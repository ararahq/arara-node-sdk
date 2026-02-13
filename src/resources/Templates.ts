import { BaseResource } from './BaseResource';
import { Template, TemplateStatus, CreateTemplateRequest, TemplateResponse } from '../types';

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
     * Create a new template for Meta approval.
     * POST /v1/templates
     */
    async create(payload: CreateTemplateRequest): Promise<TemplateResponse> {
        const response = await this.client.post<TemplateResponse>('/v1/templates', payload);
        return response.data;
    }

    /**
     * Get a specific template by name.
     * GET /v1/templates/{name}
     */
    async get(name: string): Promise<Template> {
        const response = await this.client.get<Template>(`/v1/templates/${name}`);
        return response.data;
    }

    /**
     * Get template status from provider.
     * GET /v1/templates/{name}/status
     */
    async getStatus(name: string): Promise<TemplateStatus> {
        const response = await this.client.get<TemplateStatus>(`/v1/templates/${name}/status`);
        return response.data;
    }

    /**
     * Delete a template by name.
     * DELETE /v1/templates/{name}
     */
    async delete(name: string): Promise<void> {
        await this.client.delete(`/v1/templates/${name}`);
    }
}
