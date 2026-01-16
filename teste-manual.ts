import { NodeSDK } from './src/index';

// Configuração
const API_URL = process.env.API_URL || 'http://localhost:8080/api';
const API_KEY = process.env.API_KEY || ''; // Deixe vazio se for testar login ou se não tiver key ainda

// Inicialização
const sdk = new NodeSDK({
  baseUrl: API_URL,
  apiKey: API_KEY
});

async function main() {
  console.log(`🚀 Iniciando testes do SDK Arara em ${API_URL}...`);

  // 1. Teste de Auth (Opcional - se tiver token firebase fake/real)
  // const firebaseToken = "fake-token";
  // try {
  //     console.log("\n[Auth] Tentando login com Firebase...");
  //     const auth = await sdk.auth.loginWithFirebase(firebaseToken);
  //     console.log("✅ Login sucesso! Token:", auth.token);
  //     // Re-instanciar SDK com o novo token se fosse um fluxo real
  // } catch (e: any) {
  //     console.log("ℹ️ Login ignorado ou falhou (esperado se sem token válido).");
  // }

  // 2. Teste de Usuário (getMe)
  try {
    console.log("\n[Users] Buscando dados do usuário (getMe)...");
    const me = await sdk.users.getMe();
    console.log("✅ Usuário encontrado:", me.name, me.email);

    // 3. Teste de Atualização (Update)
    console.log("[Users] Tentando atualizar usuário...");
    const updated = await sdk.users.update({ name: me.name + " (upd)" });
    console.log("✅ Usuário atualizado:", updated.name);

  } catch (e: any) {
    if (e.response?.status === 403 || e.response?.status === 401) {
      console.error("\n❌ ACESSO NEGADO (401/403).");
      console.error("Para testar endpoints protegidos, você precisa configurar a variável API_KEY.");
      console.error("Exemplo: API_KEY=sk_live_... npx tsx teste-manual.ts");
    } else {
      console.error("❌ Erro em Users:", e.message);
    }
  }

  // 4. Teste de Templates
  try {
    console.log("\n[Templates] Listando templates...");
    const templates = await sdk.templates.list();
    console.log(`✅ ${templates.length} templates encontrados.`);

    if (templates.length > 0) {
      const firstId = templates[0].id;
      console.log(`[Templates] Buscando detalhes do template ${firstId}...`);
      const details = await sdk.templates.get(firstId);
      console.log("✅ Detalhes:", details.formattedName);
    }
  } catch (e: any) {
    console.error("❌ Erro em Templates (pode ser normal se 401):", e.message);
  }

  // 5. Teste de Organizations
  try {
    console.log("\n[Organizations] Buscando Webhook...");
    const webhook = await sdk.organizations.getWebhook();
    console.log("✅ Webhook URL:", webhook.url || "Não configurada");
  } catch (e: any) {
    console.error("❌ Erro em Organizations:", e.message);
  }

  // 6. Teste de ApiKeys
  try {
    console.log("\n[ApiKeys] Listando Chaves de API...");
    const keys = await sdk.apiKeys.list();
    console.log(`✅ ${keys.length} chaves encontradas.`);
  } catch (e: any) {
    console.error("❌ Erro em ApiKeys:", e.message);
  }

  console.log("\n🏁 Testes finalizados.");
}

main();
