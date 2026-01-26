import {
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayAuthorizerResult,
} from 'aws-lambda';

// Accept any non-empty Authorization header. Replace with real validation later.
export const handler = async (
    event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewayAuthorizerResult> => {
    const token = event.identitySource?.[0];

    if (!token) {
        return {
            principalId: 'unauthorized',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: event.routeArn ?? '*',
                    },
                ],
            },
            context: {
                sub: '',
                scope: '',
            },
        };
    }

    return {
        principalId: 'stub-user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: event.routeArn ?? '*',
                },
            ],
        },
        context: {
            sub: 'stub-user',
            scope: 'eid:session',
        },
    };
};
