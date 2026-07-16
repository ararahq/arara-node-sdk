import axios, { AxiosInstance } from 'axios';
import { SDKConfig } from './types';
import { DEFAULT_MAX_RETRIES, setupInterceptors } from './http';

import { Users } from './resources/Users';
import { Messages } from './resources/Messages';
import { Templates } from './resources/Templates';
import { Organizations } from './resources/Organizations';
import { ApiKeys } from './resources/ApiKeys';
import { Contacts } from './resources/Contacts';
import { Conversations } from './resources/Conversations';
import { Wallet } from './resources/Wallet';
import { Numbers } from './resources/Numbers';
import { SmartLinks } from './resources/SmartLinks';
import { Campaigns } from './resources/Campaigns';
import { RawApi } from './resources/RawApi';

export {
    SDKConfig,
    User,
    UpdateUserRequest,
    SendMessageRequest,
    SendMessageOptions,
    MessageResponse,
    Template,
    TemplateResponse,
    TemplateStatus,
    UpdateWebhookRequest,
    OrganizationWebhook,
    WebhookUpdateResponse,
    ApiKey,
    GeneratedApiKey,

    ContactRequest,
    ContactPatchRequest,
    ContactResponse,
    ContactsListResponse,
    ContactsBatchError,
    ContactsBatchResponse,
    ContactsStatsResponse,
    ContactsReactivationCandidate,
    ContactsReactivationResponse,
    ContactMessageItem,
    ContactMessagesResponse,

    ConversationReplyRequest,

    WalletTransactionDTO,
    WalletTransactionPageDTO,
    AutoRechargeSettingsDTO,
    UpdateAutoRechargeRequest,

    NumberCardDTO,
    NumbersSlotDTO,
    NumbersResponseDTO,
    UpdateNumberRequest,
    RequestNumberRequest,

    CreateWhatsAppSmartLinkRequest,
    UpdateWhatsAppSmartLinkRequest,
    WhatsAppSmartLinkResponse,

    CampaignContactRequest,
    CampaignAbConfig,
    CampaignRequest,
    CampaignResponse,
    CampaignListItem,
    CampaignListResponse,
    CampaignDetailResponse,
    CampaignEstimateResponse,

    RevenueRecoveryWebhookEvent,
    AbacatePayWebhookEvent,
    MessageStatusWebhookEvent,
    AraraWebhookEvent
} from './types';

const DEFAULT_BASE_URL = 'https://api.ararahq.com';

export class NodeSDK {
    private client: AxiosInstance;


    public users: Users;
    public messages: Messages;
    public templates: Templates;
    public organizations: Organizations;
    public apiKeys: ApiKeys;
    public contacts: Contacts;
    public conversations: Conversations;
    public wallet: Wallet;
    public numbers: Numbers;
    public smartLinks: SmartLinks;
    public campaigns: Campaigns;
    public api: RawApi;

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
            baseURL: config.baseUrl ?? DEFAULT_BASE_URL,
            timeout: config.timeout ?? 10000,
            headers
        });

        setupInterceptors(this.client, config.maxRetries ?? DEFAULT_MAX_RETRIES);

        this.users = new Users(this.client);
        this.messages = new Messages(this.client);
        this.templates = new Templates(this.client);
        this.organizations = new Organizations(this.client);
        this.apiKeys = new ApiKeys(this.client);
        this.contacts = new Contacts(this.client);
        this.conversations = new Conversations(this.client);
        this.wallet = new Wallet(this.client);
        this.numbers = new Numbers(this.client);
        this.smartLinks = new SmartLinks(this.client);
        this.campaigns = new Campaigns(this.client);
        this.api = new RawApi(this.client);
    }
}

export { Contacts } from './resources/Contacts';
export { Conversations } from './resources/Conversations';
export { Wallet } from './resources/Wallet';
export { Numbers } from './resources/Numbers';
export { SmartLinks } from './resources/SmartLinks';
export { Campaigns } from './resources/Campaigns';
export { RawApi } from './resources/RawApi';

export { WebhookUtils } from './utils/WebhookUtils';
export { AraraError } from './errors';
