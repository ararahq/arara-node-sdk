import axios, { AxiosInstance } from 'axios';
import type { SDKConfig } from './config';
import { DEFAULT_MAX_RETRIES, setupInterceptors } from './http';

import { Auth } from './resources/auth';
import { Messages } from './resources/messages';
import { Templates } from './resources/templates';
import { OptOuts } from './resources/opt-outs';
import { Contacts } from './resources/contacts';
import { Conversations } from './resources/conversations';
import { Wallet } from './resources/wallet';
import { Numbers } from './resources/numbers';
import { SmartLinks } from './resources/smart-links';
import { Campaigns } from './resources/campaigns';
import { RawApi } from './resources/raw-api';

export { SDKConfig } from './config';
export type {
    CurrentUser,
    Pagination,
    PaginatedResponse,
    PageParams,
    SendMessageRequest,
    SendMessageOptions,
    MessageResponse,
    BatchMessageItem,
    BatchMessageRequest,
    BatchMessageResponse,
    Template,
    CreateTemplateRequest,
    TemplateButton,
    TemplateResponse,
    TemplateStatus,
    ListTemplatesParams,
    TemplateAnalyticsParams,
    OptOutRequest,

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
} from './resources';

const DEFAULT_BASE_URL = 'https://api.ararahq.com';

export class NodeSDK {
    private client: AxiosInstance;

    public auth: Auth;
    public messages: Messages;
    public templates: Templates;
    public optOuts: OptOuts;
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

        this.auth = new Auth(this.client);
        this.messages = new Messages(this.client);
        this.templates = new Templates(this.client);
        this.optOuts = new OptOuts(this.client);
        this.contacts = new Contacts(this.client);
        this.conversations = new Conversations(this.client);
        this.wallet = new Wallet(this.client);
        this.numbers = new Numbers(this.client);
        this.smartLinks = new SmartLinks(this.client);
        this.campaigns = new Campaigns(this.client);
        this.api = new RawApi(this.client);
    }
}

export { Contacts } from './resources/contacts';
export { Conversations } from './resources/conversations';
export { Wallet } from './resources/wallet';
export { Numbers } from './resources/numbers';
export { SmartLinks } from './resources/smart-links';
export { Campaigns } from './resources/campaigns';
export { RawApi } from './resources/raw-api';
export { Auth } from './resources/auth';
export { OptOuts } from './resources/opt-outs';
export { Messages, MAX_BATCH_SIZE } from './resources/messages';
export { Templates } from './resources/templates';

export { WebhookUtils } from './utils/webhook-utils';
export { AraraError, AuthenticationError, PlanFeatureLockedError } from './errors';
