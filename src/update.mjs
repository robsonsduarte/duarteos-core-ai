import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPackageVersion } from './utils.mjs'
import { checkMcpStatus, printMcpReport } from './mcp-check.mjs'

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

// Garante que entradas DuarteOS existam no .gitignore (append-only, nunca remove)
function ensureGitignoreEntries(cwd) {
  const gitignorePath = resolve(cwd, '.gitignore')
  const requiredEntries = [
    '.claude/config/user.yaml',
    '.claude/settings.local.json',
  ]

  let content = ''
  if (existsSync(gitignorePath)) {
    content = readFileSync(gitignorePath, 'utf-8')
  }

  const missingEntries = requiredEntries.filter(entry => !content.includes(entry))

  if (missingEntries.length > 0) {
    const separator = content.endsWith('\n') ? '' : '\n'
    const block = separator + '\n# DuarteOS — configs pessoais (nao versionar)\n' + missingEntries.join('\n') + '\n'
    writeFileSync(gitignorePath, content + block, 'utf-8')
    console.log(`  + .gitignore atualizado (${missingEntries.length} entradas DuarteOS adicionadas)`)
    return true
  }
  return false
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

    // v5.0.0 — Protocols (system-owned, always updated)
    ['protocols/CONSTITUTION.md', '.claude/protocols/CONSTITUTION.md'],
    ['protocols/GOVERNANCE.md', '.claude/protocols/GOVERNANCE.md'],
    ['protocols/README.md', '.claude/protocols/README.md'],
    ['protocols/CONFIG-PROTOCOL.md', '.claude/protocols/CONFIG-PROTOCOL.md'],
    ['protocols/SYNAPSE.md', '.claude/protocols/SYNAPSE.md'],
    ['protocols/QUALITY-GATES.md', '.claude/protocols/QUALITY-GATES.md'],
    ['protocols/IDE-SYNC.md', '.claude/protocols/IDE-SYNC.md'],
    ['protocols/AGENT-GSD-PROTOCOL.md', '.claude/protocols/AGENT-GSD-PROTOCOL.md'],

    // v5.0.0 — Config (system.yaml is system-owned)
    ['config/system.yaml', '.claude/config/system.yaml'],
    ['config/user.yaml.example', '.claude/config/user.yaml.example'],

    // v5.0.0 — Synapse (structure files)
    ['synapse/README.md', '.claude/synapse/README.md'],
    ['synapse/template.yaml', '.claude/synapse/template.yaml'],

    // v5.0.0 — New Commands
    ['commands/squad/task.md', '.claude/commands/squad/task.md'],
    ['commands/squad/synapse.md', '.claude/commands/squad/synapse.md'],
    ['commands/squad/sync-ide.md', '.claude/commands/squad/sync-ide.md'],

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

    // v5.0.0 — Task Templates (system-owned)
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

  // Files that are NEVER overwritten (user data)
  const neverOverwrite = [
    '.mcp.json',              // User has API keys configured
    '.env',                   // User secrets
    '.env.example',           // May have been customized
    '.claude/settings.json',  // User may have custom hooks/settings
    '.claude/settings.local.json', // YOLO mode permissions (user customized)
    '.claude/session-context.md', // User session data
    'CLAUDE.md',              // User customized project policy
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
    // v5.0.0 — User config and agent state (NEVER overwritten)
    '.claude/config/project.yaml',
    '.claude/config/user.yaml',
    // Synapse agent state files are NEVER overwritten
    '.claude/synapse/pm.yaml',
    '.claude/synapse/architect.yaml',
    '.claude/synapse/backend.yaml',
    '.claude/synapse/frontend.yaml',
    '.claude/synapse/qa.yaml',
    '.claude/synapse/context-engineer.yaml',
    '.claude/synapse/devils-advocate.yaml',
    '.claude/synapse/python-executor.yaml',
    '.claude/synapse/data-scientist.yaml',
    '.claude/synapse/devops.yaml',
    '.claude/synapse/security-auditor.yaml',
    '.claude/synapse/fullstack.yaml',
    '.claude/synapse/system-builder.yaml',
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
    // v5.2.0 — YOLO Mode (policy + permissions, only added if missing)
    ['CLAUDE.md', 'CLAUDE.md'],
    ['settings.local.json', '.claude/settings.local.json'],
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

  // DUARTEOS Mind Clones — sync entire directory tree
  const mindClonesSrc = resolve(TEMPLATES_DIR, 'commands', 'DUARTEOS')
  const mindClonesDest = resolve(cwd, '.claude', 'commands', 'DUARTEOS')
  if (existsSync(mindClonesSrc)) {
    const categories = readdirSync(mindClonesSrc, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    let mindClonesAdded = 0
    let mindClonesUpdated = 0
    for (const category of categories) {
      const catSrc = resolve(mindClonesSrc, category)
      const catDest = resolve(mindClonesDest, category)
      if (!existsSync(catDest)) {
        mkdirSync(catDest, { recursive: true })
      }

      const agents = readdirSync(catSrc).filter(f => f.endsWith('.md'))
      for (const agent of agents) {
        const agentSrc = resolve(catSrc, agent)
        const agentDest = resolve(catDest, agent)
        if (!existsSync(agentDest)) {
          cpSync(agentSrc, agentDest)
          mindClonesAdded++
        } else {
          const currentContent = readFileSync(agentDest, 'utf-8')
          const newContent = readFileSync(agentSrc, 'utf-8')
          if (currentContent !== newContent) {
            cpSync(agentSrc, agentDest)
            mindClonesUpdated++
          }
        }
      }
    }

    if (mindClonesAdded > 0) {
      console.log(`  + ${mindClonesAdded} mind clones adicionados (DUARTEOS/)`)
      added += mindClonesAdded
    }
    if (mindClonesUpdated > 0) {
      console.log(`  ~ ${mindClonesUpdated} mind clones atualizados (DUARTEOS/)`)
      updated += mindClonesUpdated
    }
  }

  // Ensure .gitignore has DuarteOS entries
  ensureGitignoreEntries(cwd)

  console.log(`
  Update completo!
  ---
  Atualizados: ${updated} arquivos
  Adicionados: ${added} arquivos novos
  Inalterados: ${skipped} (ja estavam na versao atual)

  YOLO Mode (garantido a cada update):
    CLAUDE.md                    — Politica de execucao (criado se ausente)
    .claude/settings.local.json  — Permissoes auto-approve (criado se ausente)
    .gitignore                   — Entradas DuarteOS garantidas

  Arquivos preservados (nunca sobrescritos):
    .mcp.json               — suas API keys
    .env                    — suas variaveis de ambiente
    .claude/settings.json   — suas configuracoes
    .claude/session-context.md — seu contexto de sessao
    .claude/memory.json     — seu grafo de conhecimento
    .claude/config/project.yaml — configuracao do projeto
    .claude/config/user.yaml — suas preferencias pessoais
    .claude/agent-memory/*/MEMORY.md — memorias individuais dos agentes
    .claude/synapse/*.yaml  — estado dos agentes
    squads/                 — seus squads customizados
`)

  // MCP Health Check — detect disconnected MCPs and guide user
  const mcpStatus = checkMcpStatus(cwd)
  printMcpReport(mcpStatus)
}
