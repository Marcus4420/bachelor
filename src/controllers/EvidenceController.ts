import { EvidenceService } from '../services/EvidenceService';
import { EvidenceBundle } from '../domain/Evidence';

export class EvidenceController {
    constructor(private readonly evidenceService: EvidenceService) { }

    async getEvidence(sessionId: string): Promise<EvidenceBundle | null> {
        if (!sessionId) {
            throw new Error('sessionId is required');
        }
        return this.evidenceService.getEvidence(sessionId);
    }
}
