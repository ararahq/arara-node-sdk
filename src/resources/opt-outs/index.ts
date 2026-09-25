import { BaseResource } from '../base-resource';
import { OptOutRequest, OptOutItem, OptOutList, OptOutCheck } from './model';

export const E164_PHONE = /^\+[1-9]\d{6,14}$/;

/**
 * Channel opt-outs. Phones must be E.164 with the leading plus (`+5511999998888`);
 * anything else is rejected locally with the same rule the API applies. Reads require an ADMIN key.
 */
export class OptOuts extends BaseResource {
    /** GET /v1/opt-outs */
    async list(): Promise<OptOutList> {
        const response = await this.client.get<OptOutList>('/v1/opt-outs');
        return response.data;
    }

    /** GET /v1/opt-outs/{phone} */
    async get(phone: string): Promise<OptOutCheck> {
        const response = await this.client.get<OptOutCheck>(optOutPath(phone));
        return response.data;
    }

    /** POST /v1/opt-outs (201) */
    async create(request: OptOutRequest): Promise<OptOutItem> {
        const phone = requireE164(request.phone);
        const response = await this.client.post<OptOutItem>('/v1/opt-outs', { ...request, phone });
        return response.data;
    }

    /** DELETE /v1/opt-outs/{phone} (204) */
    async delete(phone: string): Promise<void> {
        await this.client.delete(optOutPath(phone));
    }
}

function requireE164(phone: string): string {
    const normalized = phone.trim();
    if (!E164_PHONE.test(normalized)) {
        throw new RangeError(`Opt-out phone must be E.164 with a leading plus, got "${phone}".`);
    }
    return normalized;
}

function optOutPath(phone: string): string {
    return `/v1/opt-outs/${encodeURIComponent(requireE164(phone))}`;
}
