import { BaseResource } from '../base-resource';
import { API_KEY_MODES, ApiKey, ApiKeyMode, GeneratedApiKey } from './model';

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
    async create(mode: ApiKeyMode = API_KEY_MODES.LIVE): Promise<GeneratedApiKey> {
        const response = await this.client.post<GeneratedApiKey>('/v1/api-keys', null, {
            params: { mode }
        });
        return response.data;
    }
}
