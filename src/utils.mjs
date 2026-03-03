import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getPackageVersion() {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'))
  return pkg.version
}

export function showVersion() {
  console.log(`duarteos-core-ai v${getPackageVersion()}`)
}

// Env var name → MCP server ID mapping
const MCP_ENV_MAP = {
  exa: ['EXA_API_KEY'],
  apify: ['APIFY_TOKEN'],
  redis: ['REDIS_URL'],
  github: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
  obsidian: ['OBSIDIAN_VAULT_PATH'],
  'e2b-sandbox': ['E2B_API_KEY'],
  n8n: ['N8N_API_URL', 'N8N_API_KEY'],
}

// Parse .env file into key-value object
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  const content = readFileSync(filePath, 'utf-8')
  const vars = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (val) vars[key] = val
  }
  return vars
}

// Inject env vars from .env.local into .mcp.json env blocks
export function injectMcpEnvVars(cwd) {
  const mcpPath = resolve(cwd, '.mcp.json')
  if (!existsSync(mcpPath)) return false

  let config
  try {
    config = JSON.parse(readFileSync(mcpPath, 'utf-8'))
  } catch {
    return false
  }

  const servers = config.mcpServers
  if (!servers) return false

  const envVars = parseEnvFile(resolve(cwd, '.env.local'))
  if (Object.keys(envVars).length === 0) return false

  let changed = false
  for (const [serverId, envKeys] of Object.entries(MCP_ENV_MAP)) {
    if (!servers[serverId]) continue

    for (const envKey of envKeys) {
      const value = envVars[envKey]
      if (!value) continue

      if (!servers[serverId].env) servers[serverId].env = {}
      if (servers[serverId].env[envKey] !== value) {
        servers[serverId].env[envKey] = value
        changed = true
      }
    }
  }

  if (changed) {
    writeFileSync(mcpPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
    console.log('  + .mcp.json: env vars injetadas do .env.local')
    return true
  }
  return false
}

export function showHelp() {
  console.log(`
  duarteos-core-ai v${getPackageVersion()}
  AIOS multi-agente para Claude Code.

  Uso:
    npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos init
    npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos init meu-projeto
    npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos init --yes
    npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos update

  Comandos:
    init [nome] [--yes]    Instala DuarteOS no projeto atual
    update [--force]       Atualiza arquivos do sistema (preserva seus dados)

  O que instala:
    .claude/
      settings.json              Configuracao com hooks e agent teams
      session-context.md         Template de contexto de sessao
      protocols/                 7 documentos de governanca
        CONSTITUTION.md          15 principios inviolaveis (4 artigos)
        GOVERNANCE.md            Convencoes de nomenclatura formal
        CONFIG-PROTOCOL.md       Documentacao do 4-Layer Config
        SYNAPSE.md               Protocolo da state machine
        QUALITY-GATES.md         Protocolo dos 9 quality gates
        IDE-SYNC.md              Protocolo de sincronizacao IDE
        README.md                Indice de todos os protocolos
      config/                    4-Layer Config System
        system.yaml              Layer 0: defaults DuarteOS (read-only)
        project.yaml             Layer 1: config do projeto (customizavel)
        user.yaml.example        Layer 2: template (gitignored)
      hooks/                     9 quality gates automaticos
        post-edit-lint.sh        Auto-lint apos editar arquivos
        pre-commit-check.sh      TypeScript + ESLint + testes antes do commit
        security-gate.sh         Bloqueia comandos perigosos
        session-memory.sh        Salva contexto da sessao ao encerrar
        architecture-review.sh   Valida padroes arquiteturais apos editar
        test-coverage-gate.sh    Verifica cobertura de testes
        dependency-audit.sh      Audita dependencias vulneraveis
        docs-gate.sh             Verifica documentacao antes do commit
        bundle-size-gate.sh      Alerta de tamanho de bundle
      synapse/                   State Machine por agente
        README.md                Documentacao do Synapse
        template.yaml            Template de estado do agente
      agents/                    6 agentes especializados customizados
        python-executor.md       SPARK: Execucao Python
        data-scientist.md        LENS: Analise de dados, ML
        devops.md                VAULT: Docker, CI/CD, infra
        security-auditor.md      SPECTER: Auditoria OWASP
        fullstack.md             BRIDGE: Full-stack rapido
        system-builder.md        TITAN: Constroi sistemas completos
      agent-memory/              Memoria persistente por agente
        README.md                Documentacao do sistema de memoria
        _global/PATTERNS.md      Padroes confirmados por 3+ agentes
        _meta/promotion-log.md   Historico de promocoes
      blueprints/
        blueprint-template.md    Template de blueprint para build-system
      squad-templates/           4 templates de squads customizados
        basic/                   1 lead + 1 executor
        fullstack/               backend-lead + frontend-lead + qa-lead
        data-science/            analyst + pipeline-builder + validator
        automation/              orchestrator + script-builder + tester
      ide-templates/             Multi-IDE Sync
        cursor.md.tmpl           Template para .cursorrules
        windsurf.md.tmpl         Template para .windsurfrules
        copilot.md.tmpl          Template para copilot-instructions.md
        README.md                Documentacao do IDE Sync
      task-templates/            39 templates de tasks por categoria
        spec/                    6 templates (feature, api-contract, prd, ...)
        dev/                     8 templates (endpoint, component, refactor, ...)
        qa/                      6 templates (test-suite, code-review, ...)
        db/                      6 templates (migration, seed, rls-policy, ...)
        ops/                     6 templates (ci-cd, docker, deploy, ...)
        sec/                     5 templates (owasp-audit, dependency-scan, ...)
        README.md                Indice de todos os templates
      commands/
        agents/                  7 agentes deliberativos + squad
          squad.md               Orquestrador multi-agente (13 personas)
          pm.md                  ATLAS: Supreme Orchestrator (PM)
          architect.md           NEXUS: Arquiteto de Software
          backend.md             FORGE: Desenvolvedor Backend
          frontend.md            PRISM: Desenvolvedor Frontend
          qa.md                  SENTINEL: Analista de Qualidade
          context-engineer.md    COMPASS: Engenheiro de Coerencia
          devils-advocate.md     SHADOW: Advogado do Diabo (Red Team)
        squad/                   22 comandos GSD-powered
          new-project.md         Inicializar projeto/milestone
          map-codebase.md        Mapear codebase (4 agentes paralelos)
          plan-phase.md          Planejar fase do roadmap
          execute-phase.md       Executar fase (wave-based parallel)
          verify-work.md         Verificar trabalho (UAT)
          discuss-phase.md       Discutir fase (capturar decisoes)
          research-phase.md      Pesquisar fase
          validate-plan.md       Validar plano (red team)
          audit.md               Auditar milestone
          quick.md               Task rapida
          debug.md               Debug sistematico
          progress.md            Status do projeto
          pause.md               Pausar trabalho
          resume.md              Retomar trabalho
          build-system.md        APP FACTORY (PRD/N8N/URL → sistema)
          create-squad.md        Criar squad customizado
          list-squads.md         Listar squads do projeto
          run-squad.md           Executar squad numa demanda
          clone-mind.md          DNA Mental: clonar mente de especialista
          task.md                Executar task template
          synapse.md             Ver estado dos agentes
          sync-ide.md            Sincronizar configs de IDE
      scripts/                   Scripts de setup
        setup-python.sh          Instala Python + deps dos MCP servers
        setup-sandbox.sh         Configura E2B ou Docker sandbox
      mcp-servers/               8 Python MCP servers (FastMCP)
        data-analyzer/           Analise CSV, estatisticas, graficos
        web-scraper/             Web scraping avancado
        automation/              Automacao de sistema, file processing
        input-analyzer/          Analisa PRDs, N8N workflows, URLs → Blueprint
        memory-graph/            Grafo de conhecimento persistente entre sessoes
        tool-forge/              Cria novas tools dinamicamente (tool evolution)
        redis-session/           Sessoes persistentes no Redis (save/restore/cleanup)
        redis-task-manager/      Tasks multi-agente com dependencias
    .planning/
      config.json                Configuracao do workflow GSD
    .mcp.json                    23 MCP Servers pre-configurados
    .env.example                 Variaveis de ambiente para os MCPs

  MCP Servers incluidos (23):
    Node.js:  Context7, EXA, Fetch, YouTube Transcript, Redis,
              GitHub, REST API, Supabase, CodeRabbit, n8n,
              Google Workspace, Obsidian, Memory, Sequential Thinking
    Python:   Data Analyzer, Web Scraper, Automation,
              Input Analyzer, Memory Graph, Tool Forge,
              Redis Session, Redis Task Manager
    Sandbox:  E2B (execucao segura de codigo)

  Pre-requisitos:
    - Claude Code (claude.ai/code) instalado
    - GSD plugin instalado (https://github.com/cleyio/gsd)
    - Python 3.10+ (para MCP servers Python)
    - Node.js 18+

  Pos-instalacao:
    bash .claude/scripts/setup-python.sh    Configura ambiente Python
    bash .claude/scripts/setup-sandbox.sh   Configura sandbox (E2B/Docker)

  Documentacao: https://github.com/robsonsduarte/duarteos-core-ai
`)
}
