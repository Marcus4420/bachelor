
import { ProviderAdapter } from './ProviderAdapter';
import { StubProviderAdapter } from './implementations/StubProviderAdapter';
import { StubCopyProviderAdapter } from './implementations/StubProviderAdapterCopy';

export function getProviderAdapter(providerName: string): ProviderAdapter {
    switch (providerName) {
        case 'stub':
            return new StubProviderAdapter();
        case 'stubCopy':
            return new StubCopyProviderAdapter();
        default:
            throw new Error(`Unknown provider: ${providerName}`);
    }
}