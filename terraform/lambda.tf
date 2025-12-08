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

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "start_session" {
  function_name = "${var.project_name}-start-session"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/startSessionHandler.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.module}/../dist/eid-service.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/eid-service.zip")

  environment {
    variables = {
      DB_HOST     = aws_db_instance.postgres.address
      DB_NAME     = aws_db_instance.postgres.db_name
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
    }
  }
}

// Additional Lambda handlers for evidence and callback
resource "aws_lambda_function" "get_evidence" {
  function_name = "${var.project_name}-get-evidence"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/getEvidenceHandler.handler"
  runtime       = "nodejs20.x"
  filename         = "${path.module}/../dist/eid-service.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/eid-service.zip")
  environment {
    variables = {
      DB_HOST     = aws_db_instance.postgres.address
      DB_NAME     = aws_db_instance.postgres.db_name
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
    }
  }
}

resource "aws_lambda_function" "callback" {
  function_name = "${var.project_name}-callback"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "api/handlers/callbackHandler.handler"
  runtime       = "nodejs20.x"
  filename         = "${path.module}/../dist/eid-service.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/eid-service.zip")
  environment {
    variables = {
      DB_HOST     = aws_db_instance.postgres.address
      DB_NAME     = aws_db_instance.postgres.db_name
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
    }
  }
}
