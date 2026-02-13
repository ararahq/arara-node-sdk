import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Messages Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'sk_test_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send a message', async () => {
        const payload = { receiver: '5588', templateName: 'hello', variables: ['World'] };
        const mockResponse = {
            data: { status: 'queued', mode: 'live', sender: '123', receiver: '5588' }
        };

        const mockPost = jest.fn().mockResolvedValue(mockResponse);
        mockedAxios.create.mockReturnValue({
            post: mockPost,
            get: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);

        sdk = new NodeSDK(config);
        const result = await sdk.messages.send(payload);

        expect(mockPost).toHaveBeenCalledWith('/v1/messages', payload);
        expect(result).toEqual(mockResponse.data);
    });
});
