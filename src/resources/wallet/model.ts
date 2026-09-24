export interface WalletTransactionDTO {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    referenceId: string | null;
    mode: string;
    createdAt: string | null;
}

export interface WalletTransactionPageDTO {
    content: WalletTransactionDTO[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface AutoRechargeSettingsDTO {
    enabled: boolean;
    threshold: number;
    amount: number;
    lastAttemptAt: string | null;
    lastFailureReason: string | null;
}

export interface UpdateAutoRechargeRequest {
    enabled?: boolean;
    threshold?: number;
    amount?: number;
}
