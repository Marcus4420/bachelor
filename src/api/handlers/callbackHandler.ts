import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CallbackController } from '../../controllers/CallbackController';
import { SessionService } from '../../services/SessionService';
import { PgSessionRepository } from '../../repositories/PgSessionRepository';
import { PgEvidenceRepository } from '../../repositories/PgEvidenceRepository';
import { StubProviderAdapter } from '../../providers/implementations/StubProviderAdapter';
import { Pool } from 'pg';

const pool = new Pool({});
const controller = new CallbackController(
    new SessionService(
        new PgSessionRepository(pool),
        new PgEvidenceRepository(pool),
        new StubProviderAdapter(),
    ),
);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing body' }) };
    }
    const payload = JSON.parse(event.body);
    try {
        await controller.handleProviderCallback(payload);
        return { statusCode: 204, body: '' };
    } catch (err: any) {
        return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
};
