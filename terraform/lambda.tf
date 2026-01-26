
locals {
  lambda_env = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_NAME     = aws_db_instance.postgres.db_name
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
  }

  lambda_zip         = "${path.module}/../dist/eid-service.zip"
  lambda_source_hash = filebase64sha256(local.lambda_zip)

  lambda_functions = {
    start_session = {
      handler         = "api/handlers/startSessionHandler.handler"
      function_suffix = "start-session"
    }
    get_evidence = {
      handler         = "api/handlers/getEvidenceHandler.handler"
      function_suffix = "get-evidence"
    }
    callback = {
      handler         = "api/handlers/callbackHandler.handler"
      function_suffix = "callback"
    }
  }
}

# IAM role for Lambda execution
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Attach basic logging policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Authorizer Lambda (stays separate because it has different wiring)
resource "aws_lambda_function" "authorizer" {
  function_name = "${var.project_name}-authorizer"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/auth/authorizerHandler.handler"
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash
}

# Application Lambdas defined once via a map
resource "aws_lambda_function" "handler" {
  for_each = local.lambda_functions

  function_name = "${var.project_name}-${each.value.function_suffix}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = each.value.handler
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash

  environment {
    variables = local.lambda_env
  }
}
