# Changelog

## 2.0.0 (2026-09-24)

Aligns the SDK with the API contract. Breaking changes are listed with the migration.

### Breaking

- **Removed `sdk.users`, `sdk.organizations` and `sdk.apiKeys`** (and the types `User`, `UpdateUserRequest`, `UpdateWebhookRequest`, `OrganizationWebhook`, `WebhookUpdateResponse`, `ApiKey`, `ApiKeyMode`, `GeneratedApiKey`, `API_KEY_MODES`). The API answers 403 to all of them when called with an API key.
  - `sdk.users.getMe()` → `sdk.auth.me()` (`GET /auth/me`, requires an ADMIN key). It returns `{ name, email, role, emailPending }`; `phoneNumber` and `needsInitialOnboarding` are not available. Profile updates, webhook config and key management stay in the dashboard.
- **`templates.get`, `templates.getStatus` and `templates.delete` take the template id (UUID)**, not the name. The API answers 400 `INVALID_PATH_PARAM` to a name.
  - Lookup by name: `(await sdk.templates.list({ name: 'welcome' })).data[0]`.
- **`templates.list()` returns `PaginatedResponse<Template>`** (`{ data, pagination: { page, size, totalElements, totalPages } }`) instead of `Template[]`, and accepts `{ name, status, page, size }`.
  - `const templates = await sdk.templates.list()` → `const { data: templates } = await sdk.templates.list()`.
- **`smartLinks.list()` returns `PaginatedResponse<WhatsAppSmartLinkResponse>`** and accepts `{ page, size }`.
- **`Template` mirrors the API `TemplateResponse`**: `body`, `samples` and `buttonsConfig` removed (the API never returned them). The text is in `bodyPreview`; `structureJson` is the provider structure as an object, not the body. New fields: `originalCategory`, `providerName`, `providerTemplateId`, `availableForSending`, `unavailableReason`, `usageGuide`, `variablesSchema`.
- **POST without `Idempotency-Key` is no longer retried.** Retries only replay `GET`/`PUT`/`DELETE` or a `POST` with the header. Use `sdk.api.post(path, body, { headers: { 'Idempotency-Key': key } })` if you need retries on a raw POST.
- 401, and 403 without an error code, now throw `AuthenticationError` (except the empty 403 of `messages.get` for another user's message, which is `AraraError` `RESOURCE_FORBIDDEN`); 403 `PLAN_FEATURE_LOCKED` throws `PlanFeatureLockedError`. Both extend `AraraError`, so existing `instanceof AraraError` checks keep working.

### Added

- `CampaignRequest.scheduledAt` and `CampaignResponse.scheduledAt` (scheduled campaigns).
- `messages.send` and `campaigns.create` always send `Idempotency-Key`: your key, or a UUID v4 generated per call and reused on every retry of that call.
- `messages.sendBatch` (`POST /v1/messages/batch`, up to 1000 messages) and `messages.get(id)` (`GET /v1/messages/{id}`).
- `templates.analytics(id, { period })` returns `TemplateAnalytics`; `templates.analyticsAll({ period })` returns `TemplateAnalyticsSummary[]`. Rates are strings with one decimal (`"97.5"`).
- `CreateTemplateRequest.carouselCards`; `TemplateButton` types `FLOW` (with `flowId`) and `CHARGE`.
- `sdk.optOuts` (`list` → `{ items, total }`, `get` → `{ phone, channel, optedOut }`, `create` → `OptOutItem`, `delete`). Phones must be E.164 with `+` (the API rule); other formats throw `RangeError` locally.
- `PlanFeatureLockedError` (`feature`, `currentPlan`, `upgradeTo`) and `AuthenticationError`.
- `SendMessageRequest` gains `sender`, `type`, `interactive`, `location`, `reaction`, `charge`, `replyTo`, `smartLinkParam`, `smartLinkUrl`, `mode`; `MessageResponse` gains `body`, `cost`, `reason`; its `id` is `string | null` and the never-returned `createdAt` is gone. `sendBatch` items are `BatchMessageItemResponse` (`id`, `receiver`, `status`, `cost`). `media_url` is marked deprecated (the API removes it on 2027-01-01).

## 1.9.0

- Publish on every push to `main` via npm Trusted Publishing.
