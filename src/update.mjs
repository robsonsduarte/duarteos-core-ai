import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPackageVersion } from './utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates')

function copyTemplate(src, dest) {
  const content = readFileSync(src, 'utf-8')
  const destDir = dirname(dest)
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }
  writeFileSync(dest, content, 'utf-8')
}

export function update(options = {}) {
  const cwd = process.cwd()
  const force = options.force || false

  console.log(`\n  DuarteOS Core AI — Update`)
  console.log(`  Versao do pacote: v${getPackageVersion()}`)
  console.log(`  Diretorio: ${cwd}\n`)

  // Check if DuarteOS is installed
  if (!existsSync(resolve(cwd, '.claude/commands/agents/squad.md'))) {
    console.error('  ✗ DuarteOS nao esta instalado neste projeto.')
    console.error('  Use "duarteos init" primeiro.')
    process.exit(1)
  }

  // Files that are SAFE to overwrite (system files, not user-customized)
  const safeToUpdate = [
    // Squad commands (system — user doesn't customize these)
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
    ['commands/squad/build-system.md', '.claude/commands/squad/build-system.md'],

    // Agent definitions (system intelligence)
    ['agents/squad.md', '.claude/commands/agents/squad.md'],
    ['agents/pm.md', '.claude/commands/agents/pm.md'],
    ['agents/architect.md', '.claude/commands/agents/architect.md'],
    ['agents/backend.md', '.claude/commands/agents/backend.md'],
    ['agents/frontend.md', '.claude/commands/agents/frontend.md'],
    ['agents/qa.md', '.claude/commands/agents/qa.md'],
    ['agents/context-engineer.md', '.claude/commands/agents/context-engineer.md'],
    ['agents/devils-advocate.md', '.claude/commands/agents/devils-advocate.md'],

    // Custom agents
    ['agents-custom/python-executor.md', '.claude/agents/python-executor.md'],
    ['agents-custom/data-scientist.md', '.claude/agents/data-scientist.md'],
    ['agents-custom/devops.md', '.claude/agents/devops.md'],
    ['agents-custom/security-auditor.md', '.claude/agents/security-auditor.md'],
    ['agents-custom/fullstack.md', '.claude/agents/fullstack.md'],
    ['agents-custom/system-builder.md', '.claude/agents/system-builder.md'],

    // Hooks
    ['hooks/post-edit-lint.sh', '.claude/hooks/post-edit-lint.sh'],
    ['hooks/pre-commit-check.sh', '.claude/hooks/pre-commit-check.sh'],
    ['hooks/security-gate.sh', '.claude/hooks/security-gate.sh'],
    ['hooks/session-memory.sh', '.claude/hooks/session-memory.sh'],

    // Scripts
    ['scripts/setup-python.sh', '.claude/scripts/setup-python.sh'],
    ['scripts/setup-sandbox.sh', '.claude/scripts/setup-sandbox.sh'],
    ['scripts/redis-session-save.sh', '.claude/scripts/redis-session-save.sh'],

    // Python MCP servers
    ['mcp-servers/data-analyzer/server.py', '.claude/mcp-servers/data-analyzer/server.py'],
    ['mcp-servers/web-scraper/server.py', '.claude/mcp-servers/web-scraper/server.py'],
    ['mcp-servers/automation/server.py', '.claude/mcp-servers/automation/server.py'],
    ['mcp-servers/input-analyzer/server.py', '.claude/mcp-servers/input-analyzer/server.py'],
    ['mcp-servers/memory-graph/server.py', '.claude/mcp-servers/memory-graph/server.py'],
    ['mcp-servers/tool-forge/server.py', '.claude/mcp-servers/tool-forge/server.py'],
    ['mcp-servers/redis-session/server.py', '.claude/mcp-servers/redis-session/server.py'],
    ['mcp-servers/redis-task-manager/server.py', '.claude/mcp-servers/redis-task-manager/server.py'],
    ['mcp-servers/requirements.txt', '.claude/mcp-servers/requirements.txt'],

    // Setup MCPs guide
    ['commands/setup-mcps.md', '.claude/commands/setup-mcps.md'],

    // Blueprint template
    ['blueprints/blueprint-template.md', '.claude/blueprints/blueprint-template.md'],

    // Planning config
    ['planning/config.json', '.planning/config.json'],

    // Squad Factory Commands
    ['commands/squad/create-squad.md', '.claude/commands/squad/create-squad.md'],
    ['commands/squad/list-squads.md', '.claude/commands/squad/list-squads.md'],
    ['commands/squad/run-squad.md', '.claude/commands/squad/run-squad.md'],
    ['commands/squad/clone-mind.md', '.claude/commands/squad/clone-mind.md'],

    // Squad Templates
    ['squad-templates/basic/squad.yaml', '.claude/squad-templates/basic/squad.yaml'],
    ['squad-templates/basic/README.md', '.claude/squad-templates/basic/README.md'],
    ['squad-templates/basic/agents/lead.md', '.claude/squad-templates/basic/agents/lead.md'],
    ['squad-templates/basic/agents/executor.md', '.claude/squad-templates/basic/agents/executor.md'],
    ['squad-templates/basic/tasks/default.md', '.claude/squad-templates/basic/tasks/default.md'],
    ['squad-templates/fullstack/squad.yaml', '.claude/squad-templates/fullstack/squad.yaml'],
    ['squad-templates/fullstack/agents/backend-lead.md', '.claude/squad-templates/fullstack/agents/backend-lead.md'],
    ['squad-templates/fullstack/agents/frontend-lead.md', '.claude/squad-templates/fullstack/agents/frontend-lead.md'],
    ['squad-templates/fullstack/agents/qa-lead.md', '.claude/squad-templates/fullstack/agents/qa-lead.md'],
    ['squad-templates/fullstack/tasks/setup-db.md', '.claude/squad-templates/fullstack/tasks/setup-db.md'],
    ['squad-templates/fullstack/tasks/build-api.md', '.claude/squad-templates/fullstack/tasks/build-api.md'],
    ['squad-templates/fullstack/tasks/build-ui.md', '.claude/squad-templates/fullstack/tasks/build-ui.md'],
    ['squad-templates/data-science/squad.yaml', '.claude/squad-templates/data-science/squad.yaml'],
    ['squad-templates/data-science/agents/analyst.md', '.claude/squad-templates/data-science/agents/analyst.md'],
    ['squad-templates/data-science/agents/pipeline-builder.md', '.claude/squad-templates/data-science/agents/pipeline-builder.md'],
    ['squad-templates/data-science/agents/validator.md', '.claude/squad-templates/data-science/agents/validator.md'],
    ['squad-templates/automation/squad.yaml', '.claude/squad-templates/automation/squad.yaml'],
    ['squad-templates/automation/agents/orchestrator.md', '.claude/squad-templates/automation/agents/orchestrator.md'],
    ['squad-templates/automation/agents/script-builder.md', '.claude/squad-templates/automation/agents/script-builder.md'],
    ['squad-templates/automation/agents/tester.md', '.claude/squad-templates/automation/agents/tester.md'],

    // Agent Memory (structure files only — individual memories are never overwritten)
    ['agent-memory/README.md', '.claude/agent-memory/README.md'],
    ['agent-memory/_global/PATTERNS.md', '.claude/agent-memory/_global/PATTERNS.md'],
    ['agent-memory/_meta/promotion-log.md', '.claude/agent-memory/_meta/promotion-log.md'],
  ]

  // Files that are NEVER overwritten (user data)
  const neverOverwrite = [
    '.mcp.json',              // User has API keys configured
    '.env',                   // User secrets
    '.env.example',           // May have been customized
    '.claude/settings.json',  // User may have custom hooks/settings
    '.claude/session-context.md', // User session data
    '.claude/memory.json',    // User knowledge graph
    // Agent memories — individual per-agent memories are NEVER overwritten
    '.claude/agent-memory/pm/MEMORY.md',
    '.claude/agent-memory/architect/MEMORY.md',
    '.claude/agent-memory/backend/MEMORY.md',
    '.claude/agent-memory/frontend/MEMORY.md',
    '.claude/agent-memory/qa/MEMORY.md',
    '.claude/agent-memory/context-engineer/MEMORY.md',
    '.claude/agent-memory/devils-advocate/MEMORY.md',
    '.claude/agent-memory/python-executor/MEMORY.md',
    '.claude/agent-memory/data-scientist/MEMORY.md',
    '.claude/agent-memory/devops/MEMORY.md',
    '.claude/agent-memory/security-auditor/MEMORY.md',
    '.claude/agent-memory/fullstack/MEMORY.md',
    '.claude/agent-memory/system-builder/MEMORY.md',
    // User squads — custom squads are NEVER overwritten
    'squads/',
  ]

  let updated = 0
  let added = 0
  let skipped = 0

  for (const [src, dest] of safeToUpdate) {
    const destPath = resolve(cwd, dest)
    const srcPath = resolve(TEMPLATES_DIR, src)

    if (!existsSync(srcPath)) {
      continue
    }

    const destDir = dirname(destPath)
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true })
    }

    if (existsSync(destPath)) {
      const currentContent = readFileSync(destPath, 'utf-8')
      const newContent = readFileSync(srcPath, 'utf-8')

      if (currentContent === newContent) {
        skipped++
        continue
      }

      copyTemplate(srcPath, destPath)
      console.log(`  ~ atualizado ${dest}`)
      updated++
    } else {
      copyTemplate(srcPath, destPath)
      console.log(`  + adicionado ${dest}`)
      added++
    }
  }

  // Add new files that don't exist yet (safe — won't overwrite)
  const newOnlyFiles = [
    ['env.example', '.env.example'],
  ]

  for (const [src, dest] of newOnlyFiles) {
    const destPath = resolve(cwd, dest)
    const srcPath = resolve(TEMPLATES_DIR, src)

    if (!existsSync(destPath) && existsSync(srcPath)) {
      copyTemplate(srcPath, destPath)
      console.log(`  + adicionado ${dest}`)
      added++
    }
  }

  console.log(`
  Update completo!
  ---
  Atualizados: ${updated} arquivos
  Adicionados: ${added} arquivos novos
  Inalterados: ${skipped} (ja estavam na versao atual)

  Arquivos preservados (nunca sobrescritos):
    .mcp.json               — suas API keys
    .env                    — suas variaveis de ambiente
    .claude/settings.json   — suas configuracoes
    .claude/session-context.md — seu contexto de sessao
    .claude/memory.json     — seu grafo de conhecimento
    .claude/agent-memory/*/MEMORY.md — memorias individuais dos agentes
    squads/                 — seus squads customizados
`)
}
