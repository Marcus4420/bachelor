
# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_cloudwatch_log_group" "http_api_access" {
  name              = "/aws/apigateway/${var.project_name}-http"
  retention_in_days = 14
}


locals {
  routes = {
    start_session = {
      method      = "POST"
      route_key   = "POST /sessions"
      lambda_key  = "start_session"
      description = "Start session"
    }
    get_evidence = {
      method      = "GET"
      route_key   = "GET /sessions/{sessionId}/evidence"
      lambda_key  = "get_evidence"
      description = "Get evidence"
    }
    callback = {
      method      = "POST"
      route_key   = "POST /callbacks/provider"
      lambda_key  = "callback"
      description = "Provider callback"
    }
  }
}




# Default stage for auto-deploy
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.http_api_access.arn
    format          = jsonencode({
      requestId      = "$context.requestId"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      errorMessage   = "$context.error.message"
      integrationError = "$context.integrationErrorMessage"
    })
  }
}

# Lambda authorizer for all routes
resource "aws_apigatewayv2_authorizer" "lambda_auth" {
  api_id                              = aws_apigatewayv2_api.http_api.id
  authorizer_type                     = "REQUEST"
  authorizer_uri                      = aws_lambda_function.authorizer.invoke_arn
  identity_sources                    = ["$request.header.Authorization"]
  name                                = "${var.project_name}-authorizer"
  authorizer_payload_format_version   = "2.0"
  authorizer_result_ttl_in_seconds    = 0
}

resource "aws_apigatewayv2_integration" "route" {
  for_each = local.routes

  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.handler[each.value.lambda_key].arn
  integration_method = each.value.method
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "route" {
  for_each = local.routes

  api_id             = aws_apigatewayv2_api.http_api.id
  route_key          = each.value.route_key
  target             = "integrations/${aws_apigatewayv2_integration.route[each.key].id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.lambda_auth.id
}

resource "aws_lambda_permission" "apigw_invoke" {
  for_each = local.routes

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.handler[each.value.lambda_key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_invoke_authorizer" {
  statement_id  = "AllowAPIGatewayInvokeAuthorizer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/authorizers/*"
}
