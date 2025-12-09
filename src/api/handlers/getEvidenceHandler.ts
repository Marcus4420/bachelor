import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { EvidenceController } from '../../controllers/EvidenceController';
import { EvidenceService } from '../../services/EvidenceService';
import { PgSessionRepository } from '../../repositories/PgSessionRepository';
import { PgEvidenceRepository } from '../../repositories/PgEvidenceRepository';
import pool from '../../infra/db/pool';
import { HTTP_RESPONSES } from '../httpResponse';
const controller = new EvidenceController(
    new EvidenceService(
        new PgSessionRepository(pool),
        new PgEvidenceRepository(pool),
    ),
);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const sessionId = event.pathParameters?.sessionId;
    if (!sessionId) {
        return HTTP_RESPONSES.badRequest('Missing sessionId');
    }
    try {
        const evidence = await controller.getEvidence(sessionId);
        if (!evidence) {
            return HTTP_RESPONSES.notFound;
        }
        return { statusCode: 200, body: JSON.stringify(evidence) };
    } catch (err: any) {
        return HTTP_RESPONSES.badRequest(err.message);
    }
};
