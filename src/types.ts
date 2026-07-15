export interface SDKConfig {
    /** Arara API Key (starts with 'ara_live_') */
    apiKey?: string;
    /** API Base URL (default: https://api.ararahq.com) */
    baseUrl?: string;
    timeout?: number;
    /** Maximum automatic retries for network errors, 5xx and 429 responses (default: 3) */
    maxRetries?: number;
}

// USERS (Contacts)

export interface User {
    name: string;
    email: string;
    phoneNumber?: string;
    needsInitialOnboarding?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    phoneNumber?: string;
}

// MESSAGES

export interface SendMessageRequest {
    receiver: string;
    templateName?: string;
    templateVariables?: string[];
    variables?: string[]; // Alias for templateVariables
    body?: string;
    media_url?: string;
    scheduled_at?: string;
}

export interface SendMessageOptions {
    /** Sent as the Idempotency-Key header to deduplicate retried sends */
    idempotencyKey?: string;
}

export interface MessageResponse {
    id: string; // Public ID (ara_msg_...)
    status: string;
    mode: string;
    sender: string;
    receiver: string;
    createdAt?: string;
}

// TEMPLATES

export interface Template {
    id: string; // ara_tmp_...
    name: string;
    formattedName: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    body: string;
    samples?: string[];
    buttonsConfig?: any[];
    providerStatus: string;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateTemplateRequest {
    name: string;
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    body: string;
    header?: string;
    headerType?: 'text' | 'media' | 'document';
    footer?: string;
    buttons?: TemplateButton[];
    samples?: Record<string, string>;
    variableExamples?: string[]; // Legacy
}

export interface TemplateButton {
    type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL' | 'SMART_LINK' | 'COPY_CODE';
    text: string;
    url?: string;
    phone?: string;
    extraConfig?: Record<string, any>;
}

export interface TemplateResponse {
    id: string;
    name: string;
}

export interface TemplateStatus {
    status: string;
    rejectionReason?: string | null;
    category: string;
}

// WEBHOOKS AND INTEGRATIONS

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

// API KEYS

export interface ApiKey {
    id: string;
    prefix: string;
    lastFour: string;
    mode: string;
    createdAt: string;
    lastUsedAt: string | "Nunca";
}

export interface GeneratedApiKey {
    plainTextKey: string;
    prefix: string;
    lastFourChars: string;
    mode: string;
    createdAt: string;
}



// WEBHOOK EVENTS (Universal Envelope v2)

export interface AraraWebhookEnvelope<T> {
    event: string;
    data: T;
    timestamp: string;
    organizationId: string;
}

/**
 * Revenue Recovery Event (Abandoned Cart, Pix Generated, etc.)
 */
export interface RevenueRecoveryData {
    name?: string;
    phone: string;
    total?: number;
    checkout_url?: string;
    minutes_without_payment?: number;
    pix_qr_code?: string;
}

/**
 * Message Status Change Event (Sent, Delivered, Read...)
 */
export interface MessageStatusData {
    messageId: string; // ara_msg_...
    status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed' | 'canceled';
    receiver: string;
    sender: string;
    errorDetails?: any;
}

/**
 * Inbound Message Event
 */
export interface InboundMessageData {
    from: string;
    to: string;
    body: string;
    type: 'text' | 'media';
    media_url?: string;
    sender_name?: string;
}

export type RevenueRecoveryWebhookEvent = AraraWebhookEnvelope<RevenueRecoveryData>;
export type MessageStatusWebhookEvent = AraraWebhookEnvelope<MessageStatusData>;
export type InboundMessageWebhookEvent = AraraWebhookEnvelope<InboundMessageData>;
export type AbacatePayWebhookEvent = AraraWebhookEnvelope<any>; // Fallback para AbacatePay

/**
 * Union type for typing the body of any webhook received from Arara
 */
export type AraraWebhookEvent = RevenueRecoveryWebhookEvent | MessageStatusWebhookEvent | InboundMessageWebhookEvent | AbacatePayWebhookEvent;
