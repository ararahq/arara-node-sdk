export const API_KEY_MODES = {
    LIVE: 'LIVE',
    TEST: 'TEST'
} as const;

export type ApiKeyMode = (typeof API_KEY_MODES)[keyof typeof API_KEY_MODES];

export interface ApiKey {
    id: string;
    prefix: string;
    lastFour: string;
    mode: string;
    createdAt: string;
    lastUsedAt: string;
}

export interface GeneratedApiKey {
    plainTextKey: string;
    prefix: string;
    lastFourChars: string;
    mode: string;
    createdAt: string;
}
