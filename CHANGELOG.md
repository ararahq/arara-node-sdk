# Changelog

## 2.0.0 (2026-09-24)

Aligns the SDK with the API contract. Breaking changes are listed with the migration.

### Breaking

- **Removed `sdk.users`, `sdk.organizations` and `sdk.apiKeys`** (and the types `User`, `UpdateUserRequest`, `UpdateWebhookRequest`, `OrganizationWebhook`, `WebhookUpdateResponse`, `ApiKey`, `ApiKeyMode`, `GeneratedApiKey`, `API_KEY_MODES`). The API answers 403 to all of them when called with an API key.
  - `sdk.users.getMe()` → `sdk.auth.me()` (`GET /auth/me`, requires an ADMIN key). Profile updates, webhook config and key management stay in the dashboard.
- **`templates.get`, `templates.getStatus` and `templates.delete` take the template id (UUID)**, not the name. The API answers 400 `INVALID_PATH_PARAM` to a name.
  - Lookup by name: `(await sdk.templates.list({ name: 'welcome' })).data[0]`.
- **`templates.list()` returns `PaginatedResponse<Template>`** (`{ data, pagination: { page, size, totalElements, totalPages } }`) instead of `Template[]`, and accepts `{ name, status, page, size }`.
  - `const templates = await sdk.templates.list()` → `const { data: templates } = await sdk.templates.list()`.
- **`smartLinks.list()` returns `PaginatedResponse<WhatsAppSmartLinkResponse>`** and accepts `{ page, size }`.
- **`Template.body` removed** (the API never returned it); use `bodyPreview` / `structureJson`.
- **POST without `Idempotency-Key` is no longer retried.** Retries only replay `GET`/`PUT`/`DELETE` or a `POST` with the header. Use `sdk.api.post(path, body, { headers: { 'Idempotency-Key': key } })` if you need retries on a raw POST.
- 401, and 403 without an error code, now throw `AuthenticationError`; 403 `PLAN_FEATURE_LOCKED` throws `PlanFeatureLockedError`. Both extend `AraraError`, so existing `instanceof AraraError` checks keep working.

### Added

- `messages.send` and `campaigns.create` always send `Idempotency-Key`: your key, or a UUID v4 generated per call and reused on every retry of that call.
- `messages.sendBatch` (`POST /v1/messages/batch`, up to 1000 messages) and `messages.get(id)` (`GET /v1/messages/{id}`).
- `templates.analytics(id?, { period })`.
- `sdk.optOuts` (`list`, `get`, `create`, `delete`).
- `PlanFeatureLockedError` (`feature`, `currentPlan`, `upgradeTo`) and `AuthenticationError`.
- `SendMessageRequest` gains `sender`, `type`, `interactive`, `location`, `reaction`, `charge`, `replyTo`, `smartLinkParam`, `smartLinkUrl`, `mode`; `MessageResponse` gains `body`, `cost`, `reason`. `media_url` is marked deprecated (the API removes it on 2027-01-01).

## 1.9.0

- Publish on every push to `main` via npm Trusted Publishing.
