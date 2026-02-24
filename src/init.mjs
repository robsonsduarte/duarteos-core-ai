import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates')

function copyTemplate(src, dest, replacements = {}) {
  let content = readFileSync(src, 'utf-8')

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }

  const destDir = dirname(dest)
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }

  writeFileSync(dest, content, 'utf-8')
}

function detectProjectName(cwd) {
  const pkgPath = resolve(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      return pkg.name || null
    } catch {
      return null
    }
  }
  return null
}

export function init(projectName, options = {}) {
  const cwd = process.cwd()

  // Detect project name
  const detectedName = projectName || detectProjectName(cwd) || 'meu-projeto'
  console.log(`\n  Instalando DuarteOS Core AI no projeto: ${detectedName}`)
  console.log(`  Diretorio: ${cwd}\n`)

  const replacements = {
    PROJECT_NAME: detectedName,
    PROJECT_NAME_UPPER: detectedName.toUpperCase().replace(/-/g, ' '),
  }

  // Directories to create
  const dirs = [
    '.claude/commands/agents',
    '.claude/commands/squad',
    '.planning',
    '.claude/hooks',
    '.claude/agents',
    '.claude/scripts',
    '.claude/mcp-servers/data-analyzer',
    '.claude/mcp-servers/web-scraper',
    '.claude/mcp-servers/automation',
    '.claude/mcp-servers/input-analyzer',
    '.claude/mcp-servers/memory-graph',
    '.claude/mcp-servers/tool-forge',
    '.claude/mcp-servers/redis-session',
    '.claude/mcp-servers/redis-task-manager',
    '.claude/mcp-servers/custom-tools',
    '.claude/blueprints',
    '.claude/agent-memory/_global',
    '.claude/agent-memory/_meta',
    '.claude/squad-templates/basic/agents',
    '.claude/squad-templates/basic/tasks',
    '.claude/squad-templates/fullstack/agents',
    '.claude/squad-templates/fullstack/tasks',
    '.claude/squad-templates/data-science/agents',
    '.claude/squad-templates/automation/agents',
  ]

  for (const dir of dirs) {
    const fullPath = resolve(cwd, dir)
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true })
      console.log(`  + criado ${dir}/`)
    }
  }

  // Files to copy (template path -> destination path)
  const files = [
    // Settings
    ['settings.json', '.claude/settings.json'],
    ['session-context.md', '.claude/session-context.md'],

    // Agents
    ['agents/squad.md', '.claude/commands/agents/squad.md'],
    ['agents/pm.md', '.claude/commands/agents/pm.md'],
    ['agents/architect.md', '.claude/commands/agents/architect.md'],
    ['agents/backend.md', '.claude/commands/agents/backend.md'],
    ['agents/frontend.md', '.claude/commands/agents/frontend.md'],
    ['agents/qa.md', '.claude/commands/agents/qa.md'],
    ['agents/context-engineer.md', '.claude/commands/agents/context-engineer.md'],
    ['agents/devils-advocate.md', '.claude/commands/agents/devils-advocate.md'],

    // Squad commands
    ['commands/squad/new-project.md', '.claude/commands/squad/new-project.md'],
    ['commands/squad/map-codebase.md', '.claude/commands/squad/map-codebase.md'],
    ['commands/squad/plan-phase.md', '.claude/commands/squad/plan-phase.md'],
    ['commands/squad/execute-phase.md', '.claude/commands/squad/execute-phase.md'],
    ['commands/squad/verify-work.md', '.claude/commands/squad/verify-work.md'],
    ['commands/squad/discuss-phase.md', '.claude/commands/squad/discuss-phase.md'],
    ['commands/squad/research-phase.md', '.claude/commands/squad/research-phase.md'],
    ['commands/squad/validate-plan.md', '.claude/commands/squad/validate-plan.md'],
    ['commands/squad/audit.md', '.claude/commands/squad/audit.md'],
    ['commands/squad/quick.md', '.claude/commands/squad/quick.md'],
    ['commands/squad/debug.md', '.claude/commands/squad/debug.md'],
    ['commands/squad/progress.md', '.claude/commands/squad/progress.md'],
    ['commands/squad/pause.md', '.claude/commands/squad/pause.md'],
    ['commands/squad/resume.md', '.claude/commands/squad/resume.md'],

    // Planning
    ['planning/config.json', '.planning/config.json'],

    // MCP Servers
    ['mcp.json', '.mcp.json'],
    ['env.example', '.env.example'],

    // Setup commands
    ['commands/setup-mcps.md', '.claude/commands/setup-mcps.md'],

    // Hooks
    ['hooks/post-edit-lint.sh', '.claude/hooks/post-edit-lint.sh'],
    ['hooks/pre-commit-check.sh', '.claude/hooks/pre-commit-check.sh'],
    ['hooks/security-gate.sh', '.claude/hooks/security-gate.sh'],
    ['hooks/session-memory.sh', '.claude/hooks/session-memory.sh'],

    // Custom Agents
    ['agents-custom/python-executor.md', '.claude/agents/python-executor.md'],
    ['agents-custom/data-scientist.md', '.claude/agents/data-scientist.md'],
    ['agents-custom/devops.md', '.claude/agents/devops.md'],
    ['agents-custom/security-auditor.md', '.claude/agents/security-auditor.md'],
    ['agents-custom/fullstack.md', '.claude/agents/fullstack.md'],

    // Scripts
    ['scripts/setup-python.sh', '.claude/scripts/setup-python.sh'],
    ['scripts/setup-sandbox.sh', '.claude/scripts/setup-sandbox.sh'],

    // Python MCP Servers
    ['mcp-servers/data-analyzer/server.py', '.claude/mcp-servers/data-analyzer/server.py'],
    ['mcp-servers/web-scraper/server.py', '.claude/mcp-servers/web-scraper/server.py'],
    ['mcp-servers/automation/server.py', '.claude/mcp-servers/automation/server.py'],
    ['mcp-servers/requirements.txt', '.claude/mcp-servers/requirements.txt'],

    // Build System (App Factory)
    ['commands/squad/build-system.md', '.claude/commands/squad/build-system.md'],
    ['agents-custom/system-builder.md', '.claude/agents/system-builder.md'],
    ['blueprints/blueprint-template.md', '.claude/blueprints/blueprint-template.md'],

    // Advanced Python MCP Servers
    ['mcp-servers/input-analyzer/server.py', '.claude/mcp-servers/input-analyzer/server.py'],
    ['mcp-servers/memory-graph/server.py', '.claude/mcp-servers/memory-graph/server.py'],
    ['mcp-servers/tool-forge/server.py', '.claude/mcp-servers/tool-forge/server.py'],
    ['mcp-servers/redis-session/server.py', '.claude/mcp-servers/redis-session/server.py'],
    ['scripts/redis-session-save.sh', '.claude/scripts/redis-session-save.sh'],
    ['mcp-servers/redis-task-manager/server.py', '.claude/mcp-servers/redis-task-manager/server.py'],

    // Agent Memory
    ['agent-memory/README.md', '.claude/agent-memory/README.md'],
    ['agent-memory/_global/PATTERNS.md', '.claude/agent-memory/_global/PATTERNS.md'],
    ['agent-memory/_meta/promotion-log.md', '.claude/agent-memory/_meta/promotion-log.md'],

    // Squad Factory Commands
    ['commands/squad/create-squad.md', '.claude/commands/squad/create-squad.md'],
    ['commands/squad/list-squads.md', '.claude/commands/squad/list-squads.md'],
    ['commands/squad/run-squad.md', '.claude/commands/squad/run-squad.md'],
    ['commands/squad/clone-mind.md', '.claude/commands/squad/clone-mind.md'],

    // Squad Templates — Basic
    ['squad-templates/basic/squad.yaml', '.claude/squad-templates/basic/squad.yaml'],
    ['squad-templates/basic/README.md', '.claude/squad-templates/basic/README.md'],
    ['squad-templates/basic/agents/lead.md', '.claude/squad-templates/basic/agents/lead.md'],
    ['squad-templates/basic/agents/executor.md', '.claude/squad-templates/basic/agents/executor.md'],
    ['squad-templates/basic/tasks/default.md', '.claude/squad-templates/basic/tasks/default.md'],

    // Squad Templates — Fullstack
    ['squad-templates/fullstack/squad.yaml', '.claude/squad-templates/fullstack/squad.yaml'],
    ['squad-templates/fullstack/agents/backend-lead.md', '.claude/squad-templates/fullstack/agents/backend-lead.md'],
    ['squad-templates/fullstack/agents/frontend-lead.md', '.claude/squad-templates/fullstack/agents/frontend-lead.md'],
    ['squad-templates/fullstack/agents/qa-lead.md', '.claude/squad-templates/fullstack/agents/qa-lead.md'],
    ['squad-templates/fullstack/tasks/setup-db.md', '.claude/squad-templates/fullstack/tasks/setup-db.md'],
    ['squad-templates/fullstack/tasks/build-api.md', '.claude/squad-templates/fullstack/tasks/build-api.md'],
    ['squad-templates/fullstack/tasks/build-ui.md', '.claude/squad-templates/fullstack/tasks/build-ui.md'],

    // Squad Templates — Data Science
    ['squad-templates/data-science/squad.yaml', '.claude/squad-templates/data-science/squad.yaml'],
    ['squad-templates/data-science/agents/analyst.md', '.claude/squad-templates/data-science/agents/analyst.md'],
    ['squad-templates/data-science/agents/pipeline-builder.md', '.claude/squad-templates/data-science/agents/pipeline-builder.md'],
    ['squad-templates/data-science/agents/validator.md', '.claude/squad-templates/data-science/agents/validator.md'],

    // Squad Templates — Automation
    ['squad-templates/automation/squad.yaml', '.claude/squad-templates/automation/squad.yaml'],
    ['squad-templates/automation/agents/orchestrator.md', '.claude/squad-templates/automation/agents/orchestrator.md'],
    ['squad-templates/automation/agents/script-builder.md', '.claude/squad-templates/automation/agents/script-builder.md'],
    ['squad-templates/automation/agents/tester.md', '.claude/squad-templates/automation/agents/tester.md'],
  ]

  let installed = 0
  let skipped = 0

  for (const [src, dest] of files) {
    const destPath = resolve(cwd, dest)
    const srcPath = resolve(TEMPLATES_DIR, src)

    if (existsSync(destPath)) {
      console.log(`  ~ pulado ${dest} (ja existe)`)
      skipped++
      continue
    }

    if (!existsSync(srcPath)) {
      console.log(`  ! template nao encontrado: ${src}`)
      continue
    }

    copyTemplate(srcPath, destPath, replacements)
    console.log(`  + instalado ${dest}`)
    installed++
  }

  // Summary
  console.log(`
  Instalacao completa!
  ---
  Instalados: ${installed} arquivos
  Pulados: ${skipped} (ja existiam)

  Proximos passos:
  1. Configure as API keys: cp .env.example .env && edite o .env
     (veja /setup-mcps para guia completo)
  2. Carregue as vars: source .env && claude (ou use direnv)
  3. Adicione .claude/CLAUDE.md com instrucoes especificas do seu projeto
  4. Instale o GSD: https://github.com/cleyio/gsd
  4. Use os comandos:
     /agents:squad [demanda]     — Ativa squad completo (13 agentes com personas)
     /agents:pm [demanda]        — ATLAS: Gerente de Projetos
     /agents:architect [area]    — NEXUS: Arquiteto
     /agents:backend [feature]   — FORGE: Backend Dev
     /agents:frontend [tela]     — PRISM: Frontend Dev
     /agents:qa [area]           — SENTINEL: QA
     /agents:context-engineer    — COMPASS: Context Engineer
     /agents:devils-advocate     — SHADOW: Red Team
     /squad:new-project          — Iniciar projeto
     /squad:plan-phase N         — Planejar fase
     /squad:execute-phase N      — Executar fase
     /squad:quick "desc"         — Task rapida
     /squad:build-system [input] — APP FACTORY: PRD/N8N/URL → sistema completo
     /squad:create-squad [nome]  — Criar squad customizado
     /squad:list-squads          — Listar squads do projeto
     /squad:run-squad [n] [dem]  — Executar squad numa demanda
     /squad:clone-mind [nome]    — DNA Mental: clonar mente de especialista

  Squad Factory (.claude/squad-templates/) — 4 templates:
     basic               — 1 lead + 1 executor (minimo viavel)
     fullstack           — backend-lead + frontend-lead + qa-lead
     data-science        — analyst + pipeline-builder + validator
     automation          — orchestrator + script-builder + tester

  Agent Memory (.claude/agent-memory/) — memoria persistente:
     {agent-id}/MEMORY.md    — memoria individual por agente
     _global/PATTERNS.md     — padroes confirmados por 3+ agentes
     _meta/promotion-log.md  — historico de promocoes

  MCPs instalados (.mcp.json) — 23 servidores:
     Context7              — Docs atualizadas de bibliotecas
     EXA                   — Busca web + codigo + empresas
     Fetch                 — Busca URLs → Markdown
     YouTube Transcript    — Transcricoes de videos
     Redis                 — Persistencia de contexto, cache, sessoes
     GitHub                — Issues, PRs, repos
     REST API              — Chama qualquer REST API
     Supabase              — Acesso direto ao Supabase
     CodeRabbit            — Code review IA (40+ analyzers)
     n8n                   — Automacoes n8n
     Google Workspace      — Gmail, Drive, Calendar, Docs, Sheets
     Obsidian              — Notas do Obsidian vault
     Memory                — Grafo de conhecimento persistente
     Sequential Thinking   — Raciocinio estruturado

  Hooks instalados (.claude/hooks/) — 4 quality gates:
     post-edit-lint.sh       — Auto-lint apos editar arquivos
     pre-commit-check.sh     — TypeScript + ESLint + testes antes do commit
     security-gate.sh        — Bloqueia comandos perigosos
     session-memory.sh       — Salva contexto da sessao ao encerrar

  Agentes customizados (.claude/agents/) — 6 especialistas:
     python-executor         — Execucao Python (analise, automacao, scripts)
     data-scientist          — Analise de dados, ML, visualizacoes
     devops                  — Docker, CI/CD, infra, deploy
     security-auditor        — Auditoria OWASP, vulnerabilidades
     fullstack               — Full-stack rapido (front + back + banco)
     system-builder          — Constroi sistemas completos (App Factory)

  MCP Servers Python (.claude/mcp-servers/) — 8 servidores:
     data-analyzer           — Analise CSV, estatisticas, graficos
     web-scraper             — Web scraping avancado
     automation              — Automacao de sistema, file processing
     input-analyzer          — Analisa PRDs, N8N workflows, URLs → Blueprint
     memory-graph            — Grafo de conhecimento persistente entre sessoes
     tool-forge              — Cria novas tools dinamicamente (tool evolution)
     redis-session           — Sessoes persistentes no Redis (save/restore/cleanup)
     redis-task-manager      — Tasks multi-agente com dependencias e execucao paralela

  Scripts (.claude/scripts/):
     setup-python.sh         — Instala Python + deps dos MCP servers
     setup-sandbox.sh        — Configura E2B ou Docker sandbox

  App Factory (.claude/blueprints/):
     blueprint-template.md   — Template de blueprint para build-system
     Use: /squad:build-system [PRD.md | workflow.json | URL]
`)
}
