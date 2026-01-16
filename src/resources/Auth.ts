import { BaseResource } from './BaseResource';
import { AuthResponse } from '../types';

export class Auth extends BaseResource {
    /**
     * Authenticates with Firebase token.
     * POST /auth
     */
    async loginWithFirebase(firebaseToken: string): Promise<AuthResponse> {
        const response = await this.client.post<AuthResponse>('/auth', { token: firebaseToken });
        return response.data;
    }
}
