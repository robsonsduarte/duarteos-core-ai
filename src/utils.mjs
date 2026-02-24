import { readFileSync } from 'fs'
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
      hooks/                     4 quality gates automaticos
        post-edit-lint.sh        Auto-lint apos editar arquivos
        pre-commit-check.sh      TypeScript + ESLint + testes antes do commit
        security-gate.sh         Bloqueia comandos perigosos
        session-memory.sh        Salva contexto da sessao ao encerrar
      agents/                    6 agentes especializados customizados
        python-executor.md       Execucao Python (analise, automacao, scripts)
        data-scientist.md        Analise de dados, ML, visualizacoes
        devops.md                Docker, CI/CD, infra, deploy
        security-auditor.md      Auditoria OWASP, vulnerabilidades
        fullstack.md             Full-stack rapido (front + back + banco)
        system-builder.md       Constroi sistemas completos (App Factory)
      blueprints/
        blueprint-template.md   Template de blueprint para build-system
      commands/
        agents/                  7 agentes deliberativos + squad
          squad.md               Orquestrador multi-agente (7 agentes)
          pm.md                  Supreme Orchestrator (Gerente de Projetos)
          architect.md           Arquiteto de Software
          backend.md             Desenvolvedor Backend
          frontend.md            Desenvolvedor Frontend
          qa.md                  Analista de Qualidade
          context-engineer.md    Engenheiro de Coerencia
          devils-advocate.md     Advogado do Diabo (Red Team)
        squad/                   14 comandos GSD-powered
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
        redis-task-manager/      Tasks multi-agente com dependencias (create/assign/complete)
    .planning/
      config.json                Configuracao do workflow GSD
    .mcp.json                    22 MCP Servers pre-configurados
    .env.example                 Variaveis de ambiente para os MCPs

  MCP Servers incluidos (21):
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
