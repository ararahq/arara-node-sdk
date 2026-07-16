import { BaseResource } from './BaseResource';
import {
    WalletTransactionPageDTO,
    AutoRechargeSettingsDTO,
    UpdateAutoRechargeRequest
} from '../types';

export class Wallet extends BaseResource {
    /**
     * List wallet transactions.
     * GET /v1/wallet/transactions
     */
    async transactions(page = 0, size = 20): Promise<WalletTransactionPageDTO> {
        const response = await this.client.get<WalletTransactionPageDTO>('/v1/wallet/transactions', {
            params: { page, size }
        });
        return response.data;
    }

    /**
     * Get auto-recharge settings.
     * GET /v1/wallet/auto-recharge
     */
    async getAutoRecharge(): Promise<AutoRechargeSettingsDTO> {
        const response = await this.client.get<AutoRechargeSettingsDTO>('/v1/wallet/auto-recharge');
        return response.data;
    }

    /**
     * Update auto-recharge settings.
     * PATCH /v1/wallet/auto-recharge
     */
    async updateAutoRecharge(request: UpdateAutoRechargeRequest): Promise<AutoRechargeSettingsDTO> {
        const response = await this.client.patch<AutoRechargeSettingsDTO>('/v1/wallet/auto-recharge', request);
        return response.data;
    }
}
