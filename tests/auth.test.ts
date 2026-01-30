import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'sk_test_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should login with firebase token', async () => {
        const mockResponse = {
            data: {
                user: { name: 'Test User', email: 'test@email.com', phoneNumber: '123' },
                token: 'jwt-token',
                isAuthenticated: true
            }
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

        const result = await sdk.auth.loginWithFirebase('firebase-token-123');

        expect(mockPost).toHaveBeenCalledWith('/auth', { token: 'firebase-token-123' });
        expect(result).toEqual(mockResponse.data);
    });
});
