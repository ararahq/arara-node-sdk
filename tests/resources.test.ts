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
        const body = { name: 'Micael', email: 'dono@empresa.com', role: 'ADMIN', emailPending: false };
        mockGet.mockResolvedValueOnce({ data: body });

        const me = await sdk.auth.me();

        expect(mockGet).toHaveBeenCalledWith('/auth/me');
        expect(me).toEqual(body);
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

    it('should manage opt-outs with the api shapes', async () => {
        const item = { phone: '+5588999999999', channel: 'WHATSAPP', reason: 'pediu', createdAt: '2026-09-24T12:00:00Z' };
        mockGet
            .mockResolvedValueOnce({ data: { items: [item], total: 1 } })
            .mockResolvedValueOnce({ data: { phone: '+5588999999999', channel: 'WHATSAPP', optedOut: true } });
        mockPost.mockResolvedValueOnce({ data: item });

        const list = await sdk.optOuts.list();
        const check = await sdk.optOuts.get(' +5588999999999 ');
        const created = await sdk.optOuts.create({ phone: '+5588999999999', reason: 'pediu' });
        await sdk.optOuts.delete('+5588999999999');

        expect(list.total).toBe(1);
        expect(check.optedOut).toBe(true);
        expect(created).toEqual(item);
        expect(mockGet).toHaveBeenNthCalledWith(1, '/v1/opt-outs');
        expect(mockGet).toHaveBeenNthCalledWith(2, '/v1/opt-outs/%2B5588999999999');
        expect(mockPost).toHaveBeenCalledWith('/v1/opt-outs', { phone: '+5588999999999', reason: 'pediu' });
        expect(mockDelete).toHaveBeenCalledWith('/v1/opt-outs/%2B5588999999999');
    });

    it('should reject opt-out phones that are not E.164 without calling the api', async () => {
        await expect(sdk.optOuts.create({ phone: '5588999999999' })).rejects.toThrow(RangeError);
        await expect(sdk.optOuts.get('whatsapp:+5588999999999')).rejects.toThrow(RangeError);
        await expect(sdk.optOuts.delete('+0123')).rejects.toThrow(RangeError);
        expect(mockPost).not.toHaveBeenCalled();
        expect(mockGet).not.toHaveBeenCalled();
        expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should generate an idempotency key when creating a campaign without one', async () => {
        const payload = { name: 'c', templateName: 't', contacts: [] } as never;

        await sdk.campaigns.create(payload);

        const headers = mockPost.mock.calls[0][2].headers;
        expect(headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('should send scheduledAt and read it back from the campaign response', async () => {
        const body = { id: 'c1', name: 'Black Friday', status: 'SCHEDULED', totalMessages: 1, totalCost: 0.35, scheduledAt: '2026-11-27T12:00:00Z' };
        mockPost.mockResolvedValueOnce({ data: body });
        const payload = {
            name: 'Black Friday',
            templateName: 'promo',
            contacts: [{ to: '+5511999998888', variables: ['Maria'] }],
            scheduledAt: '2026-11-27T12:00:00Z'
        };

        const result = await sdk.campaigns.create(payload);

        expect(mockPost.mock.calls[0][1]).toEqual(payload);
        expect(result.scheduledAt).toBe('2026-11-27T12:00:00Z');
    });

    it('should use the caller idempotency key when creating a campaign', async () => {
        await sdk.campaigns.create({ name: 'c' } as never, { idempotencyKey: 'camp-1' });

        expect(mockPost).toHaveBeenCalledWith('/v1/campaigns', { name: 'c' }, {
            headers: { 'Idempotency-Key': 'camp-1' }
        });
    });
});
