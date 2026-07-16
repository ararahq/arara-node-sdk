import { BaseResource } from './BaseResource';
import {
    ContactRequest,
    ContactPatchRequest,
    ContactResponse,
    ContactsListResponse,
    ContactsBatchResponse,
    ContactsStatsResponse,
    ContactsReactivationResponse,
    ContactMessagesResponse
} from '../types';

export class Contacts extends BaseResource {
    /**
     * List contacts.
     * GET /v1/contacts
     */
    async list(
        page = 0,
        size = 20,
        q?: string,
        lifecycle?: string
    ): Promise<ContactsListResponse> {
        const response = await this.client.get<ContactsListResponse>('/v1/contacts', {
            params: { page, size, q, lifecycle }
        });
        return response.data;
    }

    /**
     * Import a batch of contacts.
     * POST /v1/contacts/batch
     */
    async importBatch(contacts: ContactRequest[]): Promise<ContactsBatchResponse> {
        const response = await this.client.post<ContactsBatchResponse>('/v1/contacts/batch', contacts);
        return response.data;
    }

    /**
     * Get contact lifecycle stats.
     * GET /v1/contacts/stats
     */
    async stats(): Promise<ContactsStatsResponse> {
        const response = await this.client.get<ContactsStatsResponse>('/v1/contacts/stats');
        return response.data;
    }

    /**
     * List reactivation candidates.
     * GET /v1/contacts/reactivation
     */
    async reactivationCandidates(limit = 100): Promise<ContactsReactivationResponse> {
        const response = await this.client.get<ContactsReactivationResponse>('/v1/contacts/reactivation', {
            params: { limit }
        });
        return response.data;
    }

    /**
     * List distinct contact tags.
     * GET /v1/contacts/tags
     */
    async listTags(): Promise<Record<string, string[]>> {
        const response = await this.client.get<Record<string, string[]>>('/v1/contacts/tags');
        return response.data;
    }

    /**
     * Get a contact by phone.
     * GET /v1/contacts/{phone}
     */
    async get(phone: string): Promise<ContactResponse> {
        const response = await this.client.get<ContactResponse>(`/v1/contacts/${phone}`);
        return response.data;
    }

    /**
     * Update a contact by phone.
     * PATCH /v1/contacts/{phone}
     */
    async update(phone: string, patch: ContactPatchRequest): Promise<ContactResponse> {
        const response = await this.client.patch<ContactResponse>(`/v1/contacts/${phone}`, patch);
        return response.data;
    }

    /**
     * List a contact's recent messages.
     * GET /v1/contacts/{phone}/messages
     */
    async messages(phone: string, limit = 30): Promise<ContactMessagesResponse> {
        const response = await this.client.get<ContactMessagesResponse>(`/v1/contacts/${phone}/messages`, {
            params: { limit }
        });
        return response.data;
    }
}
