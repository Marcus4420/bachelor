import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { EvidenceController } from '../../controllers/EvidenceController';
import { EvidenceService } from '../../services/EvidenceService';
import { PgSessionRepository } from '../../repositories/PgSessionRepository';
import { PgEvidenceRepository } from '../../repositories/PgEvidenceRepository';
import { Pool } from 'pg';

const pool = new Pool({});
const controller = new EvidenceController(
    new EvidenceService(
        new PgSessionRepository(pool),
        new PgEvidenceRepository(pool),
    ),
);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const sessionId = event.pathParameters?.sessionId;
    if (!sessionId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing sessionId' }) };
    }
    try {
        const evidence = await controller.getEvidence(sessionId);
        if (!evidence) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify(evidence) };
    } catch (err: any) {
        return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
};
