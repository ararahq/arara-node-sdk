export { Auth } from './auth';
export type { CurrentUser } from './auth/model';

export type { Pagination, PaginatedResponse, PageParams } from './pagination';

export { Campaigns } from './campaigns';
export type {
    CampaignContactRequest,
    CampaignAbConfig,
    CampaignRequest,
    CampaignResponse,
    CampaignListItem,
    CampaignListResponse,
    CampaignDetailResponse,
    CampaignEstimateResponse
} from './campaigns/model';

export { Contacts } from './contacts';
export type {
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
    ContactMessagesResponse
} from './contacts/model';

export { Conversations } from './conversations';
export type { ConversationReplyRequest } from './conversations/model';

export { Messages } from './messages';
export type {
    SendMessageRequest,
    SendMessageOptions,
    MessageResponse,
    BatchMessageItem,
    BatchMessageRequest,
    BatchMessageResponse,
    BatchMessageItemResponse
} from './messages/model';

export { Numbers } from './numbers';
export type {
    NumberCardDTO,
    NumbersSlotDTO,
    NumbersResponseDTO,
    UpdateNumberRequest,
    RequestNumberRequest
} from './numbers/model';

export { OptOuts } from './opt-outs';
export type { OptOutRequest, OptOutItem, OptOutList, OptOutCheck } from './opt-outs/model';

export { SmartLinks } from './smart-links';
export type {
    CreateWhatsAppSmartLinkRequest,
    UpdateWhatsAppSmartLinkRequest,
    WhatsAppSmartLinkResponse
} from './smart-links/model';

export { Templates } from './templates';
export type {
    Template,
    CreateTemplateRequest,
    TemplateButton,
    TemplateResponse,
    TemplateStatus,
    ListTemplatesParams,
    TemplateAnalyticsParams,
    TemplateAnalytics,
    TemplateAnalyticsSummary,
    CarouselCard
} from './templates/model';


export { Wallet } from './wallet';
export type {
    WalletTransactionDTO,
    WalletTransactionPageDTO,
    AutoRechargeSettingsDTO,
    UpdateAutoRechargeRequest
} from './wallet/model';

export type {
    RevenueRecoveryWebhookEvent,
    AbacatePayWebhookEvent,
    MessageStatusWebhookEvent,
    AraraWebhookEvent
} from './webhooks/model';

export { RawApi } from './raw-api';
