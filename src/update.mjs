import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPackageVersion, injectMcpEnvVars } from './utils.mjs'
import { checkMcpStatus, printMcpReport } from './mcp-check.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates')

// Changelog por versao — exibido no update
const CHANGELOG = {
  '5.14.0': {
    title: 'MMOS v3.1 — Hierarquia de Pesquisa EXA + Apify First',
    highlights: [
      'Hierarquia de pesquisa redesenhada: EXA MCP (tier 1) → Apify MCP (tier 2) → WebSearch (tier 3 fallback)',
      'TIER 1 — EXA MCP Server (web_search_exa): pesquisa semantica profunda, SEMPRE primeiro',
      'TIER 2 — Apify MCP (search-actors + call-actor): scraping estruturado (YouTube, Twitter, podcasts)',
      'TIER 3 — WebSearch: fallback SOMENTE se EXA + Apify retornaram < 3 fontes primarias',
      'WebFetch continua sendo usado para extracao de conteudo (independente do tier)',
      'Catalogo de fontes agora registra tier de origem para rastreabilidade',
      'MMOS-PIPELINE.md atualizado com nova subsecao de hierarquia de ferramentas',
      'mind-update NAO afetado — pipeline independente (usa material fornecido)',
    ],
  },
  '5.13.0': {
    title: 'MMOS v3 — PCFE Pre-Clone Fidelity Estimation + Human Gate',
    highlights: [
      'MMOS Pipeline evoluido de v2.1 (7 fases) para v3.0.0 (11 fases 0-10)',
      'Novo sub-workflow PCFE: estima fidelidade ANTES do pipeline pesado (formula 5 componentes)',
      'PCFE Formula: FE = VS*0.20 + DS*0.15 + CS*0.30 + PS*0.20 + QS*0.15',
      'VS (Volume Score): quantidade de material + bonus livros/entrevistas longas',
      'DS (Diversity Score): variedade de tipos de fonte + span temporal',
      'CS (Coverage Score, MAIOR PESO 30%): cobertura das 8 camadas DNA + 4 subcamadas',
      'PS (Profundidade Score): profundidade vs superficialidade do material',
      'QS (Quality Score): confiabilidade e completude das fontes',
      'Gate de Aprovacao Humana: painel com FE + breakdown + gaps + 3 opcoes (APROVAR/ENRIQUECER/ABORTAR)',
      'Loop de enriquecimento: max 3 iteracoes (Fase 4 → Fase 1 → Fase 4)',
      'Scaffold automatico pos-aprovacao: 21+ dirs + tasks + checklists + config.yaml + DNA skeleton',
      'Calibracao automatica: Fase 9 compara FE vs F real, armazena em pcfe-calibration.yaml',
      'Classificacao FE: EXCELENTE (>=85), BOM (70-84), MODERADO (55-69), FRACO (40-54), INSUFICIENTE (<40)',
      'Novo checklist OMEGA para PCFE (planning >=85, 8 criterios)',
      'mind-template.yaml: novos campos fidelity_estimated, pcfe_breakdown, pcfe_classification',
      'Checklist mind-clone atualizado: 10 → 15 criterios, pesos recalibrados para 11 fases',
      'MMOS-PIPELINE.md atualizado para v3 com diagrama, PCFE, Gate Humano, Scaffold, Calibracao',
      'Fases 6-10 (pesadas) identicas as antigas 1-5 — backward compatible',
      'mind-update NAO afetado — pipeline independente',
    ],
  },
  '5.12.0': {
    title: 'MMOS v2.1 — 6 Novos Componentes de Profundidade Cognitiva',
    highlights: [
      'MMOS Pipeline evoluido de v2.0 para v2.1 — 6 novos componentes cognitivos para fidelidade 95%+',
      'Estilometria Computacional: metricas quantitativas de estilo (comprimento frase, cadencia, code-switching)',
      'Associacoes Conceituais: nova camada — pontes entre conceitos aparentemente nao relacionados',
      'Estrutura Retorica: formula argumentativa padrao (como a pessoa constroi argumentos)',
      'Modelo de Recompensa e Medo: drivers positivos (impulsores) vs negativos (medos) separados',
      'Hierarquia de Valores Rankeada: evolucao de lista plana para ranking com conflitos resolvidos',
      'Teoria da Mente Simulada: como a pessoa modela intencoes dos outros (critica, elogio, provocacao)',
      'mind-template.yaml expandido: 155 → 238 linhas (+6 novas secoes/subcamadas)',
      'mind-clone.md: Fases 2, 3 e 5 expandidas com novos targets de extracao e validacao',
      'mind-update.md: Steps 2-5 expandidos com novos layers de delta/merge/regression',
      'MMOS-PIPELINE.md: nova secao 16 documentando os 6 componentes + regras de extracao',
      'Backward compatible: clones existentes continuam validos (novos campos opcionais)',
      'Amanda Khayat mind-update v2: fidelidade 75% → 94.0% (F=L:93 B:95 C:94 K:95 V:92), 211 insights de 3 fontes, 17 frameworks (de 5), 8 paradoxos (de 0), 13 heuristicas (de 4)',
    ],
  },
  '5.11.0': {
    title: 'MCP Fix — 19/21 Servers Validados',
    highlights: [
      'FIX: 8 Python MCPs crashavam — FastMCP(description=) nao existe no fastmcp 2.x, trocado para instructions=',
      'FIX: _comment_* entries no .mcp.json quebravam o loader do Claude Code (removidos)',
      'FIX: obsidian MCP — vault path movido de env para args (formato correto do pacote)',
      'REMOVIDOS MCPs que crashavam sem config: redis (deprecated), rest-api (sem BASE_URL), coderabbit (sem PAT)',
      'VALIDADO: 19/21 MCPs passam handshake JSON-RPC initialize (2 restantes precisam OAuth interativo)',
      'MCP_ENV_MAP e mcp-check.mjs atualizados para refletir 21 servers ativos',
      'Templates (templates/mcp.json + mcp-servers/) sincronizados com as correcoes',
    ],
  },
  '5.10.0': {
    title: 'MCP Reliability — env vars diretas + .mcp.json git-ignored',
    highlights: [
      'FIX: MCP servers nao carregavam porque env vars (EXA_API_KEY, APIFY_TOKEN, etc.) nao chegavam ao processo',
      'Env vars do .env.local agora injetadas diretamente no bloco env de cada server no .mcp.json',
      '.mcp.json agora e git-ignored (contem API keys) — template sem keys em templates/mcp.json',
      'injectMcpEnvVars() em utils.mjs — chamada no init e update para manter .mcp.json sincronizado',
      'Removida duplicacao entre .mcp.json (projeto) e ~/.claude/.mcp.json (global)',
      'Servers afetados: exa, apify, redis, github, obsidian, e2b-sandbox, n8n',
    ],
  },
  '5.9.0': {
    title: 'OMEGA v1.1 — Task Lifecycle + Mind Clone Bootstrap + Squad Artifacts + MCP Fix',
    highlights: [
      'OMEGA v1.1.0: Task Lifecycle Protocol — PRE-EXEC + POST-EXEC + Memory obrigatorios (Secao 11)',
      'Pre-Execution: TASK.md + CHECKLIST.md criados em .planning/tasks/ antes de QUALQUER task',
      'Post-Execution: checklist marcado, resumo salvo em HISTORY.md + session-context.md, cleanup automatico',
      'HISTORY.md: log permanente de todas as tasks executadas (nunca deletado)',
      'OMEGA_LIFECYCLE wrapper: envolve OMEGA_LOOP com PRE-EXEC e POST-EXEC',
      'Mind Clone Bootstrap: clones carregam mente completa (squad artifacts) automaticamente ao instanciar',
      'Fase 6 mind-clone expandida: 9 tipos de squad artifacts gerados automaticamente com YAML schemas',
      'Gate Gawande Squad Completeness: 10 checks (7 kill items) para validar artifacts do squad',
      'artifacts_completeness: novo bloco no config.yaml do squad com score e gate',
      'mind-update Step 4 expandido: mapeamento delta → artifacts com merge incremental',
      'Pavel Durov: legacy backfill completo — 31 squad artifacts gerados (14 frameworks, 6 tasks, 8 artifacts)',
      'FIX: MCP servers (exa, apify, github, etc.) agora iniciam corretamente — removido ${VAR} do env block',
      'FIX: env vars herdadas do shell (direnv/.env.local) — Claude Code nao suporta interpolacao ${VAR}',
    ],
  },
  '5.7.0': {
    title: 'OMEGA — Quality Enforcement Loop Engine',
    highlights: [
      'OMEGA engine: quality enforcement loop para todos os agentes com circuit breaker 3-state',
      'MMOS Pipeline v2: pipeline de clonagem mental de 6 fases com 5 autoridades e formula de fidelidade >= 95%',
      'Circuit breaker (CLOSED → OPEN → HALF-OPEN) com auto-cooldown configuravel',
      'Quality gates com thresholds: Research >=80, Planning >=85, Implementation >=90, Validation >=95',
      'Escalation router: same agent → vertical → horizontal → human',
      'Model routing por complexidade (Haiku/Sonnet/Opus)',
      'Agent signature traceability em todos os outputs',
      'OMEGA config.yaml: configuracao de gates, thresholds, circuit breaker, escalation',
      'OMEGA state.json: estado runtime com metricas e historico de qualidade',
      'OMEGA checklists: 6 quality gate checklists por fase',
      'Novo protocolo: .claude/protocols/OMEGA.md',
      'Novo protocolo: .claude/protocols/MMOS-PIPELINE.md',
    ],
  },
  '5.6.0': {
    title: 'MMOS Pipeline — DNA 6 Camadas + APEX/ICP + Paradoxos Produtivos',
    highlights: [
      'Novo comando /DUARTEOS:mmos:mind-clone — pipeline MMOS v2 de 6 fases para clonagem mental',
      'Novo comando /DUARTEOS:mmos:mind-update — atualizacao incremental com rollback automatico',
      'DNA evoluido de 5 para 6 camadas — nova camada: Paradoxos Produtivos (inspirada em MMOS Layer 8)',
      'Gate de viabilidade APEX/ICP — avalia candidato antes de gastar tokens (APEX >= 40/60, ICP >= 6/10)',
      '5 autoridades integradas: Allen (GTD), Forte (CODE), Deming (PDSA), Kahneman (Anti-Vies), Gawande (Gates)',
      '15 entidades de dados distribuidas pelas 6 fases do pipeline',
      'Gates Gawande DO-CONFIRM entre cada transicao de fase com kill items bloqueantes',
      'Formula de fidelidade composta: F = L*0.20 + B*0.30 + C*0.15 + K*0.20 + V*0.15',
      'Fidelidade-alvo: >= 95% (minimum per component: 85%)',
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

/**
 * Migrate .mcp.json: remove ${VAR} interpolation from env blocks.
 * Claude Code does NOT support ${VAR} — servers must inherit env from the shell.
 * This function surgically patches the file, preserving user customizations.
 */
function migrateMcpJson(cwd) {
  const mcpPath = resolve(cwd, '.mcp.json')
  if (!existsSync(mcpPath)) return false

  let raw
  try {
    raw = readFileSync(mcpPath, 'utf-8')
  } catch {
    return false
  }

  let config
  try {
    config = JSON.parse(raw)
  } catch {
    return false
  }

  const servers = config.mcpServers
  if (!servers) return false

  let changed = false
  for (const [id, server] of Object.entries(servers)) {
    if (id.startsWith('_comment')) continue
    if (!server.env) continue

    // Remove env entries that use ${VAR} pattern (literal, not interpolated)
    const keysToRemove = []
    for (const [key, value] of Object.entries(server.env)) {
      if (typeof value === 'string' && value.includes('${')) {
        keysToRemove.push(key)
      }
    }

    for (const key of keysToRemove) {
      delete server.env[key]
      changed = true
    }

    // If env block is now empty, remove it
    if (Object.keys(server.env).length === 0) {
      delete server.env
    }
  }

  // Also fix args that contain ${VAR} (e.g., supabase URL)
  for (const [id, server] of Object.entries(servers)) {
    if (id.startsWith('_comment')) continue
    if (!server.args) continue

    server.args = server.args.map(arg => {
      if (typeof arg === 'string' && arg.includes('${')) {
        // Remove the ${VAR} portion from the arg
        changed = true
        return arg.replace(/\$\{[^}]+\}/g, '').replace(/[?&]project_ref=$/, '')
      }
      return arg
    })
  }

  if (changed) {
    writeFileSync(mcpPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
    console.log('  ✓ .mcp.json migrado: removido ${VAR} do env (servers herdam do shell)')
    return true
  }
  return false
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
    '.env.local',
    '.mcp.json',
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

  // Banner de versao
  const bannerWidth = 56
  const border = '━'.repeat(bannerWidth)
  console.log(``)
  console.log(`  ┏${border}┓`)
  console.log(`  ┃  DuarteOS Core AI v${version} — Update${' '.repeat(Math.max(0, bannerWidth - 31 - version.length))}┃`)
  console.log(`  ┃  21 MCPs  |  13 Agentes  |  59 Mind Clones${' '.repeat(Math.max(0, bannerWidth - 46))}┃`)
  console.log(`  ┗${border}┛`)
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

    // v5.7.0 — OMEGA Quality Enforcement Loop
    ['omega/config.yaml', '.claude/omega/config.yaml'],

    // v5.7.0 — Protocols (OMEGA + MMOS-PIPELINE)
    ['protocols/OMEGA.md', '.claude/protocols/OMEGA.md'],
    ['protocols/MMOS-PIPELINE.md', '.claude/protocols/MMOS-PIPELINE.md'],

    // v5.13.0 — MMOS v3 PCFE template (system-owned, safe to update)
    ['commands/DUARTEOS/mmos/pcfe-template.yaml', '.claude/commands/DUARTEOS/mmos/pcfe-template.yaml'],

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
    // v5.7.0 — OMEGA state (runtime data, never overwrite)
    '.claude/omega/state.json',
    // v5.13.0 — PCFE calibration data (accumulates over time, never overwrite)
    '.claude/omega/pcfe-calibration.yaml',
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

    // Guard: skip files in neverOverwrite list
    if (neverOverwrite.includes(dest)) {
      skipped++
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
    // v5.8.1 — direnv auto-load (only added if missing — never overwrite user config)
    ['.envrc', '.envrc'],
    // v5.13.0 — PCFE calibration (only created if missing — accumulates data over time)
    ['omega/pcfe-calibration.yaml', '.claude/omega/pcfe-calibration.yaml'],
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

  // OMEGA checklists — sync quality gate checklist files
  const omegaChecklistsSrc = resolve(TEMPLATES_DIR, 'omega', 'checklists')
  const omegaChecklistsDest = resolve(cwd, '.claude', 'omega', 'checklists')
  if (existsSync(omegaChecklistsSrc)) {
    if (!existsSync(omegaChecklistsDest)) mkdirSync(omegaChecklistsDest, { recursive: true })
    const entries = readdirSync(omegaChecklistsSrc)
    for (const entry of entries) {
      if (entry.endsWith('.md')) {
        const srcPath = resolve(omegaChecklistsSrc, entry)
        const destPath = resolve(omegaChecklistsDest, entry)
        if (!existsSync(destPath)) {
          cpSync(srcPath, destPath)
          console.log(`  + adicionado .claude/omega/checklists/${entry}`)
          added++
        } else {
          const current = readFileSync(destPath, 'utf-8')
          const next = readFileSync(srcPath, 'utf-8')
          if (current !== next) {
            cpSync(srcPath, destPath)
            console.log(`  ~ atualizado .claude/omega/checklists/${entry}`)
            updated++
          }
        }
      }
    }
  }

  // OMEGA checkpoints directory — ensure it exists for runtime snapshots
  const omegaCheckpointsDest = resolve(cwd, '.claude', 'omega', 'checkpoints')
  if (!existsSync(omegaCheckpointsDest)) mkdirSync(omegaCheckpointsDest, { recursive: true })

  // v5.9.0 — OMEGA Task Lifecycle: ensure .planning/tasks/ exists
  const planningTasksDest = resolve(cwd, '.planning', 'tasks')
  if (!existsSync(planningTasksDest)) mkdirSync(planningTasksDest, { recursive: true })

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

  // v5.9.0 — Migrate .mcp.json: remove ${VAR} interpolation (Claude Code bug)
  migrateMcpJson(cwd)

  // v5.10.0 — Inject env vars from .env.local into .mcp.json (MCP servers need explicit env)
  injectMcpEnvVars(cwd)

  // Ensure .gitignore has DuarteOS entries (.mcp.json now git-ignored since it contains keys)
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
    .mcp.json               — suas API keys (git-ignored)
    .env                    — suas variaveis de ambiente
    .claude/settings.json   — suas configuracoes
    .claude/session-context.md — seu contexto de sessao
    .claude/memory.json     — seu grafo de conhecimento
    .claude/config/project.yaml — configuracao do projeto
    .claude/config/user.yaml — suas preferencias pessoais
    .claude/agent-memory/*/MEMORY.md — memorias individuais dos agentes
    .claude/synapse/*.yaml  — estado dos agentes
    .envrc                  — sua configuracao direnv
    squads/                 — seus squads customizados
`)

  // MCP Health Check — detect disconnected MCPs and guide user
  const mcpStatus = checkMcpStatus(cwd)
  printMcpReport(mcpStatus)
}
