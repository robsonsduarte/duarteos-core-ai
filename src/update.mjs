import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPackageVersion } from './utils.mjs'
import { checkMcpStatus, printMcpReport } from './mcp-check.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates')

// Changelog por versao — exibido no update
const CHANGELOG = {
  '5.6.0': {
    title: 'MMOS Pipeline — DNA 6 Camadas + APEX/ICP + Paradoxos Produtivos',
    highlights: [
      'Novo comando /DUARTEOS:mmos:mind-clone — pipeline MMOS de 7 fases para clonagem cognitiva',
      'Novo comando /DUARTEOS:mmos:mind-update — atualizacao incremental com rollback automatico',
      'DNA evoluido de 5 para 6 camadas — nova camada: Paradoxos Produtivos (inspirada em MMOS Layer 8)',
      'Gate de viabilidade APEX/ICP — avalia candidato antes de gastar tokens (rejeita ~35%)',
      'APEX: 6 dimensoes (Authority, Productivity, Exemplarity, X-Factor, Accessibility, Singularity) com scoring /60',
      'ICP: 10 criterios binarios — GO (>=36 + >=7), CAUTION, NO-GO',
      'Validacao expandida: 15 prompts em 4 niveis (superficie, media, profunda, paradoxos)',
      'Formula de fidelidade: superficie(15%) + media(20%) + profunda(30%) + paradoxos(35%)',
      'Fidelidade-alvo: >= 94% (inspirada no MMOS DNA Mental 8-Layer)',
      'Rollback automatico no mind-update se fidelidade cair > 5%',
      'Prompts finais ~10k palavras com secao dedicada a Paradoxos Produtivos',
      'Triangulacao de fontes: camadas 1-4 >= 3 fontes, camadas 5-6 >= 5 fontes',
      'Novo MCP: Apify (@apify/actors-mcp-server) — scraping, transcricoes YouTube, extracao de dados',
      'mind-template.yaml atualizado: campos apex_score, icp_score, fidelidade, paradoxos_produtivos',
      'SYNAPSE.md documentado com Camada 6 (peso, campos, requisitos, exemplos)',
    ],
  },
  '5.5.0': {
    title: 'Inbox/Caixa System — Local Content Ingestion',
    highlights: [
      'Novo comando /DUARTEOS:squad:ingest — 4 modos: SCAN, INGEST, PROCESS, ORGANIZE',
      'Inbox/Caixa: material bruto em inbox/{autor}/{tipo}/ processado localmente (sem internet)',
      'Rastreabilidade: campo source_path em cada insight do DNA vincula ao arquivo fonte',
      'Canonicalizacao de entidades: regras no clone-mind para slug unico por especialista',
      'Navegacao reversa: DNA YAML → source_path → inbox/{autor}/{tipo}/{arquivo}.txt',
      'Inspirado em Mega Brain Pipeline (Thiago Finch) — adaptado sem overhead Python/hooks',
      '59 Synapse DNA YAMLs pre-populados — todas as 10 categorias de mind clones',
      '13 agent state files — estado Synapse para todos os agentes core',
    ],
  },
  '5.4.0': {
    title: 'Single-Responsibility Enforcement',
    highlights: [
      'Squad commands refatorados — cada comando respeita fronteiras de responsabilidade',
      'PM (ATLAS) nunca mais executa trabalho tecnico — delegacao forcada em todos os comandos',
      'build-system: PM spawna NEXUS para blueprint (antes criava direto)',
      'plan-phase: pipeline COMPASS → NEXUS → SHADOW (antes 1 agente com 3 personas)',
      'discuss-phase: COMPASS como lider explicito (antes PM fazia papel de Context Engineer)',
      'create-squad: PM delega criacao de arquivos ao NEXUS/TITAN',
      'run-squad: escalacao obrigatoria ao ATLAS quando bloqueado',
      'debug/quick: agente lider declarado (SENTINEL para debug, roteamento por tipo para quick)',
      'init.mjs: AGENT-GSD-PROTOCOL.md adicionado (faltava em instalacoes frescas)',
      '8 Conselhos de Especialistas: IA, Marketing, Copywriting, UX, Tech, Business, Content, Product',
      'Conselhos spawnnam mind clones em paralelo → sintese com consensos e divergencias',
      'Handoff verificavel entre agentes — criterios de "pronto" antes de spawnar proximo',
      'Protocolo de violacao constitucional — agentes param + declaram + reportam ao PM',
      'RETROSPECTIVE.md obrigatorio pos-milestone — lido pelo PM no proximo ciclo',
      'Loop de revisao em 2 niveis — feedback pode retornar ao COMPASS (contexto) ou NEXUS (plano)',
      'Protocolo de escalacao explicito em todos os agentes que escrevem codigo',
      '7 Mind Clones de Saude: Drauzio Varella, Claudio Miyake, Juliana Trentini, Vera Iaconelli, Marcio Atalla, Patricia Leite, Raquel Castanharo',
      'Conselho de Saude: 7 especialistas multidisciplinares (medicina, odonto, fono, psico, ed.fisica, nutricao, fisio)',
      '7 Mind Clones Juridico Digital: Patricia Peck, Ronaldo Lemos, Guilherme Martins, Erik Nybo, Ivson Coelho, Ricardo Calcini, Jose Faleiros Junior',
      'Conselho Juridico Digital: 7 juristas (LGPD, PI, consumidor, startups, tributario, trabalhista, contratos)',
      'Synapse v2: memoria incremental viva — DNA 5 camadas (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas)',
      'clone-mind v2: DNA 5 camadas + Synapse Sync + modo incremental (--update) + modo dossie (--dossier)',
      'Novo comando /squad:dossie — compila dossies tematicos cross-source com todos os mind clones relevantes',
      '14 mind clones enriquecidos com pesquisa web verificada (Saude + Juridico)',
      '14 Synapse DNA YAML pre-populados — 5 camadas cognitivas extraidas de cada mind clone',
      'init/update sincronizam synapse/minds/*.yaml e templates (mind-template, dossier-template)',
    ],
  },
  '5.3.0': {
    title: 'PM Pure Orchestrator + Incremental Dev',
    highlights: [
      'PM (ATLAS) reescrito como orquestrador puro — nunca executa, so delega',
      'Regra 100% INCREMENTAL aplicada em 15+ arquivos',
      'Blueprint template para App Factory',
      'GSD integrado como subcomandos formais dos agentes',
    ],
  },
  '5.2.0': {
    title: 'YOLO Mode + Constitution + Config System',
    highlights: [
      'YOLO Mode — execucao autonoma com guardrails minimos',
      'Constitution — 5 artigos de principios inviolaveis',
      '4-Layer Config (system → project → user → session)',
      'Task Templates, Synapse State Machine, Quality Gates',
    ],
  },
}

function printChangelog(version) {
  const entry = CHANGELOG[version]
  if (!entry) return

  const width = 64
  const border = '━'.repeat(width)
  const thin = '─'.repeat(width)

  console.log(``)
  console.log(`  ┏${border}┓`)
  const label = `  ✦  DuarteOS v${version} — ${entry.title}  `
  const pad = Math.max(0, width - label.length)
  console.log(`  ┃${label}${' '.repeat(pad)}┃`)
  console.log(`  ┗${border}┛`)
  console.log(``)
  console.log(`  O que ha de novo:`)
  console.log(`  ${thin}`)
  for (const item of entry.highlights) {
    console.log(`  → ${item}`)
  }
  console.log(`  ${thin}`)
  console.log(``)
}

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

  const version = getPackageVersion()

  console.log(`\n  DuarteOS Core AI — Update`)
  console.log(`  Versao do pacote: v${version}`)
  console.log(`  Diretorio: ${cwd}\n`)

  // Mostrar changelog da versao sendo instalada
  printChangelog(version)

  // Check if DuarteOS is installed (accept old or new path structure)
  const hasNewStructure = existsSync(resolve(cwd, '.claude/commands/DUARTEOS/agents/squad.md'))
  const hasOldStructure = existsSync(resolve(cwd, '.claude/commands/agents/squad.md'))
  if (!hasNewStructure && !hasOldStructure) {
    console.error('  ✗ DuarteOS nao esta instalado neste projeto.')
    console.error('  Use "duarteos init" primeiro.')
    process.exit(1)
  }

  // Migrate old namespace structure → new /DUARTEOS: namespace
  if (hasOldStructure && !hasNewStructure) {
    console.log('  ↑ Migrando comandos para namespace /DUARTEOS:...')

    // Ensure DUARTEOS directories exist
    const duarteosAgentsDir = resolve(cwd, '.claude/commands/DUARTEOS/agents')
    const duarteosSquadDir = resolve(cwd, '.claude/commands/DUARTEOS/squad')
    if (!existsSync(duarteosAgentsDir)) mkdirSync(duarteosAgentsDir, { recursive: true })
    if (!existsSync(duarteosSquadDir)) mkdirSync(duarteosSquadDir, { recursive: true })

    // Move agents/* → DUARTEOS/agents/*
    const oldAgentsDir = resolve(cwd, '.claude/commands/agents')
    if (existsSync(oldAgentsDir)) {
      for (const file of readdirSync(oldAgentsDir)) {
        const src = resolve(oldAgentsDir, file)
        const dest = resolve(duarteosAgentsDir, file)
        if (!existsSync(dest)) cpSync(src, dest)
      }
    }

    // Move squad/* → DUARTEOS/squad/*
    const oldSquadDir = resolve(cwd, '.claude/commands/squad')
    if (existsSync(oldSquadDir)) {
      for (const file of readdirSync(oldSquadDir)) {
        const src = resolve(oldSquadDir, file)
        const dest = resolve(duarteosSquadDir, file)
        if (!existsSync(dest)) cpSync(src, dest)
      }
    }

    // Move setup-mcps.md → DUARTEOS/setup-mcps.md
    const oldSetupMcps = resolve(cwd, '.claude/commands/setup-mcps.md')
    const newSetupMcps = resolve(cwd, '.claude/commands/DUARTEOS/setup-mcps.md')
    if (existsSync(oldSetupMcps) && !existsSync(newSetupMcps)) {
      cpSync(oldSetupMcps, newSetupMcps)
    }

    console.log('  ✓ Namespace migrado com sucesso!')
    console.log('')
  }

  // Files that are SAFE to overwrite (system files, not user-customized)
  const safeToUpdate = [
    // Squad commands (system — user doesn't customize these)
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
    ['commands/DUARTEOS/squad/build-system.md', '.claude/commands/DUARTEOS/squad/build-system.md'],

    // Agent definitions (system intelligence)
    ['commands/DUARTEOS/agents/squad.md', '.claude/commands/DUARTEOS/agents/squad.md'],
    ['commands/DUARTEOS/agents/pm.md', '.claude/commands/DUARTEOS/agents/pm.md'],
    ['commands/DUARTEOS/agents/architect.md', '.claude/commands/DUARTEOS/agents/architect.md'],
    ['commands/DUARTEOS/agents/backend.md', '.claude/commands/DUARTEOS/agents/backend.md'],
    ['commands/DUARTEOS/agents/frontend.md', '.claude/commands/DUARTEOS/agents/frontend.md'],
    ['commands/DUARTEOS/agents/qa.md', '.claude/commands/DUARTEOS/agents/qa.md'],
    ['commands/DUARTEOS/agents/context-engineer.md', '.claude/commands/DUARTEOS/agents/context-engineer.md'],
    ['commands/DUARTEOS/agents/devils-advocate.md', '.claude/commands/DUARTEOS/agents/devils-advocate.md'],

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
    ['commands/DUARTEOS/setup-mcps.md', '.claude/commands/DUARTEOS/setup-mcps.md'],

    // Blueprint template
    ['blueprints/blueprint-template.md', '.claude/blueprints/blueprint-template.md'],

    // Planning config
    ['planning/config.json', '.planning/config.json'],

    // Squad Factory Commands
    ['commands/DUARTEOS/squad/create-squad.md', '.claude/commands/DUARTEOS/squad/create-squad.md'],
    ['commands/DUARTEOS/squad/list-squads.md', '.claude/commands/DUARTEOS/squad/list-squads.md'],
    ['commands/DUARTEOS/squad/run-squad.md', '.claude/commands/DUARTEOS/squad/run-squad.md'],
    ['commands/DUARTEOS/squad/clone-mind.md', '.claude/commands/DUARTEOS/squad/clone-mind.md'],
    ['commands/DUARTEOS/squad/ingest.md', '.claude/commands/DUARTEOS/squad/ingest.md'],

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

    // v5.0.0 — Synapse (structure files) + v5.4 Synapse v2
    ['synapse/README.md', '.claude/synapse/README.md'],
    ['synapse/template.yaml', '.claude/synapse/template.yaml'],
    ['synapse/mind-template.yaml', '.claude/synapse/mind-template.yaml'],
    ['synapse/dossier-template.yaml', '.claude/synapse/dossier-template.yaml'],

    // v5.5.0 — Inbox/Caixa
    ['inbox/README.md', 'inbox/README.md'],

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

  // DUARTEOS commands — sync entire directory tree
  const duarteosSrc = resolve(TEMPLATES_DIR, 'commands', 'DUARTEOS')
  const duarteosDest = resolve(cwd, '.claude', 'commands', 'DUARTEOS')
  if (existsSync(duarteosSrc)) {
    const walkSync = (src, dest) => {
      if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
      const entries = readdirSync(src, { withFileTypes: true })
      for (const entry of entries) {
        const srcPath = resolve(src, entry.name)
        const destPath = resolve(dest, entry.name)
        if (entry.isDirectory()) {
          walkSync(srcPath, destPath)
        } else if (entry.name.endsWith('.md')) {
          if (!existsSync(destPath)) {
            cpSync(srcPath, destPath)
            added++
          } else {
            const current = readFileSync(destPath, 'utf-8')
            const next = readFileSync(srcPath, 'utf-8')
            if (current !== next) {
              cpSync(srcPath, destPath)
              updated++
            }
          }
        }
      }
    }
    walkSync(duarteosSrc, duarteosDest)
  }

  // Synapse minds — sync pre-populated DNA YAML files
  const synapseMindsSrc = resolve(TEMPLATES_DIR, 'synapse', 'minds')
  const synapseMindsDest = resolve(cwd, '.claude', 'synapse', 'minds')
  if (existsSync(synapseMindsSrc)) {
    if (!existsSync(synapseMindsDest)) mkdirSync(synapseMindsDest, { recursive: true })
    const entries = readdirSync(synapseMindsSrc)
    for (const entry of entries) {
      if (entry.endsWith('.yaml')) {
        const srcPath = resolve(synapseMindsSrc, entry)
        const destPath = resolve(synapseMindsDest, entry)
        if (!existsSync(destPath)) {
          cpSync(srcPath, destPath)
          added++
        } else {
          const current = readFileSync(destPath, 'utf-8')
          const next = readFileSync(srcPath, 'utf-8')
          if (current !== next) {
            cpSync(srcPath, destPath)
            updated++
          }
        }
      }
    }
  }

  // Synapse agent state — create missing state files (never overwrite existing)
  const synapseStateSrc = resolve(TEMPLATES_DIR, 'synapse')
  const synapseStateDest = resolve(cwd, '.claude', 'synapse')
  if (existsSync(synapseStateSrc)) {
    if (!existsSync(synapseStateDest)) mkdirSync(synapseStateDest, { recursive: true })
    const stateFiles = readdirSync(synapseStateSrc).filter(
      f => f.endsWith('.yaml') && !f.includes('template') && !f.includes('dossier')
    )
    for (const entry of stateFiles) {
      const srcPath = resolve(synapseStateSrc, entry)
      const destPath = resolve(synapseStateDest, entry)
      if (!existsSync(destPath)) {
        cpSync(srcPath, destPath)
        console.log(`  + adicionado .claude/synapse/${entry}`)
        added++
      }
    }
  }

  // Clean up old namespace directories (after migration + update copied new files)
  const oldAgentsDir = resolve(cwd, '.claude/commands/agents')
  const oldSquadDir = resolve(cwd, '.claude/commands/squad')
  const oldSetupMcps = resolve(cwd, '.claude/commands/setup-mcps.md')
  if (existsSync(oldAgentsDir)) {
    rmSync(oldAgentsDir, { recursive: true })
    console.log('  - removido .claude/commands/agents/ (migrado para DUARTEOS/)')
  }
  if (existsSync(oldSquadDir)) {
    rmSync(oldSquadDir, { recursive: true })
    console.log('  - removido .claude/commands/squad/ (migrado para DUARTEOS/)')
  }
  if (existsSync(oldSetupMcps)) {
    rmSync(oldSetupMcps)
    console.log('  - removido .claude/commands/setup-mcps.md (migrado para DUARTEOS/)')
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
