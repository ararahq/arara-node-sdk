import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Templates Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
        sdk = new NodeSDK(config);
        mockedAxios.create.mockReturnValue({
            post: jest.fn(),
            get: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should list templates', async () => {
        const mockResponse = { data: [{ id: '1', name: 'temp1' }] };
        const mockGet = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.templates.list();
        expect(mockGet).toHaveBeenCalledWith('/v1/templates');
        expect(result).toEqual(mockResponse.data);
    });

    it('should get template by id', async () => {
        const mockResponse = { data: { id: '1', name: 'temp1' } };
        const mockGet = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.templates.get('1');
        expect(mockGet).toHaveBeenCalledWith('/v1/templates/1');
        expect(result).toEqual(mockResponse.data);
    });

    it('should get template status', async () => {
        const mockResponse = { data: { status: 'APPROVED' } };
        const mockGet = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.templates.getStatus('1');
        expect(mockGet).toHaveBeenCalledWith('/v1/templates/1/status');
        expect(result).toEqual(mockResponse.data);
    });

    it('should delete template', async () => {
        const mockDelete = jest.fn().mockResolvedValue({});

        mockedAxios.create.mockReturnValue({
            delete: mockDelete,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        await sdk.templates.delete('1');
        expect(mockDelete).toHaveBeenCalledWith('/v1/templates/1');
    });
});
