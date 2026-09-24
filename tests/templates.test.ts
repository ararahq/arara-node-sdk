import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const TEMPLATE_ID = '3f0c6a52-8a0e-4c1b-9d7e-1b2a3c4d5e6f';
const REAL_TEMPLATE = {
    id: TEMPLATE_ID,
    name: 'boas_vindas',
    formattedName: 'boas_vindas',
    category: 'UTILITY',
    originalCategory: 'UTILITY',
    language: 'pt_BR',
    providerName: 'GUPSHUP',
    providerTemplateId: 'gs-tpl-1',
    providerStatus: 'APPROVED',
    rejectionReason: null,
    availableForSending: true,
    unavailableReason: null,
    bodyPreview: 'Oi {{1}}',
    structureJson: { body: 'Oi {{1}}' },
    usageGuide: { message: 'Use o objeto variables', endpoint: 'POST /v1/messages' },
    variablesSchema: { '1': 'Maria' },
    createdAt: '2026-09-01T12:00:00Z',
    updatedAt: null
};

describe('Templates Resource', () => {
    let sdk: NodeSDK;
    let mockGet: jest.Mock;
    let mockDelete: jest.Mock;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockGet = jest.fn();
        mockDelete = jest.fn().mockResolvedValue({});
        mockedAxios.create.mockReturnValue({
            get: mockGet,
            delete: mockDelete,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as never);
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the paginated envelope when listing templates', async () => {
        const page = {
            data: [REAL_TEMPLATE],
            pagination: { page: 0, size: 50, totalElements: 1, totalPages: 1 }
        };
        mockGet.mockResolvedValue({ data: page });

        const result = await sdk.templates.list({ name: 'boas_vindas', page: 0, size: 50 });

        expect(mockGet).toHaveBeenCalledWith('/v1/templates', {
            params: { name: 'boas_vindas', page: 0, size: 50 }
        });
        expect(result.data[0].id).toBe(TEMPLATE_ID);
        expect(result.data[0].structureJson).toEqual({ body: 'Oi {{1}}' });
        expect(result.data[0].variablesSchema).toEqual({ '1': 'Maria' });
        expect(result.pagination.totalElements).toBe(1);
    });

    it('should list templates without filters by default', async () => {
        mockGet.mockResolvedValue({ data: { data: [], pagination: { page: 0, size: 50, totalElements: 0, totalPages: 0 } } });

        await sdk.templates.list();

        expect(mockGet).toHaveBeenCalledWith('/v1/templates', { params: {} });
    });

    it('should get a template by id', async () => {
        mockGet.mockResolvedValue({ data: REAL_TEMPLATE });

        const result = await sdk.templates.get(TEMPLATE_ID);

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}`);
        expect(result).toEqual(REAL_TEMPLATE);
    });

    it('should get template status by id', async () => {
        mockGet.mockResolvedValue({ data: { status: 'APPROVED', rejectionReason: null, category: 'UTILITY' } });

        await sdk.templates.getStatus(TEMPLATE_ID);

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}/status`);
    });

    it('should delete a template by id', async () => {
        await sdk.templates.delete(TEMPLATE_ID);

        expect(mockDelete).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}`);
    });

    it('should get analytics of one template with a period', async () => {
        const body = {
            templateId: TEMPLATE_ID,
            templateName: 'boas_vindas',
            period: '7d',
            sent: 40,
            delivered: 39,
            read: 16,
            failed: 1,
            deliveryRate: '97.5',
            readRate: '41.0'
        };
        mockGet.mockResolvedValue({ data: body });

        const result = await sdk.templates.analytics(TEMPLATE_ID, { period: '7d' });

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}/analytics`, {
            params: { period: '7d' }
        });
        expect(result.deliveryRate).toBe('97.5');
        expect(result.templateId).toBe(TEMPLATE_ID);
    });

    it('should return one summary per template name for analyticsAll', async () => {
        const body = [
            { templateName: 'boas_vindas', period: '30d', sent: 10, delivered: 9, read: 3, failed: 1, deliveryRate: '90.0', readRate: '30.0' },
            { templateName: 'cobranca', period: '30d', sent: 2, delivered: 2, read: 2, failed: 0, deliveryRate: '100.0', readRate: '100.0' }
        ];
        mockGet.mockResolvedValue({ data: body });

        const result = await sdk.templates.analyticsAll();

        expect(mockGet).toHaveBeenCalledWith('/v1/templates/analytics', { params: {} });
        expect(result).toHaveLength(2);
        expect(result[1].templateName).toBe('cobranca');
    });
});
