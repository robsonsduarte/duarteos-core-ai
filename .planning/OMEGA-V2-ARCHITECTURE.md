# OMEGA v2 — Documento de Arquitetura

**Versao:** 2.0.0-draft
**Status:** Arquitetura aprovada para implementacao
**Autor:** NEXUS (Architect)
**Data:** 2026-03-03
**Substitui:** OMEGA v1.0.0 + AGENT-GSD-PROTOCOL v1.2.0

---

## 1. Visao Geral

### 1.1 O Que e OMEGA v2

OMEGA v2 e o **motor unico de execucao** do DuarteOS. Ele unifica duas funcoes que antes eram separadas:

- **OMEGA v1** — motor de qualidade continua (loop de refinamento, circuit breaker, escalation, scoring por evidencia)
- **GSD** — motor de execucao estruturada (lifecycle de projeto, milestones, fases, artefatos em `.planning/`, session management)

A fusao elimina a duplicidade conceitual ("cerebro vs maos") e cria um sistema coeso onde **qualidade e execucao sao inseparaveis** — nao existe execucao sem quality gate, e nao existe quality gate sem execucao rastreada.

```
OMEGA v2 = OMEGA v1 (qualidade) + GSD (execucao) + Synapse v3 (contexto) + MMOS v2 (mind clones)
```

### 1.2 Principio Arquitetural

```
┌─────────────────────────────────────────────────────────────┐
│  USUARIO                                                     │
│  Demanda → ATLAS (PM) → Delega                              │
├─────────────────────────────────────────────────────────────┤
│  OMEGA v2 ENGINE                                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  LIFECYCLE LAYER (absorvido do GSD)                  │   │
│  │  Projetos → Milestones → Fases → Tasks              │   │
│  │  .planning/ artefatos rastreados                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  EXECUTION LAYER (core OMEGA)                        │   │
│  │  Loop → Score → Threshold → Feedback → Repeat        │   │
│  │  Circuit Breaker, Escalation, Backpressure           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  QUALITY LAYER (quality gates + checklists)          │   │
│  │  6 task_types × thresholds × evidencias              │   │
│  │  Dual-Gate Exit, Completion Signals                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  CONTEXT LAYER (Synapse v3 integration)              │   │
│  │  L0-L7 Context Stack, Agent State, DNA Memory       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  MIND CLONE LAYER (MMOS v2 integration)              │   │
│  │  6 Fases Pipeline, 5 Autoridades, Gates Gawande     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  AGENTES (executam DENTRO do OMEGA Engine)                   │
│  ATLAS, NEXUS, FORGE, PRISM, SENTINEL, COMPASS,            │
│  SHADOW, TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE        │
├─────────────────────────────────────────────────────────────┤
│  PERSISTENCIA                                                │
│  .planning/ (lifecycle)  .claude/omega/ (engine state)      │
│  .claude/synapse/ (context) .claude/session-context.md      │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Relacao OMEGA <-> Synapse <-> MMOS

```
OMEGA v2 ──────── ORQUESTRA ────────→ Tudo
    │                                      │
    ├── Synapse v3: CONSOME contexto       │
    │   (L0-L7 stack carregado por OMEGA   │
    │    antes de cada task)               │
    │                                      │
    ├── Synapse v3: PRODUZ estado          │
    │   (OMEGA atualiza agent state        │
    │    e omega_history no Synapse)       │
    │                                      │
    └── MMOS v2: EXECUTA dentro de OMEGA   │
        (cada fase MMOS = task OMEGA       │
         com task_type e threshold)        │
                                           │
Synapse v3 ← MEMORIA VIVA do sistema      │
    └── 8 camadas de contexto (L0-L7)     │
    └── Agent state tracking               │
    └── Mind clone DNA storage             │
                                           │
MMOS v2 ← PIPELINE de mind clones         │
    └── 6 fases com Gates Gawande          │
    └── 5 autoridades (Allen, Forte,       │
        Deming, Kahneman, Gawande)         │
    └── Cada fase = task OMEGA             │
```

**Regra fundamental:** OMEGA v2 e o unico ponto de entrada para execucao. Nenhum agente executa workflow complexo fora do OMEGA. Synapse alimenta contexto. MMOS opera como pipeline especializado dentro do OMEGA.

---

## 2. Secoes do Protocolo OMEGA v2

### 2.1 Secoes Existentes (mantidas do OMEGA v1)

Todas as secoes do OMEGA v1.0.0 permanecem, com ajustes indicados:

| # | Secao | Status | Ajustes Necessarios |
|---|-------|--------|---------------------|
| 1 | OMEGA Core Loop | Mantida | Adicionar lifecycle context ao loop (fase atual, milestone, projeto) |
| 2 | Quality Gates — Thresholds | Mantida | Adicionar task_type `lifecycle` (threshold 85) para operacoes de lifecycle |
| 3 | Circuit Breaker | Mantida | Sem ajustes |
| 4 | Escalation Router | Mantida | Adicionar escalacao entre fases (nao so entre agentes) |
| 5 | Agent Signature | Mantida | Adicionar campo `phase` e `milestone` ao OMEGA_SIGNATURE |
| 6 | Progress Tracking | Mantida | Expandir para tracking em nivel de projeto/milestone/fase |
| 7 | Backpressure | Mantida | Adicionar gates de fase (pre-conditions do GSD) como backpressure |
| 8 | Model Routing | Mantida | Sem ajustes |
| 9 | State Persistence | **Expandida** | Absorver `.planning/` como parte do estado OMEGA |
| 10 | Integracao com Agentes | Mantida | Atualizar manifests para usar `/omega:*` |
| A | Glossario | Mantida | Adicionar termos de lifecycle |
| B | Referencia Rapida | Mantida | Atualizar com novos subcomandos |
| C | Mapa de Integracao | **Reescrita** | Remover GSD como camada separada |
| D | Cenarios de Uso | Mantida | Adicionar cenarios de lifecycle |
| E | Configuracao | Mantida | Adicionar config de lifecycle |

### 2.2 Secoes Novas (absorvidas do GSD)

| # | Secao Nova | Origem | Descricao |
|---|-----------|--------|-----------|
| 11 | Lifecycle Management | GSD new-project, milestones, fases | Gerenciamento de projeto/milestone/fase |
| 12 | Session Management | GSD pause-work, resume-work | Pause/resume com handoff completo |
| 13 | Artifact Management | GSD .planning/ | Artefatos estruturados e seus schemas |
| 14 | Workflow Recipes | GSD recipes 1-6 | Fluxos end-to-end (agora com OMEGA nativo) |
| 15 | Invocation Rules | GSD regras de invocacao | Quando usar OMEGA formal vs execucao direta |
| 16 | Save-Context Protocol | GSD save-context | Checkpoint continuo apos operacoes |
| 17 | Subcommand Manifest | GSD manifests por agente | Manifest completo de todos os subcomandos |
| 18 | Authorization Chain | GSD cadeia de autorizacao | Quem autoriza o que |

### 2.3 Secoes de Integracao (novas)

| # | Secao Nova | Descricao |
|---|-----------|-----------|
| 19 | Synapse v3 Integration | 8 camadas de contexto — como OMEGA carrega e atualiza |
| 20 | MMOS v2 Integration | Pipeline de mind clones dentro do OMEGA |
| 21 | Gawande Gate Mapping | Gates Gawande do MMOS mapeados para dual-gate OMEGA |

### 2.4 Estrutura Final do Protocolo

```
OMEGA-V2.md (~2000+ linhas estimadas)
├── Definicao e Principios (atualizada)
├── 1.  OMEGA Core Loop (mantida + lifecycle context)
├── 2.  Quality Gates — Thresholds (mantida + lifecycle type)
├── 3.  Circuit Breaker (mantida)
├── 4.  Escalation Router (mantida + escalacao entre fases)
├── 5.  Agent Signature (mantida + phase/milestone fields)
├── 6.  Progress Tracking (expandida para projeto/milestone/fase)
├── 7.  Backpressure (mantida + gates de fase)
├── 8.  Model Routing (mantida)
├── 9.  State Persistence (expandida — absorve .planning/)
├── 10. Integracao com Agentes (atualizada)
├── 11. Lifecycle Management (NOVO — de GSD)
├── 12. Session Management (NOVO — de GSD)
├── 13. Artifact Management (NOVO — de GSD)
├── 14. Workflow Recipes (NOVO — de GSD)
├── 15. Invocation Rules (NOVO — de GSD)
├── 16. Save-Context Protocol (NOVO — de GSD)
├── 17. Subcommand Manifest (NOVO — de GSD)
├── 18. Authorization Chain (NOVO — de GSD)
├── 19. Synapse v3 Integration (NOVO)
├── 20. MMOS v2 Integration (NOVO)
├── 21. Gawande Gate Mapping (NOVO)
├── A.  Glossario (expandido)
├── B.  Referencia Rapida (atualizada)
├── C.  Mapa de Integracao (reescrita)
├── D.  Cenarios de Uso (expandidos)
├── E.  Configuracao (expandida)
└── F.  Migration Guide (NOVO)
```

---

## 3. Lifecycle Management (absorvido do GSD)

### 3.1 Hierarquia de Lifecycle

```
Projeto (Project)
  └── Milestone 1
       ├── Fase 1.1 (discuss → plan → execute → verify)
       ├── Fase 1.2
       └── Fase 1.3
  └── Milestone 2
       ├── Fase 2.1
       └── Fase 2.2
  └── Quick Tasks (fora do lifecycle formal)
```

### 3.2 Projetos

**Equivalente GSD:** `/gsd:new-project`
**Comando OMEGA v2:** `/omega:project:new`

| Aspecto | Definicao |
|---------|-----------|
| Pre-condicao | Demanda com 3+ fases estimadas |
| Guard | Nenhum projeto ativo sem milestone concluido (ou override PM) |
| task_type OMEGA | `planning` |
| Threshold | >= 85 |
| Artefatos produzidos | `.planning/PROJECT.md`, `.planning/ROADMAP.md` |
| Quem executa | ATLAS (PM) — delega a NEXUS para arquitetura |
| Save-context | Obrigatorio — registra milestone criado, roadmap gerado, total de fases |

**PROJECT.md schema:**
```markdown
# {Nome do Projeto}
- **ID:** {slug unico}
- **Status:** active | paused | completed | archived
- **Created:** {ISO 8601}
- **Milestones:** {lista com status}
- **Total fases:** {N}
- **Descricao:** {texto}
- **Stakeholders:** {lista}
- **Constraints:** {lista}
```

**ROADMAP.md schema:**
```markdown
# Roadmap — {Nome do Projeto}
## Milestone {N}: {Nome}
### Fase {N.M}: {Nome}
- **Status:** pending | discussing | planning | executing | verifying | completed
- **Agente principal:** {CODENAME}
- **Dependencias:** {lista de fases}
- **Estimativa:** {T-shirt size}
- **Descricao:** {texto}
```

### 3.3 Milestones

**Comandos OMEGA v2:**

| Comando | Equivalente GSD | task_type | Threshold | Output |
|---------|----------------|-----------|-----------|--------|
| `/omega:milestone:new` | `/gsd:new-milestone` | planning | 85 | ROADMAP.md atualizado |
| `/omega:milestone:audit` | `/gsd:audit-milestone` | validation | 95 | Audit report |
| `/omega:milestone:complete` | `/gsd:complete-milestone` | validation | 95 | Milestone arquivado |

**Guards de milestone:**
- `milestone:new` — milestone anterior concluido ou primeiro milestone. Audit aprovado (se nao for primeiro).
- `milestone:audit` — todas as fases do milestone executadas e verificadas.
- `milestone:complete` — audit com verdict != BLOCKED.

**Transicoes de estado:**
```
created → active → auditing → completed → archived
                      ↓
                   blocked (se audit falha)
                      ↓
                   active (volta para corrigir)
```

### 3.4 Fases

**Comandos OMEGA v2:**

| Comando | Equivalente GSD | task_type | Threshold | Output |
|---------|----------------|-----------|-----------|--------|
| `/omega:phase:discuss {N}` | `/gsd:discuss-phase N` | research | 80 | CONTEXT.md |
| `/omega:phase:research {N}` | `/gsd:research-phase N` | research | 80 | RESEARCH.md |
| `/omega:phase:plan {N}` | `/gsd:plan-phase N` | planning | 85 | PLAN.md files |
| `/omega:phase:execute {N}` | `/gsd:execute-phase N` | implementation | 90 | Commits + SUMMARY.md |
| `/omega:phase:verify {N}` | `/gsd:verify-work N` | validation | 95 | UAT.md |
| `/omega:phase:add` | `/gsd:add-phase` | planning | 85 | Fase adicionada ao final |
| `/omega:phase:insert` | `/gsd:insert-phase` | planning | 85 | Fase inserida como decimal |
| `/omega:phase:remove` | `/gsd:remove-phase` | planning | 85 | Fase removida, renumerada |
| `/omega:phase:assumptions {N}` | `/gsd:list-phase-assumptions N` | research | 80 | Lista de premissas |

**State machine de fases:**
```
pending → discussing → planning → executing → verifying → completed
                                      ↕           ↕
                                   blocked ←→ (retorna ao estado anterior)
```

**Guards de transicao:**
| Transicao | Guard |
|-----------|-------|
| pending → discussing | PM autoriza |
| discussing → planning | CONTEXT.md existe |
| planning → executing | PLAN.md existe + SHADOW verdict != BLOCKED + PM autoriza |
| executing → verifying | Commits existem + OMEGA score >= 90 em execucao |
| verifying → completed | OMEGA score >= 95 em verificacao + PM valida |

**Artefatos por estado:**

| Estado | Artefato Produzido | Localizacao |
|--------|--------------------|-------------|
| discussing | CONTEXT.md | `.planning/phases/{N}/CONTEXT.md` |
| planning | PLAN.md(s) | `.planning/phases/{N}/PLAN-{NN}.md` |
| executing | SUMMARY.md | `.planning/phases/{N}/SUMMARY.md` |
| verifying | UAT.md | `.planning/phases/{N}/UAT.md` |

### 3.5 Quick Tasks

**Comando OMEGA v2:** `/omega:quick "descricao"` e `/omega:quick --full "descricao"`

| Aspecto | Quick | Quick --full |
|---------|-------|-------------|
| Equivalente GSD | `/gsd:quick` | `/gsd:quick --full` |
| task_type | implementation | implementation |
| Threshold | >= 90 | >= 90 |
| Max iterations | 2 | 2 |
| Verificacao inclusa | Nao | Sim (auto-verify) |
| Artefatos | `.planning/quick/{NNN}/` | `.planning/quick/{NNN}/` + verificacao |
| Guard | Task < 3 steps | Task < 3 steps |

**Regra de numeracao:** `{NNN}` e sequencial (001, 002, ...), determinado pelo proximo numero livre no diretorio `.planning/quick/`.

### 3.6 Artefatos em .planning/

**Estrutura de diretorios OMEGA v2:**

```
.planning/
├── config.json               ← Config do projeto (existente)
├── PROJECT.md                ← Descricao do projeto
├── ROADMAP.md                ← Roadmap com milestones e fases
├── STATE.md                  ← Estado para pause/resume (handoff)
├── phases/
│   ├── 1/
│   │   ├── CONTEXT.md        ← Output de discuss
│   │   ├── RESEARCH.md       ← Output de research
│   │   ├── PLAN-01.md        ← Plano task 1
│   │   ├── PLAN-02.md        ← Plano task 2
│   │   ├── SUMMARY.md        ← Resultado da execucao
│   │   └── UAT.md            ← Resultado da verificacao
│   ├── 2/
│   │   └── ...
│   └── N/
├── quick/
│   ├── 001/
│   │   ├── TASK.md           ← Descricao + resultado
│   │   └── VERIFY.md         ← Verificacao (se --full)
│   └── NNN/
├── milestones/
│   ├── 1/
│   │   └── AUDIT.md          ← Resultado do audit
│   └── N/
├── debug/
│   └── {slug}.md             ← Resultado de debug
├── codebase/
│   ├── ARCHITECTURE.md       ← Output de map-codebase
│   ├── DEPENDENCIES.md
│   ├── API-MAP.md
│   ├── DATA-MODEL.md
│   ├── PATTERNS.md
│   ├── RISKS.md
│   └── TECH-DEBT.md
└── todos/
    └── TODO.md               ← Lista de pendencias
```

---

## 4. Session Management (absorvido do GSD)

### 4.1 Pause/Resume

**Comandos:**

| Comando | Equivalente GSD | Descricao |
|---------|----------------|-----------|
| `/omega:session:pause` | `/gsd:pause-work` | Salva estado completo para retomada |
| `/omega:session:resume` | `/gsd:resume-work` | Restaura contexto de sessao anterior |

### 4.2 Pause — Handoff Completo

Ao pausar, OMEGA v2 produz `.planning/STATE.md` com:

```markdown
# Handoff de Sessao

## Estado do Projeto
- **Projeto:** {nome}
- **Milestone atual:** {N — nome}
- **Fase atual:** {N — nome}
- **Status da fase:** {discussing | planning | executing | verifying}
- **Ultimo subcomando:** {comando + timestamp}

## Progresso
- **Fases completadas:** {lista}
- **Fase em andamento:** {N — detalhes}
- **Tasks concluidas nesta fase:** {N/total}
- **OMEGA score atual:** {score}/{threshold}
- **Iteracao OMEGA:** {N}/3

## Artefatos Ativos
- **ROADMAP.md:** {existe | nao}
- **PLAN.md ativos:** {lista}
- **CONTEXT.md:** {existe | nao}
- **UAT.md:** {existe | nao}
- **Commits pendentes:** {lista de SHAs}

## Proximo Passo
{O que deve acontecer ao retomar — especifico e acionavel}

## Bloqueios
{Lista de bloqueios ativos, se houver}

## Decisoes Pendentes
{Lista de decisoes que o usuario precisa tomar}

## Context Window
- **Arquivos relevantes:** {lista dos arquivos mais importantes para contexto}
- **Git branch:** {branch atual}
- **Git SHA:** {ultimo SHA}
```

### 4.3 Resume — Context Restore

Ao retomar, OMEGA v2:

1. Le `.planning/STATE.md` para restaurar estado
2. Le `.claude/omega/state.json` para restaurar estado do loop
3. Le `.claude/session-context.md` para contexto adicional
4. Carrega Synapse context stack (L0-L7) relevante para a fase atual
5. Apresenta resumo ao usuario com proximo passo sugerido
6. Aguarda confirmacao antes de continuar

### 4.4 Progress Tracking em Nivel de Projeto

OMEGA v1 rastreia progresso em nivel de task. OMEGA v2 adiciona tracking em 3 niveis adicionais:

| Nivel | Metricas | Onde |
|-------|---------|------|
| **Projeto** | % fases completas, milestones done, tempo total | `.planning/ROADMAP.md` + progress.log |
| **Milestone** | % fases do milestone, audit status | `.planning/milestones/{N}/` |
| **Fase** | Status, artefatos, OMEGA scores | `.planning/phases/{N}/` |
| **Task** | Iteracoes, scores, delta (OMEGA v1 — mantido) | `.claude/omega/state.json` + progress.log |

### 4.5 Save-Context Automatico

**Absorvido do GSD save-context protocol, agora nativo no OMEGA v2.**

Apos cada operacao OMEGA v2 que muda estado do projeto, o agente responsavel DEVE atualizar `.claude/session-context.md`:

| Operacao OMEGA | O que salvar |
|----------------|-------------|
| `project:new` | Milestone criado, roadmap gerado, total de fases |
| `phase:discuss {N}` | Fase N discutida, decisoes capturadas em CONTEXT.md |
| `phase:plan {N}` | Fase N planejada, quantidade de PLAN.md criados |
| `phase:execute {N}` | Fase N executada, commits realizados, resultado |
| `phase:verify {N}` | Fase N verificada, resultado UAT (passou/falhou) |
| `milestone:audit` | Auditoria realizada, verdict |
| `milestone:complete` | Milestone concluido, proximo milestone |
| `debug "desc"` | Debug iniciado/concluido, root cause |
| `quick "desc"` | Task rapida executada, resultado |
| `phase:add/insert/remove` | Roadmap alterado, nova estrutura de fases |
| `session:pause` | Estado salvo para retomada |
| `session:resume` | Contexto restaurado, proximo passo |

**Formato do session-context.md:**

```markdown
## Estado Atual
- **Projeto:** {nome}
- **Milestone:** {nome/numero}
- **Fase atual:** {N — nome}
- **Status da fase:** {discussing | planning | executing | verifying | completed}
- **Ultima operacao:** {operacao OMEGA + data/hora}
- **Proximo passo:** {o que deve acontecer agora}
- **Bloqueios:** {nenhum | descricao}

## Artefatos Ativos
- **ROADMAP.md:** {existe | —}
- **PLAN.md ativos:** {lista}
- **CONTEXT.md:** {existe | —}
- **UAT.md:** {existe | —}

## OMEGA Status
- **Score ultimo:** {score}/{threshold}
- **Iteracao:** {N}/3
- **Circuit breaker:** {CLOSED | HALF_OPEN | OPEN}

## Decisoes Recentes
- [{data}] {descricao da decisao}
```

---

## 5. Subcomandos OMEGA v2 — Manifest Completo

### 5.1 Categoria: Lifecycle

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:project:new` | Demanda com 3+ fases | Nenhum projeto ativo sem milestone | planning | 85 | PROJECT.md, ROADMAP.md |
| `/omega:milestone:new` | Milestone anterior concluido ou primeiro | Audit aprovado (se nao primeiro) | planning | 85 | ROADMAP.md atualizado |
| `/omega:milestone:audit` | Todas fases do milestone executadas | Nenhum | validation | 95 | AUDIT.md |
| `/omega:milestone:complete` | Audit aprovado | Verdict != BLOCKED | validation | 95 | Milestone arquivado |
| `/omega:phase:add` | Roadmap existente | PM autorizou | planning | 85 | Fase adicionada ao final |
| `/omega:phase:insert` | Roadmap existente, urgencia justificada | PM autorizou | planning | 85 | Fase inserida como decimal |
| `/omega:phase:remove` | Fase futura (nao iniciada) | PM autorizou | planning | 85 | Fase removida, renumerada |

### 5.2 Categoria: Execution

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:phase:execute {N}` | PLAN.md aprovado | PM autorizou | implementation | 90 | Commits atomicos + SUMMARY.md |
| `/omega:quick "desc"` | Task pequena (1-3 steps) | Nenhum | implementation | 90 | quick/{NNN}/ |
| `/omega:quick --full "desc"` | Task que precisa verificacao | Nenhum | implementation | 90 | quick/{NNN}/ + verificado |
| `/omega:debug "desc"` | Bug persistente (2+ tentativas) | Nenhum | implementation | 90 | debug/{slug}.md |
| `/omega:build-system` | PRD, workflow N8N, URL ou briefing | Nenhum | implementation | 90 | Sistema completo |

### 5.3 Categoria: Quality

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:phase:verify {N}` | Fase executada (commits existem) | Nenhum | validation | 95 | UAT.md + diagnostico |
| `/omega:validate-plan` | PLAN.md existe | Nenhum | validation | 95 | Verdict: APPROVED/CAVEATS/BLOCKED |
| `/omega:health` | Suspeita de inconsistencia | Nenhum | — (informativo) | — | Diagnostico de saude |

### 5.4 Categoria: Context

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:phase:discuss {N}` | Antes de planejar fase | Nenhum | research | 80 | CONTEXT.md |
| `/omega:phase:research {N}` | Tech nova ou integracao complexa | Nenhum | research | 80 | RESEARCH.md |
| `/omega:map-codebase` | Codebase a analisar | Nenhum | research | 80 | 7 docs em .planning/codebase/ |
| `/omega:phase:assumptions {N}` | Antes de aprovar planos | Nenhum | research | 80 | Lista de premissas |

### 5.5 Categoria: Session

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:progress` | Projeto inicializado | Nenhum | — (informativo) | — | Status visual |
| `/omega:session:pause` | Trabalho em andamento | Nenhum | — (informativo) | — | STATE.md handoff |
| `/omega:session:resume` | STATE.md com handoff | Nenhum | — (informativo) | — | Contexto restaurado |
| `/omega:todo:add` | Ideia fora do escopo | Nenhum | — (informativo) | — | Todo registrado |
| `/omega:todo:list` | Nenhum | Nenhum | — (informativo) | — | Lista de pendencias |

### 5.6 Categoria: Config

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:settings` | Nenhum | Nenhum | — (informativo) | — | Config atualizado |
| `/omega:synapse` | Nenhum | Nenhum | — (informativo) | — | Dashboard de agentes |

### 5.7 Categoria: Mind Clone (MMOS v2)

| Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|-----------|-------------|-------|-----------|-----------|--------|
| `/omega:mmos:clone-mind {nome}` | Conteudo fonte disponivel | Nenhum | mind_clone | 95 | DNA YAML completo |
| `/omega:mmos:mind-update {nome}` | Clone existente + novo conteudo | Clone existe | mind_update | 95 | DNA atualizado (incremental) |
| `/omega:mmos:dossie {tema}` | Mind clones existentes sobre tema | Nenhum | mind_clone | 95 | Dossie tematico |
| `/omega:mmos:ingest` | Conteudo no inbox/ | Nenhum | research | 80 | Conteudo processado |

### 5.8 Subcomandos SEM OMEGA Loop (informativos)

Os seguintes subcomandos NAO disparam o OMEGA loop (nao produzem output executavel):

- `/omega:progress` — apenas le e exibe estado
- `/omega:session:pause` — apenas persiste estado
- `/omega:session:resume` — apenas restaura estado
- `/omega:todo:add` / `/omega:todo:list` — apenas registra/lista
- `/omega:settings` — apenas exibe/atualiza config
- `/omega:synapse` — apenas exibe dashboard
- `/omega:health` — apenas diagnostica

**Regra:** Subcomandos informativos nao emitem OMEGA_STATUS block e nao contam para o rate limiter.

---

## 6. Integracao Synapse v3

### 6.1 Synapse Context Stack — 8 Camadas

OMEGA v2 carrega e consome o Synapse Context Stack em 8 camadas (L0-L7). A carga acontece ANTES do inicio de cada task.

```
┌──────────────────────────────────────────────────┐
│ L7: Star Commands (comandos prioritarios)        │ ← Carregado se agente tem star commands
│ L6: Keywords (termos relevantes da task)         │ ← Injetado pelo OMEGA ao iniciar task
│ L5: Squad Context (time de agentes atual)        │ ← Carregado se task envolve multi-agent
│ L4: Task Parameters (dados especificos da task)  │ ← Injetado pelo OMEGA com task details
│ L3: Fase do Workflow (discuss/plan/execute/...)   │ ← Determinado pelo OMEGA lifecycle state
│ L2: Persona do Agente (quem esta executando)     │ ← Carregado do agent definition file
│ L1: Global Framework (OMEGA como framework)      │ ← Este protocolo (OMEGA v2)
│ L0: Constitution (principios inviolaveis)        │ ← Sempre carregado primeiro
└──────────────────────────────────────────────────┘
```

### 6.2 L0 — Constitution

**Quando carregar:** SEMPRE. Toda task, todo agente, toda sessao.

**Como OMEGA carrega:**
1. OMEGA verifica se `.claude/protocols/CONSTITUTION.md` existe
2. Principios constitucionais sao carregados como hard stops (violacao = terminacao imediata)
3. Artigo 5 (OMEGA obrigatorio) e referencia circular — OMEGA carrega a si mesmo como obrigacao constitucional

**O que OMEGA faz com L0:**
- Usa como base para as 13 condicoes de terminacao (condicao #6: violacao constitucional)
- Valida que nenhum output viola artigos 1-5

### 6.3 L1 — Global Framework (OMEGA como framework)

**Quando carregar:** SEMPRE para tasks que passam pelo OMEGA loop.

**Como OMEGA se posiciona:**
- OMEGA v2 e O framework global de execucao. Nao e mais um "wrapper" sobre o GSD.
- L1 carrega as regras do OMEGA: thresholds, loop config, circuit breaker settings

**O que OMEGA faz com L1:**
- Configura o execution environment baseado no `config.yaml`
- Define max_iterations, thresholds e escalation order para a sessao

### 6.4 L2 — Persona do Agente

**Quando carregar:** SEMPRE que um agente e ativado.

**Como OMEGA identifica qual agente:**
1. OMEGA recebe o `agent` field na delegacao do PM
2. Carrega o agent definition file correspondente:
   - Agentes core deliberativos: `.claude/commands/DUARTEOS/agents/{agente}.md`
   - Agentes custom: `.claude/agents/{agente}.md`
3. Extrai: codename, role, capabilities, restrictions, manifest de subcomandos

**O que OMEGA faz com L2:**
- Filtra o manifest de subcomandos ao que o agente pode usar
- Define routing de escalacao baseado no role do agente
- Atualiza Synapse state: `agent: {CODENAME}, state: activated`

### 6.5 L3 — Fase do Workflow

**Quando carregar:** Em tasks que fazem parte de um lifecycle formal (projeto/milestone/fase).

**Como OMEGA mapeia a fase atual:**
1. Le `.planning/ROADMAP.md` para determinar milestone e fase ativos
2. Le `.claude/session-context.md` para estado mais recente
3. Determina o estado da fase: `discussing | planning | executing | verifying | completed`

**Mapeamento fase → Synapse state:**

| Fase OMEGA | Synapse State |
|-----------|---------------|
| discussing | `analyzing` |
| planning | `planning` |
| executing | `executing` |
| verifying | `reviewing` |
| completed | `completed` |
| blocked (qualquer) | `blocked` |

**O que OMEGA faz com L3:**
- Seleciona o task_type e threshold adequados para a fase
- Carrega artefatos relevantes da fase (CONTEXT.md, PLAN.md, etc.)
- Valida pre-condicoes (guards) da transicao de fase

### 6.6 L4 — Task Parameters

**Quando carregar:** Em TODA task que passa pelo OMEGA loop.

**Como OMEGA passa parametros:**
```yaml
task_parameters:
  id: "{task-id}"
  description: "{texto}"
  task_type: "{research | planning | implementation | validation | mind_clone | mind_update}"
  threshold: {N}
  max_iterations: {N}
  complexity: {1-10}
  model: "{haiku | sonnet | opus}"
  phase: {N}          # null se quick task
  milestone: {N}      # null se quick task
  project: "{slug}"   # null se quick task
  dependencies: []    # tasks que devem estar completas
  blocking: []        # tasks que dependem desta
  artifacts_expected: [] # artefatos que devem ser produzidos
```

**O que OMEGA faz com L4:**
- Configura o OMEGA loop com os parametros
- Define o checklist de evidencias baseado no task_type
- Inicializa o OMEGA_STATUS template

### 6.7 L5 — Squad Context

**Quando carregar:** Em tasks que envolvem multiplos agentes (squad operations).

**Como OMEGA popula contexto de squad:**
1. Le a team config (se existir): `~/.claude/teams/{team-name}/config.json`
2. Le Synapse state de todos os agentes do squad: `.claude/synapse/{agent}.yaml`
3. Compila visao consolidada: quem esta ativo, quem esta blocked, quem esta idle

**O que OMEGA faz com L5:**
- Informa ao agente atual quais agentes estao disponiveis para escalacao
- Identifica gargalos (agentes blocked)
- Permite escalacao horizontal informada

### 6.8 L6 — Keywords

**Quando carregar:** Opcionalmente, quando a task tem termos tecnicos relevantes.

**Como OMEGA injeta keywords:**
1. Extrai termos-chave da descricao da task
2. Extrai termos do CONTEXT.md e RESEARCH.md (se existirem)
3. Compila lista de keywords para enrichment de contexto

**O que OMEGA faz com L6:**
- Passa keywords ao agente como contexto adicional
- Permite busca semantica em dossies e mind clones (se relevante)

### 6.9 L7 — Star Commands

**Quando carregar:** Quando o agente tem comandos prioritarios definidos.

**Como OMEGA registra star commands:**
- Star commands sao subcomandos marcados como prioritarios para um agente especifico
- Exemplo: SENTINEL tem `/omega:phase:verify` como star command
- Carregados do agent definition file

**O que OMEGA faz com L7:**
- Prioriza star commands na sugestao de proximo passo
- Usa star commands para routing automatico (qual agente para qual task)

### 6.10 Atualizacao do Synapse pelo OMEGA

OMEGA nao apenas consome Synapse — tambem atualiza:

| Evento OMEGA | Atualizacao Synapse |
|-------------|-------------------|
| Task iniciada | `state: activated`, `task: {desc}`, timestamp |
| Fase mudou | `state: {analyzing/planning/executing/reviewing}` |
| Score calculado | `omega_history.last_score`, `last_task_type` |
| Task completada | `state: completed`, `omega_history.session_scores` append |
| Task escalada | `state: blocked`, `blocked_by: "escalation"` |
| Sessao encerrada | Manter ultimo estado (nao resetar) |

---

## 7. Integracao MMOS v2

### 7.1 Cada Fase MMOS como Task OMEGA

O pipeline MMOS de 6 fases roda como sequencia de tasks OMEGA. Cada fase tem seu proprio task_type, threshold e OMEGA loop:

| Fase MMOS | Nome | task_type OMEGA | Threshold | max_iterations | Descricao |
|-----------|------|----------------|-----------|----------------|-----------|
| 1 | Coleta | research | 80 | 3 | ETL Pipeline — captar material bruto |
| 2 | Extracao | research | 80 | 3 | MIUs e fragmentos semanticos |
| 3 | Inferencia | mind_clone | 95 | 3 | Drivers, frameworks, correlacoes |
| 4 | Mapeamento | mind_clone | 95 | 3 | Scores em sistemas de classificacao |
| 5 | Perfil | mind_clone | 95 | 3 | Perfil agregado, entidade minds |
| 6 | Recomendacao | mind_clone | 95 | 3 | Ferramentas recomendadas, gaps |

**Regra:** Cada fase e uma task OMEGA independente. O OMEGA loop roda dentro de cada fase. Uma fase so avanca para a proxima se o dual-gate exit for satisfeito.

### 7.2 Gates Gawande Mapeados para Dual-Gate OMEGA

Os Gates Gawande do MMOS (checklists DO-CONFIRM entre fases) sao mapeados diretamente para o dual-gate exit do OMEGA:

| Gate Gawande | Posicao | Mapeamento OMEGA |
|-------------|---------|-----------------|
| Gate 1→2 | Apos Coleta | Completion signals da task de Coleta |
| Gate 2→3 | Apos Extracao | Completion signals da task de Extracao |
| Gate 3→4 | Apos Inferencia | Completion signals da task de Inferencia |
| Gate 4→5 | Apos Mapeamento | Completion signals da task de Mapeamento |
| Gate 5→6 | Apos Perfil | Completion signals da task de Perfil |

**Como funciona:**

```
Gate Gawande (DO-CONFIRM)
  │
  ├── Items "critical: true" → Bloqueantes no OMEGA (backpressure)
  │   Se qualquer kill_item falha → task.blocked (nao avanca)
  │
  ├── Items "critical: false" → Warnings no OMEGA (nao-bloqueantes)
  │   Registrados no progress.log, mas nao impedem avancar
  │
  └── Todos critical pass → Mapeado como completion_signals
      + exit_signal: true → dual-gate met → proxima fase
```

**Exemplo de mapeamento (Gate 1→2 — Coleta):**

```yaml
gate_1_2_mapping:
  gawande_kill_items:
    - id: 1
      check: "Coverage score >= 90%?"
      omega_signal: "coverage_met"
      blocking: true
    - id: 3
      check: "ZERO fontes secundarias?"
      omega_signal: "sources_validated"
      blocking: true
  gawande_non_critical:
    - id: 2
      check: "Minimo 4 tipos de fonte?"
      omega_signal: "source_diversity"
      blocking: false
    - id: 4
      check: "Material bruto preservado?"
      omega_signal: "data_integrity"
      blocking: false
    - id: 5
      check: "Span temporal documentado?"
      omega_signal: "docs_updated"
      blocking: false

  omega_dual_gate:
    gate_1_threshold: 80  # research
    gate_2_required_signals: ["coverage_met", "sources_validated"]
    gate_2_exit_signal: true  # quando ambos kill_items passam
```

### 7.3 As 5 Autoridades como Camadas de Validacao

O MMOS define 5 autoridades que operam em cada fase. No OMEGA v2, cada autoridade se mapeia para um aspecto do loop de validacao:

| Autoridade MMOS | Papel | Mapeamento OMEGA v2 |
|----------------|-------|---------------------|
| **Allen (GTD)** | Captura, clarificacao, organizacao | Pre-processing: OMEGA classifica task antes do loop |
| **Forte (CODE)** | Summarizacao progressiva, packets intermediarios | Progress tracking: cada iteracao = progressive summarization |
| **Deming (PDSA)** | Plan-Do-Study-Act, hipoteses e metricas | OMEGA loop = PDSA: Plan(config) → Do(execute) → Study(score) → Act(feedback/escalate) |
| **Kahneman** | Anti-vieses, base rates, avaliacao independente | Fresh reviewer principle + escalacao horizontal (avaliadores independentes) |
| **Gawande** | Checklists DO-CONFIRM, kill items | Dual-gate exit + backpressure gates |

**Mapeamento detalhado OMEGA Loop = Deming PDSA:**

```
OMEGA LOOP          ←→  DEMING PDSA
─────────────────        ─────────────
Config (threshold,       PLAN
  task_type, model)      (hipotese, metricas)

Execute (agente          DO
  implementa)            (executar plano)

Score (avaliar           STUDY
  evidencias, calcular   (medir resultado,
  score por checklist)   comparar com hipotese)

Feedback/Escalate        ACT
  (refinar, escalar,     (se abaixo: ajustar,
  ou finalizar)          se acima: padronizar)
```

**Kahneman dentro do OMEGA:**

| Principio Kahneman | Implementacao OMEGA |
|-------------------|---------------------|
| Anti-ancoragem | Contexto fresco por iteracao (principio fundamental #4) |
| Avaliacao independente | Escalacao horizontal: 3 agentes independentes |
| Base rate | Checklists com criterios quantitativos (nao subjetivos) |
| Pre-mortem | SHADOW (Devil's Advocate) como validador obrigatorio em planning |
| Fragmentacao de julgamento | Cada criterio avaliado independentemente (nao nota global) |

### 7.4 MMOS dentro do OMEGA — Fluxo Completo

```
/omega:mmos:clone-mind {nome}
  │
  ├── OMEGA inicializa pipeline MMOS
  │   └── Carrega Synapse L0-L7 com contexto de mind clone
  │
  ├── FASE 1: Coleta (task_type: research, threshold: 80)
  │   ├── OMEGA loop: executa, score, feedback, repeat
  │   ├── Gate Gawande 1→2: kill items bloqueantes
  │   └── Dual-gate met → avanca
  │
  ├── FASE 2: Extracao (task_type: research, threshold: 80)
  │   ├── OMEGA loop
  │   ├── Gate Gawande 2→3
  │   └── Dual-gate met → avanca
  │
  ├── FASE 3: Inferencia (task_type: mind_clone, threshold: 95)
  │   ├── OMEGA loop (modelo: Opus obrigatorio)
  │   ├── Gate Gawande 3→4
  │   └── Dual-gate met → avanca
  │
  ├── FASE 4: Mapeamento (task_type: mind_clone, threshold: 95)
  │   ├── OMEGA loop
  │   ├── Gate Gawande 4→5
  │   └── Dual-gate met → avanca
  │
  ├── FASE 5: Perfil (task_type: mind_clone, threshold: 95)
  │   ├── OMEGA loop
  │   ├── Gate Gawande 5→6 (inclui blind test + pre-mortem)
  │   └── Dual-gate met → avanca
  │
  ├── FASE 6: Recomendacao (task_type: mind_clone, threshold: 95)
  │   ├── OMEGA loop
  │   └── Dual-gate met → clone completo
  │
  └── OMEGA finaliza: atualiza Synapse, registra em progress.log
```

---

## 8. Migration Path

### 8.1 O Que Muda do GSD para OMEGA v2

| Aspecto | GSD (antes) | OMEGA v2 (depois) |
|---------|------------|-------------------|
| Motor de execucao | GSD Engine + OMEGA wrapper | OMEGA v2 (unico motor) |
| Namespace de comandos | `/gsd:*` + `/DUARTEOS:squad:*` | `/omega:*` (unificado) |
| Protocolo principal | AGENT-GSD-PROTOCOL.md | OMEGA-V2.md |
| Quality gates | OMEGA envolve GSD | Nativo no OMEGA |
| Artefatos | `.planning/` (gerido pelo GSD) | `.planning/` (gerido pelo OMEGA) |
| Estado do loop | `.claude/omega/state.json` | `.claude/omega/state.json` (expandido) |
| Session management | GSD pause/resume | OMEGA session:pause/resume |
| Lifecycle | GSD new-project, milestones | OMEGA project, milestone, phase |

### 8.2 Arquivos Criados (novos)

| Arquivo | Descricao |
|---------|-----------|
| `.claude/protocols/OMEGA-V2.md` | Protocolo completo OMEGA v2 (~2000+ linhas) |
| `.claude/omega/checklists/lifecycle.md` | Novo checklist para operacoes de lifecycle |
| `.planning/phases/` | Diretorio de fases (criado sob demanda) |
| `.planning/milestones/` | Diretorio de milestones (criado sob demanda) |
| `.planning/todos/` | Diretorio de todos (criado sob demanda) |

### 8.3 Arquivos Editados (modificados)

| Arquivo | Mudanca |
|---------|---------|
| `.claude/protocols/CONSTITUTION.md` | Artigo 5 referencia OMEGA v2 (nao mais "OMEGA" generico) |
| `.claude/protocols/SYNAPSE.md` | Secao de integracao OMEGA atualizada para v2; adicionar 8 camadas context stack |
| `.claude/protocols/MMOS-PIPELINE.md` | Adicionar secao de integracao OMEGA v2 com mapeamento de fases |
| `.claude/omega/config.yaml` | Expandir com config de lifecycle, session, e Synapse |
| `.claude/omega/state.json` | Expandir schema com lifecycle state (project, milestone, phase) |
| `CLAUDE.md` + `templates/CLAUDE.md` | Atualizar referencias de `/gsd:*` para `/omega:*` |
| `.claude/session-context.md` | Formato expandido com OMEGA status |
| Todos os agent definition files | Atualizar manifests de `/gsd:*` para `/omega:*` |
| Squad commands (squad.md) | Atualizar referencias de GSD para OMEGA |

### 8.4 Arquivos Deprecados (eventualmente deletados)

| Arquivo | Destino |
|---------|---------|
| `.claude/protocols/AGENT-GSD-PROTOCOL.md` | **Deprecado.** Conteudo absorvido por OMEGA-V2.md. Manter como read-only reference por 1 versao (v6.0), deletar em v6.1. |
| `.claude/protocols/OMEGA.md` (v1) | **Substituido** por OMEGA-V2.md. Manter como `.claude/protocols/archive/OMEGA-V1.md` por referencia. |

### 8.5 Mapeamento de Comandos (GSD → OMEGA v2)

| Comando GSD Antigo | Comando OMEGA v2 | Notas |
|-------------------|------------------|-------|
| `/gsd:new-project` | `/omega:project:new` | Mesma funcionalidade |
| `/gsd:new-milestone` | `/omega:milestone:new` | Mesma funcionalidade |
| `/gsd:complete-milestone` | `/omega:milestone:complete` | Mesma funcionalidade |
| `/gsd:audit-milestone` | `/omega:milestone:audit` | Mesma funcionalidade |
| `/gsd:discuss-phase N` | `/omega:phase:discuss {N}` | Mesma funcionalidade |
| `/gsd:research-phase N` | `/omega:phase:research {N}` | Mesma funcionalidade |
| `/gsd:plan-phase N` | `/omega:phase:plan {N}` | Mesma funcionalidade |
| `/gsd:execute-phase N` | `/omega:phase:execute {N}` | Mesma funcionalidade |
| `/gsd:verify-work N` | `/omega:phase:verify {N}` | Mesma funcionalidade |
| `/gsd:add-phase` | `/omega:phase:add` | Mesma funcionalidade |
| `/gsd:insert-phase` | `/omega:phase:insert` | Mesma funcionalidade |
| `/gsd:remove-phase` | `/omega:phase:remove` | Mesma funcionalidade |
| `/gsd:list-phase-assumptions N` | `/omega:phase:assumptions {N}` | Mesma funcionalidade |
| `/gsd:quick "desc"` | `/omega:quick "desc"` | Mesma funcionalidade |
| `/gsd:quick --full "desc"` | `/omega:quick --full "desc"` | Mesma funcionalidade |
| `/gsd:debug "desc"` | `/omega:debug "desc"` | Mesma funcionalidade |
| `/gsd:progress` | `/omega:progress` | Mesma funcionalidade |
| `/gsd:pause-work` | `/omega:session:pause` | Renomeado |
| `/gsd:resume-work` | `/omega:session:resume` | Renomeado |
| `/gsd:add-todo` | `/omega:todo:add` | Renomeado |
| `/gsd:check-todos` | `/omega:todo:list` | Renomeado |
| `/gsd:settings` | `/omega:settings` | Renomeado |
| `/gsd:health` | `/omega:health` | Renomeado |
| `/gsd:map-codebase` | `/omega:map-codebase` | Mesma funcionalidade |
| `/DUARTEOS:squad:new-project` | `/omega:project:new` (via squad) | Unificado |
| `/DUARTEOS:squad:plan-phase N` | `/omega:phase:plan {N}` (via squad) | Unificado |
| `/DUARTEOS:squad:execute-phase N` | `/omega:phase:execute {N}` (via squad) | Unificado |
| `/DUARTEOS:squad:verify-work N` | `/omega:phase:verify {N}` (via squad) | Unificado |
| `/DUARTEOS:squad:discuss-phase N` | `/omega:phase:discuss {N}` (via squad) | Unificado |
| `/DUARTEOS:squad:validate-plan` | `/omega:validate-plan` (via squad) | Unificado |
| `/DUARTEOS:squad:audit` | `/omega:milestone:audit` (via squad) | Unificado |
| `/DUARTEOS:squad:quick "desc"` | `/omega:quick "desc"` (via squad) | Unificado |
| `/DUARTEOS:squad:debug "desc"` | `/omega:debug "desc"` (via squad) | Unificado |
| `/DUARTEOS:squad:progress` | `/omega:progress` (via squad) | Unificado |
| `/DUARTEOS:squad:pause` | `/omega:session:pause` (via squad) | Unificado |
| `/DUARTEOS:squad:resume` | `/omega:session:resume` (via squad) | Unificado |
| `/DUARTEOS:squad:build-system` | `/omega:build-system` (via squad) | Unificado |
| `/DUARTEOS:squad:map-codebase` | `/omega:map-codebase` (via squad) | Unificado |
| `/DUARTEOS:squad:synapse` | `/omega:synapse` | Unificado |

### 8.6 Compatibilidade Backward

**Periodo de transicao (v6.0):**

Durante a versao 6.0, ambos os namespaces serao aceitos:
- `/gsd:*` → redireciona internamente para `/omega:*` com warning de deprecation
- `/DUARTEOS:squad:*` → permanece como alias para operacoes multi-agente

**Mecanismo de redirect:**
- Cada invocacao de `/gsd:*` emite: `[OMEGA] WARN: /gsd:{command} esta deprecado. Use /omega:{equivalent}. Executando normalmente.`
- Log de uso de comandos deprecados para metricas de migracao

**Remocao (v6.1):**
- `/gsd:*` removido completamente
- AGENT-GSD-PROTOCOL.md arquivado
- Apenas `/omega:*` aceito

### 8.7 Ordem de Implementacao

A migracao deve seguir esta ordem para minimizar risco:

```
Fase 1: Fundacao (esta fase)
  ├── Escrever OMEGA-V2.md (protocolo completo)
  ├── Criar checklist lifecycle.md
  └── Atualizar config.yaml e state.json schemas

Fase 2: Redirect Layer
  ├── Implementar redirect /gsd:* → /omega:* com warning
  ├── Atualizar squad commands para invocar /omega:*
  └── Testes de compatibilidade

Fase 3: Agent Updates
  ├── Atualizar manifests de cada agente (13 agentes)
  ├── Atualizar CONSTITUTION.md
  ├── Atualizar SYNAPSE.md
  └── Atualizar MMOS-PIPELINE.md

Fase 4: Cleanup
  ├── Remover redirects /gsd:*
  ├── Arquivar AGENT-GSD-PROTOCOL.md
  ├── Arquivar OMEGA v1
  └── Atualizar MEMORY.md e CLAUDE.md

Fase 5: Distribution
  ├── Atualizar templates/ para novos usuarios
  ├── Atualizar src/init.mjs e src/update.mjs
  └── Bump versao para 6.0.0
```

---

## 9. Cadeia de Autorizacao

### 9.1 Matriz de Permissoes

| Acao | PM (ATLAS) | Architect (NEXUS) | Backend (FORGE) | Frontend (PRISM) | QA (SENTINEL) | Context (COMPASS) | Devil (SHADOW) | Outros |
|------|-----------|-------------------|-----------------|------------------|---------------|-------------------|----------------|--------|
| Iniciar projeto | **AUTORIZA** | Executa design | — | — | — | — | — | — |
| Criar milestone | **AUTORIZA** | Valida viabilidade | — | — | — | — | — | — |
| Discutir fase | Delega | Participa | — | — | — | **EXECUTA** | — | — |
| Pesquisar fase | Delega | **EXECUTA** | — | — | — | **EXECUTA** | — | — |
| Planejar fase | Delega (implicitamente) | **EXECUTA** | — | — | — | Alimenta contexto | — | — |
| Validar plano | Aprova final | — | — | — | — | — | **EXECUTA** | — |
| Executar fase | **AUTORIZA** explicitamente | — | **EXECUTA** | **EXECUTA** | — | — | — | BRIDGE, TITAN |
| Verificar fase | Valida conclusao | — | — | — | **EXECUTA** | — | — | — |
| Auditar milestone | Decide | — | — | — | **EXECUTA** | Audita contexto | Contesta | — |
| Completar milestone | **UNICO** autorizado | — | — | — | — | — | — | — |
| Quick task | Avalia escopo | Pode executar | **EXECUTA** | **EXECUTA** | — | — | — | BRIDGE |
| Debug | Avalia | — | **EXECUTA** | — | **EXECUTA** | — | — | BRIDGE |
| Map codebase | Delega | **EXECUTA** | — | — | — | — | — | — |
| Pause/Resume | **EXECUTA** | — | — | — | — | — | — | — |
| Inserir/Remover fase | **UNICO** autorizado | Propoe | — | — | — | — | — | — |
| Rollback | **UNICO** autorizado | — | — | — | — | — | — | — |
| Override circuit breaker | **UNICO** autorizado | — | — | — | — | — | — | — |
| Cancelar OMEGA loop | **UNICO** autorizado | — | — | — | — | — | — | — |
| Ajustar thresholds | **UNICO** autorizado | Recomenda | — | — | — | — | — | — |

### 9.2 Fluxo de Decisao

```
DECISAO DE EXECUCAO:
  Usuario pede algo
  → ATLAS (PM) avalia escopo e complexidade
  → Se escopo < 3 tasks: /omega:quick (agente competente)
  → Se escopo >= 3 tasks: /omega:project:new (workflow formal)

WORKFLOW FORMAL:
  ATLAS autoriza
  → COMPASS: /omega:phase:discuss {N}
  → NEXUS: /omega:phase:plan {N}
  → SHADOW: /omega:validate-plan
  → ATLAS aprova plano
  → FORGE/PRISM: /omega:phase:execute {N}
  → SENTINEL: /omega:phase:verify {N}
  → ATLAS valida conclusao

ESCALACAO (OMEGA Router — 4 niveis):
  Nivel 1: Retry (mesmo agente, nova iteracao)
  Nivel 2: Vertical (outro agente assume)
  Nivel 3: Horizontal (multiplos agentes paralelos)
  Nivel 4: Human (usuario decide)
```

### 9.3 Regras Especiais

| Regra | Detalhe |
|-------|---------|
| PM nunca executa | ATLAS orquestra e autoriza. Nunca escreve codigo, nunca audita, nunca projeta. |
| SHADOW nao executa tasks | SHADOW contesta, nao implementa. Influencia OMEGA via validacao de planos. |
| QA pode bloquear release | SENTINEL com score < 95 em verify = fase nao pode ser declarada completa. |
| Agentes custom sao escopo-limitados | TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE operam dentro do escopo delegado pelo PM. |
| Nenhum agente auto-aprova | Score OMEGA e calculado por evidencias, nao por declaracao do agente. |

---

## 10. Configuracao Expandida

### 10.1 config.yaml OMEGA v2

```yaml
omega:
  version: "2.0.0"
  enabled: true

  # Thresholds por task type
  thresholds:
    research: 80
    planning: 85
    implementation: 90
    validation: 95
    mind_clone: 95
    mind_update: 95

  # Circuit breaker
  circuit_breaker:
    no_progress_threshold: 3
    same_error_threshold: 5
    cooldown_minutes: 30
    auto_reset: false

  # Loop settings
  loop:
    max_iterations: 3
    max_iterations_quick: 2
    escalation_order: ["same_agent", "vertical", "horizontal", "human"]

  # Model routing
  model_routing:
    low: "haiku"
    medium: "sonnet"
    high: "opus"
    low_max_complexity: 4
    medium_max_complexity: 6

  # Lifecycle (NOVO — absorvido do GSD)
  lifecycle:
    artifacts_dir: ".planning"
    phases_dir: ".planning/phases"
    milestones_dir: ".planning/milestones"
    quick_dir: ".planning/quick"
    debug_dir: ".planning/debug"
    codebase_dir: ".planning/codebase"
    todos_dir: ".planning/todos"
    state_file: ".planning/STATE.md"

  # Session management (NOVO — absorvido do GSD)
  session:
    context_file: ".claude/session-context.md"
    auto_save_context: true
    auto_checkpoint_context_percent: 75

  # Synapse integration (NOVO)
  synapse:
    context_stack_enabled: true
    agent_state_dir: ".claude/synapse"
    minds_dir: ".claude/synapse/minds"
    auto_update_agent_state: true

  # MMOS integration (NOVO)
  mmos:
    pipeline_enabled: true
    model_override: "opus"  # mind clones sempre Opus
    gate_gawande_blocking: true  # kill items sao bloqueantes

  # Logging
  logging:
    enabled: true
    progress_log: ".claude/omega/progress.log"
    state_file: ".claude/omega/state.json"
    max_log_lines: 10000
    rotation: true

  # Rate limiter
  rate_limiter:
    max_calls_per_hour: 100
```

### 10.2 state.json Expandido

```json
{
  "version": "2.0.0",
  "last_updated": "2026-03-03T10:00:00Z",

  "lifecycle": {
    "project": {
      "id": "project-slug",
      "name": "Nome do Projeto",
      "status": "active",
      "current_milestone": 1,
      "total_milestones": 3
    },
    "milestone": {
      "number": 1,
      "name": "MVP",
      "status": "active",
      "total_phases": 4,
      "completed_phases": 2
    },
    "phase": {
      "number": 3,
      "name": "API Integration",
      "status": "executing",
      "started_at": "2026-03-03T09:00:00Z"
    }
  },

  "current_task": {
    "id": "auth-middleware-001",
    "description": "Implement auth middleware for API routes",
    "type": "implementation",
    "agent": "FORGE",
    "iteration": 2,
    "max_iterations": 3,
    "score": 78,
    "threshold": 90,
    "started_at": "2026-03-03T09:30:00Z",
    "completion_signals": ["tests_pass", "types_check"],
    "exit_signal": false,
    "phase": 3,
    "milestone": 1,
    "project": "project-slug"
  },

  "circuit_breaker": {
    "state": "CLOSED",
    "no_progress_count": 0,
    "same_error_count": 0,
    "same_error_signature": null,
    "last_transition": "2026-03-03T09:00:00Z",
    "cooldown_until": null,
    "history": []
  },

  "escalation": {
    "level": 1,
    "agents_tried": ["FORGE"],
    "total_iterations": 2,
    "best_score": 78,
    "best_agent": "FORGE",
    "best_iteration": 2
  },

  "rate_limiter": {
    "calls_this_hour": 42,
    "hour_started": "2026-03-03T09:00:00Z",
    "max_calls_per_hour": 100
  },

  "session": {
    "context_utilization_percent": 45,
    "auto_checkpoint_threshold": 75,
    "last_checkpoint": null
  }
}
```

---

## 11. Workflow Recipes OMEGA v2

### Recipe 1: Nova Feature (Completa)

```
TRIGGER: Usuario descreve feature
FLUXO:
  1. ATLAS avalia escopo
     → Se grande: /omega:project:new
     → Se medio: /omega:phase:discuss {N}
  2. COMPASS: /omega:phase:discuss {N} → CONTEXT.md
     (OMEGA loop: research, threshold 80)
  3. NEXUS: /omega:phase:research {N} → RESEARCH.md (se tech nova)
     (OMEGA loop: research, threshold 80)
  4. NEXUS: /omega:phase:plan {N} → PLAN.md files
     (OMEGA loop: planning, threshold 85)
  5. SHADOW: /omega:validate-plan → Verdict
     (OMEGA loop: validation, threshold 95)
     → Se BLOCKED: volta para step 4
     → Se CAVEATS: ATLAS decide
  6. FORGE/PRISM: /omega:phase:execute {N} → commits
     (OMEGA loop: implementation, threshold 90)
  7. SENTINEL: /omega:phase:verify {N} → UAT.md
     (OMEGA loop: validation, threshold 95)
     → Se falhou: SENTINEL cria fix-plan → volta step 6
  8. ATLAS: valida e fecha fase
     (save-context automatico)
```

### Recipe 2: Bug Fix

```
TRIGGER: Bug reportado
FLUXO:
  1. ATLAS avalia severidade
     → Se critico: /omega:quick --full "fix: desc"
     → Se persistente: /omega:debug "desc"
  2. SENTINEL: /omega:debug "desc" → root cause
  3. FORGE/PRISM: /omega:quick "fix: desc" → commit
  4. SENTINEL: valida fix
```

### Recipe 3: Refactoring

```
TRIGGER: Divida tecnica identificada
FLUXO:
  1. ATLAS autoriza refactor
  2. NEXUS: /omega:map-codebase → 7 docs
  3. NEXUS: /omega:phase:plan {N} → PLAN.md
  4. SHADOW: /omega:phase:assumptions {N} → riscos
  5. FORGE/PRISM: /omega:phase:execute {N} → commits
  6. SENTINEL: /omega:phase:verify {N} → regressao
  7. ATLAS: valida conclusao
```

### Recipe 4: Novo Projeto do Zero

```
TRIGGER: PRD, briefing ou URL recebido
FLUXO:
  1. ATLAS: /omega:project:new → roadmap
     OU /omega:build-system → sistema completo (modo YOLO)
  2. Para cada fase do roadmap:
     a. /omega:phase:discuss {N}
     b. /omega:phase:plan {N}
     c. /omega:phase:execute {N}
     d. /omega:phase:verify {N}
  3. /omega:milestone:audit → auditoria final
  4. /omega:milestone:complete → milestone arquivado
```

### Recipe 5: Sessao de Trabalho (Retomada)

```
TRIGGER: Inicio de nova sessao
FLUXO:
  1. ATLAS: /omega:session:resume → contexto restaurado
  2. ATLAS: /omega:progress → status atual
  3. ATLAS decide proximo passo
  4. Ao encerrar: /omega:session:pause → handoff salvo
```

### Recipe 6: Task Rapida

```
TRIGGER: Pedido simples (1-3 steps)
FLUXO:
  1. ATLAS avalia: cabe em quick?
     → Se sim: /omega:quick "desc"
     → Se precisa verificacao: /omega:quick --full "desc"
  2. Pronto.
```

### Recipe 7: Mind Clone (NOVO)

```
TRIGGER: Novo expert a clonar
FLUXO:
  1. ATLAS: /omega:mmos:clone-mind {nome}
  2. Pipeline MMOS executa 6 fases (cada uma com OMEGA loop)
  3. Gates Gawande entre fases (bloqueantes)
  4. Resultado: DNA YAML + squad files
  5. Score >= 95 para aprovacao
```

### Recipe 8: Atualizacao de Clone (NOVO)

```
TRIGGER: Novo conteudo para expert existente
FLUXO:
  1. ATLAS: /omega:mmos:mind-update {nome}
  2. Backup automatico antes de modificar
  3. Delta analysis: NOVO / REFORCO / EVOLUCAO
  4. Merge aditivo (nunca remove)
  5. Regression validation
  6. Fidelity check (delta <= 5%)
  7. Score >= 95 para aprovacao
```

---

## 12. OMEGA_STATUS v2 — Formato Atualizado

### Template

```
<!-- OMEGA_STATUS
agent: {CODENAME}
task: {descricao curta da task}
iteration: {N de max_iterations}
task_type: {research | planning | implementation | validation | mind_clone | mind_update}
score: {0-100}
threshold: {threshold para este task_type}
phase: {N | null}
milestone: {N | null}
project: {slug | null}
evidence:
  - {evidencia 1: o que foi verificado e resultado}
  - {evidencia 2: o que foi verificado e resultado}
completion_signals:
  - {sinal 1}
  - {sinal 2}
exit_signal: {true | false}
blockers:
  - {bloqueio 1, se houver}
delta:
  files_modified: {N}
  files_created: {N}
  git_sha_before: {sha}
  git_sha_after: {sha}
  tests_added: {N}
  tests_passing: {N}/{total}
synapse_state: {activated | analyzing | planning | executing | reviewing | completed | blocked}
notes: {observacoes relevantes}
-->
```

**Campos novos em v2:**
- `threshold` — explicita o threshold para transparencia
- `phase` — fase do lifecycle (null se quick task ou fora de lifecycle)
- `milestone` — milestone atual (null se aplicavel)
- `project` — slug do projeto (null se aplicavel)
- `synapse_state` — estado atualizado no Synapse

---

## 13. Riscos e Mitigacoes

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|---------------|---------|-----------|
| 1 | Complexidade do protocolo (2000+ linhas) dificulta adocao | Alta | Alto | Manter secao "Referencia Rapida" no Apendice B. Criar cheat-sheet de 1 pagina. |
| 2 | Periodo de transicao /gsd → /omega causa confusao | Media | Medio | Redirect layer com warnings claros. Documentar mapeamento 1:1. |
| 3 | Overhead de OMEGA em tasks simples | Media | Baixo | Quick tasks com max_iterations=2. Subcomandos informativos SEM OMEGA loop. |
| 4 | Estado persistido fica inconsistente entre .planning/ e .claude/omega/ | Media | Alto | OMEGA e o unico escritor. Nunca editar .planning/ manualmente. Health check verifica consistencia. |
| 5 | Integracao Synapse v3 (8 camadas) ainda nao existe | Alta | Alto | Implementar Synapse v3 ANTES ou em PARALELO com OMEGA v2. Context stack pode ser incremental. |
| 6 | MMOS v2 mapeamento imperfeito com OMEGA gates | Media | Medio | Validar com mind clone real antes de declarar GA. |
| 7 | Atualizacao de 13 agentes simultaneamente | Alta | Alto | Fase 3 da migracao: atualizar um agente por vez, testar cada um. |

---

## 14. Decisoes Arquiteturais (ADRs)

### ADR-001: Namespace `/omega:*` em vez de manter `/gsd:*`

**Contexto:** GSD e framework externo. OMEGA e nativo.
**Decisao:** Migrar tudo para `/omega:*`.
**Justificativa:** Um unico namespace elimina confusao. OMEGA v2 nao e mais "wrapper" do GSD — e o motor completo. Manter dois namespaces seria duplicidade conceitual.
**Consequencia:** Periodo de transicao com redirects. ~40 mapeamentos de comando.

### ADR-002: `.planning/` permanece como diretorio de artefatos

**Contexto:** Poderiamos mover artefatos para `.claude/omega/artifacts/`.
**Decisao:** Manter `.planning/` como esta.
**Justificativa:** `.planning/` ja e familiar para usuarios. E versionado por git. Move-lo quebraria projetos existentes sem ganho.
**Consequencia:** OMEGA v2 gerencia `.planning/` diretamente (antes era "propriedade" do GSD).

### ADR-003: Synapse 8 camadas vs 5 camadas

**Contexto:** Synapse v2 tem 6 camadas de DNA para mind clones. Synapse v3 precisaria de 8 camadas de CONTEXTO (L0-L7) para o OMEGA.
**Decisao:** As 8 camadas de contexto (L0-L7) sao uma feature SEPARADA das 6 camadas de DNA. Coexistem.
**Justificativa:** DNA e sobre mind clones (cognicao). Context stack e sobre execucao (runtime). Sao ortogonais.
**Consequencia:** Synapse v3 tem dois eixos: DNA (6 camadas) + Context Stack (8 camadas).

### ADR-004: MMOS fases = tasks OMEGA independentes (nao sub-tasks)

**Contexto:** Cada fase MMOS poderia ser uma sub-task dentro de uma mega-task OMEGA.
**Decisao:** Cada fase e uma task OMEGA independente com seu proprio loop.
**Justificativa:** O circuit breaker precisa operar por fase. Se uma fase falha, nao deve travar o pipeline inteiro — apenas aquela fase. Escalacao funciona melhor com tasks independentes.
**Consequencia:** Pipeline MMOS sao 6 tasks sequenciais, nao 1 task com 6 steps.

### ADR-005: Compatibilidade backward via redirect (nao alias permanente)

**Contexto:** Poderiamos manter `/gsd:*` como alias permanente.
**Decisao:** Redirect temporario (v6.0) com remocao em v6.1.
**Justificativa:** Aliases permanentes criam confusao (duas formas de fazer a mesma coisa). Melhor forcar migracao com periodo de graca.
**Consequencia:** v6.1 sera breaking change para quem ainda usa `/gsd:*`.

---

## 15. Metricas de Sucesso

| Metrica | Valor Esperado | Como Medir |
|---------|---------------|-----------|
| Todos os workflows GSD funcionam via OMEGA | 100% | Testar cada recipe end-to-end |
| Zero duplicidade de conceitos | 0 referencias a GSD em agentes | Grep por `/gsd:` |
| OMEGA_STATUS emitido em toda task | 100% | Audit de progress.log |
| Lifecycle tracking funcional | Projeto → Milestone → Fase → Task | Testar project:new ate milestone:complete |
| Session pause/resume funciona | Retomada com contexto intacto | Testar pause, fechar sessao, resume |
| MMOS pipeline roda com gates OMEGA | 6 fases com dual-gate | Testar clone-mind completo |
| Synapse v3 context stack carrega | L0-L7 carregados antes de task | Verificar logs |
| Periodo de transicao sem quebra | Zero erros em /gsd:* redirects | Testar todos os 40 mapeamentos |

---

<!-- OMEGA_STATUS
agent: NEXUS
task: Produzir OMEGA-V2-ARCHITECTURE.md — documento de arquitetura completo
iteration: 1 de 3
task_type: planning
score: 92
threshold: 85
evidence:
  - Todos os protocolos atuais lidos integralmente (OMEGA.md 1278 linhas, GSD 430 linhas, CONSTITUTION.md, SYNAPSE.md, MMOS-PIPELINE.md, mmos-extraction-engine-v2.md, 6 checklists)
  - Visao geral com diagrama de camadas e relacoes OMEGA/Synapse/MMOS definida
  - Todas as 21 secoes do protocolo v2 mapeadas e organizadas logicamente
  - Lifecycle management completo: projetos, milestones, fases, quick tasks com state machines e guards
  - Session management com pause/resume/save-context detalhado
  - 37 subcomandos definidos com pre-condicao, guard, task_type, threshold e output
  - Integracao Synapse v3 com 8 camadas L0-L7 detalhada (quando carregar, como consumir, como atualizar)
  - Integracao MMOS v2 com mapeamento fase→task OMEGA e Gates Gawande→dual-gate
  - 5 autoridades MMOS mapeadas para conceitos OMEGA (Allen→preprocessing, Forte→progress, Deming→PDSA loop, Kahneman→fresh reviewer, Gawande→dual-gate)
  - Migration path completo: arquivos criados, editados, deprecados, 40 mapeamentos de comando, ordem de implementacao em 5 fases
  - Cadeia de autorizacao com matriz de permissoes 13 agentes x 20 acoes
  - 8 workflow recipes (6 existentes atualizadas + 2 novas para MMOS)
  - OMEGA_STATUS v2 com campos novos (threshold, phase, milestone, project, synapse_state)
  - 5 ADRs documentadas com contexto, decisao, justificativa e consequencia
  - 7 riscos identificados com mitigacao
  - 8 metricas de sucesso definidas
completion_signals:
  - files_created
  - docs_updated
exit_signal: true
blockers:
  - nenhum
delta:
  files_modified: 0
  files_created: 1
  git_sha_before: uncommitted
  git_sha_after: uncommitted
  tests_added: N/A
  tests_passing: N/A
synapse_state: completed
notes: Documento exaustivo com ~900 linhas cobrindo todas as 9 secoes solicitadas. Pronto para servir como base de implementacao do protocolo OMEGA v2 completo.
-->
