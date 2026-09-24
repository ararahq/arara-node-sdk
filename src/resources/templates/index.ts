import { BaseResource } from '../base-resource';
import { PaginatedResponse } from '../pagination';
import {
    Template,
    TemplateStatus,
    CreateTemplateRequest,
    TemplateResponse,
    ListTemplatesParams,
    TemplateAnalyticsParams,
    TemplateAnalytics,
    TemplateAnalyticsSummary
} from './model';

export class Templates extends BaseResource {
    /**
     * List templates, paginated. Filter by exact name with `params.name`.
     * GET /v1/templates
     */
    async list(params: ListTemplatesParams = {}): Promise<PaginatedResponse<Template>> {
        const response = await this.client.get<PaginatedResponse<Template>>('/v1/templates', { params });
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
     * Get a template by its id (UUID). To look up by name, use `list({ name })`.
     * GET /v1/templates/{id}
     */
    async get(id: string): Promise<Template> {
        const response = await this.client.get<Template>(templatePath(id));
        return response.data;
    }

    /**
     * Get the provider approval status of a template by id (UUID).
     * GET /v1/templates/{id}/status
     */
    async getStatus(id: string): Promise<TemplateStatus> {
        const response = await this.client.get<TemplateStatus>(`${templatePath(id)}/status`);
        return response.data;
    }

    /**
     * Delete a template by id (UUID).
     * DELETE /v1/templates/{id}
     */
    async delete(id: string): Promise<void> {
        await this.client.delete(templatePath(id));
    }

    /**
     * Delivery and read analytics of one template by id.
     * GET /v1/templates/{id}/analytics
     */
    async analytics(id: string, params: TemplateAnalyticsParams = {}): Promise<TemplateAnalytics> {
        const response = await this.client.get<TemplateAnalytics>(`${templatePath(id)}/analytics`, { params });
        return response.data;
    }

    /**
     * Analytics of every template with traffic in the period, one item per template name.
     * GET /v1/templates/analytics
     */
    async analyticsAll(params: TemplateAnalyticsParams = {}): Promise<TemplateAnalyticsSummary[]> {
        const response = await this.client.get<TemplateAnalyticsSummary[]>('/v1/templates/analytics', { params });
        return response.data;
    }
}

function templatePath(id: string): string {
    return `/v1/templates/${encodeURIComponent(id)}`;
}
