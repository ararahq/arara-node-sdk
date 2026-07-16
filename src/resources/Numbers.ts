import { BaseResource } from './BaseResource';
import { NumbersResponseDTO, UpdateNumberRequest, RequestNumberRequest } from '../types';

export class Numbers extends BaseResource {
    /**
     * List numbers with plan slot info.
     * GET /v1/organizations/me/numbers
     */
    async list(): Promise<NumbersResponseDTO> {
        const response = await this.client.get<NumbersResponseDTO>('/v1/organizations/me/numbers');
        return response.data;
    }

    /**
     * Update a number.
     * PATCH /v1/organizations/me/numbers/{id}
     */
    async update(id: string, request: UpdateNumberRequest): Promise<Record<string, unknown>> {
        const response = await this.client.patch<Record<string, unknown>>(
            `/v1/organizations/me/numbers/${id}`,
            request
        );
        return response.data;
    }

    /**
     * Deactivate a number.
     * DELETE /v1/organizations/me/numbers/{id}
     */
    async delete(id: string): Promise<Record<string, unknown>> {
        const response = await this.client.delete<Record<string, unknown>>(
            `/v1/organizations/me/numbers/${id}`
        );
        return response.data;
    }

    /**
     * Request a new dedicated number.
     * POST /v1/organizations/me/numbers/request
     */
    async request(request: RequestNumberRequest): Promise<Record<string, unknown>> {
        const response = await this.client.post<Record<string, unknown>>(
            '/v1/organizations/me/numbers/request',
            request
        );
        return response.data;
    }

    /**
     * List number provisioning requests.
     * GET /v1/organizations/me/numbers/requests
     */
    async listRequests(): Promise<Record<string, unknown>[]> {
        const response = await this.client.get<Record<string, unknown>[]>(
            '/v1/organizations/me/numbers/requests'
        );
        return response.data;
    }

    /**
     * Sync a number's health from the provider.
     * POST /v1/organizations/me/numbers/{id}/sync
     */
    async sync(id: string): Promise<Record<string, unknown>> {
        const response = await this.client.post<Record<string, unknown>>(
            `/v1/organizations/me/numbers/${id}/sync`
        );
        return response.data;
    }

    /**
     * Get warming recommendations for a number.
     * GET /v1/organizations/me/numbers/{id}/warming
     */
    async warming(id: string): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>(
            `/v1/organizations/me/numbers/${id}/warming`
        );
        return response.data;
    }
}
