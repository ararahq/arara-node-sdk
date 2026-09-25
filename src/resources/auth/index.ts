import { BaseResource } from '../base-resource';
import { CurrentUser } from './model';

export class Auth extends BaseResource {
    /**
     * Current user behind the API key. Requires an ADMIN key.
     * GET /auth/me
     */
    async me(): Promise<CurrentUser> {
        const response = await this.client.get<CurrentUser>('/auth/me');
        return response.data;
    }
}
