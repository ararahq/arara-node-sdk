import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Organizations Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get webhook config', async () => {
        const mockResponse = { data: { url: 'https://hook', secret: 'sec' } };
        const mockGet = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.organizations.getWebhook();
        expect(mockGet).toHaveBeenCalledWith('/organizations/me/webhook');
        expect(result).toEqual(mockResponse.data);
    });

    it('should update webhook config', async () => {
        const payload = { url: 'https://new' };
        const mockResponse = { data: { message: 'ok', url: 'https://new' } };
        const mockPatch = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            patch: mockPatch,
            get: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.organizations.updateWebhook(payload);
        expect(mockPatch).toHaveBeenCalledWith('/organizations/me/webhook', payload);
        expect(result).toEqual(mockResponse.data);
    });
});
