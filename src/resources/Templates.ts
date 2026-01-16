import { BaseResource } from './BaseResource';
import { Template, TemplateStatus } from '../types';

export class Templates extends BaseResource {
    /**
     * List all templates.
     * GET /v1/templates
     */
    async list(): Promise<Template[]> {
        const response = await this.client.get<Template[]>('/v1/templates');
        return response.data;
    }

    /**
     * Get a specific template by ID.
     * GET /v1/templates/{id}
     */
    async get(id: string): Promise<Template> {
        const response = await this.client.get<Template>(`/v1/templates/${id}`);
        return response.data;
    }

    /**
     * Get template status from provider.
     * GET /v1/templates/{id}/status
     */
    async getStatus(id: string): Promise<TemplateStatus> {
        const response = await this.client.get<TemplateStatus>(`/v1/templates/${id}/status`);
        return response.data;
    }

    /**
     * Delete a template.
     * DELETE /v1/templates/{id}
     */
    async delete(id: string): Promise<void> {
        await this.client.delete(`/v1/templates/${id}`);
    }
}
