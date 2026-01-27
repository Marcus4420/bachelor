import { SessionConfig, SessionStatus } from '../domain/Session';
import { ProviderAdapter } from '../providers/ProviderAdapter';
import { SessionRepository } from '../repositories/interfaces/SessionRepository';
import { EvidenceRepository } from '../repositories/interfaces/EvidenceRepository';
import crypto from 'crypto';
import { randomUUID } from '../utils/uuid';

export class SessionService {
    constructor(
        private readonly sessionRepo: SessionRepository,
        private readonly evidenceRepo: EvidenceRepository,
        private readonly provider: ProviderAdapter,
    ) { }

    async startSession(externalId: string) {
        const session: SessionConfig = {
            id: crypto.randomUUID(),
            externalId,
            provider: this.provider.id,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.sessionRepo.create(session);

        const { redirectUrl } = await this.provider.createSession(session);

        await this.evidenceRepo.appendEvent({
            id: randomUUID(),
            sessionId: session.id,
            type: 'SESSION_CREATED',
            payloadHash: '',
        });

        return { sessionId: session.id, redirectUrl };
    }

    async handleCallback(payload: unknown) {
        const result = await this.provider.handleCallback(payload);
        const session = await this.sessionRepo.findById(result.sessionId);
        if (!session) return;

        await this.sessionRepo.updateStatus(session.id, result.status as SessionStatus);
        await this.evidenceRepo.appendEvent({
            id: randomUUID(),
            sessionId: session.id,
            type: 'PROVIDER_CALLBACK',
            payloadHash: result.providerPayloadHash,
        });
    }
}
