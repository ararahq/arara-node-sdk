import { NodeSDK } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Users Resource', () => {
    let sdk: NodeSDK;
    const config = { baseUrl: 'https://api.test', apiKey: 'ara_live_123' };

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
        sdk = new NodeSDK(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get current user info', async () => {
        const mockResponse = {
            data: { name: 'User', email: 't@t.com', phoneNumber: '5588' }
        };

        const mockGet = jest.fn().mockResolvedValue(mockResponse);
        mockedAxios.create.mockReturnValue({
            post: jest.fn(),
            get: mockGet,
            patch: jest.fn(),
            delete: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);

        sdk = new NodeSDK(config);
        const result = await sdk.users.getMe();

        expect(mockGet).toHaveBeenCalledWith('/users/me');
        expect(result).toEqual(mockResponse.data);
    });

    it('should update user info', async () => {
        const updateData = { name: 'New Name' };
        const mockResponse = {
            data: { name: 'New Name', email: 't@t.com', phoneNumber: '5588' }
        };

        const mockPatch = jest.fn().mockResolvedValue(mockResponse);
        mockedAxios.create.mockReturnValue({
            post: jest.fn(),
            get: jest.fn(),
            patch: mockPatch,
            delete: jest.fn(),
            defaults: { headers: {} },
            interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
        } as any);

        sdk = new NodeSDK(config);
        const result = await sdk.users.update(updateData);

        expect(mockPatch).toHaveBeenCalledWith('/users/me', updateData);
        expect(result).toEqual(mockResponse.data);
    });
});
