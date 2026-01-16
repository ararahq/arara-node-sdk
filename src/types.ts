export interface SDKConfig {
    apiKey?: string;
    baseUrl: string;
    timeout?: number;
}

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

export interface SendMessageRequest {
    receiver: string;
    templateName: string;
    variables?: string[];
    scheduled_at?: string;
}

export interface MessageResponse {
    status: string;
    mode: string;
    sender: string;
    receiver: string;
}

export interface Template {
    id: string;
    name: string;
    formattedName: string;
    category: string;
    language: string;
    providerName: string;
    providerTemplateId: string;
    providerStatus: string;
    rejectionReason?: string | null;
    bodyPreview?: string | null;
    createdAt: string;
    updatedAt?: string | null;
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

export interface AuthResponse {
    user: User;
    token: string;
    userId?: string;
    isAuthenticated: boolean;
    apiKey?: string;
}
