# Arara Node SDK

O SDK oficial para integração com a plataforma **AraraHQ**. Este pacote fornece uma interface simples e tipada para interagir com todos os recursos da API.

## Instalação

```bash
npm install ararahq
# ou
yarn add ararahq
# ou
pnpm add ararahq
```

## Configuração

Importe e inicialize o SDK com sua chave de API (obtida no painel administrativo).

```typescript
import { NodeSDK } from 'ararahq';

const sdk = new NodeSDK({
  baseUrl: 'https://api.ararahq.com/api', // ou sua URL da API
  apiKey: 'sk_live_...'
});
```

## Recursos Disponíveis

O SDK é dividido em módulos para facilitar o uso:

### 1. Autenticação (`sdk.auth`)

Gerenciamento de sessão e login.

```typescript
// Login via Firebase Token
const auth = await sdk.auth.loginWithFirebase('firebase-token-jwt');
console.log(auth.token);
```

### 2. Usuários (`sdk.users`)

Gerenciamento do perfil do usuário autenticado.

```typescript
// Obter dados do usuário atual
const user = await sdk.users.getMe();

// Atualizar perfil
const updated = await sdk.users.update({
  name: "Novo Nome",
  phoneNumber: "+5511999998888"
});
```

### 3. Mensagens (`sdk.messages`)

Envio de mensagens via WhatsApp (integrado com Twilio/Providers).

```typescript
// Enviar mensagem de template
const response = await sdk.messages.send({
  receiver: "whatsapp:+5511999998888",
  templateName: "boas_vindas",
  variables: ["João"]
});

console.log(`Mensagem enviada! Status: ${response.status}`);
```

### 4. Templates (`sdk.templates`)

Gestão e consulta de templates de mensagens.

```typescript
// Listar templates
const templates = await sdk.templates.list();

// Detalhes de um template
const details = await sdk.templates.get('id-do-template');
```

### 5. Organização e Webhooks (`sdk.organizations`)

Configuração de preferências da organização, como Webhooks para eventos de entrada.

```typescript
// Consultar configuração atual
const config = await sdk.organizations.getWebhook();

// Atualizar URL de Webhook
await sdk.organizations.updateWebhook({
  url: "https://minha-api.com/webhook",
  secret: "meu-secret-seguro"
});
```

### 6. Chaves de API (`sdk.apiKeys`)

Gerenciamento programático de chaves de acesso.

```typescript
// Criar nova chave
const newKey = await sdk.apiKeys.create('LIVE');
console.log(`Nova chave gerada: ${newKey.plainTextKey}`);
```

### 7. Tipagem de Webhooks (Eventos de Entrada)

O SDK exporta tipos para ajudar você a processar os webhooks que sua aplicação recebe da Arara (ex: Recuperação de Carrinho, Status de Mensagem).

```typescript
import { AraraWebhookEvent } from 'ararahq';
import express from 'express';

const app = express();

app.post('/webhook/arara', (req, res) => {
  const event = req.body as AraraWebhookEvent;

  if (event.event === 'cart.abandoned') {
    console.log(`Carrinho abandonado por: ${event.phone}, Valor: ${event.total}`);
  }

  if (event.event === 'billing.paid') {
     console.log(`Pagamento confirmado! ID: ${event.data.billing.id}`);
  }

  res.sendStatus(200);
});
```

## Tratamento de Erros

O SDK utiliza `axios` internamente. Erros de API retornarão exceções que podem ser tratadas via `try/catch`.

```typescript
try {
  await sdk.users.getMe();
} catch (error: any) {
  if (error.response?.status === 403) {
    console.error("Acesso negado: Verifique sua API Key.");
  } else {
    console.error("Erro desconhecido:", error.message);
  }
}
```

## Licença

ISC
