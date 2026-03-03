import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * MCP Registry — defines all MCPs with their auth requirements.
 * Each entry maps to a key in .mcp.json's mcpServers.
 */
const MCP_REGISTRY = {
  // === Essential: No auth needed (always ready) ===
  'context7': {
    name: 'Context7',
    description: 'Documentacao atualizada de bibliotecas',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'fetch': {
    name: 'Fetch',
    description: 'Busca URLs e converte para Markdown',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'youtube-transcript': {
    name: 'YouTube Transcript',
    description: 'Transcricoes de videos',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'memory': {
    name: 'Memory',
    description: 'Grafo de conhecimento persistente',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'sequential-thinking': {
    name: 'Sequential Thinking',
    description: 'Raciocinio estruturado',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },

  // === Essential: Python MCP Servers (local, no auth, via uv run) ===
  'data-analyzer': {
    name: 'Data Analyzer',
    description: 'Analise CSV, estatisticas, graficos',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'web-scraper': {
    name: 'Web Scraper',
    description: 'Web scraping avancado',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'automation': {
    name: 'Automation',
    description: 'Automacao de sistema e file processing',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'input-analyzer': {
    name: 'Input Analyzer',
    description: 'Analisa PRDs, N8N workflows, URLs',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'memory-graph': {
    name: 'Memory Graph',
    description: 'Grafo de conhecimento entre sessoes',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },
  'tool-forge': {
    name: 'Tool Forge',
    description: 'Cria tools dinamicamente',
    envVars: [],
    authType: 'none',
    tier: 'essential',
  },

  // === Essential: API Key already configured ===
  'exa': {
    name: 'EXA',
    description: 'Busca web, codigo, empresas',
    envVars: ['EXA_API_KEY'],
    authType: 'api_key',
    tier: 'essential',
    setupUrl: 'https://dashboard.exa.ai/api-keys',
    setupHint: 'Crie conta gratuita ($15 credito)',
  },
  'apify': {
    name: 'Apify',
    description: 'Actors, web scraper, RAG browser',
    envVars: ['APIFY_TOKEN'],
    authType: 'api_key',
    tier: 'essential',
    setupUrl: 'https://console.apify.com/account/integrations',
    setupHint: 'Crie conta gratuita e copie o API Token em Settings → Integrations',
  },
  'e2b-sandbox': {
    name: 'E2B Sandbox',
    description: 'Execucao segura de codigo em microVMs',
    envVars: ['E2B_API_KEY'],
    authType: 'api_key',
    tier: 'essential',
    setupUrl: 'https://e2b.dev/dashboard',
    setupHint: 'Crie conta gratuita (free tier)',
  },
  'obsidian': {
    name: 'Obsidian',
    description: 'Notas do vault local',
    envVars: ['OBSIDIAN_VAULT_PATH'],
    authType: 'local_path',
    tier: 'essential',
    setupHint: 'Defina o caminho do vault (ex: /Users/voce/Documents/Obsidian Vault)',
  },

  // === Optional: Requires external service or unfilled keys ===
  'github': {
    name: 'GitHub',
    description: 'Issues, PRs, repos, code search',
    envVars: ['GITHUB_PAT'],
    authType: 'api_key',
    tier: 'optional',
    setupUrl: 'https://github.com/settings/tokens',
    setupHint: 'Crie um Personal Access Token (escopos: repo, read:org)',
  },
  'coderabbit': {
    name: 'CodeRabbit',
    description: 'Code review IA (40+ analyzers)',
    envVars: ['GITHUB_PAT'],
    authType: 'api_key',
    tier: 'optional',
    setupUrl: 'https://github.com/settings/tokens',
    setupHint: 'Usa o mesmo GITHUB_PAT do GitHub MCP',
  },
  'n8n': {
    name: 'n8n',
    description: 'Automacoes e workflows',
    envVars: ['N8N_API_URL', 'N8N_API_KEY'],
    authType: 'api_key',
    tier: 'optional',
    setupHint: 'n8n → Settings → API → gere uma API Key',
  },
  'google-workspace': {
    name: 'Google Workspace',
    description: 'Gmail, Drive, Calendar, Docs, Sheets, Tasks',
    envVars: ['GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET'],
    authType: 'oauth',
    tier: 'optional',
    setupUrl: 'https://console.cloud.google.com/apis/credentials',
    setupHint: 'Crie credencial OAuth 2.0 tipo "Desktop Application"',
    oauthNote: 'Apos configurar, o browser abre automaticamente para autorizar na primeira execucao',
  },
  'supabase': {
    name: 'Supabase',
    description: 'Acesso direto ao banco (DB, auth, storage)',
    envVars: ['SUPABASE_PROJECT_REF'],
    authType: 'oauth',
    tier: 'optional',
    setupUrl: 'https://supabase.com/dashboard',
    setupHint: 'Dashboard → Settings → General → Reference ID',
    oauthNote: 'Apos configurar, autentique via browser na primeira execucao',
  },
  'redis': {
    name: 'Redis',
    description: 'Persistencia, cache, sessoes',
    envVars: ['REDIS_URL'],
    authType: 'url',
    tier: 'optional',
    setupHint: 'Local: redis://localhost:6379 | Cloud: Upstash ou Redis Cloud (free tier)',
  },
  'redis-session': {
    name: 'Redis Session',
    description: 'Sessoes persistentes no Redis',
    envVars: ['REDIS_URL'],
    authType: 'url',
    tier: 'optional',
    setupHint: 'Usa a mesma REDIS_URL do Redis MCP',
  },
  'redis-task-manager': {
    name: 'Redis Task Manager',
    description: 'Tasks multi-agente com dependencias',
    envVars: ['REDIS_URL'],
    authType: 'url',
    tier: 'optional',
    setupHint: 'Usa a mesma REDIS_URL do Redis MCP',
  },
  'rest-api': {
    name: 'REST API',
    description: 'Chama qualquer REST API',
    envVars: ['REST_API_BASE_URL'],
    authType: 'url',
    tier: 'optional',
    setupHint: 'Defina a URL base da sua API (ex: https://api.meuapp.com)',
  },
}

/**
 * Parse a .env file into a key-value map.
 * Handles comments, empty lines, quotes, and inline comments.
 */
function parseEnvFile(filePath) {
  const vars = {}
  if (!existsSync(filePath)) return vars

  const content = readFileSync(filePath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    vars[key] = value
  }

  return vars
}

/**
 * Check which MCPs are configured in .mcp.json and whether their
 * required env vars are set in .env or process.env.
 */
export function checkMcpStatus(cwd) {
  const mcpJsonPath = resolve(cwd, '.mcp.json')
  const envPath = resolve(cwd, '.env')
  const envLocalPath = resolve(cwd, '.env.local')

  // Read configured MCPs
  let configuredMcps = {}
  if (existsSync(mcpJsonPath)) {
    try {
      const raw = JSON.parse(readFileSync(mcpJsonPath, 'utf-8'))
      configuredMcps = raw.mcpServers || {}
    } catch {
      // Invalid JSON — treat as no MCPs configured
    }
  }

  // Parse .env and .env.local (local overrides base)
  const envVars = parseEnvFile(envPath)
  const envLocalVars = parseEnvFile(envLocalPath)

  // Merge: process.env < .env < .env.local
  const allVars = { ...process.env, ...envVars, ...envLocalVars }

  const connected = []
  const disconnected = []

  for (const [mcpId, config] of Object.entries(configuredMcps)) {
    // Skip comment entries
    if (mcpId.startsWith('_comment')) continue

    const registry = MCP_REGISTRY[mcpId]
    if (!registry) continue // Unknown MCP, skip

    if (registry.envVars.length === 0) {
      connected.push({ id: mcpId, ...registry })
      continue
    }

    // Check which env vars are missing or empty
    const missingVars = registry.envVars.filter(v => {
      const val = allVars[v]
      return !val || val === '' || val.startsWith('${')
    })

    if (missingVars.length === 0) {
      connected.push({ id: mcpId, ...registry })
    } else {
      disconnected.push({ id: mcpId, ...registry, missingVars })
    }
  }

  return {
    hasEnvFile: existsSync(envPath),
    configured: Object.keys(configuredMcps).filter(k => !k.startsWith('_comment')).length,
    connected,
    disconnected,
  }
}

/**
 * Print a formatted MCP health check report.
 */
export function printMcpReport(status) {
  const { hasEnvFile, configured, connected, disconnected } = status

  const essentialConnected = connected.filter(m => m.tier === 'essential')
  const optionalConnected = connected.filter(m => m.tier === 'optional')
  const essentialDisconnected = disconnected.filter(m => m.tier === 'essential')
  const optionalDisconnected = disconnected.filter(m => m.tier === 'optional')

  console.log(`
  MCP Health Check (${configured} servidores configurados)
  ${'='.repeat(50)}`)

  if (essentialConnected.length > 0) {
    console.log(`
  Essenciais — prontos (${essentialConnected.length}):`)
    for (const mcp of essentialConnected) {
      console.log(`    \x1b[32m✓\x1b[0m ${mcp.name.padEnd(22)} ${mcp.description}`)
    }
  }

  if (optionalConnected.length > 0) {
    console.log(`
  Opcionais — prontos (${optionalConnected.length}):`)
    for (const mcp of optionalConnected) {
      console.log(`    \x1b[32m✓\x1b[0m ${mcp.name.padEnd(22)} ${mcp.description}`)
    }
  }

  if (essentialDisconnected.length > 0) {
    console.log(`
  \x1b[31mEssenciais — FALHARAM (${essentialDisconnected.length}):\x1b[0m`)
    for (const mcp of essentialDisconnected) {
      console.log(`    \x1b[31m✗\x1b[0m ${mcp.name.padEnd(22)} falta: ${mcp.missingVars.join(', ')}`)
      if (mcp.setupUrl) {
        console.log(`      \x1b[36m→\x1b[0m ${mcp.setupUrl}`)
      }
      console.log(`      ${mcp.setupHint}`)
    }
  }

  if (optionalDisconnected.length > 0) {
    console.log(`
  \x1b[33mOpcionais — precisam de configuracao (${optionalDisconnected.length}):\x1b[0m`)
    for (const mcp of optionalDisconnected) {
      console.log(`    \x1b[33m○\x1b[0m ${mcp.name.padEnd(22)} falta: ${mcp.missingVars.join(', ')}`)
      if (mcp.setupUrl) {
        console.log(`      \x1b[36m→\x1b[0m ${mcp.setupUrl}`)
      }
      console.log(`      ${mcp.setupHint}`)
      if (mcp.oauthNote) {
        console.log(`      \x1b[33m⚡\x1b[0m ${mcp.oauthNote}`)
      }
    }
  }

  if (essentialDisconnected.length > 0 || optionalDisconnected.length > 0) {
    console.log(`
  Para conectar MCPs desconectados:`)
    console.log(`    1. Edite .env.local com as variaveis faltantes`)
    console.log(`    2. Execute:  npx duarteos update`)
    console.log(`    Ou use \x1b[1m/DUARTEOS:setup-mcps\x1b[0m dentro do Claude Code para guia completo.`)
  }

  if (essentialDisconnected.length === 0 && essentialConnected.length > 0) {
    console.log(`
  \x1b[32mTodos os MCPs essenciais estao prontos!\x1b[0m`)
  }

  console.log('')
}
