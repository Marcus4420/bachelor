import {
    APIGatewayRequestAuthorizerEventV2,
    APIGatewaySimpleAuthorizerWithContextResult,
} from 'aws-lambda';

// TODO: Replace with real OAuth2/OIDC validation in production
export const handler = async (
    event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<{ sub: string; scope: string }>> => {
    const token = event.identitySource?.[0];
    if (!token) {
        return {
            isAuthorized: false,
            context: {
                sub: '',
                scope: '',
            },
        };
    }
    return {
        isAuthorized: true,
        context: {
            sub: 'stub-user',
            scope: 'eid:session',
        },
    };
};
