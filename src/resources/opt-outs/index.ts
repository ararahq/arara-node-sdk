import { BaseResource } from '../base-resource';
import { OptOutRequest } from './model';

/** Channel opt-outs. Reads require an ADMIN key. */
export class OptOuts extends BaseResource {
    /** GET /v1/opt-outs */
    async list(): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>('/v1/opt-outs');
        return response.data;
    }

    /** GET /v1/opt-outs/{phone} */
    async get(phone: string): Promise<Record<string, unknown>> {
        const response = await this.client.get<Record<string, unknown>>(optOutPath(phone));
        return response.data;
    }

    /** POST /v1/opt-outs */
    async create(request: OptOutRequest): Promise<Record<string, unknown>> {
        const response = await this.client.post<Record<string, unknown>>('/v1/opt-outs', request);
        return response.data;
    }

    /** DELETE /v1/opt-outs/{phone} */
    async delete(phone: string): Promise<void> {
        await this.client.delete(optOutPath(phone));
    }
}

function optOutPath(phone: string): string {
    return `/v1/opt-outs/${encodeURIComponent(phone)}`;
}
