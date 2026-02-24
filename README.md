# DuarteOS Core AI

AIOS multi-agente para [Claude Code](https://claude.ai/code). Instala 12 agentes especializados, 14 comandos squad, 19 MCP servers, hooks de quality gate e MCP servers Python customizados em qualquer projeto.

## O que e

Um pacote que injeta inteligencia de orquestracao no seu projeto Claude Code:

- **12 Agentes Especializados** — 7 deliberativos + 5 custom agents
- **14 Comandos Squad** integrados com o motor GSD
- **19 MCP Servers** — 15 Node.js + 3 Python (FastMCP) + 1 Sandbox
- **4 Hooks** de quality gate automaticos (lint, security, pre-commit, memory)
- **Fluxo deliberativo-executivo** com loop fechado
- **Zero dependencias npm** — apenas arquivos `.claude/`, `.planning/` e `.mcp.json`

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

## Agentes Custom (5)

| Agente | Dominio | Tools |
|--------|---------|-------|
| **Python Executor** | Scripts Python, automacao, integracao | Bash, Read, Write, Edit, Glob, Grep |
| **Data Scientist** | Analise de dados, ML, visualizacoes | Bash, Read, Write, Edit, Glob, Grep |
| **DevOps** | Docker, CI/CD, infra, deploy, monitoring | Bash, Read, Write, Edit, Glob, Grep |
| **Security Auditor** | OWASP, vulnerabilidades, auditoria | Bash, Read, Glob, Grep (read-only) |
| **Fullstack** | Frontend + Backend + DB, feature completa | Bash, Read, Write, Edit, Glob, Grep |

## Hooks (4 Quality Gates)

| Hook | Evento | Descricao |
|------|--------|-----------|
| `post-edit-lint.sh` | PostToolUse (Write/Edit) | Auto-lint apos editar arquivos (ESLint/Biome/Prettier) |
| `pre-commit-check.sh` | PreToolUse (git commit) | TypeScript + ESLint + testes antes do commit |
| `security-gate.sh` | PreToolUse (Bash) | Bloqueia comandos perigosos (rm -rf, DROP, etc) |
| `session-memory.sh` | Stop | Salva contexto da sessao automaticamente |

## MCP Servers (19)

### Node.js (15)
| Categoria | MCPs |
|-----------|------|
| **Busca** | Context7 (docs de libs), EXA (web + codigo), Brave Search (web), Fetch (URL→MD) |
| **Conteudo** | YouTube Transcript (transcricoes), Reddit (posts, trending) |
| **Desenvolvimento** | GitHub (repos, PRs, issues), REST API (qualquer API), Supabase (DB), CodeRabbit (code review IA) |
| **Automacao** | n8n (workflows), Google Workspace (Gmail, Drive, Calendar, Docs, Sheets), Obsidian (notas) |
| **Raciocinio** | Memory (grafo de conhecimento), Sequential Thinking (raciocinio estruturado) |

### Python (3 — FastMCP)
| MCP Server | Tools | O que faz |
|------------|-------|-----------|
| **Data Analyzer** | `analyze_csv`, `query_dataframe`, `create_chart`, `correlate` | Analise de dados com pandas, graficos com matplotlib/seaborn |
| **Web Scraper** | `scrape_page`, `extract_links`, `extract_tables`, `scrape_structured` | Web scraping avancado com BeautifulSoup |
| **Automation** | `find_duplicates`, `disk_usage`, `batch_rename`, `run_and_capture`, `file_stats` | Automacao de sistema e file processing |

### Sandbox (1)
| MCP Server | O que faz |
|------------|-----------|
| **E2B** | Execucao segura de codigo em Firecracker microVMs (Python, Node, Go, Rust) |

## Instalacao

```bash
# Com npx (recomendado)
npx duarteos-core-ai init

# Ou instale globalmente
npm install -g duarteos-core-ai
duarteos init

# Sem perguntas (aceita defaults)
npx duarteos-core-ai init --yes
```

### Pos-instalacao

```bash
# Configurar ambiente Python (para MCP servers Python)
bash .claude/scripts/setup-python.sh

# Configurar sandbox (E2B ou Docker)
bash .claude/scripts/setup-sandbox.sh
```

## O que instala

```
.claude/
  settings.json                    # Config com hooks + agent teams
  session-context.md               # Template de contexto persistente
  hooks/                           # Quality gates automaticos
    post-edit-lint.sh              # Auto-lint (ESLint/Biome/Prettier)
    pre-commit-check.sh            # tsc + lint + test antes de commit
    security-gate.sh               # Bloqueia comandos perigosos
    session-memory.sh              # Salva contexto ao encerrar
  agents/                          # Custom agents (.claude/agents/)
    python-executor.md             # Executor Python
    data-scientist.md              # Cientista de dados
    devops.md                      # Engenheiro DevOps
    security-auditor.md            # Auditor de seguranca
    fullstack.md                   # Dev fullstack
  commands/
    agents/                        # 7 agentes deliberativos
      squad.md                     # Orquestrador multi-agente
      pm.md                        # Gerente de Projetos
      architect.md                 # Arquiteto de Software
      backend.md                   # Desenvolvedor Backend
      frontend.md                  # Desenvolvedor Frontend
      qa.md                        # Analista de Qualidade
      context-engineer.md          # Engenheiro de Coerencia
      devils-advocate.md           # Advogado do Diabo (Red Team)
    squad/                         # 14 comandos GSD
      new-project.md               # Inicializar projeto
      map-codebase.md              # Mapear codebase (4 agentes)
      plan-phase.md                # Planejar fase
      execute-phase.md             # Executar fase (wave-based)
      verify-work.md               # Verificar trabalho (UAT)
      discuss-phase.md             # Discutir fase
      research-phase.md            # Pesquisar fase
      validate-plan.md             # Validar plano (red team)
      audit.md                     # Auditar milestone
      quick.md                     # Task rapida
      debug.md                     # Debug sistematico
      progress.md                  # Status do projeto
      pause.md                     # Pausar trabalho
      resume.md                    # Retomar trabalho
  scripts/                         # Scripts de setup
    setup-python.sh                # Python + deps
    setup-sandbox.sh               # E2B / Docker sandbox
  mcp-servers/                     # Python MCP Servers
    data-analyzer/server.py        # Analise de dados
    web-scraper/server.py          # Web scraping
    automation/server.py           # Automacao de sistema
    requirements.txt               # Deps compartilhadas
.planning/
  config.json                      # Configuracao GSD
.mcp.json                          # 19 MCP Servers pre-configurados
```

## Pre-requisitos

1. **Claude Code** instalado ([claude.ai/code](https://claude.ai/code))
2. **GSD** instalado ([github.com/cleyio/gsd](https://github.com/cleyio/gsd))
3. **Python 3.10+** (para MCP servers Python)
4. **Node.js 18+**

## Uso

### Agentes Individuais

```
/agents:pm [demanda]                    # Gerente de Projetos
/agents:architect [area]                # Arquiteto
/agents:backend [feature]               # Backend Dev
/agents:frontend [tela]                 # Frontend Dev
/agents:qa [area]                       # QA
/agents:context-engineer [area]         # Context Engineer
/agents:devils-advocate [proposta]      # Red Team
```

### Squad Completo

```
/agents:squad [demanda]                 # Ativa todos os 7 agentes
```

### Comandos Squad (GSD-powered)

```
/squad:new-project [demanda]            # Pesquisa → Requirements → Roadmap
/squad:map-codebase                     # 4 agentes → 7 docs de codebase
/squad:discuss-phase N                  # Captura decisoes → CONTEXT.md
/squad:research-phase N                 # Pesquisa tecnica → RESEARCH.md
/squad:plan-phase N                     # Research → Plan → Verify → PLAN.md
/squad:validate-plan                    # Red team contesta planos
/squad:execute-phase N                  # Wave-based execution + commits
/squad:verify-work N                    # UAT + diagnostico + fix plans
/squad:audit                            # Auditoria completa de milestone
/squad:quick "descricao"                # Task rapida (1-3 passos)
/squad:debug "descricao do bug"         # Debug cientifico persistente
/squad:progress                         # Status + proximo passo
/squad:pause                            # Salvar estado
/squad:resume                           # Retomar trabalho
```

## Fluxo Completo

```
/squad:new-project          → PM: pesquisa → requirements → roadmap
    ↓
/squad:map-codebase         → Arquiteto: 4 agentes → 7 docs
    ↓
/squad:discuss-phase 1      → Context Engineer: decisoes → CONTEXT.md
    ↓
/squad:plan-phase 1         → Arquiteto + Context + Devil: → PLAN.md
    ↓
/squad:execute-phase 1      → Backend/Frontend: waves paralelas + commits
    ↓
/squad:verify-work 1        → QA: UAT + diagnose + fix plans
    ↓
/squad:audit                → QA + Context + Devil: auditoria final
```

## Arquitetura

```
                    ┌─────────────────────┐
                    │   Claude Code CLI    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  DuarteOS Core AI   │
                    │  (settings + hooks) │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                     │
┌─────────▼─────────┐ ┌───────▼───────┐ ┌──────────▼──────────┐
│  7 Deliberative   │ │  5 Custom     │ │  19 MCP Servers     │
│  Agents           │ │  Agents       │ │                     │
│  (commands/)      │ │  (.claude/    │ │  15 Node.js         │
│                   │ │   agents/)    │ │  3 Python (FastMCP) │
│  PM, Architect,   │ │              │ │  1 Sandbox (E2B)    │
│  Backend, Frontend│ │  Python,     │ │                     │
│  QA, Context,     │ │  DataSci,    │ └─────────────────────┘
│  Devil's Advocate │ │  DevOps,     │
└─────────┬─────────┘ │  Security,   │
          │            │  Fullstack   │
          │            └──────────────┘
          │
┌─────────▼─────────┐
│  GSD Engine       │
│  (14 squad cmds)  │
│  .planning/       │
└───────────────────┘
```

## Principios

1. **Nenhum agente pode apenas analisar** — todo agente deve: Detectar → Provar → Agir
2. **Critica sem alternativa e invalida** — Advogado do Diabo sempre apresenta alternativa
3. **QA sempre entrega prova** — sem teste/evidencia, relatorio e invalido
4. **Loop fechado** — nenhum agente encerra sem evidencia + acao + proximo passo
5. **Execucao incremental** — mudancas atomicas, commits focados
6. **Disciplina > ritual** — se regra virar burocracia, simplificar

## Personalizacao

Apos instalar, adicione um `CLAUDE.md` na raiz do `.claude/` com instrucoes especificas do seu projeto:

```markdown
# CLAUDE.md

## Project Overview
[Descricao do seu projeto]

## Architecture
[Stack, padroes, convencoes]

## Commands
[Scripts de build, test, lint]
```

Os agentes usam o `CLAUDE.md` como fonte de verdade para contexto do projeto.

## Criar MCP Server Python Customizado

```python
from fastmcp import FastMCP

mcp = FastMCP("meu-server", description="Meu MCP customizado")

@mcp.tool()
def minha_ferramenta(param: str) -> str:
    """Descricao da ferramenta."""
    return f"Resultado: {param}"

if __name__ == "__main__":
    mcp.run()
```

Salve em `.claude/mcp-servers/meu-server/server.py` e adicione ao `.mcp.json`:

```json
{
  "meu-server": {
    "command": "python3",
    "args": [".claude/mcp-servers/meu-server/server.py"]
  }
}
```

## Licenca

MIT
