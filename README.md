# DuarteOS Core AI

AIOS multi-agente para [Claude Code](https://claude.ai/code). Instala 13 agentes, 15 comandos squad, 22 MCP servers, App Factory e sistema de memoria persistente em qualquer projeto.

## O que e

Um pacote que injeta inteligencia de orquestracao no seu projeto Claude Code:

- **13 Agentes Especializados** — 7 deliberativos + 6 custom agents
- **15 Comandos Squad** integrados com o motor GSD
- **22 MCP Servers** — 15 Node.js + 6 Python (FastMCP) + 1 Sandbox
- **App Factory** — `/squad:build-system` cria sistemas completos a partir de PRD/N8N/URL
- **Memory Graph** — conhecimento persistente entre sessoes
- **Tool Evolution** — agentes criam suas proprias ferramentas
- **4 Hooks** de quality gate automaticos
- **Zero dependencias npm** — apenas arquivos `.claude/`, `.planning/` e `.mcp.json`

## App Factory — O Recurso Principal

```bash
# A partir de um PRD
/squad:build-system docs/PRD.md

# A partir de um workflow N8N
/squad:build-system automation/lead-capture.json

# A partir de um site de referencia
/squad:build-system https://linear.app

# A partir de um briefing
/squad:build-system "Sistema de agendamento para clinicas com painel admin e area do paciente"
```

O comando analisa o input automaticamente, gera um BLUEPRINT.md e constroi o sistema completo:

```
Input (PRD/N8N/URL/Texto)
    ↓
FASE 0: Input Analysis → BLUEPRINT.md
    ↓
FASE 1: Architecture Decision → SCHEMA.sql + API contract
    ↓
FASE 2: Foundation → Scaffold + DB + Auth + Layout
    ↓
FASE 3: Features → API routes + Pages + Components (waves paralelas)
    ↓
FASE 4: Polish → Responsivo + Loading states + Animacoes
    ↓
FASE 5: Delivery → DELIVERY.md + instrucoes de deploy
```

**Modo YOLO:** executa tudo automaticamente, so pergunta quando CRITICO (ambiguidade, exclusao de feature, custo, seguranca).

## Agentes Deliberativos (7)

| Agente | Lente Cognitiva | Poder Executivo |
|--------|-----------------|-----------------||
| **PM** (Supreme Orchestrator) | Orquestracao, priorizacao, decisao | Reabrir fases, forcar rollback, encerrar loops |
| **Arquiteto** | Sistemas, trade-offs, estrutura | Criar/refatorar estrutura, implementar esqueleto |
| **Backend Dev** | Logica server-side, seguranca | Implementar features, corrigir bugs |
| **Frontend Dev** | UI premium, viralidade visual | Implementar interfaces, elevar padrao |
| **QA** | Rigor, prova, evidencia | Escrever testes, bloquear sem prova |
| **Context Engineer** | Semantica, coerencia, anti-drift | Reestruturar prompts, corrigir drift |
| **Advogado do Diabo** | Ceticismo, red team | Questionar tudo, bloquear riscos criticos |

## Agentes Custom (6)

| Agente | Dominio |
|--------|---------|
| **System Builder** | Constroi sistemas completos a partir de blueprints (App Factory) |
| **Python Executor** | Scripts Python, automacao, integracao |
| **Data Scientist** | Analise de dados, ML, visualizacoes |
| **DevOps** | Docker, CI/CD, infra, deploy, monitoring |
| **Security Auditor** | OWASP, vulnerabilidades, auditoria (read-only) |
| **Fullstack** | Frontend + Backend + DB, feature completa |

## MCP Servers (22)

### Node.js (15)
| Categoria | MCPs |
|-----------|------|
| **Busca** | Context7, EXA, Brave Search, Fetch |
| **Conteudo** | YouTube Transcript, Reddit |
| **Dev** | GitHub, REST API, Supabase, CodeRabbit |
| **Automacao** | n8n, Google Workspace, Obsidian |
| **Raciocinio** | Memory, Sequential Thinking |

### Python — FastMCP (6)
| MCP Server | O que faz |
|------------|-----------|
| **Input Analyzer** | Analisa PRDs, N8N workflows e URLs → gera Blueprint estruturado |
| **Memory Graph** | Grafo de conhecimento persistente: `remember`, `recall`, `connect`, `forget` |
| **Tool Forge** | Cria novas tools/MCP servers dinamicamente (tool evolution) |
| **Data Analyzer** | Analise CSV com pandas, graficos com matplotlib/seaborn |
| **Web Scraper** | Web scraping avancado com BeautifulSoup |
| **Automation** | Automacao de sistema, file processing, disk analysis |

### Sandbox (1)
| MCP | O que faz |
|-----|-----------|
| **E2B** | Execucao segura em Firecracker microVMs |

## Instalacao

```bash
# Com npx (recomendado)
npx duarteos-core-ai init

# Ou instale globalmente
npm install -g duarteos-core-ai
duarteos init

# Sem perguntas
npx duarteos-core-ai init --yes
```

### Pos-instalacao

```bash
# Configurar ambiente Python (para MCP servers Python)
bash .claude/scripts/setup-python.sh

# Configurar sandbox (E2B ou Docker)
bash .claude/scripts/setup-sandbox.sh
```

## O que instala (48 arquivos)

```
.claude/
  settings.json                    # Config com hooks + agent teams
  session-context.md               # Contexto persistente
  hooks/                           # 4 quality gates
    post-edit-lint.sh              # Auto-lint (ESLint/Biome/Prettier)
    pre-commit-check.sh            # tsc + lint + test antes de commit
    security-gate.sh               # Bloqueia comandos perigosos
    session-memory.sh              # Salva contexto ao encerrar
  agents/                          # 6 custom agents
    system-builder.md              # App Factory builder
    python-executor.md             # Executor Python
    data-scientist.md              # Cientista de dados
    devops.md                      # Engenheiro DevOps
    security-auditor.md            # Auditor de seguranca
    fullstack.md                   # Dev fullstack
  blueprints/
    blueprint-template.md          # Template de blueprint
  commands/
    agents/                        # 7 agentes deliberativos
      squad.md, pm.md, architect.md, backend.md,
      frontend.md, qa.md, context-engineer.md, devils-advocate.md
    squad/                         # 15 comandos GSD
      build-system.md              # APP FACTORY
      new-project.md, map-codebase.md, plan-phase.md,
      execute-phase.md, verify-work.md, discuss-phase.md,
      research-phase.md, validate-plan.md, audit.md,
      quick.md, debug.md, progress.md, pause.md, resume.md
  scripts/
    setup-python.sh                # Python + deps
    setup-sandbox.sh               # E2B / Docker
  mcp-servers/                     # 6 Python MCP Servers
    input-analyzer/server.py       # Analisa PRDs/N8N/URLs
    memory-graph/server.py         # Grafo de conhecimento
    tool-forge/server.py           # Criacao de tools
    data-analyzer/server.py        # Analise de dados
    web-scraper/server.py          # Web scraping
    automation/server.py           # Automacao
    requirements.txt               # Deps compartilhadas
.planning/
  config.json                      # Configuracao GSD
.mcp.json                          # 22 MCP Servers
```

## Comandos

### Agentes
```
/agents:squad [demanda]             # Squad completo (7 agentes)
/agents:pm [demanda]                # Gerente de Projetos
/agents:architect [area]            # Arquiteto
/agents:backend [feature]           # Backend Dev
/agents:frontend [tela]             # Frontend Dev
/agents:qa [area]                   # QA
/agents:context-engineer [area]     # Context Engineer
/agents:devils-advocate [proposta]  # Red Team
```

### Squad (GSD-powered)
```
/squad:build-system [input]         # APP FACTORY: PRD/N8N/URL → sistema completo
/squad:new-project [demanda]        # Pesquisa → Requirements → Roadmap
/squad:map-codebase                 # 4 agentes → 7 docs de codebase
/squad:plan-phase N                 # Research → Plan → Verify → PLAN.md
/squad:execute-phase N              # Wave-based execution + commits
/squad:verify-work N                # UAT + diagnostico
/squad:audit                        # Auditoria final
/squad:quick "descricao"            # Task rapida
/squad:debug "bug"                  # Debug cientifico
/squad:progress                     # Status
/squad:pause / /squad:resume        # Pausar/retomar
```

## Fluxo Completo

```
/squad:build-system [input]     → BLUEPRINT.md → sistema completo (YOLO)
    ou
/squad:new-project              → PM: pesquisa → roadmap
    ↓
/squad:map-codebase             → Arquiteto: 4 agentes → 7 docs
    ↓
/squad:discuss-phase 1          → Context Engineer: decisoes → CONTEXT.md
    ↓
/squad:plan-phase 1             → Arquiteto + Context + Devil → PLAN.md
    ↓
/squad:execute-phase 1          → Backend/Frontend: waves + commits
    ↓
/squad:verify-work 1            → QA: UAT + fix plans
    ↓
/squad:audit                    → Auditoria final
```

## Arquitetura

```
                         ┌────────────────────┐
                         │  Claude Code CLI   │
                         └─────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     DuarteOS Core AI v3     │
                    │  settings + hooks + memory  │
                    └──────────────┬──────────────┘
                                   │
       ┌───────────────┬───────────┼───────────┬────────────────┐
       │               │           │           │                │
┌──────▼──────┐ ┌──────▼──────┐ ┌──▼──┐ ┌─────▼─────┐ ┌───────▼───────┐
│ 7 Agents    │ │ 6 Custom    │ │ GSD │ │ 22 MCPs   │ │ App Factory   │
│ (commands/) │ │ (.claude/   │ │     │ │ 15 Node   │ │ build-system  │
│             │ │  agents/)   │ │ 15  │ │ 6 Python  │ │ → Blueprint   │
│ PM, Arch,   │ │ Builder,   │ │ cmds│ │ 1 Sandbox │ │ → Full System │
│ Back, Front │ │ Python,    │ │     │ │           │ │               │
│ QA, Context │ │ DataSci,   │ └─────┘ │ Memory    │ └───────────────┘
│ Devil       │ │ DevOps,    │         │ ToolForge │
└─────────────┘ │ Security,  │         │ Input     │
                │ Fullstack  │         │ Analyzer  │
                └────────────┘         └───────────┘
```

## Principios

1. **Nenhum agente pode apenas analisar** — Detectar → Provar → Agir
2. **Critica sem alternativa e invalida** — sempre apresentar alternativa
3. **QA sempre entrega prova** — sem teste/evidencia, invalido
4. **Loop fechado** — evidencia + acao + proximo passo
5. **YOLO mode** — executa tudo, so pergunta quando critico
6. **Tool evolution** — agentes criam ferramentas quando precisam
7. **Memory persistence** — conhecimento sobrevive entre sessoes
8. **Disciplina > ritual** — se regra virar burocracia, simplificar

## Pre-requisitos

1. **Claude Code** ([claude.ai/code](https://claude.ai/code))
2. **GSD** ([github.com/cleyio/gsd](https://github.com/cleyio/gsd))
3. **Python 3.10+** (para MCP servers Python)
4. **Node.js 18+**

## Licenca

MIT
