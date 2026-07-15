import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiKeys Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should list api keys', async () => {
        const mockResponse = { data: [{ id: 'key1' }] };
        const mockGet = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            get: mockGet,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.apiKeys.list();
        expect(mockGet).toHaveBeenCalledWith('/v1/api-keys');
        expect(result).toEqual(mockResponse.data);
    });

    it('should create api key', async () => {
        const mockResponse = { data: { plainTextKey: 'ara_live_123' } };
        const mockPost = jest.fn().mockResolvedValue(mockResponse);

        mockedAxios.create.mockReturnValue({
            post: mockPost,
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);
        sdk = new NodeSDK(config);

        const result = await sdk.apiKeys.create('LIVE');
        expect(mockPost).toHaveBeenCalledWith('/v1/api-keys', null, { params: { mode: 'LIVE' } });
        expect(result).toEqual(mockResponse.data);
    });
});
