import axios, { AxiosInstance } from 'axios';
import { SDKConfig } from './types';

import { Users } from './resources/Users';
import { Messages } from './resources/Messages';
import { Templates } from './resources/Templates';
import { Organizations } from './resources/Organizations';
import { ApiKeys } from './resources/ApiKeys';

export {
    SDKConfig,
    User,
    UpdateUserRequest,
    SendMessageRequest,
    MessageResponse,
    Template,
    TemplateResponse,
    TemplateStatus,
    UpdateWebhookRequest,
    OrganizationWebhook,
    WebhookUpdateResponse,
    ApiKey,
    GeneratedApiKey,

    RevenueRecoveryWebhookEvent,
    AbacatePayWebhookEvent,
    MessageStatusWebhookEvent,
    AraraWebhookEvent
} from './types';

export class NodeSDK {
    private client: AxiosInstance;


    public users: Users;
    public messages: Messages;
    public templates: Templates;
    public organizations: Organizations;
    public apiKeys: ApiKeys;

    constructor(config: SDKConfig) {
        if (!config.apiKey || config.apiKey.trim() === '') {
            throw new Error(
                'SDKConfig.apiKey is required to instantiate NodeSDK. Please provide a valid API key.'
            );
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        headers['Authorization'] = `Bearer ${config.apiKey}`;

        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout ?? 10000,
            headers
        });


        this.users = new Users(this.client);
        this.messages = new Messages(this.client);
        this.templates = new Templates(this.client);
        this.organizations = new Organizations(this.client);
        this.apiKeys = new ApiKeys(this.client);
    }
}

export { WebhookUtils } from './utils/WebhookUtils';
