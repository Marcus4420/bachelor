import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { SessionController } from '../../controllers/SessionController';
import { SessionService } from '../../services/SessionService';
import { PgSessionRepository } from '../../repositories/PgSessionRepository';
import { PgEvidenceRepository } from '../../repositories/PgEvidenceRepository';

import { StartSessionRequest } from '../../domain/Session';
import { getProviderAdapter as ProviderFactory } from '../../providers/providerFactory';
import { Pool } from 'pg';

const pool = new Pool({});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing body' }) };
    }
    const payload = JSON.parse(event.body) as StartSessionRequest;

    const providerName = event.headers?.['x-provider']

    if (!providerName) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing x-provider header' }) };
    }

    const controller = new SessionController(
        new SessionService(
            new PgSessionRepository(pool),
            new PgEvidenceRepository(pool),
            ProviderFactory(providerName),
        ),
    );

    try {
        const response = await controller.startSession(payload);
        return { statusCode: 201, body: JSON.stringify(response) };
    } catch (err: any) {
        return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
};
