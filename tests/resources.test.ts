import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth, SmartLinks, OptOuts and Campaigns resources', () => {
    let sdk: NodeSDK;
    let mockGet: jest.Mock;
    let mockPost: jest.Mock;
    let mockDelete: jest.Mock;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockGet = jest.fn().mockResolvedValue({ data: { ok: true } });
        mockPost = jest.fn().mockResolvedValue({ data: { ok: true } });
        mockDelete = jest.fn().mockResolvedValue({});
        mockedAxios.create.mockReturnValue({
            get: mockGet,
            post: mockPost,
            delete: mockDelete,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as never);
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should read the current user from /auth/me without the v1 prefix', async () => {
        await sdk.auth.me();

        expect(mockGet).toHaveBeenCalledWith('/auth/me');
    });

    it('should not expose the removed users, organizations and apiKeys resources', () => {
        const instance = sdk as unknown as Record<string, unknown>;

        expect(instance.users).toBeUndefined();
        expect(instance.organizations).toBeUndefined();
        expect(instance.apiKeys).toBeUndefined();
    });

    it('should return the paginated envelope when listing smart links', async () => {
        const page = { data: [{ id: 'sl_1' }], pagination: { page: 1, size: 10, totalElements: 11, totalPages: 2 } };
        mockGet.mockResolvedValue({ data: page });

        const result = await sdk.smartLinks.list({ page: 1, size: 10 });

        expect(mockGet).toHaveBeenCalledWith('/v1/smart-links/whatsapp', { params: { page: 1, size: 10 } });
        expect(result.pagination.totalPages).toBe(2);
    });

    it('should manage opt-outs', async () => {
        await sdk.optOuts.list();
        await sdk.optOuts.get('+5588999999999');
        await sdk.optOuts.create({ phone: '5588999999999', reason: 'pediu' });
        await sdk.optOuts.delete('5588999999999');

        expect(mockGet).toHaveBeenNthCalledWith(1, '/v1/opt-outs');
        expect(mockGet).toHaveBeenNthCalledWith(2, '/v1/opt-outs/%2B5588999999999');
        expect(mockPost).toHaveBeenCalledWith('/v1/opt-outs', { phone: '5588999999999', reason: 'pediu' });
        expect(mockDelete).toHaveBeenCalledWith('/v1/opt-outs/5588999999999');
    });

    it('should generate an idempotency key when creating a campaign without one', async () => {
        const payload = { name: 'c', templateName: 't', contacts: [] } as never;

        await sdk.campaigns.create(payload);

        const headers = mockPost.mock.calls[0][2].headers;
        expect(headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('should use the caller idempotency key when creating a campaign', async () => {
        await sdk.campaigns.create({ name: 'c' } as never, { idempotencyKey: 'camp-1' });

        expect(mockPost).toHaveBeenCalledWith('/v1/campaigns', { name: 'c' }, {
            headers: { 'Idempotency-Key': 'camp-1' }
        });
    });
});
