export interface SDKConfig {
    /** Arara API Key (starts with 'ara_live_') */
    apiKey?: string;
    /** Arara API Base URL (default: https://api.ararahq.com) */
    baseUrl?: string;
    timeout?: number;
    /** Maximum automatic retries for network errors, 5xx and 429 responses (default: 3) */
    maxRetries?: number;
}
