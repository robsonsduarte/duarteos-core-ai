import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * MCP Registry — defines all MCPs with their auth requirements.
 * Each entry maps to a key in .mcp.json's mcpServers.
 */
const MCP_REGISTRY = {
  // === No auth needed (always ready) ===
  'context7': {
    name: 'Context7',
    description: 'Documentacao atualizada de bibliotecas',
    envVars: [],
    authType: 'none',
  },
  'fetch': {
    name: 'Fetch',
    description: 'Busca URLs e converte para Markdown',
    envVars: [],
    authType: 'none',
  },
  'youtube-transcript': {
    name: 'YouTube Transcript',
    description: 'Transcricoes de videos',
    envVars: [],
    authType: 'none',
  },
  'memory': {
    name: 'Memory',
    description: 'Grafo de conhecimento persistente',
    envVars: [],
    authType: 'none',
  },
  'sequential-thinking': {
    name: 'Sequential Thinking',
    description: 'Raciocinio estruturado',
    envVars: [],
    authType: 'none',
  },

  // === Python MCP Servers (local, no auth) ===
  'data-analyzer': {
    name: 'Data Analyzer',
    description: 'Analise CSV, estatisticas, graficos',
    envVars: [],
    authType: 'none',
  },
  'web-scraper': {
    name: 'Web Scraper',
    description: 'Web scraping avancado',
    envVars: [],
    authType: 'none',
  },
  'automation': {
    name: 'Automation',
    description: 'Automacao de sistema e file processing',
    envVars: [],
    authType: 'none',
  },
  'input-analyzer': {
    name: 'Input Analyzer',
    description: 'Analisa PRDs, N8N workflows, URLs',
    envVars: [],
    authType: 'none',
  },
  'memory-graph': {
    name: 'Memory Graph',
    description: 'Grafo de conhecimento entre sessoes',
    envVars: [],
    authType: 'none',
  },
  'tool-forge': {
    name: 'Tool Forge',
    description: 'Cria tools dinamicamente',
    envVars: [],
    authType: 'none',
  },

  // === API Key required ===
  'exa': {
    name: 'EXA',
    description: 'Busca web, codigo, empresas',
    envVars: ['EXA_API_KEY'],
    authType: 'api_key',
    setupUrl: 'https://dashboard.exa.ai/api-keys',
    setupHint: 'Crie conta gratuita ($15 credito)',
  },
  'github': {
    name: 'GitHub',
    description: 'Issues, PRs, repos, code search',
    envVars: ['GITHUB_PAT'],
    authType: 'api_key',
    setupUrl: 'https://github.com/settings/tokens',
    setupHint: 'Crie um Personal Access Token (escopos: repo, read:org)',
  },
  'coderabbit': {
    name: 'CodeRabbit',
    description: 'Code review IA (40+ analyzers)',
    envVars: ['GITHUB_PAT'],
    authType: 'api_key',
    setupUrl: 'https://github.com/settings/tokens',
    setupHint: 'Usa o mesmo GITHUB_PAT do GitHub MCP',
  },
  'n8n': {
    name: 'n8n',
    description: 'Automacoes e workflows',
    envVars: ['N8N_API_URL', 'N8N_API_KEY'],
    authType: 'api_key',
    setupHint: 'n8n → Settings → API → gere uma API Key',
  },
  'e2b-sandbox': {
    name: 'E2B Sandbox',
    description: 'Execucao segura de codigo em microVMs',
    envVars: ['E2B_API_KEY'],
    authType: 'api_key',
    setupUrl: 'https://e2b.dev/dashboard',
    setupHint: 'Crie conta gratuita (free tier)',
  },

  // === OAuth required ===
  'google-workspace': {
    name: 'Google Workspace',
    description: 'Gmail, Drive, Calendar, Docs, Sheets, Tasks',
    envVars: ['GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET'],
    authType: 'oauth',
    setupUrl: 'https://console.cloud.google.com/apis/credentials',
    setupHint: 'Crie credencial OAuth 2.0 tipo "Desktop Application"',
    oauthNote: 'Apos configurar, o browser abre automaticamente para autorizar na primeira execucao',
  },
  'supabase': {
    name: 'Supabase',
    description: 'Acesso direto ao banco (DB, auth, storage)',
    envVars: ['SUPABASE_PROJECT_REF'],
    authType: 'oauth',
    setupUrl: 'https://supabase.com/dashboard',
    setupHint: 'Dashboard → Settings → General → Reference ID',
    oauthNote: 'Apos configurar, autentique via browser na primeira execucao',
  },

  // === URL/Path required ===
  'redis': {
    name: 'Redis',
    description: 'Persistencia, cache, sessoes',
    envVars: ['REDIS_URL'],
    authType: 'url',
    setupHint: 'Local: redis://localhost:6379 | Cloud: Upstash ou Redis Cloud (free tier)',
  },
  'redis-session': {
    name: 'Redis Session',
    description: 'Sessoes persistentes no Redis',
    envVars: ['REDIS_URL'],
    authType: 'url',
    setupHint: 'Usa a mesma REDIS_URL do Redis MCP',
  },
  'redis-task-manager': {
    name: 'Redis Task Manager',
    description: 'Tasks multi-agente com dependencias',
    envVars: ['REDIS_URL'],
    authType: 'url',
    setupHint: 'Usa a mesma REDIS_URL do Redis MCP',
  },
  'rest-api': {
    name: 'REST API',
    description: 'Chama qualquer REST API',
    envVars: ['REST_API_BASE_URL'],
    authType: 'url',
    setupHint: 'Defina a URL base da sua API (ex: https://api.meuapp.com)',
  },
  'obsidian': {
    name: 'Obsidian',
    description: 'Notas do vault local',
    envVars: ['OBSIDIAN_VAULT_PATH'],
    authType: 'local_path',
    setupHint: 'Defina o caminho do vault (ex: /Users/voce/Documents/Obsidian Vault)',
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

  // Parse .env
  const envVars = parseEnvFile(envPath)

  // Merge with process.env (process.env has lower priority than .env)
  const allVars = { ...process.env, ...envVars }

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

  console.log(`
  MCP Health Check (${configured} servidores configurados)
  ${'='.repeat(50)}`)

  if (connected.length > 0) {
    console.log(`
  Prontos para uso (${connected.length}):`)
    for (const mcp of connected) {
      console.log(`    \x1b[32m✓\x1b[0m ${mcp.name.padEnd(22)} ${mcp.description}`)
    }
  }

  if (disconnected.length > 0) {
    console.log(`
  \x1b[33mDesconectados — precisam de configuracao (${disconnected.length}):\x1b[0m`)
    for (const mcp of disconnected) {
      console.log(`    \x1b[31m✗\x1b[0m ${mcp.name.padEnd(22)} falta: ${mcp.missingVars.join(', ')}`)
      if (mcp.setupUrl) {
        console.log(`      \x1b[36m→\x1b[0m ${mcp.setupUrl}`)
      }
      console.log(`      ${mcp.setupHint}`)
      if (mcp.oauthNote) {
        console.log(`      \x1b[33m⚡\x1b[0m ${mcp.oauthNote}`)
      }
    }

    console.log(`
  Para conectar os MCPs desconectados:`)

    if (!hasEnvFile) {
      console.log(`    1. Crie o .env:    cp .env.example .env`)
      console.log(`    2. Edite o .env:   nano .env  (preencha as variaveis)`)
      console.log(`    3. Carregue:       source .env && claude`)
    } else {
      console.log(`    1. Edite o .env:   nano .env  (preencha as variaveis faltantes)`)
      console.log(`    2. Carregue:       source .env && claude`)
    }
    console.log(`    Ou use \x1b[1m/DUARTEOS:setup-mcps\x1b[0m dentro do Claude Code para guia completo.`)
  } else if (configured > 0) {
    console.log(`
  \x1b[32mTodos os MCPs estao prontos!\x1b[0m`)
  }

  console.log('')
}
