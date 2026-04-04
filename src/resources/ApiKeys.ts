import { BaseResource } from './BaseResource';
import { ApiKey, GeneratedApiKey } from '../types';

export class ApiKeys extends BaseResource {
    /**
     * List all API keys.
     * GET /v1/api-keys
     */
    async list(): Promise<ApiKey[]> {
        const response = await this.client.get<ApiKey[]>('/v1/api-keys');
        return response.data;
    }

    /**
     * Create a new API key.
     * POST /v1/api-keys
     */
    async create(mode: 'LIVE' | 'TEST' = 'LIVE'): Promise<GeneratedApiKey> {
        const response = await this.client.post<GeneratedApiKey>('/v1/api-keys', null, {
            params: { mode }
        });
        return response.data;
    }
}
