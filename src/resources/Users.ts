import { BaseResource } from './BaseResource';
import { User, UpdateUserRequest } from '../types';

export class Users extends BaseResource {
    /**
     * Get detailed info about the authenticated user.
     * GET /users/me
     */
    async getMe(): Promise<User> {
        const response = await this.client.get<User>('/users/me');
        return response.data;
    }

    /**
     * Update authenticated user.
     * PATCH /users/me
     */
    async update(data: UpdateUserRequest): Promise<User> {
        const response = await this.client.patch<User>('/users/me', data);
        return response.data;
    }
}
