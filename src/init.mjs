import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { checkMcpStatus, printMcpReport } from './mcp-check.mjs'

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

// Garante que entradas DuarteOS existam no .gitignore (append-only, nunca remove)
function ensureGitignoreEntries(cwd) {
  const gitignorePath = resolve(cwd, '.gitignore')
  const requiredEntries = [
    '',
    '# DuarteOS — configs pessoais (nao versionar)',
    '.claude/config/user.yaml',
    '.claude/settings.local.json',
  ]

  let content = ''
  if (existsSync(gitignorePath)) {
    content = readFileSync(gitignorePath, 'utf-8')
  }

  const missingEntries = requiredEntries.filter(
    entry => entry === '' ? false : !content.includes(entry)
  )

  if (missingEntries.length > 0) {
    const separator = content.endsWith('\n') ? '' : '\n'
    const block = separator + '\n# DuarteOS — configs pessoais (nao versionar)\n' + missingEntries.join('\n') + '\n'
    writeFileSync(gitignorePath, content + block, 'utf-8')
    console.log(`  + .gitignore atualizado (${missingEntries.length} entradas DuarteOS adicionadas)`)
    return true
  }
  return false
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
    '.claude/commands/DUARTEOS/agents',
    '.claude/commands/DUARTEOS/squad',
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
    // v5.0.0 — Protocols, Config, Synapse, Task Templates, IDE Templates
    '.claude/protocols',
    '.claude/config',
    '.claude/synapse',
    '.claude/ide-templates',
    '.claude/task-templates/spec',
    '.claude/task-templates/dev',
    '.claude/task-templates/qa',
    '.claude/task-templates/db',
    '.claude/task-templates/ops',
    '.claude/task-templates/sec',
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
    // YOLO Mode — CLAUDE.md + settings.local.json (policy + permissions)
    ['CLAUDE.md', 'CLAUDE.md'],
    ['settings.local.json', '.claude/settings.local.json'],

    // Settings
    ['settings.json', '.claude/settings.json'],
    ['session-context.md', '.claude/session-context.md'],

    // Agents
    ['commands/DUARTEOS/agents/squad.md', '.claude/commands/DUARTEOS/agents/squad.md'],
    ['commands/DUARTEOS/agents/pm.md', '.claude/commands/DUARTEOS/agents/pm.md'],
    ['commands/DUARTEOS/agents/architect.md', '.claude/commands/DUARTEOS/agents/architect.md'],
    ['commands/DUARTEOS/agents/backend.md', '.claude/commands/DUARTEOS/agents/backend.md'],
    ['commands/DUARTEOS/agents/frontend.md', '.claude/commands/DUARTEOS/agents/frontend.md'],
    ['commands/DUARTEOS/agents/qa.md', '.claude/commands/DUARTEOS/agents/qa.md'],
    ['commands/DUARTEOS/agents/context-engineer.md', '.claude/commands/DUARTEOS/agents/context-engineer.md'],
    ['commands/DUARTEOS/agents/devils-advocate.md', '.claude/commands/DUARTEOS/agents/devils-advocate.md'],

    // Squad commands
    ['commands/DUARTEOS/squad/new-project.md', '.claude/commands/DUARTEOS/squad/new-project.md'],
    ['commands/DUARTEOS/squad/map-codebase.md', '.claude/commands/DUARTEOS/squad/map-codebase.md'],
    ['commands/DUARTEOS/squad/plan-phase.md', '.claude/commands/DUARTEOS/squad/plan-phase.md'],
    ['commands/DUARTEOS/squad/execute-phase.md', '.claude/commands/DUARTEOS/squad/execute-phase.md'],
    ['commands/DUARTEOS/squad/verify-work.md', '.claude/commands/DUARTEOS/squad/verify-work.md'],
    ['commands/DUARTEOS/squad/discuss-phase.md', '.claude/commands/DUARTEOS/squad/discuss-phase.md'],
    ['commands/DUARTEOS/squad/research-phase.md', '.claude/commands/DUARTEOS/squad/research-phase.md'],
    ['commands/DUARTEOS/squad/validate-plan.md', '.claude/commands/DUARTEOS/squad/validate-plan.md'],
    ['commands/DUARTEOS/squad/audit.md', '.claude/commands/DUARTEOS/squad/audit.md'],
    ['commands/DUARTEOS/squad/quick.md', '.claude/commands/DUARTEOS/squad/quick.md'],
    ['commands/DUARTEOS/squad/debug.md', '.claude/commands/DUARTEOS/squad/debug.md'],
    ['commands/DUARTEOS/squad/progress.md', '.claude/commands/DUARTEOS/squad/progress.md'],
    ['commands/DUARTEOS/squad/pause.md', '.claude/commands/DUARTEOS/squad/pause.md'],
    ['commands/DUARTEOS/squad/resume.md', '.claude/commands/DUARTEOS/squad/resume.md'],

    // Planning
    ['planning/config.json', '.planning/config.json'],

    // MCP Servers
    ['mcp.json', '.mcp.json'],
    ['env.example', '.env.example'],

    // Setup commands
    ['commands/DUARTEOS/setup-mcps.md', '.claude/commands/DUARTEOS/setup-mcps.md'],

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
    ['commands/DUARTEOS/squad/build-system.md', '.claude/commands/DUARTEOS/squad/build-system.md'],
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
    ['commands/DUARTEOS/squad/create-squad.md', '.claude/commands/DUARTEOS/squad/create-squad.md'],
    ['commands/DUARTEOS/squad/list-squads.md', '.claude/commands/DUARTEOS/squad/list-squads.md'],
    ['commands/DUARTEOS/squad/run-squad.md', '.claude/commands/DUARTEOS/squad/run-squad.md'],
    ['commands/DUARTEOS/squad/clone-mind.md', '.claude/commands/DUARTEOS/squad/clone-mind.md'],

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

    // v5.0.0 — Protocols
    ['protocols/CONSTITUTION.md', '.claude/protocols/CONSTITUTION.md'],
    ['protocols/GOVERNANCE.md', '.claude/protocols/GOVERNANCE.md'],
    ['protocols/README.md', '.claude/protocols/README.md'],
    ['protocols/CONFIG-PROTOCOL.md', '.claude/protocols/CONFIG-PROTOCOL.md'],
    ['protocols/SYNAPSE.md', '.claude/protocols/SYNAPSE.md'],
    ['protocols/QUALITY-GATES.md', '.claude/protocols/QUALITY-GATES.md'],
    ['protocols/IDE-SYNC.md', '.claude/protocols/IDE-SYNC.md'],

    // v5.0.0 — 4-Layer Config
    ['config/system.yaml', '.claude/config/system.yaml'],
    ['config/project.yaml', '.claude/config/project.yaml'],
    ['config/user.yaml.example', '.claude/config/user.yaml.example'],

    // v5.0.0 — Synapse State Machine
    ['synapse/README.md', '.claude/synapse/README.md'],
    ['synapse/template.yaml', '.claude/synapse/template.yaml'],

    // v5.0.0 — New Commands
    ['commands/DUARTEOS/squad/task.md', '.claude/commands/DUARTEOS/squad/task.md'],
    ['commands/DUARTEOS/squad/synapse.md', '.claude/commands/DUARTEOS/squad/synapse.md'],
    ['commands/DUARTEOS/squad/sync-ide.md', '.claude/commands/DUARTEOS/squad/sync-ide.md'],

    // v5.0.0 — Quality Gates (new hooks)
    ['hooks/architecture-review.sh', '.claude/hooks/architecture-review.sh'],
    ['hooks/test-coverage-gate.sh', '.claude/hooks/test-coverage-gate.sh'],
    ['hooks/dependency-audit.sh', '.claude/hooks/dependency-audit.sh'],
    ['hooks/docs-gate.sh', '.claude/hooks/docs-gate.sh'],
    ['hooks/bundle-size-gate.sh', '.claude/hooks/bundle-size-gate.sh'],

    // v5.0.0 — IDE Templates
    ['ide-templates/cursor.md.tmpl', '.claude/ide-templates/cursor.md.tmpl'],
    ['ide-templates/windsurf.md.tmpl', '.claude/ide-templates/windsurf.md.tmpl'],
    ['ide-templates/copilot.md.tmpl', '.claude/ide-templates/copilot.md.tmpl'],
    ['ide-templates/README.md', '.claude/ide-templates/README.md'],

    // v5.0.0 — Task Templates
    ['task-templates/README.md', '.claude/task-templates/README.md'],
    ['task-templates/spec/spec-feature.md', '.claude/task-templates/spec/spec-feature.md'],
    ['task-templates/spec/spec-api-contract.md', '.claude/task-templates/spec/spec-api-contract.md'],
    ['task-templates/spec/spec-prd.md', '.claude/task-templates/spec/spec-prd.md'],
    ['task-templates/spec/spec-user-story.md', '.claude/task-templates/spec/spec-user-story.md'],
    ['task-templates/spec/spec-migration-plan.md', '.claude/task-templates/spec/spec-migration-plan.md'],
    ['task-templates/spec/spec-architecture-decision.md', '.claude/task-templates/spec/spec-architecture-decision.md'],
    ['task-templates/dev/dev-api-endpoint.md', '.claude/task-templates/dev/dev-api-endpoint.md'],
    ['task-templates/dev/dev-component.md', '.claude/task-templates/dev/dev-component.md'],
    ['task-templates/dev/dev-refactor.md', '.claude/task-templates/dev/dev-refactor.md'],
    ['task-templates/dev/dev-integration.md', '.claude/task-templates/dev/dev-integration.md'],
    ['task-templates/dev/dev-migration.md', '.claude/task-templates/dev/dev-migration.md'],
    ['task-templates/dev/dev-hotfix.md', '.claude/task-templates/dev/dev-hotfix.md'],
    ['task-templates/dev/dev-feature.md', '.claude/task-templates/dev/dev-feature.md'],
    ['task-templates/dev/dev-hook.md', '.claude/task-templates/dev/dev-hook.md'],
    ['task-templates/qa/qa-test-suite.md', '.claude/task-templates/qa/qa-test-suite.md'],
    ['task-templates/qa/qa-code-review.md', '.claude/task-templates/qa/qa-code-review.md'],
    ['task-templates/qa/qa-regression.md', '.claude/task-templates/qa/qa-regression.md'],
    ['task-templates/qa/qa-performance.md', '.claude/task-templates/qa/qa-performance.md'],
    ['task-templates/qa/qa-accessibility.md', '.claude/task-templates/qa/qa-accessibility.md'],
    ['task-templates/qa/qa-e2e.md', '.claude/task-templates/qa/qa-e2e.md'],
    ['task-templates/db/db-migration.md', '.claude/task-templates/db/db-migration.md'],
    ['task-templates/db/db-seed.md', '.claude/task-templates/db/db-seed.md'],
    ['task-templates/db/db-rls-policy.md', '.claude/task-templates/db/db-rls-policy.md'],
    ['task-templates/db/db-index-optimization.md', '.claude/task-templates/db/db-index-optimization.md'],
    ['task-templates/db/db-backup-plan.md', '.claude/task-templates/db/db-backup-plan.md'],
    ['task-templates/db/db-schema-design.md', '.claude/task-templates/db/db-schema-design.md'],
    ['task-templates/ops/ops-ci-cd.md', '.claude/task-templates/ops/ops-ci-cd.md'],
    ['task-templates/ops/ops-docker.md', '.claude/task-templates/ops/ops-docker.md'],
    ['task-templates/ops/ops-deploy.md', '.claude/task-templates/ops/ops-deploy.md'],
    ['task-templates/ops/ops-monitoring.md', '.claude/task-templates/ops/ops-monitoring.md'],
    ['task-templates/ops/ops-ssl-cert.md', '.claude/task-templates/ops/ops-ssl-cert.md'],
    ['task-templates/ops/ops-scaling.md', '.claude/task-templates/ops/ops-scaling.md'],
    ['task-templates/sec/sec-owasp-audit.md', '.claude/task-templates/sec/sec-owasp-audit.md'],
    ['task-templates/sec/sec-dependency-scan.md', '.claude/task-templates/sec/sec-dependency-scan.md'],
    ['task-templates/sec/sec-penetration-plan.md', '.claude/task-templates/sec/sec-penetration-plan.md'],
    ['task-templates/sec/sec-incident-response.md', '.claude/task-templates/sec/sec-incident-response.md'],
    ['task-templates/sec/sec-auth-review.md', '.claude/task-templates/sec/sec-auth-review.md'],
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

  // DUARTEOS commands — copy entire directory tree (agents, squad, mind clones, setup-mcps)
  const duarteosSrc = resolve(TEMPLATES_DIR, 'commands', 'DUARTEOS')
  const duarteosDest = resolve(cwd, '.claude', 'commands', 'DUARTEOS')
  if (existsSync(duarteosSrc)) {
    // Recursive copy for subdirectories
    const walkDir = (src, dest) => {
      if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
      const entries = readdirSync(src, { withFileTypes: true })
      for (const entry of entries) {
        const srcPath = resolve(src, entry.name)
        const destPath = resolve(dest, entry.name)
        if (entry.isDirectory()) {
          walkDir(srcPath, destPath)
        } else if (entry.name.endsWith('.md')) {
          if (!existsSync(destPath)) {
            let content = readFileSync(srcPath, 'utf-8')
            for (const [key, value] of Object.entries(replacements)) {
              content = content.replaceAll(`{{${key}}}`, value)
            }
            writeFileSync(destPath, content, 'utf-8')
            installed++
          }
        }
      }
    }
    walkDir(duarteosSrc, duarteosDest)
    console.log(`  + DUARTEOS/ commands sincronizados`)
  }

  // Ensure .gitignore has DuarteOS entries
  ensureGitignoreEntries(cwd)

  // Summary
  console.log(`
  Instalacao completa!
  ---
  Instalados: ${installed} arquivos
  Pulados: ${skipped} (ja existiam)

  YOLO Mode:
    CLAUDE.md                    — Politica de execucao autonoma
    .claude/settings.local.json  — Permissoes auto-approve (~100 padroes)
    .gitignore                   — Entradas DuarteOS adicionadas

  Proximos passos:
  1. Configure as API keys: cp .env.example .env && edite o .env
     (veja /DUARTEOS:setup-mcps para guia completo)
  2. Carregue as vars: source .env && claude (ou use direnv)
  3. Customize CLAUDE.md com stack e convencoes do seu projeto
  4. Instale o GSD: https://github.com/cleyio/gsd
  4. Use os comandos:
     /DUARTEOS:agents:squad [demanda]     — Ativa squad completo (13 agentes com personas)
     /DUARTEOS:agents:pm [demanda]        — ATLAS: Gerente de Projetos
     /DUARTEOS:agents:architect [area]    — NEXUS: Arquiteto
     /DUARTEOS:agents:backend [feature]   — FORGE: Backend Dev
     /DUARTEOS:agents:frontend [tela]     — PRISM: Frontend Dev
     /DUARTEOS:agents:qa [area]           — SENTINEL: QA
     /DUARTEOS:agents:context-engineer    — COMPASS: Context Engineer
     /DUARTEOS:agents:devils-advocate     — SHADOW: Red Team
     /DUARTEOS:squad:new-project          — Iniciar projeto
     /DUARTEOS:squad:plan-phase N         — Planejar fase
     /DUARTEOS:squad:execute-phase N      — Executar fase
     /DUARTEOS:squad:quick "desc"         — Task rapida
     /DUARTEOS:squad:build-system [input] — APP FACTORY: PRD/N8N/URL → sistema completo
     /DUARTEOS:squad:create-squad [nome]  — Criar squad customizado
     /DUARTEOS:squad:list-squads          — Listar squads do projeto
     /DUARTEOS:squad:run-squad [n] [dem]  — Executar squad numa demanda
     /DUARTEOS:squad:clone-mind [nome]    — DNA Mental: clonar mente de especialista
     /DUARTEOS:squad:task [template]      — Executar task template
     /DUARTEOS:squad:synapse              — Dashboard de estado dos agentes
     /DUARTEOS:squad:sync-ide [ide]       — Gerar configs para Cursor/Windsurf/Copilot

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

  Protocols (.claude/protocols/) — 7 documentos formais:
     CONSTITUTION.md         — Principios inviolaveis (seguranca, qualidade, etica, processo)
     GOVERNANCE.md           — Convencoes de nomenclatura e ciclo de vida
     CONFIG-PROTOCOL.md      — Sistema de configuracao em 4 camadas
     SYNAPSE.md              — Maquina de estados dos agentes
     QUALITY-GATES.md        — Pipeline de validacao (9 gates)
     IDE-SYNC.md             — Sincronizacao multi-IDE

  Config (.claude/config/) — 3 camadas:
     system.yaml             — Layer 0: defaults DuarteOS (read-only)
     project.yaml            — Layer 1: configuracao do projeto
     user.yaml.example       — Layer 2: template para preferencias pessoais

  Task Templates (.claude/task-templates/) — 37 templates em 6 categorias:
     spec/                   — 6 templates de especificacao
     dev/                    — 8 templates de desenvolvimento
     qa/                     — 6 templates de qualidade
     db/                     — 6 templates de banco de dados
     ops/                    — 6 templates de operacoes
     sec/                    — 5 templates de seguranca

  Synapse (.claude/synapse/) — estado dos agentes:
     template.yaml           — Template de estado por agente
     {agent-id}.yaml         — Criado automaticamente ao ativar agente

  IDE Templates (.claude/ide-templates/) — sincronizacao multi-IDE:
     cursor.md.tmpl          — Template para .cursorrules
     windsurf.md.tmpl        — Template para .windsurfrules
     copilot.md.tmpl         — Template para copilot-instructions.md

  Hooks instalados (.claude/hooks/) — 9 quality gates:
     post-edit-lint.sh       — Auto-lint apos editar arquivos
     architecture-review.sh  — Valida estrutura de novos arquivos
     pre-commit-check.sh     — TypeScript + ESLint + testes antes do commit
     test-coverage-gate.sh   — Cobertura minima de testes
     docs-gate.sh            — Alerta se API mudou sem docs
     dependency-audit.sh     — Auditoria de dependencias
     security-gate.sh        — Bloqueia comandos perigosos
     bundle-size-gate.sh     — Alerta se bundle excede threshold
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
     Use: /DUARTEOS:squad:build-system [PRD.md | workflow.json | URL]

  Mind Clones (.claude/commands/DUARTEOS/) — 45 consultores cognitivos:
     /DUARTEOS:Copywriting:*    — 7 mestres (Schwartz, Halbert, Ogilvy...)
     /DUARTEOS:Marketing:*      — 9 estrategistas (Dan Kennedy, Pedro Sobral...)
     /DUARTEOS:UX-Design:*      — 6 especialistas (Don Norman, Nielsen...)
     /DUARTEOS:AI:*             — 5 pioneiros (Andrew Ng, Hinton, LeCun...)
     /DUARTEOS:Tech:*           — 5 lideres (Zuckerberg, Larry Page...)
     /DUARTEOS:Business:*       — 6 empreendedores (Bill Gates, Thiago Finch...)
     /DUARTEOS:Content:*        — 4 criadores (MrBeast, Virginia Fonseca...)
     /DUARTEOS:Product:*        — 3 lideres (Julie Zhuo, Ezra Firestone...)
`)

  // MCP Health Check — detect disconnected MCPs and guide user
  const mcpStatus = checkMcpStatus(cwd)
  printMcpReport(mcpStatus)
}
