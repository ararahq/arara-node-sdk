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
  baseUrl: 'https://api.ararahq.com/api',
  apiKey: 'sk_live_...'
});
```

## Resources

### 1. Users (`sdk.users`)

```typescript
const user = await sdk.users.getMe();

const updated = await sdk.users.update({
  name: "New Name",
  phoneNumber: "+5511999998888"
});
```

### 2. Messages (`sdk.messages`)

```typescript
// Template standard
const response = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "welcome",
  variables: ["John"]
});

// Template com Mídia (Header de Imagem/PDF)
const mediaResponse = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "invoice_ready",
  variables: ["John", "January"],
  media_url: "https://your-media.com/invoice.pdf"
});

// Mensagem de Sessão (Texto Livre)
const sessionResponse = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  body: "Olá! Como posso ajudar?"
});
```

### 3. Templates (`sdk.templates`)

```typescript
const templates = await sdk.templates.list();

const details = await sdk.templates.get('template-name');

await sdk.templates.create({
  name: "promo_christmas",
  category: "MARKETING",
  language: "pt_BR",
  body: "Hi {{1}}, check our Christmas deals!",
  samples: ["John"]
});

await sdk.templates.delete('template-name');
```

### 4. Organization & Webhooks (`sdk.organizations`)

```typescript
const config = await sdk.organizations.getWebhook();

await sdk.organizations.updateWebhook({
  url: "https://your-api.com/webhook",
  secret: "secure-secret"
});
```

### 5. API Keys (`sdk.apiKeys`)

```typescript
const newKey = await sdk.apiKeys.create('LIVE');
```

### 6. Webhook Events

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

## Error Handling

```typescript
try {
  await sdk.users.getMe();
} catch (error: any) {
  console.error(error.response?.status, error.message);
}
```

## License

MIT
