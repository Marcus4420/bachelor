
locals {
  lambda_env = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_NAME     = aws_db_instance.postgres.db_name
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
  }
  lambda_zip         = "${path.module}/../dist/eid-service.zip"
  lambda_source_hash = filebase64sha256(local.lambda_zip)
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

# --- Lambda Functions ---
# Authorizer Lambda
resource "aws_lambda_function" "authorizer" {
  function_name = "${var.project_name}-authorizer"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/auth/authorizerHandler.handler"
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash
}

# Start Session Lambda
resource "aws_lambda_function" "start_session" {
  function_name = "${var.project_name}-start-session"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/startSessionHandler.handler"
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash
  environment {
    variables = local.lambda_env
  }
}

# Get Evidence Lambda
resource "aws_lambda_function" "get_evidence" {
  function_name = "${var.project_name}-get-evidence"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/getEvidenceHandler.handler"
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash
  environment {
    variables = local.lambda_env
  }
}

# Callback Lambda
resource "aws_lambda_function" "callback" {
  function_name = "${var.project_name}-callback"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/callbackHandler.handler"
  runtime       = "nodejs20.x"
  filename         = local.lambda_zip
  source_code_hash = local.lambda_source_hash
  environment {
    variables = local.lambda_env
  }
}
