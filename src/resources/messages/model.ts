export interface SendMessageRequest {
    receiver: string;
    templateName?: string;
    templateVariables?: string[];
    variables?: string[];
    body?: string;
    media_url?: string;
    scheduled_at?: string;
}

export interface SendMessageOptions {
    /** Sent as the Idempotency-Key header to deduplicate retried sends */
    idempotencyKey?: string;
}

export interface MessageResponse {
    id: string;
    status: string;
    mode: string;
    sender: string;
    receiver: string;
    createdAt?: string;
}
