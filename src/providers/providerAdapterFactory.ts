import { ProviderAdapter } from './ProviderAdapter';
import { StubNordicProviderAdapter } from './implementations/StubNordicProviderAdapter';
import { StubEuroProviderAdapter } from './implementations/StubEuroProviderAdapter';

export function getProviderAdapter(providerName: string): ProviderAdapter {
    switch (providerName) {
        case 'stubNordic':
            return new StubNordicProviderAdapter();
        case 'stubEuro':
            return new StubEuroProviderAdapter();
        default:
            throw new Error(`Unknown provider: ${providerName}`);
    }
}

