import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CallbackController } from '../../controllers/CallbackController';
import { SessionService } from '../../services/SessionService';
import { PgSessionRepository } from '../../repositories/PgSessionRepository';
import { PgEvidenceRepository } from '../../repositories/PgEvidenceRepository';
import { StubNordicProviderAdapter } from '../../providers/implementations/StubNordicProviderAdapter';
import pool from '../../infra/db/pool';
import { HTTP_RESPONSES } from '../httpResponse';
const controller = new CallbackController(
    new SessionService(
        new PgSessionRepository(pool),
        new PgEvidenceRepository(pool),
        new StubNordicProviderAdapter(),
    ),
);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    if (!event.body) {
        return HTTP_RESPONSES.badRequest('Missing body');
    }
    const payload = JSON.parse(event.body);
    try {
        await controller.handleProviderCallback(payload);
        return HTTP_RESPONSES.noContent;
    } catch (err: any) {
        return HTTP_RESPONSES.badRequest(err.message);
    }
};
