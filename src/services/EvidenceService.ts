import { EvidenceBundle } from '../domain/Evidence';
import { SessionRepository } from '../repositories/interfaces/SessionRepository';
import { EvidenceRepository } from '../repositories/interfaces/EvidenceRepository';

export class EvidenceService {
    constructor(
        private readonly sessionRepo: SessionRepository,
        private readonly evidenceRepo: EvidenceRepository,
    ) { }

    async getEvidence(sessionId: string): Promise<EvidenceBundle | null> {
        const session = await this.sessionRepo.findById(sessionId);
        if (!session) return null;

        const events = await this.evidenceRepo.findEventsBySessionId(sessionId);
        const ordered = events.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

        return {
            session,
            events: ordered,
            integrity: 'OK',
        };
    }
}
