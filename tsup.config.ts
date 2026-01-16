import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],  // Arquivo principal
  format: ['cjs', 'esm'],   // Gera código compatível com tudo (CommonJS e Modules)
  dts: true,                // Gera os tipos TypeScript
  clean: true,              // Limpa a pasta dist antes de criar de novo
});
