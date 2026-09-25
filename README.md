# Arara Node SDK

[![npm](https://img.shields.io/npm/v/@ararahq/sdk)](https://www.npmjs.com/package/@ararahq/sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-docs.ararahq.com-orange)](https://docs.ararahq.com)

Official Node.js SDK for **[AraraHQ](https://ararahq.com)** — the developer-first WhatsApp API. Simple, typed, and built for scale.

## Installation

```bash
npm install @ararahq/sdk
```

## Configuration

```typescript
import { NodeSDK } from '@ararahq/sdk';

const sdk = new NodeSDK({
  apiKey: 'ara_live_...'
});
```

`baseUrl` defaults to `https://api.ararahq.com`. All options:

```typescript
const sdk = new NodeSDK({
  apiKey: 'ara_live_...',
  baseUrl: 'https://api.ararahq.com',
  timeout: 10000,
  maxRetries: 3
});
```

The SDK automatically retries network errors, `5xx` and `429` responses with exponential backoff, honoring the `Retry-After` header when present. Only requests that are safe to replay are retried: `GET`/`PUT`/`DELETE`, and `POST` carrying an `Idempotency-Key`. `messages.send`, `messages.sendBatch` and `campaigns.create` always send one (yours, or a UUID v4 generated per call and reused on every retry), so a retry never duplicates a send or a charge. Set `maxRetries: 0` to disable.

## API key permissions

`GET` on contacts, conversations, wallet, smart links, opt-outs and `auth.me()` requires an **ADMIN** key. Keys with only `READ` get `AuthenticationError` (403) on those reads. API keys, user profile and organization webhook are not manageable with an API key; use the dashboard.

## Resources

### 1. Current user (`sdk.auth`)

```typescript
const me = await sdk.auth.me(); // GET /auth/me, ADMIN key
```

### 2. Messages (`sdk.messages`)

`receiver` accepts `whatsapp:+5511...`, `+5511...` or digits only.

```typescript
// Template standard
const response = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "welcome",
  templateVariables: ["John"]
});

// Template com Mídia (Header de Imagem/PDF)
const mediaResponse = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "invoice_ready",
  templateVariables: ["John", "January"],
  media_url: "https://your-media.com/invoice.pdf"
});

// Mensagem de Sessão (Texto Livre)
const sessionResponse = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  body: "Olá! Como posso ajudar?"
});

// Envio idempotente com sua própria chave (sem ela o SDK gera uma por chamada)
const idempotentResponse = await sdk.messages.send(
  {
    receiver: "whatsapp:+5511999998888",
    templateName: "welcome",
    templateVariables: ["John"]
  },
  { idempotencyKey: "order-8231-welcome" }
);

// Lote: um template, até 1000 destinatários
const batch = await sdk.messages.sendBatch({
  templateName: "welcome",
  messages: [{ receiver: "+5511999998888", variables: ["John"] }]
});

// Consulta por id
const message = await sdk.messages.get(response.id);
```

### 3. Templates (`sdk.templates`)

`get`, `getStatus`, `delete` and `analytics` take the template **id** (UUID), not the name. To find a template by name, filter the list.

```typescript
const { data, pagination } = await sdk.templates.list({ page: 0, size: 50 });

const [welcome] = (await sdk.templates.list({ name: 'welcome' })).data;
const details = await sdk.templates.get(welcome.id);
const status = await sdk.templates.getStatus(welcome.id);
const analytics = await sdk.templates.analytics(welcome.id, { period: '30d' }); // deliveryRate: "97.5"
const allAnalytics = await sdk.templates.analyticsAll({ period: '7d' });

await sdk.templates.create({
  name: "promo_christmas",
  category: "MARKETING",
  language: "pt_BR",
  body: "Hi {{1}}, check our Christmas deals!",
  samples: { "1": "John" }
});

await sdk.templates.delete(welcome.id);
```

### 4. Opt-outs (`sdk.optOuts`)

Phones must be E.164 with the leading `+`; other formats throw `RangeError` before calling the API.

```typescript
await sdk.optOuts.create({ phone: "+5511999998888", reason: "pediu pra sair" });
const { optedOut } = await sdk.optOuts.get("+5511999998888");
const { items, total } = await sdk.optOuts.list();
await sdk.optOuts.delete("+5511999998888");
```

### 5. Webhook Events

```typescript
import { AraraWebhookEvent, WebhookUtils } from '@ararahq/sdk';
import express from 'express';

const app = express();

app.post('/webhook/arara', express.json(), (req, res) => {
    const event = req.body as AraraWebhookEvent;

    if (WebhookUtils.isMessageStatusEvent(event)) {
        const { messageId, status, receiver } = event.data;
        console.log(`Message ${messageId} to ${receiver}: ${status}`);
    }

    if (WebhookUtils.isInboundMessageEvent(event)) {
        const { from, body } = event.data;
        console.log(`New message from ${from}: ${body}`);
    }

    res.sendStatus(200);
});
```

### 6. Contacts (`sdk.contacts`)

```typescript
const page = await sdk.contacts.list(0, 50);
const contact = await sdk.contacts.get('+5511999998888');
await sdk.contacts.update('+5511999998888', { name: "Maria", tags: ["vip"] });
await sdk.contacts.importBatch([{ name: "Maria", phone: "+5511999998888" }]);
const stats = await sdk.contacts.stats();
const history = await sdk.contacts.messages('+5511999998888', 30);
```

### 7. Conversations (`sdk.conversations`)

```typescript
const conversations = await sdk.conversations.list();
const messages = await sdk.conversations.messages('conversation-id');
await sdk.conversations.reply({ conversationId: 'conversation-id', body: "Oi, tudo certo?" });
const windows = await sdk.conversations.windowStatus(['+5511999998888']);
```

### 8. Campaigns (`sdk.campaigns`)

```typescript
const estimate = await sdk.campaigns.estimate('promo', 1200);

const campaign = await sdk.campaigns.create({
  name: "Black Friday",
  templateName: "promo",
  contacts: [{ to: "whatsapp:+5511999998888", variables: ["Maria"] }]
});

const detail = await sdk.campaigns.get(campaign.id);
await sdk.campaigns.cancel(campaign.id);
```

### 9. Wallet (`sdk.wallet`)

```typescript
const transactions = await sdk.wallet.transactions(0, 20);
const autoRecharge = await sdk.wallet.getAutoRecharge();
await sdk.wallet.updateAutoRecharge({ enabled: true, threshold: 50, amount: 200 });
```

### 10. Numbers (`sdk.numbers`)

```typescript
const { numbers, slot } = await sdk.numbers.list();
await sdk.numbers.update(numbers[0].id, { alias: "Suporte" });
const warming = await sdk.numbers.warming(numbers[0].id);
```

### 11. Smart Links (`sdk.smartLinks`)

```typescript
const link = await sdk.smartLinks.create({
  name: "Promo",
  phoneNumber: "+5511999998888",
  defaultText: "Quero a oferta"
});
const stats = await sdk.smartLinks.stats(link.id);
const { data: links, pagination } = await sdk.smartLinks.list({ page: 0, size: 50 });
```

### 12. Raw API (`sdk.api`)

Escape hatch for endpoints without a typed resource yet. Inherits auth, `baseUrl`, timeout and retries.

```typescript
const data = await sdk.api.get('/v1/some/endpoint');
await sdk.api.post('/v1/some/endpoint', { foo: "bar" });
```

## Error Handling

Every failed request throws a typed `AraraError` with the parsed API error envelope:

```typescript
import { AraraError } from '@ararahq/sdk';

try {
  await sdk.messages.send({ receiver: "whatsapp:+5511999998888", body: "Oi" });
} catch (error) {
  if (error instanceof AraraError) {
    console.error(error.statusCode, error.code, error.message, error.details);
    if (error.statusCode === 429 && error.retryAfter !== undefined) {
      console.error(`Retry after ${error.retryAfter}s`);
    }
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `statusCode` | `number \| undefined` | HTTP status. `undefined` for network errors |
| `code` | `string` | API error code (e.g. `INSUFFICIENT_FUNDS`). `NETWORK_ERROR` when the request never got a response. A 429 carries `SEND_RATE_LIMITED`, `MARKETING_FREQUENCY_EXCEEDED`, `BATCH_BUSY` or `RATE_LIMIT_EXCEEDED` |
| `message` | `string` | Human-readable message from the API |
| `details` | `object \| undefined` | Extra context from the API |
| `retryAfter` | `number \| undefined` | Seconds to wait, from the `Retry-After` header |

Two subclasses narrow the common cases:

- `PlanFeatureLockedError` (403 `PLAN_FEATURE_LOCKED`): exposes `feature`, `currentPlan` and `upgradeTo`.
- `AuthenticationError` (401, or 403 without an error code): the key was rejected (invalid, expired, IP not allowed, missing permission). Exception: `messages.get(id)` on a message owned by another user answers an empty 403, which the SDK raises as a plain `AraraError` with code `RESOURCE_FORBIDDEN`.

```typescript
import { PlanFeatureLockedError, AuthenticationError } from '@ararahq/sdk';

try {
  await sdk.campaigns.create(campaign);
} catch (error) {
  if (error instanceof PlanFeatureLockedError) {
    showUpgrade(error.upgradeTo);
  } else if (error instanceof AuthenticationError) {
    rotateKey();
  }
}
```

## Migrating from 1.x

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
