
# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}





# Default stage for auto-deploy
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}


# Lambda authorizer for all routes
resource "aws_apigatewayv2_authorizer" "lambda_auth" {
  api_id                              = aws_apigatewayv2_api.http_api.id
  authorizer_type                     = "REQUEST"
  authorizer_uri                      = aws_lambda_function.authorizer.invoke_arn
  identity_sources                    = ["$request.header.Authorization"]
  name                                = "eid-authorizer"
  authorizer_payload_format_version   = "2.0"
}

# --- Session Route ---
resource "aws_apigatewayv2_integration" "start_session" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.start_session.arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "start_session" {
  api_id        = aws_apigatewayv2_api.http_api.id
  route_key     = "POST /sessions"
  target        = "integrations/${aws_apigatewayv2_integration.start_session.id}"
  authorizer_id = aws_apigatewayv2_authorizer.lambda_auth.id
}

resource "aws_lambda_permission" "apigw_invoke_start_session" {
  statement_id  = "AllowAPIGatewayInvokeStartSession"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.start_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# --- Evidence Route ---
resource "aws_apigatewayv2_integration" "get_evidence" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_evidence.arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_evidence" {
  api_id        = aws_apigatewayv2_api.http_api.id
  route_key     = "GET /sessions/{sessionId}/evidence"
  target        = "integrations/${aws_apigatewayv2_integration.get_evidence.id}"
  authorizer_id = aws_apigatewayv2_authorizer.lambda_auth.id
}

resource "aws_lambda_permission" "apigw_invoke_get_evidence" {
  statement_id  = "AllowAPIGatewayInvokeGetEvidence"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_evidence.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# --- Callback Route ---
resource "aws_apigatewayv2_integration" "callback" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.callback.arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "callback" {
  api_id        = aws_apigatewayv2_api.http_api.id
  route_key     = "POST /callbacks/provider"
  target        = "integrations/${aws_apigatewayv2_integration.callback.id}"
  authorizer_id = aws_apigatewayv2_authorizer.lambda_auth.id
}

resource "aws_lambda_permission" "apigw_invoke_callback" {
  statement_id  = "AllowAPIGatewayInvokeCallback"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.callback.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
