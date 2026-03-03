# SYNAPSE v3 — Motor de Contexto Invisivel do DuarteOS

**Versao:** 3.0.0
**Data:** 2026-03-03
**Autor:** NEXUS (Architect)
**Substitui:** Synapse v2 (repositorio passivo de estado)
**Dependencia:** OMEGA v2 (`.claude/protocols/OMEGA.md`)

---

## Definicao

Synapse v3 e o **Motor de Contexto Invisivel** do ecossistema DuarteOS. Diferente do Synapse v2 (repositorio passivo que armazenava estados), o v3 e um **motor ativo** que compoe, injeta e atualiza contexto automaticamente em cada agente.

### Principio Fundamental: Injecao Automatica

```
"Voce nao precisa explicar o contexto. O SYNAPSE injeta automaticamente,
 garantindo que o agente saiba exatamente onde esta no projeto."
```

O agente que recebe contexto do Synapse **nunca precisa pedir informacao sobre onde esta, o que fazer, ou quais regras seguem**. Tudo ja esta carregado antes da primeira instrucao.

### Relacao com OMEGA v2

```
OMEGA v2 ORQUESTRA execucao e qualidade
    |
    +-- CONSOME contexto do Synapse (L0-L7) antes de cada task
    +-- PRODUZ atualizacoes de estado no Synapse apos cada task
    |
Synapse v3 ALIMENTA contexto e REGISTRA estado
    |
    +-- Compoe as 8 camadas em pacote unico para o agente
    +-- Persiste historico, DNA, e estado de squads
```

**Regra:** OMEGA e o consumidor primario do Synapse. O Synapse nao executa nada — ele monta o contexto que o OMEGA precisa para executar. A definicao completa do contrato OMEGA-Synapse esta em `.claude/protocols/OMEGA.md` Secao 19.

### Dois Eixos do Synapse v3

O Synapse v3 opera em dois eixos ortogonais:

| Eixo | O que e | Camadas | Onde vive |
|------|---------|---------|-----------|
| **Context Stack** | Contexto de execucao injetado no agente | 8 camadas (L0-L7) | Composicao em memoria |
| **DNA** | Identidade cognitiva dos mind clones | 6 camadas (filosofia-paradoxos) | `.claude/synapse/minds/` |

O Context Stack e efemero (montado por task). O DNA e persistente (evolui por ingestao).

---

## 1. As 8 Camadas de Contexto (L0-L7)

O Context Stack e a espinha dorsal do Synapse v3. Sao 8 camadas empilhadas de L0 (base) a L7 (topo), cada uma com papel, fonte e momento de carga distintos.

```
+--------------------------------------------------+
| L7: Star Commands (comandos prioritarios)        | <- Opcional
| L6: Keywords (termos relevantes da task)         | <- Opcional
| L5: Squad Context (time de agentes atual)        | <- Se multi-agent
| L4: Task Parameters (dados especificos da task)  | <- Toda task
| L3: Fase do Workflow (discuss/plan/execute/...)   | <- Se lifecycle formal
| L2: Persona do Agente (quem esta executando)     | <- Sempre
| L1: Global Framework (OMEGA como framework)      | <- Sempre
| L0: Constitution (principios inviolaveis)        | <- Sempre
+--------------------------------------------------+
          |
          v
  [Agente recebe tudo montado]
```

**Regra de prioridade:** L0 nunca e truncado. Se a janela de contexto esta cheia, o Composition Engine remove de cima para baixo (L7 primeiro, L6 depois, etc.). L0-L2 sao obrigatorios e intocaveis.

---

### L0 — Constitution

**O que e:** Os principios inviolaveis do DuarteOS — seguranca, qualidade, etica, processo e OMEGA obrigatorio. Nenhum agente, comando ou configuracao pode viola-los.

**Fonte de dados:**
- `.claude/protocols/CONSTITUTION.md`

**Quando carrega:** SEMPRE. Primeira camada carregada em qualquer sessao, qualquer agente, qualquer task. Sem excecao.

**Como e injetado:** Referencia ao arquivo completo (nao duplica conteudo). O agente le a Constitution na integra como parte do seu boot.

**Quem atualiza:** Somente por decisao unanime do squad completo. Nenhum agente individual tem autoridade.

**Schema:**

```yaml
l0_constitution:
  source: ".claude/protocols/CONSTITUTION.md"
  loaded: true
  articles: [1, 2, 3, 4, 5]       # Seguranca, Qualidade, Etica, Processo, OMEGA
  hard_stops: true                  # Violacao = terminacao imediata
  last_verified: "{YYYY-MM-DDTHH:MM}"
```

**Exemplo:**

```yaml
l0_constitution:
  source: ".claude/protocols/CONSTITUTION.md"
  loaded: true
  articles: [1, 2, 3, 4, 5]
  hard_stops: true
  last_verified: "2026-03-03T14:30"
```

---

### L1 — Global Framework

**O que e:** O framework de execucao ativo (OMEGA v2), stack do projeto e convencoes globais. Define as regras do jogo para toda a sessao.

**Fonte de dados:**
- `.claude/protocols/OMEGA.md` (resumo executivo, nao o documento inteiro)
- `.claude/omega/config.yaml` (thresholds, loop config, circuit breaker)
- `CLAUDE.md` (stack, convencoes)

**Quando carrega:** SEMPRE, logo apos L0. Toda task que passa pelo OMEGA loop.

**Como e injetado:** Resumo executivo compilado com as configuracoes ativas.

**Quem atualiza:** PM (ATLAS) ao mudar framework, stack ou convencoes.

**Schema:**

```yaml
l1_global_framework:
  engine: "OMEGA v2"
  engine_config:
    max_iterations: 3
    escalation_order: ["vertical", "horizontal", "human"]
    circuit_breaker: { threshold: 3, state: "closed" }
  thresholds:
    research: 80
    planning: 85
    implementation: 90
    validation: 95
    mind_clone: 95
  stack:
    language: "TypeScript"
    mode: "strict"
    zero_any: true
  conventions:
    commits: "conventional-commits"
    language_code: "en"
    language_communication: "pt-BR"
    principle: "simplicidade > sofisticacao"
```

**Exemplo:**

```yaml
l1_global_framework:
  engine: "OMEGA v2"
  engine_config:
    max_iterations: 3
    escalation_order: ["vertical", "horizontal", "human"]
    circuit_breaker: { threshold: 3, state: "closed" }
  thresholds:
    research: 80
    planning: 85
    implementation: 90
    validation: 95
    mind_clone: 95
  stack:
    language: "TypeScript"
    mode: "strict"
    zero_any: true
  conventions:
    commits: "conventional-commits"
    language_code: "en"
    language_communication: "pt-BR"
    principle: "simplicidade > sofisticacao"
```

---

### L2 — Persona do Agente

**O que e:** A identidade completa do agente que vai executar: codename, role, capacidades, restricoes, star commands e historico OMEGA.

**Fonte de dados:**
- Agent definition file:
  - Deliberativos: `.claude/commands/DUARTEOS/agents/{agente}.md`
  - Custom: `.claude/agents/{agente}.md`
- Synapse state file: `.claude/synapse/{agente}.yaml`

**Quando carrega:** Ao spawnar/ativar qualquer agente.

**Como e injetado:** Objeto compilado com identidade + estado + historico.

**Quem atualiza:** OMEGA ao mudar estado do agente (activated, blocked, completed).

**Schema:**

```yaml
l2_persona:
  agent_id: "{agent-id}"           # ex: "architect"
  codename: "{CODENAME}"           # ex: "NEXUS"
  role: "{descricao do papel}"     # ex: "Arquiteto de Software"
  definition_file: "{path}"        # path do .md que define o agente
  capabilities:
    - "{capacidade 1}"
    - "{capacidade 2}"
  restrictions:
    - "{restricao 1}"
    - "{restricao 2}"
  star_commands:                   # Comandos prioritarios deste agente
    - "{/comando:1}"
    - "{/comando:2}"
  state:                           # Estado atual do Synapse
    current: "{idle|activated|analyzing|planning|executing|reviewing|blocked|completed}"
    task: "{descricao da task atual}"
    started: "{YYYY-MM-DD}"
    blocked_by: null
  omega_history:                   # Historico de performance OMEGA
    last_score: null
    last_task_type: null
    last_iteration: null
    last_result: null
    needs_attention: false
    session_scores: []             # Ultimas 10 (FIFO)
```

**Exemplo:**

```yaml
l2_persona:
  agent_id: "architect"
  codename: "NEXUS"
  role: "Arquiteto de Software — projeta sistemas, define ADRs, nunca escreve codigo de producao"
  definition_file: ".claude/commands/DUARTEOS/agents/architect.md"
  capabilities:
    - "Projetar arquitetura de sistemas"
    - "Escrever ADRs (Architecture Decision Records)"
    - "Definir schemas e protocolos"
    - "Avaliar trade-offs tecnicos"
  restrictions:
    - "Nao escreve codigo de producao"
    - "Nao faz deploy"
    - "Nao altera configuracoes de infra"
  star_commands:
    - "/omega:phase:plan"
    - "/omega:artifact:adr"
  state:
    current: "activated"
    task: "Projetar Synapse v3"
    started: "2026-03-03"
    blocked_by: null
  omega_history:
    last_score: 92
    last_task_type: "planning"
    last_iteration: 2
    last_result: "completed"
    needs_attention: false
    session_scores:
      - date: "2026-03-03"
        task: "OMEGA v2 Architecture"
        score: 92
        result: "completed"
```

---

### L3 — Fase do Workflow

**O que e:** A posicao atual no lifecycle do projeto — em qual milestone, fase e estado o agente esta operando. Determina QUE TIPO de trabalho e esperado.

**Fonte de dados:**
- `.planning/ROADMAP.md` (milestone e fase ativos)
- `.claude/session-context.md` (estado mais recente da sessao)
- OMEGA lifecycle state

**Quando carrega:** Ao iniciar qualquer task que faz parte de um lifecycle formal (projeto/milestone/fase). Tasks avulsas (quick tasks) recebem L3 com valores null.

**Como e injetado:** Objeto com posicao no lifecycle + resumo da fase anterior.

**Quem atualiza:** OMEGA ao transicionar fases.

**Mapeamento Fase OMEGA para Synapse State:**

| Fase OMEGA | Synapse State | Descricao |
|-----------|---------------|-----------|
| discussing | `analyzing` | Lendo, mapeando, entendendo o problema |
| planning | `planning` | Definindo plano de acao |
| executing | `executing` | Implementando o plano |
| verifying | `reviewing` | Validando resultado |
| completed | `completed` | Task finalizada |
| blocked (qualquer) | `blocked` | Aguardando desbloqueio |

**Schema:**

```yaml
l3_workflow:
  project: "{slug}"                # null se quick task
  milestone: "{N}"                 # null se quick task
  phase: "{N}"                     # null se quick task
  phase_name: "{nome da fase}"     # ex: "Implementacao Core"
  phase_state: "{analyzing|planning|executing|reviewing|completed|blocked}"
  previous_phase_summary: "{resumo da fase anterior}"
  artifacts:                       # Artefatos relevantes da fase
    context: "{path ou null}"      # .planning/phases/{N}/CONTEXT.md
    plan: "{path ou null}"         # .planning/phases/{N}/PLAN.md
    research: "{path ou null}"     # .planning/phases/{N}/RESEARCH.md
```

**Exemplo:**

```yaml
l3_workflow:
  project: "duarteos-core-ai"
  milestone: 6
  phase: 1
  phase_name: "OMEGA v2 + Synapse v3 Integration"
  phase_state: "executing"
  previous_phase_summary: "Fase 0: OMEGA v2 Architecture aprovada, ADRs documentados"
  artifacts:
    context: ".planning/phases/1/CONTEXT.md"
    plan: ".planning/phases/1/PLAN.md"
    research: null
```

---

### L4 — Task Parameters

**O que e:** Os parametros especificos da task que o agente vai executar. Define O QUE fazer, com que qualidade, e quais artefatos produzir.

**Fonte de dados:**
- OMEGA task definition (criada pelo PM ou pelo lifecycle)

**Quando carrega:** Em TODA task que passa pelo OMEGA loop.

**Como e injetado:** Objeto com todos os parametros da task.

**Quem atualiza:** OMEGA ao criar ou modificar task.

**Schema:**

```yaml
l4_task:
  id: "{task-id}"
  description: "{texto descritivo}"
  task_type: "{research|planning|implementation|validation|mind_clone|mind_update}"
  threshold: "{N}"                   # Score minimo para aprovacao
  max_iterations: "{N}"             # Maximo de iteracoes OMEGA loop
  complexity: "{1-10}"              # Complexidade estimada
  model: "{haiku|sonnet|opus}"      # Modelo recomendado
  phase: "{N}"                      # null se quick task
  milestone: "{N}"                  # null se quick task
  project: "{slug}"                 # null se quick task
  dependencies: []                  # Tasks que devem estar completas
  blocking: []                      # Tasks que dependem desta
  artifacts_expected: []            # Artefatos que devem ser produzidos
  inputs: []                        # Artefatos de entrada
  deadline: null                    # ISO date, se houver
```

**Exemplo:**

```yaml
l4_task:
  id: "synapse-v3-protocol"
  description: "Projetar e escrever protocolo Synapse v3 com 8 camadas de contexto"
  task_type: "planning"
  threshold: 85
  max_iterations: 3
  complexity: 8
  model: "opus"
  phase: 1
  milestone: 6
  project: "duarteos-core-ai"
  dependencies: ["omega-v2-architecture"]
  blocking: ["synapse-v3-templates", "synapse-v3-index"]
  artifacts_expected:
    - ".claude/protocols/SYNAPSE.md"
    - ".claude/synapse/template.yaml"
    - ".claude/synapse/squad-template.yaml"
    - ".claude/synapse/minds/_index.yaml"
  inputs:
    - ".claude/protocols/OMEGA.md"
    - ".planning/OMEGA-V2-ARCHITECTURE.md"
  deadline: null
```

---

### L5 — Squad Context

**O que e:** O contexto do time de agentes ativo — quem esta no squad, quem esta fazendo o que, quem esta blocked, quais artefatos sao compartilhados.

**Fonte de dados:**
- Team config: `~/.claude/teams/{team-name}/config.json`
- Synapse state de cada agente: `.claude/synapse/{agent}.yaml`
- Squad state: `.claude/synapse/squads/{squad-id}.yaml` (NOVO)

**Quando carrega:** Em tasks que envolvem multiplos agentes (squad operations).

**Como e injetado:** Visao consolidada do squad com status de cada membro.

**Quem atualiza:** PM (ATLAS) ao configurar squad. OMEGA ao mudar estado dos agentes.

**Schema:**

```yaml
l5_squad:
  squad_id: "{id}"
  category: "{categoria}"           # ex: "implementation", "mind-clone"
  objective: "{descricao do objetivo do squad}"
  members:
    - agent_id: "{id}"
      codename: "{CODENAME}"
      role: "{papel no squad}"
      state: "{idle|activated|analyzing|planning|executing|reviewing|blocked|completed}"
      current_task: "{descricao ou null}"
  active_tasks:
    - id: "{task-id}"
      assignee: "{agent_id}"
      status: "{pending|in_progress|completed|blocked}"
  shared_artifacts:
    - path: "{caminho}"
      type: "{document|code|config}"
      owner: "{agent_id}"
  communication_log:                # Ultimas 5 mensagens
    - from: "{agent_id}"
      to: "{agent_id|broadcast}"
      summary: "{resumo}"
      at: "{timestamp}"
```

**Exemplo:**

```yaml
l5_squad:
  squad_id: "omega-synapse-integration"
  category: "implementation"
  objective: "Implementar OMEGA v2 + Synapse v3 de forma integrada"
  members:
    - agent_id: "architect"
      codename: "NEXUS"
      role: "Arquiteto — projeta protocolos e schemas"
      state: "executing"
      current_task: "Synapse v3 Protocol"
    - agent_id: "backend"
      codename: "FORGE"
      role: "Implementador — escreve codigo de integracao"
      state: "idle"
      current_task: null
    - agent_id: "qa"
      codename: "SENTINEL"
      role: "Validador — verifica coerencia entre protocolos"
      state: "idle"
      current_task: null
  active_tasks:
    - id: "synapse-v3-protocol"
      assignee: "architect"
      status: "in_progress"
  shared_artifacts:
    - path: ".claude/protocols/OMEGA.md"
      type: "document"
      owner: "architect"
  communication_log:
    - from: "pm"
      to: "architect"
      summary: "Delegou Synapse v3 para NEXUS"
      at: "2026-03-03T14:00"
```

---

### L6 — Keywords

**O que e:** Termos tecnicos, nomes de entidade, abreviacoes e vocabulario de dominio relevantes para a task atual. Enrichment de contexto para busca e interpretacao.

**Fonte de dados:**
- Descricao da task (extraidos automaticamente)
- `.planning/phases/{N}/CONTEXT.md` (se existir)
- `.planning/phases/{N}/RESEARCH.md` (se existir)
- Glossario do projeto (se existir)
- Dossies relevantes: `.claude/synapse/dossiers/`

**Quando carrega:** Opcionalmente, quando a task tem termos tecnicos relevantes. Lazy-loaded — so carrega se OMEGA identifica necessidade.

**Como e injetado:** Listas de termos categorizados.

**Quem atualiza:** OMEGA, extraindo automaticamente de artefatos de contexto.

**Schema:**

```yaml
l6_keywords:
  domain_terms:                    # Termos do dominio do negocio
    - term: "{termo}"
      definition: "{definicao curta}"
  technical_terms:                 # Termos tecnicos do stack
    - term: "{termo}"
      definition: "{definicao curta}"
  entity_names:                    # Nomes proprios relevantes
    - "{nome}"
  abbreviations:                   # Siglas e abreviacoes
    - abbr: "{sigla}"
      full: "{nome completo}"
```

**Exemplo:**

```yaml
l6_keywords:
  domain_terms:
    - term: "mind clone"
      definition: "Clone cognitivo de um especialista, armazenado como DNA YAML"
    - term: "dossie"
      definition: "Compilacao tematica cruzando perspectivas de multiplos mind clones"
  technical_terms:
    - term: "Context Stack"
      definition: "As 8 camadas (L0-L7) de contexto montadas pelo Synapse"
    - term: "OMEGA loop"
      definition: "Ciclo de refinamento com ate 3 iteracoes e scoring por evidencia"
  entity_names:
    - "ATLAS"
    - "NEXUS"
    - "FORGE"
  abbreviations:
    - abbr: "MMOS"
      full: "Mind Model Operating System"
    - abbr: "ADR"
      full: "Architecture Decision Record"
```

---

### L7 — Star Commands

**O que e:** Comandos prioritarios para o agente atual no contexto atual. Sao atalhos que o OMEGA sugere como proximos passos baseado no agente e na fase.

**Fonte de dados:**
- Agent definition file (star commands estaticos do agente)
- Fase atual (star commands dinamicos baseados na fase)

**Quando carrega:** Ao spawnar agente, se o agente tem star commands definidos. Lazy-loaded.

**Como e injetado:** Lista de comandos priorizados com descricao contextual.

**Quem atualiza:** OMEGA, com base no agente ativo e na fase atual.

**Schema:**

```yaml
l7_star_commands:
  priority_commands:               # Comandos mais relevantes AGORA
    - command: "{/namespace:comando}"
      reason: "{por que e prioritario neste contexto}"
  available_commands:              # Todos os comandos que o agente pode usar
    - "{/namespace:comando}"
  shortcuts:                       # Atalhos de conveniencia
    - alias: "{curto}"
      expands_to: "{/namespace:comando:completo}"
```

**Exemplo:**

```yaml
l7_star_commands:
  priority_commands:
    - command: "/omega:phase:plan"
      reason: "Fase atual e planning — este e o comando primario"
    - command: "/omega:artifact:adr"
      reason: "Decisoes arquiteturais precisam ser documentadas como ADR"
  available_commands:
    - "/omega:phase:plan"
    - "/omega:phase:execute"
    - "/omega:phase:verify"
    - "/omega:artifact:adr"
    - "/omega:artifact:context"
  shortcuts:
    - alias: "plan"
      expands_to: "/omega:phase:plan"
    - alias: "adr"
      expands_to: "/omega:artifact:adr"
```

---

## 2. Context Composition Engine

O Composition Engine e o algoritmo central do Synapse v3. Ele monta as 8 camadas em um pacote unico de contexto para cada agente.

### 2.1 Algoritmo de Composicao

```
COMPOSE_CONTEXT(agent, task):
  1. context = {}
  2. context.L0 = LOAD_CONSTITUTION()           # SEMPRE — obrigatorio
  3. context.L1 = LOAD_GLOBAL_FRAMEWORK()        # SEMPRE — obrigatorio
  4. context.L2 = LOAD_PERSONA(agent)            # SEMPRE — obrigatorio
  5. context.L3 = LOAD_WORKFLOW_PHASE(task)       # Se lifecycle formal
  6. context.L4 = LOAD_TASK_PARAMS(task)          # SEMPRE em OMEGA loop
  7. IF task.is_multi_agent:
       context.L5 = LOAD_SQUAD(task.squad_id)    # Se squad ativo
  8. IF task.has_domain_terms:
       context.L6 = LOAD_KEYWORDS(task)          # Lazy — so se necessario
  9. IF agent.has_star_commands:
       context.L7 = LOAD_STAR_COMMANDS(agent)    # Lazy — so se definido
  10. context = TRIM_TO_BUDGET(context)           # Respeitar janela
  11. RETURN context
```

### 2.2 Prioridade de Camadas (Budget de Contexto)

A janela de contexto do modelo tem ~200k tokens. O Composition Engine distribui o budget:

| Camada | Prioridade | Budget Maximo | Truncavel? |
|--------|-----------|---------------|------------|
| L0 | CRITICA | ~2k tokens | NAO |
| L1 | CRITICA | ~3k tokens | NAO |
| L2 | CRITICA | ~5k tokens | NAO |
| L3 | ALTA | ~3k tokens | Parcial (resumo) |
| L4 | ALTA | ~2k tokens | NAO |
| L5 | MEDIA | ~5k tokens | SIM (limita membros) |
| L6 | BAIXA | ~2k tokens | SIM (remove termos) |
| L7 | BAIXA | ~1k tokens | SIM (remove atalhos) |
| **Total Stack** | — | **~23k tokens** | — |
| **Restante** | — | **~177k tokens** | Para conteudo da task |

### 2.3 Regra de Trimming

```
TRIM_TO_BUDGET(context):
  total = SUM(size(layer) for layer in context)
  budget = 23000  # tokens reservados para stack

  IF total <= budget:
    RETURN context  # Tudo cabe

  # Remove de cima para baixo
  FOR layer in [L7, L6, L5]:
    IF total > budget:
      context[layer] = TRUNCATE(context[layer])
      total = RECALCULATE(context)

  # L0-L4 nunca sao removidos
  RETURN context
```

### 2.4 Lazy Loading

L5 (Squad), L6 (Keywords) e L7 (Star Commands) usam lazy loading:

- **L5** so carrega se `task.is_multi_agent == true`
- **L6** so carrega se OMEGA identifica termos tecnicos na descricao da task
- **L7** so carrega se o agent definition file tem star commands definidos

Isso economiza ~8k tokens em tasks simples (single agent, sem termos especiais).

---

## 3. State Management

O Synapse v3 gerencia tres tipos de estado persistente: agentes, mind clones e squads.

### 3.1 Agent State Files

**Localizacao:** `.claude/synapse/{agent-id}.yaml`

**Schema completo (v3):**

```yaml
# State file Synapse v3 — Agente {CODENAME}
agent: "{agent-id}"
codename: "{CODENAME}"
role: "{descricao do papel}"
definition_file: "{path do .md}"

# Estado atual
state: "{idle|activated|analyzing|planning|executing|reviewing|blocked|completed}"
task: null                          # Descricao da task atual
started: null                       # ISO date de inicio
last_transition: null               # ISO datetime da ultima transicao
blocked_by: null                    # Motivo do bloqueio, se houver
notes: null                         # Notas livres

# Capacidades e restricoes (extraidos do definition file)
capabilities:
  - "{capacidade}"
restrictions:
  - "{restricao}"

# Star commands do agente
star_commands:
  - "{/comando}"

# Historico de transicoes
transitions:
  - from: "{estado}"
    to: "{estado}"
    at: "{ISO datetime}"
    reason: "{motivo}"

# Historico OMEGA (READ-ONLY para o agente — so OMEGA atualiza)
omega_history:
  last_score: null                  # 0-100
  last_task_type: null              # research|planning|implementation|validation|mind_clone
  last_iteration: null              # 1-3
  last_result: null                 # completed|escalated|circuit_open
  needs_attention: false            # true se 3+ scores abaixo do threshold
  session_scores:                   # Ultimas 10 (FIFO)
    - date: "{YYYY-MM-DD}"
      task: "{descricao}"
      score: "{N}"
      result: "{completed|escalated}"
```

### 3.2 State Machine de Agentes

```
                    +---> analyzing ---> planning ---> executing ---> reviewing ---> completed
                    |                                     |              |               |
idle ---> activated +                                     |              |               |
                    |                                     v              v               |
                    +---> (qualquer estado) <------- blocked <------+                    |
                                                         |                              |
                                                         +-- (retorna ao anterior) --+  |
                                                                                        |
                    completed ---> idle (nova task)  <----------------------------------+
```

**Regras de transicao:**
1. Toda sessao comeca em `idle` -> `activated`
2. `activated` pode ir para `analyzing`, `planning`, `executing` ou `reviewing` diretamente
3. `blocked` pode ocorrer a partir de qualquer estado ativo
4. De `blocked`, retorna ao estado anterior quando desbloqueado
5. `completed` e estado terminal para a task atual — nova task reinicia em `idle`
6. Toda transicao DEVE ser registrada com timestamp e razao
7. Ao encerrar sessao: manter ultimo estado (NAO resetar para idle)

### 3.3 Mind DNA Files

**Localizacao:** `.claude/synapse/minds/{slug}.yaml`

**Schema:** Definido no `mind-template.yaml` (Secao 4).

As 6 camadas cognitivas:

| Camada | Nome | O que captura |
|--------|------|---------------|
| 1 | Filosofia | Crencas fundamentais, visao de mundo, principios inegociaveis |
| 2 | Frameworks | Passos-a-passo, modelos mentais, modelo de decisao |
| 3 | Heuristicas | Regras rapidas, vieses conhecidos, red flags |
| 4 | Metodologias | Processos repetiveis, ferramentas preferidas |
| 5 | Dilemas | Trade-offs, zonas cinza, evolucao de posicao |
| 6 | Paradoxos Produtivos | Contradicoes internas, triggers, resolucoes |

**Compatibilidade:** Mind clones com 5 camadas (sem paradoxos produtivos) sao validos. A camada 6 e adicionada incrementalmente quando fontes suficientes existem.

### 3.4 Squad State Files (NOVO)

**Localizacao:** `.claude/synapse/squads/{squad-id}.yaml`

**Schema completo:**

```yaml
# Squad state Synapse v3
squad_id: "{id}"
category: "{categoria}"
objective: "{descricao}"
created: "{ISO date}"
status: "{active|paused|completed|disbanded}"

# Membros
members:
  - agent_id: "{id}"
    codename: "{CODENAME}"
    role: "{papel no squad}"
    joined: "{ISO date}"

# Tasks do squad
tasks:
  - id: "{task-id}"
    description: "{texto}"
    assignee: "{agent_id}"
    status: "{pending|in_progress|completed|blocked}"
    started: "{ISO datetime}"
    completed: "{ISO datetime ou null}"

# Artefatos compartilhados
shared_artifacts:
  - path: "{caminho}"
    type: "{document|code|config|protocol}"
    owner: "{agent_id}"
    created: "{ISO date}"

# Log de comunicacao (ultimas 20)
communication_log:
  - from: "{agent_id}"
    to: "{agent_id|broadcast}"
    summary: "{resumo curto}"
    at: "{ISO datetime}"

# Metricas
metrics:
  tasks_total: 0
  tasks_completed: 0
  tasks_blocked: 0
  avg_omega_score: null
  started: "{ISO date}"
  last_activity: "{ISO datetime}"
```

### 3.5 Tabela de Transicoes de Estado — Eventos OMEGA

| Evento OMEGA | Atualizacao Synapse |
|-------------|---------------------|
| Task iniciada | `state: activated`, `task: {desc}`, `started: {date}` |
| Fase mudou | `state: {analyzing\|planning\|executing\|reviewing}` |
| Score calculado | `omega_history.last_score`, `omega_history.last_task_type` |
| Task completada | `state: completed`, `omega_history.session_scores` append |
| Task escalada | `state: blocked`, `blocked_by: "escalation"` |
| Sessao encerrada | Manter ultimo estado (nao resetar) |
| Squad criado | Novo arquivo em `squads/{id}.yaml` |
| Squad task atribuida | Atualizar `tasks[]` no squad state |
| Agente adicionado ao squad | Append em `members[]` |

**Regras de registro OMEGA:**
1. Atualizar `omega_history` apos cada task finalizada (completed ou escalated)
2. Manter apenas as ultimas 10 entradas em `session_scores` (FIFO)
3. Se agente fica abaixo do threshold 3+ vezes consecutivas: `needs_attention: true`
4. Scores OMEGA sao READ-ONLY para o agente — apenas o protocolo OMEGA pode atualizar
5. PM (ATLAS) consulta `omega_history` para decisoes de delegacao

---

## 4. Mind Clone DNA

O DNA mental e o eixo persistente do Synapse — a identidade cognitiva dos mind clones que evolui por ingestao de conteudo.

### 4.1 As 6 Camadas do DNA

```
+----------------------------------------------------------+
| 6. Paradoxos Produtivos   | Contradicoes internas        | <- Camada Ouro (35% fidelidade)
| 5. Dilemas                | Trade-offs e evolucao         |
| 4. Metodologias           | Sistemas e processos          |
| 3. Heuristicas            | Regras rapidas e red flags    |
| 2. Frameworks             | Modelos mentais e decisao     |
| 1. Filosofia              | Crencas e principios          | <- Base fundamental
+----------------------------------------------------------+
```

**Camada 1 — Filosofia:** O QUE a pessoa acredita ser verdade. Crencas fundamentais, visao de mundo, principios inegociaveis. Define o "norte" do clone.

**Camada 2 — Frameworks:** COMO a pessoa estrutura pensamento. Passos-a-passo e modelos mentais replicaveis. Se alguem seguir os mesmos passos, chega a conclusoes similares.

**Camada 3 — Heuristicas:** REGRAS DE BOLSO para decisoes rapidas. Atalhos mentais, padroes de reconhecimento, sinais de alerta. O "fast thinking" do expert.

**Camada 4 — Metodologias:** SISTEMAS e processos repetiveis. Diferente de frameworks (modelos mentais), metodologias sao processos operacionais completos.

**Camada 5 — Dilemas:** TENSOES que reconhece e como as resolve. Trade-offs, zonas cinza, evolucao de posicoes. Captura maturidade intelectual.

**Camada 6 — Paradoxos Produtivos:** CONTRADICOES internas que criam comportamento humano. A "camada ouro" da clonagem — 35% do score de fidelidade. Minimo 2 paradoxos, cada um com >= 3 fontes independentes.

### 4.2 mind-template.yaml (Schema Definitivo)

O template completo vive em `.claude/synapse/mind-template.yaml`. Campos-chave:

```yaml
identity:
  name: "{Nome Completo}"
  slug: "{slug-kebab-case}"
  domain: "{Dominio principal}"
  archetype: "{Frase que define a pessoa}"
  clone_file: ".claude/commands/DUARTEOS/{Categoria}/{slug}.md"
  apex_score: null                 # Score APEX da Fase 0 (/60)
  icp_score: null                  # Score ICP da Fase 0 (/10)

filosofia:                         # Camada 1
  crencas_core: []
  visao_de_mundo: ""
  principios_inegociaveis: []

frameworks:                        # Camada 2
  primarios: []
  modelo_decisao: ""

heuristicas:                       # Camada 3
  regras_rapidas: []
  vieses_conhecidos: []
  red_flags: []

metodologias:                      # Camada 4
  processos: []
  ferramentas_preferidas: []

dilemas:                           # Camada 5
  tradeoffs_tipicos: []
  zonas_cinza: []
  evolucao: []

paradoxos_produtivos:              # Camada 6 (opcional, adicionada incrementalmente)
  paradoxos: []
  nota_camada: ""

ingestion_log: []                  # Historico de ingestao

stats:
  total_fontes: 0
  ultima_atualizacao: ""
  versao_dna: 1
  confianca_geral: ""
  fidelidade: null
  apex_score: null
  icp_score: null
```

### 4.3 Integracao com MMOS v2

O pipeline MMOS v2 (`.claude/protocols/OMEGA.md` Secao 20) roda como sequencia de tasks OMEGA. Cada fase MMOS mapeia para uma task OMEGA com tipo e threshold:

| Fase MMOS | task_type OMEGA | Threshold |
|-----------|----------------|-----------|
| 1 - Coleta | research | 80 |
| 2 - Extracao | research | 80 |
| 3 - Inferencia | planning | 85 |
| 4 - Mapeamento | planning | 85 |
| 5 - Validacao | validation | 95 |
| 6 - Recomendacao | mind_clone | 95 |

O resultado final do pipeline MMOS e um arquivo DNA em `.claude/synapse/minds/{slug}.yaml`.

### 4.4 Ingestion Protocol

O protocolo de ingestao define como novas fontes alimentam o DNA existente.

```
INGEST(source, mind_clone):
  1. Identificar mind clone alvo
  2. Ler DNA atual de minds/{slug}.yaml (se existir)
  3. Processar conteudo fonte → extrair insights
  4. Para cada insight:
     a. Classificar em camada destino (1-6)
     b. Verificar duplicidade com insights existentes
     c. Adicionar incrementalmente (Edit, nunca Write)
     d. Registrar source_path para rastreabilidade
  5. Incrementar versao_dna
  6. Adicionar entrada no ingestion_log interno
  7. Registrar em .claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml
  8. Atualizar minds/_index.yaml
```

**Principios da ingestao:**

| Principio | Regra |
|-----------|-------|
| Acumulativo | Cada ingestao ADICIONA, nunca substitui |
| Versionado | `versao_dna` incrementa a cada atualizacao |
| Rastreavel | Todo insight vinculado a fonte via `source_path` |
| Cross-source | Um clone pode ter DNA de multiplas fontes |
| Incremental | Usar Edit, nunca Write, para atualizar DNA existente |

**Cadeia de rastreabilidade:**

```
Mind Clone (DNA YAML) → source_path → inbox/{autor}/{tipo}/{arquivo}.txt
                      → ingestion_log → date + title + source_path
```

### 4.5 Dossiers: Compilacoes Cross-Mind

Dossies sao compilacoes de conhecimento por TEMA, cruzando perspectivas de multiplos mind clones.

**Localizacao:** `.claude/synapse/dossiers/{tema-slug}.yaml`

**Diferenca de DNA:** DNA e por PESSOA. Dossie e por ASSUNTO.

**Template:** `.claude/synapse/dossier-template.yaml`

**Estrutura:**

```yaml
tema: "{nome do tema}"
slug: "{tema-slug}"
descricao: "{cobertura}"
fontes:                            # Quais clones contribuiram
  - mind_clone: "{slug}"
    perspectiva: "{visao}"
    insights_chave: []
consensos:                         # Onde maioria concorda
  - ponto: "{afirmacao}"
    defendido_por: []
divergencias:                      # Onde discordam
  - posicao_a: "{visao A}"
    defendida_por: []
    posicao_b: "{visao B}"
    defendida_por: []
frameworks_combinados:             # Sinteses multi-expert
  - name: "{framework}"
    origem: "{experts}"
    steps: []
recomendacao_consolidada: "{posicao final}"
confianca: "{alta|media|baixa}"
stats:
  total_fontes: 0
  total_insights: 0
  ultima_atualizacao: "{YYYY-MM-DD}"
  versao: 1
```

---

## 5. Indexacao

Indices sao o diretorio do Synapse — permitem busca rapida e inventario sem ler cada arquivo individual.

### 5.1 minds/_index.yaml

**Localizacao:** `.claude/synapse/minds/_index.yaml`

**Schema:**

```yaml
# Indice de Mind Clones — Synapse v3
# Gerado automaticamente. Atualizar apos cada clone-mind ou ingestao.
version: 1
last_updated: "{YYYY-MM-DD}"
total_clones: "{N}"

categories:
  "{Categoria}":
    - slug: "{slug}"
      name: "{Nome Completo}"
      domain: "{dominio}"
      clone_file: ".claude/commands/DUARTEOS/{Categoria}/{slug}.md"
      dna_file: ".claude/synapse/minds/{slug}.yaml"
      versao_dna: "{N}"
      total_fontes: "{N}"
      confianca: "{alta|media|baixa}"
      has_paradoxos: "{true|false}"
      fidelidade: "{N|null}"
      last_updated: "{YYYY-MM-DD}"
```

**Regras de atualizacao:**
1. Atualizar apos cada operacao de clone-mind (criacao ou ingestao)
2. Atualizar apos cada operacao MMOS (pipeline completo)
3. `total_clones` e a soma de todos os slugs em todas as categorias
4. `has_paradoxos: false` indica clone com 5 camadas (sem camada 6)
5. Nao incluir clones em andamento (parciais) — so finalizado com >= 1 fonte

### 5.2 dossiers/_index.yaml

**Localizacao:** `.claude/synapse/dossiers/_index.yaml`

**Schema:**

```yaml
# Indice de Dossies Tematicos — Synapse v3
version: 1
last_updated: "{YYYY-MM-DD}"
total_dossiers: "{N}"

dossiers:
  - slug: "{tema-slug}"
    tema: "{nome do tema}"
    fontes: "{N}"                  # Quantos mind clones contribuiram
    confianca: "{alta|media|baixa}"
    versao: "{N}"
    last_updated: "{YYYY-MM-DD}"
```

### 5.3 squads/_index.yaml (NOVO)

**Localizacao:** `.claude/synapse/squads/_index.yaml`

**Schema:**

```yaml
# Indice de Squads — Synapse v3
version: 1
last_updated: "{YYYY-MM-DD}"
total_squads: "{N}"

squads:
  - squad_id: "{id}"
    category: "{categoria}"
    objective: "{resumo}"
    status: "{active|paused|completed|disbanded}"
    members_count: "{N}"
    tasks_total: "{N}"
    tasks_completed: "{N}"
    created: "{ISO date}"
    last_activity: "{ISO datetime}"
```

---

## 6. Integracao OMEGA v2

O contrato completo OMEGA-Synapse esta em `.claude/protocols/OMEGA.md` Secao 19. Esta secao documenta o resumo operacional.

### 6.1 Eventos OMEGA que Atualizam Synapse

| Evento OMEGA | Atualizacao no Synapse | Arquivo Afetado |
|-------------|------------------------|-----------------|
| Session start | Carregar L0-L7 | Nenhum (leitura) |
| Agent activated | `state: activated` | `synapse/{agent}.yaml` |
| Phase transition | `state: {novo}` | `synapse/{agent}.yaml` |
| Task started | `task: {desc}`, `started: {date}` | `synapse/{agent}.yaml` |
| Score calculated | `omega_history.last_score` | `synapse/{agent}.yaml` |
| Task completed | `state: completed`, append `session_scores` | `synapse/{agent}.yaml` |
| Task escalated | `state: blocked`, `blocked_by: escalation` | `synapse/{agent}.yaml` |
| Squad created | Novo arquivo | `synapse/squads/{id}.yaml` |
| Squad task assigned | Update `tasks[]` | `synapse/squads/{id}.yaml` |
| Mind clone ingested | Update DNA + stats | `synapse/minds/{slug}.yaml` |
| Session ended | Manter ultimo estado | `synapse/{agent}.yaml` |

### 6.2 Consultas Synapse pelo OMEGA

| O que OMEGA Precisa | De Onde Vem | Camada |
|---------------------|-------------|--------|
| Principios inviolaveis | `.claude/protocols/CONSTITUTION.md` | L0 |
| Config do engine | `.claude/omega/config.yaml` | L1 |
| Identidade do agente | Agent definition + `synapse/{agent}.yaml` | L2 |
| Fase do projeto | `.planning/ROADMAP.md` + `session-context.md` | L3 |
| Parametros da task | OMEGA task definition | L4 |
| Estado do squad | `synapse/squads/{id}.yaml` + `synapse/{agent}.yaml` | L5 |
| Termos de dominio | `CONTEXT.md` + `RESEARCH.md` + dossiers | L6 |
| Comandos prioritarios | Agent definition file | L7 |

### 6.3 Fluxo Completo: OMEGA Inicia -> Synapse -> Executa -> Atualiza

```
1. PM delega task ao agente
   |
2. OMEGA recebe delegacao
   |
3. SYNAPSE compoe Context Stack (L0-L7)
   |                                          +--> L0: Constitution
   +-- Composition Engine monta pacote -------+--> L1: Global Framework
                                              +--> L2: Persona
                                              +--> L3: Workflow Phase
                                              +--> L4: Task Params
                                              +--> L5: Squad (se multi-agent)
                                              +--> L6: Keywords (se necessario)
                                              +--> L7: Star Commands (se definido)
   |
4. OMEGA injeta contexto no agente
   |
5. Agente executa (com todo contexto ja carregado)
   |
6. OMEGA avalia resultado (scoring por evidencia)
   |
7. IF score >= threshold:
   |   OMEGA atualiza Synapse: completed + score
   |
8. IF score < threshold AND iteration < max:
   |   OMEGA refina e volta ao passo 5
   |
9. IF score < threshold AND iteration == max:
   |   OMEGA escala e atualiza Synapse: blocked + escalation
   |
10. Synapse persiste estado final
```

---

## 7. Persistencia e Estrutura de Arquivos

### 7.1 Mapa Completo de Diretorios

```
.claude/
  protocols/
    SYNAPSE.md                     <- ESTE DOCUMENTO (protocolo v3)
    OMEGA.md                       <- Motor de execucao e qualidade
    CONSTITUTION.md                <- Principios inviolaveis (L0)

  synapse/
    # === Templates ===
    template.yaml                  <- Template de estado de agente (v3)
    mind-template.yaml             <- Template de DNA de mind clone (6 camadas)
    dossier-template.yaml          <- Template de dossie tematico
    squad-template.yaml            <- Template de estado de squad (NOVO v3)

    # === Estado dos Agentes Core (13) ===
    pm.yaml                        <- ATLAS
    architect.yaml                 <- NEXUS
    backend.yaml                   <- FORGE
    frontend.yaml                  <- PRISM
    qa.yaml                        <- SENTINEL
    context-engineer.yaml          <- COMPASS
    devils-advocate.yaml           <- SHADOW
    system-builder.yaml            <- TITAN
    python-executor.yaml           <- SPARK
    data-scientist.yaml            <- LENS
    devops.yaml                    <- VAULT
    security-auditor.yaml          <- SPECTER
    fullstack.yaml                 <- BRIDGE

    # === Mind Clone DNA (59+) ===
    minds/
      _index.yaml                  <- Inventario de todos os clones
      {slug}.yaml                  <- DNA individual (6 camadas)
      # Ex: larry-page.yaml, andrew-ng.yaml, gary-halbert.yaml

    # === Dossies Tematicos ===
    dossiers/
      _index.yaml                  <- Inventario de dossies
      {tema-slug}.yaml             <- Compilacao por tema

    # === Squads (NOVO v3) ===
    squads/
      _index.yaml                  <- Inventario de squads
      {squad-id}.yaml              <- Estado de cada squad

    # === Log de Ingestao ===
    ingestion/
      {YYYY-MM-DD}-{slug}.yaml     <- Registro de cada ingestao

    # === Documentacao ===
    README.md                      <- Guia rapido do Synapse
```

### 7.2 Convencoes de Nomenclatura

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Agent ID | lowercase, kebab-case | `system-builder` |
| Codename | UPPERCASE | `TITAN` |
| Mind clone slug | lowercase, kebab-case | `larry-page` |
| Squad ID | lowercase, kebab-case | `omega-synapse-integration` |
| Dossie slug | lowercase, kebab-case | `copywriting-para-saas` |
| Categoria | PascalCase | `UX-Design`, `AI`, `Business` |
| Ingestion log | `{YYYY-MM-DD}-{slug}` | `2026-03-03-larry-page` |

### 7.3 Versionamento

| Entidade | Campo de Versao | Semantica |
|----------|----------------|-----------|
| Protocolo Synapse | Header `Versao:` | SemVer (3.0.0) |
| Mind clone DNA | `stats.versao_dna` | Inteiro incremental (1, 2, 3...) |
| Dossie | `stats.versao` | Inteiro incremental |
| Indice minds | `version` | Inteiro incremental |
| Indice dossiers | `version` | Inteiro incremental |
| Indice squads | `version` | Inteiro incremental |
| Squad state | Sem versao (log de atividade) | — |
| Agent state | Sem versao (historico em transitions) | — |

---

## 8. Comandos Relacionados

| Comando | Descricao | Interage com Synapse |
|---------|-----------|---------------------|
| `/DUARTEOS:squad:synapse` | Dashboard de estado de todos os agentes | Le agent states |
| `/DUARTEOS:squad:clone-mind` | Ingestao e geracao/atualizacao de DNA | Escreve minds/ e ingestion/ |
| `/DUARTEOS:squad:ingest` | Inbox/Caixa — ingestao local | Alimenta pipeline de ingestao |
| `/DUARTEOS:squad:dossie` | Compilacao de dossie tematico | Escreve dossiers/ |
| `/DUARTEOS:mmos:mind-clone` | Pipeline MMOS completo (6 fases) | Escreve minds/ |
| `/DUARTEOS:mmos:mind-update` | Atualizacao incremental com rollback | Atualiza minds/ |

---

## 9. Migration Guide: Synapse v2 -> v3

### O que muda

| Aspecto | v2 | v3 |
|---------|----|----|
| **Natureza** | Repositorio passivo de estado | Motor ativo de contexto |
| **Agent state** | 9 campos basicos | 9 + capabilities, restrictions, star_commands, omega_history |
| **Context Stack** | Nao existia | 8 camadas (L0-L7) com composicao automatica |
| **Squads** | Nao existia | Squad state files com schema completo |
| **Indices** | `minds/_index.yaml` mencionado | minds + dossiers + squads com schemas formais |
| **Mind DNA** | 5-6 camadas | 6 camadas (camada 6 opcional, compativel) |
| **Injecao** | Manual (agente pedia) | Automatica (Composition Engine monta) |

### O que e compativel

1. **Mind DNAs existentes (59 clones):** 100% compativeis. Clones com 5 camadas funcionam — camada 6 e adicionada quando fontes permitem.
2. **Agent state files:** Precisam de upgrade para incluir novos campos. O template v3 e superset do v2.
3. **Dossier template:** Sem mudancas. Compativel.
4. **Ingestion logs:** Sem mudancas. Compativeis.

### O que precisa ser criado

1. `.claude/synapse/squad-template.yaml` — Novo template para squads
2. `.claude/synapse/squads/` — Novo diretorio
3. `.claude/synapse/squads/_index.yaml` — Novo indice
4. `.claude/synapse/minds/_index.yaml` — Precisa ser populado com os 59 clones

### Como migrar agent state files

Para cada `{agent}.yaml` existente, adicionar os campos v3:

```yaml
# Campos existentes (manter)
agent: "{id}"
codename: "{CODENAME}"
state: "{estado}"
task: null
started: null
last_transition: null
transitions: []
blocked_by: null
notes: null

# Campos novos v3 (adicionar)
role: "{extrair do definition file}"
definition_file: "{path do .md}"
capabilities: []                   # Extrair do definition file
restrictions: []                   # Extrair do definition file
star_commands: []                  # Definir por agente
omega_history:
  last_score: null
  last_task_type: null
  last_iteration: null
  last_result: null
  needs_attention: false
  session_scores: []
```

---

## Changelog

| Versao | Data | Descricao |
|--------|------|-----------|
| 3.0.0 | 2026-03-03 | Synapse v3 — Motor de Contexto Invisivel. 8 camadas L0-L7, Context Composition Engine, Squad State, indices formais, integracao OMEGA v2 completa. Substitui repositorio passivo v2. |
| 2.0.0 | 2026-03-01 | Synapse v2 — Memoria Incremental. DNA 6 camadas, dossies, ingestion logs, rastreabilidade fonte->DNA. |
| 1.0.0 | 2026-02-24 | Synapse v1 — Monitor de estado basico. States, transitions, agent tracking. |
