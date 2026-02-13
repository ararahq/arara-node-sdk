# Arara Node SDK

Official Node.js SDK for **AraraHQ**. Simple, typed, and developer-first.

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
const response = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "welcome",
  variables: ["John"]
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
