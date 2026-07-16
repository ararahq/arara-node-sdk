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



// CONTACTS

export interface ContactRequest {
    name: string;
    phone: string;
    email?: string;
    attributes?: Record<string, unknown>;
}

export interface ContactPatchRequest {
    name?: string;
    email?: string;
    tags?: string[];
}

export interface ContactResponse {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    attributes: Record<string, unknown> | null;
    tags: string[];
    createdAt: string;
    lifecycle: string;
    source: string;
    outboundCount: number;
    inboundCount: number;
    firstSeenAt: string | null;
    lastOutboundAt: string | null;
    lastInboundAt: string | null;
    lastMessageAt: string | null;
    optOutAt: string | null;
    lastTemplateName: string | null;
}

export interface ContactsListResponse {
    contacts: ContactResponse[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}

export interface ContactsBatchError {
    index: number;
    phone: string | null;
    reason: string;
}

export interface ContactsBatchResponse {
    importId: string;
    created: number;
    updated: number;
    skipped: number;
    errors: ContactsBatchError[];
}

export interface ContactsStatsResponse {
    total: number;
    newCount: number;
    engaged: number;
    silent: number;
    dormant: number;
    optedOut: number;
}

export interface ContactsReactivationCandidate {
    phone: string;
    name: string;
    lastMessageAt: string | null;
    lastTemplateName: string | null;
}

export interface ContactsReactivationResponse {
    total: number;
    candidates: ContactsReactivationCandidate[];
}

export interface ContactMessageItem {
    id: string;
    direction: string;
    status: string;
    templateName: string | null;
    body: string | null;
    createdAt: string;
}

export interface ContactMessagesResponse {
    phone: string;
    total: number;
    messages: ContactMessageItem[];
}

// CONVERSATIONS

export interface ConversationReplyRequest {
    conversationId: string;
    body: string;
}

// WALLET

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

// NUMBERS

export interface NumberCardDTO {
    id: string;
    name: string;
    alias: string | null;
    description: string | null;
    phoneNumber: string;
    type: string;
    isDefault: boolean;
    status: string;
    qualityScore: string;
    messagingTier: string;
    verifiedAt: string | null;
    lastHealthCheckAt: string | null;
    provider: string;
    createdAt: string | null;
    messagesLast7d: number;
    messagesLast30d: number;
}

export interface NumbersSlotDTO {
    used: number;
    max: number;
    planLabel: string;
    atCap: boolean;
    noEntitlement: boolean;
    monthlyPriceCents: number;
    monthlyTotalCents: number;
}

export interface NumbersResponseDTO {
    numbers: NumberCardDTO[];
    slot: NumbersSlotDTO;
}

export interface UpdateNumberRequest {
    alias?: string;
    isDefault?: boolean;
    name?: string;
    description?: string;
}

export interface RequestNumberRequest {
    reason?: string;
    expectedVolume?: string;
    areaCode?: string;
    displayName?: string;
    profilePictureUrl?: string;
}

// SMART LINKS

export interface CreateWhatsAppSmartLinkRequest {
    name: string;
    phoneNumber: string;
    defaultText?: string;
    qrCodeColor?: string;
}

export interface UpdateWhatsAppSmartLinkRequest {
    name?: string;
    defaultText?: string;
    qrCodeColor?: string;
}

export interface WhatsAppSmartLinkResponse {
    id: string;
    name: string;
    phoneNumber: string;
    defaultText: string | null;
    qrCodeColor: string;
    code: string;
    shortUrl: string;
    createdAt: string | null;
    clicks: number;
}

// CAMPAIGNS

export interface CampaignContactRequest {
    to: string;
    variables?: string[];
}

export interface CampaignAbConfig {
    variantBTemplateName: string;
    metric?: string;
    samplePct?: number;
    splitPct?: number;
    decisionWindowMinutes?: number;
    autopilot?: boolean;
}

export interface CampaignRequest {
    name: string;
    templateName: string;
    sender?: string;
    contacts: CampaignContactRequest[];
    abTest?: CampaignAbConfig;
}

export interface CampaignResponse {
    id: string;
    name: string;
    status: string;
    totalMessages: number;
    totalCost: number;
}

export interface CampaignListItem {
    id: string;
    name: string;
    status: string;
    templateName: string;
    totalMessages: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    totalCost: number;
    createdAt: string | null;
}

export interface CampaignListResponse {
    content: CampaignListItem[];
    totalPages: number;
    totalElements: number;
}

export interface CampaignDetailResponse {
    id: string;
    name: string;
    status: string;
    templateName: string;
    templateBody: string | null;
    totalMessages: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    clickedCount: number;
    convertedCount: number;
    convertedValue: number;
    replyCount: number;
    holdoutCount: number;
    blockedCount: number;
    refundCount: number;
    refundValue: number;
    totalCost: number;
    scheduledAt: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string | null;
}

export interface CampaignEstimateResponse {
    templateCategory: string;
    recipientCount: number;
    templateCost: number;
    araraFee: number;
    unitPrice: number;
    totalCost: number;
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
