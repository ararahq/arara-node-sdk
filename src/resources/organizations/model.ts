export interface UpdateWebhookRequest {
    url?: string;
    secret?: string;
}

export interface OrganizationWebhook {
    url: string;
    secret: string;
    isSharedNumber: boolean;
}

export interface WebhookUpdateResponse {
    message: string;
    url: string;
    secret: string;
}
