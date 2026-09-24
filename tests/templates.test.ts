import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const TEMPLATE_ID = '3f0c6a52-8a0e-4c1b-9d7e-1b2a3c4d5e6f';

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
            data: [{ id: TEMPLATE_ID, name: 'boas_vindas' }],
            pagination: { page: 0, size: 50, totalElements: 1, totalPages: 1 }
        };
        mockGet.mockResolvedValue({ data: page });

        const result = await sdk.templates.list({ name: 'boas_vindas', page: 0, size: 50 });

        expect(mockGet).toHaveBeenCalledWith('/v1/templates', {
            params: { name: 'boas_vindas', page: 0, size: 50 }
        });
        expect(result.data[0].id).toBe(TEMPLATE_ID);
        expect(result.pagination.totalElements).toBe(1);
    });

    it('should list templates without filters by default', async () => {
        mockGet.mockResolvedValue({ data: { data: [], pagination: {} } });

        await sdk.templates.list();

        expect(mockGet).toHaveBeenCalledWith('/v1/templates', { params: {} });
    });

    it('should get a template by id', async () => {
        mockGet.mockResolvedValue({ data: { id: TEMPLATE_ID } });

        const result = await sdk.templates.get(TEMPLATE_ID);

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}`);
        expect(result).toEqual({ id: TEMPLATE_ID });
    });

    it('should get template status by id', async () => {
        mockGet.mockResolvedValue({ data: { status: 'APPROVED' } });

        await sdk.templates.getStatus(TEMPLATE_ID);

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}/status`);
    });

    it('should delete a template by id', async () => {
        await sdk.templates.delete(TEMPLATE_ID);

        expect(mockDelete).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}`);
    });

    it('should get analytics of one template with a period', async () => {
        mockGet.mockResolvedValue({ data: { sent: 10 } });

        const result = await sdk.templates.analytics(TEMPLATE_ID, { period: '7d' });

        expect(mockGet).toHaveBeenCalledWith(`/v1/templates/${TEMPLATE_ID}/analytics`, {
            params: { period: '7d' }
        });
        expect(result).toEqual({ sent: 10 });
    });

    it('should get analytics of all templates when no id is given', async () => {
        mockGet.mockResolvedValue({ data: {} });

        await sdk.templates.analytics();

        expect(mockGet).toHaveBeenCalledWith('/v1/templates/analytics', { params: {} });
    });
});
