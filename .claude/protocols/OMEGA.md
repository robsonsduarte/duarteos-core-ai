# Protocolo OMEGA v2 — Motor Unico de Execucao do DuarteOS

**Versao:** 2.0.0
**Status:** Ativo
**Autor:** NEXUS (Architect)
**Data:** 2026-03-03
**Substitui:** OMEGA v1.0.0 + AGENT-GSD-PROTOCOL v1.2.0
**Dependencias:** CONSTITUTION.md, SYNAPSE.md, QUALITY-GATES.md

---

## Definicao

OMEGA v2 e o **motor unico de execucao** do DuarteOS. Ele unifica duas funcoes que antes eram separadas:

- **OMEGA v1** — motor de qualidade continua (loop de refinamento, circuit breaker, escalation, scoring por evidencia)
- **GSD** — motor de execucao estruturada (lifecycle de projeto, milestones, fases, artefatos em `.planning/`, session management)

A fusao elimina a duplicidade conceitual ("cerebro vs maos") e cria um sistema coeso onde **qualidade e execucao sao inseparaveis** — nao existe execucao sem quality gate, e nao existe quality gate sem execucao rastreada.

```
OMEGA v2 = OMEGA v1 (qualidade) + GSD (execucao) + Synapse v3 (contexto) + MMOS v2 (mind clones)
```

OMEGA nao e um agente. OMEGA e um protocolo que envolve a execucao de todos os agentes. Todo output de todo agente passa pelo crivo OMEGA antes de ser considerado finalizado. Nenhum agente executa workflow complexo fora do OMEGA. Synapse alimenta contexto. MMOS opera como pipeline especializado dentro do OMEGA.

### Arquitetura em Camadas

```
+-----------------------------------------------------------------+
|  USUARIO                                                         |
|  Demanda -> ATLAS (PM) -> Delega                                |
+-----------------------------------------------------------------+
|  OMEGA v2 ENGINE                                                 |
|                                                                  |
|  +----------------------------------------------------------+   |
|  |  LIFECYCLE LAYER (absorvido do GSD)                       |   |
|  |  Projetos -> Milestones -> Fases -> Tasks                 |   |
|  |  .planning/ artefatos rastreados                          |   |
|  +----------------------------------------------------------+   |
|  |  EXECUTION LAYER (core OMEGA)                             |   |
|  |  Loop -> Score -> Threshold -> Feedback -> Repeat         |   |
|  |  Circuit Breaker, Escalation, Backpressure                |   |
|  +----------------------------------------------------------+   |
|  |  QUALITY LAYER (quality gates + checklists)               |   |
|  |  6 task_types x thresholds x evidencias                   |   |
|  |  Dual-Gate Exit, Completion Signals                       |   |
|  +----------------------------------------------------------+   |
|  |  CONTEXT LAYER (Synapse v3 integration)                   |   |
|  |  L0-L7 Context Stack, Agent State, DNA Memory             |   |
|  +----------------------------------------------------------+   |
|  |  MIND CLONE LAYER (MMOS v2 integration)                   |   |
|  |  6 Fases Pipeline, 5 Autoridades, Gates Gawande           |   |
|  +----------------------------------------------------------+   |
|                                                                  |
+-----------------------------------------------------------------+
|  AGENTES (executam DENTRO do OMEGA Engine)                       |
|  ATLAS, NEXUS, FORGE, PRISM, SENTINEL, COMPASS,                |
|  SHADOW, TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE            |
+-----------------------------------------------------------------+
|  PERSISTENCIA                                                    |
|  .planning/ (lifecycle)  .claude/omega/ (engine state)          |
|  .claude/synapse/ (context) .claude/session-context.md          |
+-----------------------------------------------------------------+
```

### Relacao OMEGA <-> Synapse <-> MMOS

```
OMEGA v2 -------- ORQUESTRA ----------> Tudo
    |                                      |
    +-- Synapse v3: CONSOME contexto       |
    |   (L0-L7 stack carregado por OMEGA   |
    |    antes de cada task)               |
    |                                      |
    +-- Synapse v3: PRODUZ estado          |
    |   (OMEGA atualiza agent state        |
    |    e omega_history no Synapse)       |
    |                                      |
    +-- MMOS v2: EXECUTA dentro de OMEGA   |
        (cada fase MMOS = task OMEGA       |
         com task_type e threshold)        |
                                           |
Synapse v3 <- MEMORIA VIVA do sistema     |
    +-- 8 camadas de contexto (L0-L7)     |
    +-- Agent state tracking               |
    +-- Mind clone DNA storage             |
                                           |
MMOS v2 <- PIPELINE de mind clones        |
    +-- 6 fases com Gates Gawande          |
    +-- 5 autoridades (Allen, Forte,       |
        Deming, Kahneman, Gawande)         |
    +-- Cada fase = task OMEGA             |
```

---

## Principios Fundamentais

1. **Nenhuma task e concluida sem validacao OMEGA.** Nao importa o agente, nao importa a complexidade — o loop roda.
2. **Evidencia sobre auto-relato.** Scores de qualidade sao calculados com base em evidencias verificaveis, nao na afirmacao do agente de que "esta bom".
3. **Escalacao e normal, nao falha.** Escalar ao humano ou a outro agente e o comportamento correto quando o threshold nao e atingido. Nao e erro.
4. **Contexto fresco por iteracao.** Cada iteracao do loop de refinamento opera com contexto revisado, evitando vieses de ancoragem.
5. **Transparencia total.** Todo score, toda decisao, toda escalacao e registrada em log append-only.
6. **Qualidade e execucao sao inseparaveis.** Nao existe execucao sem quality gate, e nao existe quality gate sem execucao rastreada.
7. **Um unico motor.** Todo workflow do DuarteOS — de quick tasks a projetos completos, de codigo a mind clones — passa pelo OMEGA v2. Nao ha motor de execucao paralelo.

---

## 1. OMEGA Core Loop

### Algoritmo Principal

```
OMEGA_LOOP(task, agent, lifecycle_context):
  iteration = 0
  max_iterations = config.loop.max_iterations  // padrao: 3
  status = RUNNING

  // Carregar contexto Synapse (L0-L7) antes de iniciar
  synapse_context = load_synapse_stack(task, agent)

  // Registrar inicio no Synapse
  update_synapse_state(agent, "activated", task)

  WHILE iteration < max_iterations AND status == RUNNING:
    iteration += 1

    // 1. Agente executa a task com contexto enriquecido
    output = agent.execute(task, synapse_context, lifecycle_context)

    // 2. Agente emite OMEGA_STATUS block
    omega_status = agent.emit_omega_status(output)

    // 3. Calcular score baseado em evidencias
    score = evaluate_evidence(output, task.type)

    // 4. Registrar no progress log
    append_progress(task, iteration, score, omega_status)

    // 5. Atualizar Synapse com score
    update_synapse_omega_history(agent, score, task.type)

    // 6. Verificar exit conditions (dual-gate)
    IF dual_gate_met(omega_status, score, task.type):
      status = COMPLETED
      update_synapse_state(agent, "completed", task)
      BREAK

    // 7. Verificar circuit breaker
    IF circuit_breaker.state == OPEN:
      status = CIRCUIT_OPEN
      update_synapse_state(agent, "blocked", task)
      BREAK

    // 8. Feedback para proxima iteracao
    feedback = generate_refinement_feedback(output, score, task.type)
    task.context = task.context + feedback

  // 9. Pos-loop: decidir destino
  IF status == COMPLETED:
    finalize(task, output, score)
    save_context(task, lifecycle_context)  // checkpoint automatico
  ELSE:
    escalate(task, iteration, score)

  // 10. Atualizar state.json
  persist_state(task, status, score)
```

> **Excecao:** O subcomando `/omega:quick` usa `max_iterations = 2` (configuravel em `config.loop.max_iterations_quick`) para manter velocidade.

### Como OMEGA Envolve Toda Execucao

OMEGA nao e invocado separadamente. Ele e o wrapper implicito de toda task delegada por ATLAS (PM) ou executada por qualquer agente. O fluxo real e:

```
+----------------------------------------------------------+
|  ATLAS delega task ao agente                              |
|    |                                                      |
|    v                                                      |
|  +------------------------------------------------------+ |
|  |  OMEGA LOOP                                           | |
|  |                                                       | |
|  |  Iteracao 1: Agente executa -> Score -> Threshold?    | |
|  |    | NAO                                   | SIM      | |
|  |    v                                       v          | |
|  |  Iteracao 2: Feedback -> Re-executa -> Score -> ?     | |
|  |    | NAO                              | SIM           | |
|  |    v                                  v               | |
|  |  Iteracao 3: Feedback -> Re-executa -> Score -> ?     | |
|  |    | NAO                              | SIM           | |
|  |    v                                  v               | |
|  |  ESCALACAO                        COMPLETED           | |
|  +------------------------------------------------------+ |
|    |                                     |                |
|    v                                     v                |
|  Router de Escalacao              Output finalizado       |
+----------------------------------------------------------+
```

### OMEGA_STATUS Block

Todo agente DEVE emitir um bloco OMEGA_STATUS no final de TODA resposta que envolva execucao de task. Este bloco e o contrato entre o agente e o protocolo OMEGA.

Formato obrigatorio (v2):

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

> **Valores default:** Quando `git_sha_before`/`git_sha_after` nao estao disponiveis (codigo nao commitado), use `"uncommitted"`. Quando `tests_added`/`tests_passing` nao se aplicam (task sem testes), use `"N/A"`.

Regras do OMEGA_STATUS:
- **Obrigatorio** em toda resposta de execucao. Omitir o bloco e violacao do protocolo (Constitution Art. 5.1).
- **Posicao:** sempre no final da resposta, apos todo o conteudo.
- **Score deve ser justificado** pelas evidencias listadas. Score sem evidencia = 0.
- **exit_signal** so pode ser `true` se o agente genuinamente acredita que a task esta concluida.
- **Formato HTML comment** para nao poluir output visivel, mas ser parseavel.

### Dual-Gate Exit (Condicao de Saida)

Para uma task ser considerada COMPLETA, ambos os gates devem ser satisfeitos simultaneamente:

**Gate 1 — Score Threshold:**
O score calculado por evidencias deve atingir ou superar o threshold do tipo de task (ver secao 2).

**Gate 2 — Completion Signals:**
Pelo menos 2 sinais de completude devem estar presentes no `completion_signals`, E o campo `exit_signal` deve ser `true`.

Sinais de completude validos:

| Sinal | Descricao | Verificacao |
|-------|-----------|-------------|
| `tests_pass` | Todos os testes passam | `npm test` ou equivalente |
| `lint_clean` | Zero erros de linter | `eslint` / `biome` |
| `types_check` | TypeScript compila sem erros | `tsc --noEmit` |
| `files_created` | Arquivos esperados existem | Verificacao de filesystem |
| `coverage_met` | Cobertura de testes atinge threshold | Coverage report |
| `build_success` | Build completa sem erros | `npm run build` |
| `no_regressions` | Testes existentes continuam passando | Test suite completa |
| `docs_updated` | Documentacao atualizada conforme mudancas | Verificacao manual |
| `schema_valid` | YAML/JSON valida contra schema | Validador |
| `fidelity_check` | Fidelidade do mind clone verificada | Protocolo MMOS |
| `security_clear` | Sem vulnerabilidades introduzidas | Security gate |
| `incremental_edit` | Apenas trechos necessarios foram editados | Diff analysis |
| `plan_approved` | Plano validado pelo Devil's Advocate | SHADOW verdict |
| `context_captured` | CONTEXT.md gerado com decisoes | Verificacao de arquivo |
| `artifacts_complete` | Todos artefatos esperados gerados | Verificacao .planning/ |

Logica de saida:

```
dual_gate_met(omega_status, score, task_type):
  gate_1 = score >= THRESHOLDS[task_type]
  gate_2 = len(omega_status.completion_signals) >= 2
           AND omega_status.exit_signal == true
  RETURN gate_1 AND gate_2
```

Se Gate 1 passa mas Gate 2 falha: agente deve listar sinais faltantes e tentar obte-los.
Se Gate 2 passa mas Gate 1 falha: agente deve identificar evidencias faltantes para aumentar score.
Se ambos falham: proxima iteracao com feedback especifico.

---

## 2. Quality Gates — Thresholds por Tipo de Task

### Tabela de Thresholds

| Tipo de Task | Threshold Minimo | Descricao | Exemplos |
|-------------|-----------------|-----------|----------|
| `research` | 80 | Pesquisa, analise, mapeamento | map-codebase, phase:discuss, phase:research, mmos:ingest |
| `planning` | 85 | Planejamento, design, arquitetura | phase:plan, project:new, milestone:new, phase:add/insert/remove |
| `implementation` | 90 | Codigo, configs, infraestrutura | phase:execute, quick, debug, build-system |
| `validation` | 95 | Testes, QA, auditoria, verificacao | phase:verify, milestone:audit, validate-plan |
| `mind_clone` | 95 | Clonagem mental, DNA, dossies | mmos:clone-mind, mmos:dossie |
| `mind_update` | 95 | Atualizacao incremental de DNA Synapse | mmos:mind-update |

### Calculo de Score por Evidencia

O score NAO e auto-declarado pelo agente. E calculado com base em evidencias verificaveis. Cada tipo de task tem um checklist de evidencias com peso.

> **Nota:** Os criterios e pesos abaixo sao referencia resumida. A **fonte de verdade** para cada task_type e o arquivo de checklist correspondente em `.claude/omega/checklists/{task_type}.md`. Em caso de divergencia, o checklist prevalece.

#### Research (threshold: 80)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| Fontes consultadas (>= 10 distintas) | 15 | Multiplas fontes verificaveis |
| Diversidade de fontes (>= 3 tipos) | 15 | Livros, entrevistas, artigos, talks, podcasts, papers |
| Fontes primarias (>= 40%) | 15 | Conteudo original do sujeito |
| Triangulacao por topico (>= 3 fontes/claim) | 15 | Fontes independentes por afirmacao |
| Qualidade das citacoes | 15 | Autor, data e localizador em cada fonte |
| Zero dados fabricados | 15 | Todo fato rastreavel a fonte citada |
| Cobertura completa do escopo | 10 | Todos subtopicos do brief cobertos |

#### Planning (threshold: 85)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| Objetivo claro e mensuravel | 15 | Unico, sem ambiguidade |
| Tasks atomicas e verificaveis | 15 | Cada task com deliverable unico e "done" definido |
| Dependencias mapeadas (DAG) | 15 | blockedBy/blocks explicitos, sem ciclos |
| Riscos identificados (>= 3) | 15 | Com likelihood, impact e mitigation |
| Rollback definido | 10 | Para cada step destrutivo |
| Criterios de sucesso quantitativos | 15 | Numeros e thresholds, nao qualitativo |
| Estimativas razoaveis | 15 | T-shirt sizes ou ranges por task |

#### Implementation (threshold: 90)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| TypeScript strict (zero `any`) | 15 | `strict: true`, sem `as any` |
| Testes passam | 15 | Exit code 0 |
| Coverage >= 80% | 10 | Para arquivos modificados/novos |
| Sem vulnerabilidades OWASP top 10 | 10 | Injection, XSS, CSRF verificados |
| Sem secrets hardcoded | 10 | Nenhuma key/token em source |
| Sem console.log/debugger | 5 | Exceto logging utilities |
| Sem TODO/FIXME sem issue ref | 5 | `TODO(#123)` obrigatorio |
| Convencoes do projeto seguidas | 15 | Conventional Commits, ingles para codigo |
| Desenvolvimento incremental (Edit > Write) | 15 | Sem reescrita desnecessaria |

#### Validation (threshold: 95)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| Todas categorias de teste cobertas | 20 | Unit, integration, edge-case (ou surface/medium/deep/paradox para clones) |
| Comparacao com ground truth | 15 | Quando disponivel, deltas documentados |
| Calculo de score documentado | 15 | Formula, pesos e thresholds explicitos |
| Edge cases testados (>= 5) | 20 | Empty, max, unicode, concurrent, malformed |
| Regressao verificada | 15 | Testes anteriores continuam passando |
| Resultados reproduziveis | 15 | Consistentes em execucoes repetidas |

#### Mind Clone (threshold: 95)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| Fase 1 — Coleta: >= 20 fontes primarias | 10 | Todos tipos representados |
| Fase 2 — Extracao: fragmentos semanticos | 10 | Context, timestamps, source refs preservados |
| Fase 3 — Validacao comportamental | 10 | Contradicoes mapeadas com evidencia |
| Fase 3.5 — Synapse Sync: 6 camadas DNA | 10 | Todas preenchidas com source_path |
| Fase 4 — Inferencia: drivers e frameworks | 10 | Calculados por evidencia, YAML files |
| Fase 5 — System Components: 4 artefatos | 15 | Cognitive profile, behavioral model, linguistic fingerprint, narrative voice |
| Fase 6 — PRD: APEX score calculado | 10 | PRD gerado, todo list criado |
| Fase 7 — QA: self-test executado | 10 | Fidelidade >= 95%, YAML valido |
| Agent signature em todo output | 5 | Assinatura presente em cada arquivo |
| Diretorios do squad populados | 10 | Nenhum diretorio vazio |

#### Mind Update (threshold: 95)

| Evidencia | Peso | Criterio |
|-----------|------|----------|
| Backup criado antes de mudancas | 15 | Completo e restauravel |
| Delta analysis completa | 20 | NOVO/REFORCO/EVOLUCAO com justificativa |
| Merge aditivo (nunca remove) | 20 | Nenhum dado existente deletado |
| Diretorios do squad atualizados | 15 | Refletem novos dados |
| Regressao validada | 15 | Testes anteriores passam |
| Fidelidade nao caiu > 5% | 15 | Auto-rollback se delta > 5% |

### Regras de Scoring

1. **Score = soma dos pesos das evidencias CUMPRIDAS.** Evidencia nao verificavel = 0 pontos.
2. **Evidencia parcial = metade do peso.** Ex: 3 de 5 testes passam = metade do peso de "testes passam".
3. **Evidencia fabricada = violacao constitucional.** Artigo 3.1 — nenhum output enganoso.
4. **Agente pode contestar score** na proxima iteracao com novas evidencias.
5. **Score de iteracao anterior nao se acumula.** Cada iteracao e avaliada independentemente.

---

## 3. Circuit Breaker

### Modelo de 3 Estados

O circuit breaker protege contra loops infinitos, thrashing (mesma mudanca indo e voltando) e desperdicio de recursos. Opera com 3 estados:

```
                   2 no-progress consecutivos
  +--------+  ---------------------------------->  +-------------+
  | CLOSED |                                       |  HALF_OPEN  |
  | (normal)|  <----------------------------------  | (cautela)   |
  +--------+     progresso detectado               +-------------+
                                                          |
                                              3 no-progress total
                                              OU 5 same-error
                                                          |
                                                          v
                                                   +----------+
                                                   |   OPEN   |
                                                   | (parado) |
                                                   +----------+
                                                          |
                                                   30min cooldown
                                                          |
                                                          v
                                                   +-------------+
                                                   |  HALF_OPEN  |
                                                   | (re-tentativa)|
                                                   +-------------+
```

### Definicoes

**No-progress:** Uma iteracao onde:
- O score nao aumentou em relacao a iteracao anterior
- Nenhum arquivo foi modificado (delta.files_modified == 0)
- O git SHA nao mudou (delta.git_sha_before == delta.git_sha_after)

**Same-error:** O mesmo erro aparece em 2+ iteracoes consecutivas (mesma mensagem, mesmo arquivo, mesma linha).

**Thrashing:** Alternar entre dois estados sem convergir. Detectado quando iteracao N desfaz o que iteracao N-1 fez.

### Transicoes

| De | Para | Condicao | Acao |
|----|------|----------|------|
| CLOSED | HALF_OPEN | 2 iteracoes consecutivas sem progresso | Log warning. Proxima iteracao e a ultima chance. |
| HALF_OPEN | CLOSED | Progresso detectado na proxima iteracao | Reset contador. Continua normalmente. |
| HALF_OPEN | OPEN | 3 no-progress total OU 5 same-error OU thrashing detectado | PARA execucao. Escala imediatamente. |
| OPEN | HALF_OPEN | 30 minutos de cooldown transcorridos | Permite UMA nova tentativa. |

### Persistencia de Estado

O estado do circuit breaker e persistido em `.claude/omega/state.json`:

```json
{
  "circuit_breaker": {
    "state": "CLOSED",
    "no_progress_count": 0,
    "same_error_count": 0,
    "same_error_signature": null,
    "last_transition": "2026-03-03T14:30:00Z",
    "cooldown_until": null,
    "history": [
      {
        "from": "CLOSED",
        "to": "HALF_OPEN",
        "at": "2026-03-03T14:25:00Z",
        "reason": "2 consecutive no-progress on task: implement auth middleware",
        "task_id": "auth-middleware-001"
      }
    ]
  }
}
```

### 13 Condicoes de Terminacao

Alem do circuit breaker, OMEGA encerra o loop se qualquer destas condicoes for verdadeira:

| # | Condicao | Tipo | Acao |
|---|---------|------|------|
| 1 | Score >= threshold | Sucesso | Finalizar task |
| 2 | Max iterations atingido (3) | Limite | Escalar |
| 3 | Circuit breaker OPEN | Protecao | Escalar com cooldown |
| 4 | Stale loop (mesmo output 2x) | Thrashing | Escalar com diagnostico |
| 5 | Same error 5x | Bug sistematico | Escalar a agente diferente |
| 6 | Violacao constitucional detectada | Seguranca | PARAR. Reportar a ATLAS. |
| 7 | Context utilization >= 75% | Recurso | Auto-checkpoint e escalar |
| 8 | Dependencia externa bloqueante | Bloqueio | Marcar blocked, notificar PM |
| 9 | Agente reporta impossibilidade | Honestidade | Escalar com justificativa |
| 10 | Rate limit atingido (100 calls/hora) | Protecao | Cooldown automatico |
| 11 | Conflito entre agentes | Deadlock | PM (ATLAS) arbitra |
| 12 | Task cancelada pelo usuario | Manual | Abort limpo com log |
| 13 | Custo acumulado excede budget | Recurso | Parar, reportar ao usuario |

> **Nota sobre `/omega:quick`:** Com `max_iterations = 2`, o circuit breaker nao atinge estado OPEN durante execucao de tasks quick. A protecao contra loops travados neste subcomando e o proprio limite de iteracoes, nao o circuit breaker.

---

## 4. Escalation Router

### Fluxo de Escalacao

Quando OMEGA determina que o agente atual nao consegue atingir o threshold, a escalacao segue 4 niveis progressivos:

```
Nivel 1: RETRY (mesma agent, nova iteracao)
  | falhou apos max_iterations
  v
Nivel 2: VERTICAL (outro agente assume)
  | outro agente tambem nao resolve
  v
Nivel 3: HORIZONTAL (multiplos agentes em paralelo)
  | nenhum agente resolve
  v
Nivel 4: HUMAN (usuario decide)
```

### Nivel 1 — Retry (Mesma Agente)

- **Quando:** Iteracoes 1, 2 e 3 do OMEGA loop
- **O que acontece:** O agente recebe feedback especifico sobre o que falta para atingir o threshold
- **Contexto:** Cada iteracao recebe o delta entre score atual e threshold, mais as evidencias faltantes
- **Principio:** Contexto fresco — cada iteracao revisa o output anterior, nao opera cegamente

Formato do feedback injetado:

```
OMEGA_FEEDBACK (Iteracao {N}/{max}):
- Score atual: {score}/{threshold}
- Evidencias faltantes:
  - {evidencia}: {o que falta}
- Completion signals faltantes:
  - {sinal}: {como obter}
- Recomendacao: {acao especifica}
```

### Nivel 2 — Vertical (Outro Agente Assume)

- **Quando:** Apos max_iterations sem atingir threshold
- **Quem decide:** ATLAS (PM) escolhe o agente substituto baseado na natureza do gap
- **Handoff:** O novo agente recebe: task original + output das iteracoes + scores + feedback OMEGA
- **Principio:** Fresh reviewer — o novo agente nao tem ancoragem no trabalho anterior

Tabela de routing vertical:

| Gap Identificado | Agente Substituto | Justificativa |
|-----------------|-------------------|---------------|
| Arquitetura inadequada | NEXUS (Architect) | Redesign necessario |
| Implementacao com bugs | FORGE / PRISM | Especialista no dominio |
| Testes insuficientes | SENTINEL (QA) | Foco em validacao |
| Contexto faltante | COMPASS (Context) | Pesquisa adicional |
| Vulnerabilidade encontrada | SPECTER (Security) | Auditoria especializada |
| Problema fullstack | BRIDGE (Fullstack) | Visao end-to-end |
| Problema de infra | VAULT (DevOps) | Especialista ops |
| Fidelidade de clone baixa | COMPASS + mind-clone v2 | Re-ingestao com mais fontes |

### Nivel 3 — Horizontal (Multiplos Agentes em Paralelo)

- **Quando:** Agente substituto (nivel 2) tambem nao atinge threshold apos max_iterations
- **O que acontece:** ATLAS spawna 2-3 agentes em paralelo, cada um com abordagem diferente
- **Resultado:** ATLAS compara outputs e seleciona o melhor (ou combina)
- **Limite:** Maximo 3 agentes em paralelo para nao fragmentar contexto

Cenarios tipicos de escalacao horizontal:

| Cenario | Agentes Paralelos | Abordagem |
|---------|-------------------|-----------|
| Bug complexo | FORGE + SENTINEL + NEXUS | FORGE: fix direto, SENTINEL: debug cientifico, NEXUS: refactor |
| Feature fullstack | FORGE + PRISM + BRIDGE | Backend + Frontend + Integracao |
| Design review | NEXUS + SHADOW + COMPASS | Arquitetura + Contestacao + Contexto |
| Mind clone complexo | COMPASS + LENS + agente-dominio | Contexto + Dados + Especialista |

### Nivel 4 — Human (Usuario Decide)

- **Quando:** Niveis 1-3 falharam, OU circuit breaker esta OPEN, OU custo excede budget
- **O que o usuario recebe:**

```
OMEGA ESCALACAO — Decisao Necessaria

Task: {descricao}
Agente(s) que tentaram: {lista}
Iteracoes totais: {N}
Melhor score atingido: {score}/{threshold}

Evidencias obtidas:
  [x] {evidencia cumprida}
  [ ] {evidencia faltante}

Gap principal: {o que impede atingir threshold}

Opcoes:
  1. ACCEPT  — aceitar output atual como esta (score {score})
  2. CONTINUE — mais {N} iteracoes com agente {sugestao}
  3. CANCEL  — cancelar task, registrar como incompleta
  4. ADJUST  — ajustar threshold ou escopo da task
```

### Escalacao entre Fases do Lifecycle

OMEGA v2 adiciona escalacao entre fases de projeto, nao apenas entre agentes:

| Condicao | Escalacao |
|----------|-----------|
| phase:execute falha 3x | Volta para phase:plan (replanejar) |
| phase:verify falha 3x | Volta para phase:execute (reimplementar) |
| phase:plan falha 3x | Volta para phase:discuss (rediscutir contexto) |
| milestone:audit falha | Fases insuficientes sao reexecutadas |
| Bloqueio em fase N | PM pode inserir fase N.5 intermediaria |

### Tabela de Decisao de Escalacao

| Condicao | Acao |
|----------|------|
| Score < threshold E iteracao < max | Retry (Nivel 1) |
| Score < threshold E iteracao == max | Vertical (Nivel 2) |
| Vertical falhou | Horizontal (Nivel 3) |
| Horizontal falhou | Human (Nivel 4) |
| Circuit breaker OPEN | Human (Nivel 4) |
| Violacao constitucional | STOP + Human |
| Context >= 75% | Auto-checkpoint + continuar em nova sessao |
| Rate limit | Cooldown 15min + retry |
| Conflito entre agentes | PM arbitra |
| Fase do lifecycle falha | Regride para fase anterior |

---

## 5. Agent Signature

### Assinatura Obrigatoria

Todo output que modifica estado do projeto (codigo, config, docs, artefatos) DEVE incluir uma assinatura do agente responsavel. A assinatura permite rastrear quem fez o que em caso de falha.

Formato da assinatura (v2):

```
<!-- OMEGA_SIGNATURE
agent: {CODENAME}
role: {PM | Architect | Backend | Frontend | QA | Context | Devil | SystemBuilder | ...}
task: {descricao curta}
timestamp: {ISO 8601}
omega_iteration: {N}
omega_score: {score}
phase: {N | null}
milestone: {N | null}
git_sha: {sha do commit, se aplicavel}
-->
```

### Onde a Assinatura Aparece

| Tipo de Output | Onde Assinar |
|----------------|-------------|
| Commit de codigo | Mensagem do commit (Co-Authored-By + OMEGA metadata) |
| Artefato .planning/ | Header do arquivo markdown |
| YAML (Synapse, DNA) | Campo `last_modified_by` no YAML |
| Resposta ao usuario | OMEGA_STATUS block (que ja contem agent) |
| Decisao arquitetural | ADR ou comentario no codigo |

### Regras de Assinatura

1. **Nao falsificar.** Cada agente assina apenas seu proprio trabalho. Nunca assinar em nome de outro.
2. **Nao omitir.** Ausencia de assinatura em artefato e violacao do protocolo OMEGA.
3. **Imutavel apos assinatura.** Se o artefato precisa ser modificado, nova assinatura e adicionada (nao substituida).
4. **Cadeia de custodia.** Para tasks que passaram por escalacao, todas as assinaturas da cadeia sao preservadas.

### Rastreabilidade de Falhas

Quando um bug ou problema e encontrado, a cadeia de rastreabilidade e:

```
Bug detectado
  -> git blame: qual commit introduziu
    -> OMEGA_SIGNATURE no commit: qual agente
      -> OMEGA progress.log: qual task, qual iteracao, qual score
        -> OMEGA_STATUS: quais evidencias foram checadas
          -> Root cause: qual evidencia falhou ou foi insuficiente
```

---

## 6. Progress Tracking

### Git SHA Comparison

A cada iteracao, OMEGA compara o estado do repositorio para determinar se houve progresso real:

```
progress_detected(before, after):
  // Progresso em codigo
  sha_changed = before.git_sha != after.git_sha

  // Progresso em arquivos
  files_changed = after.files_modified > 0 OR after.files_created > 0

  // Progresso em score
  score_improved = after.score > before.score

  // Qualquer uma indica progresso
  RETURN sha_changed OR files_changed OR score_improved
```

### Metricas Rastreadas em 4 Niveis

OMEGA v2 rastreia progresso em 4 niveis hierarquicos:

| Nivel | Metricas | Onde |
|-------|---------|------|
| **Projeto** | % fases completas, milestones done, tempo total | `.planning/ROADMAP.md` + progress.log |
| **Milestone** | % fases do milestone, audit status | `.planning/milestones/{N}/` |
| **Fase** | Status, artefatos, OMEGA scores | `.planning/phases/{N}/` |
| **Task** | Iteracoes, scores, delta (granular) | `.claude/omega/state.json` + progress.log |

### Metricas por Task

| Metrica | Como Medir | Onde Registrar |
|---------|-----------|----------------|
| Git SHA antes/depois | `git rev-parse HEAD` | OMEGA_STATUS.delta |
| Arquivos modificados | `git diff --stat` | OMEGA_STATUS.delta |
| Arquivos criados | `git status --short` | OMEGA_STATUS.delta |
| Testes adicionados | Contagem de `it()` / `test()` / `describe()` | OMEGA_STATUS.delta |
| Testes passando | `npm test` exit code + contagem | OMEGA_STATUS.delta |
| Score por iteracao | Calculo de evidencias | progress.log |
| Tempo por iteracao | Timestamp inicio/fim | progress.log |
| Custo estimado por iteracao | Modelo usado + tokens estimados | progress.log |

### Cumulative Progress Log

Arquivo: `.claude/omega/progress.log`

Este arquivo e **append-only** — nunca editado, apenas adicionado. Cada entrada segue o formato:

```
=== OMEGA ENTRY ===
timestamp: 2026-03-03T14:30:00Z
task: implement auth middleware
task_type: implementation
agent: FORGE
iteration: 2/3
score: 78/90
phase: 3
milestone: 1
project: my-saas
circuit_breaker: CLOSED
git_sha: abc1234 -> def5678
files_modified: 3
files_created: 1
tests_added: 5
tests_passing: 12/12
completion_signals: [tests_pass, types_check]
exit_signal: false
feedback: "Faltam evidencias: lint_clean (2 warnings), coverage_met (novo codigo sem teste para edge case null input)"
escalation: none
synapse_state: executing
duration_seconds: 45
=== END ENTRY ===
```

### Regras do Progress Log

1. **Append-only.** Nunca editar ou deletar entradas anteriores.
2. **Uma entrada por iteracao.** Cada passagem pelo OMEGA loop gera exatamente uma entrada.
3. **Entradas de escalacao.** Quando escalacao ocorre, uma entrada adicional e registrada com `escalation: {nivel}`.
4. **Rotacao.** Quando o arquivo exceder 10.000 linhas, mover para `progress.log.{timestamp}` e iniciar novo.
5. **Leitura pelo PM.** ATLAS pode consultar o progress log para diagnosticar gargalos e patterns.

---

## 7. Backpressure

### Conceito

Backpressure e o mecanismo que impede uma task de avancar quando pre-condicoes nao foram cumpridas. No OMEGA, backpressure opera como transformacao de eventos: um sinal de "done" e convertido em "blocked" se evidencias faltam.

```
Evento original:    task.done
Verificacao OMEGA:  evidencias insuficientes
Evento transformado: task.blocked (reason: "testes nao passam")
```

### Gates Bloqueantes

Estes gates DEVEM passar antes que uma task de implementacao seja considerada concluida. Nao ha excecao.

| Gate | Verificacao | Comando | Bloqueante |
|------|-----------|---------|------------|
| TypeScript Compilation | Zero erros de tipo | `tsc --noEmit` | SIM |
| Lint | Zero erros (warnings aceitaveis) | `eslint .` / `biome check .` | SIM |
| Tests Pass | Todos os testes passam | `npm test` | SIM |
| No Regressions | Testes existentes nao quebraram | Comparacao com test suite anterior | SIM |
| YAML Validation | Arquivos YAML sao validos | Parser YAML sem erros | SIM (para mind clones) |
| Incremental Edit | Usou Edit, nao Write para existentes | Diff analysis | SIM |

### Gates de Aviso (nao-bloqueantes)

| Gate | Verificacao | Comando | Bloqueante |
|------|-----------|---------|------------|
| Coverage | Cobertura acima do threshold | Coverage report | NAO (aviso) |
| Bundle Size | Build dentro do limite | Build + size check | NAO (aviso) |
| Docs | Documentacao atualizada | Verificacao manual | NAO (aviso) |
| Architecture | Arquivos nos diretorios corretos | Path analysis | NAO (aviso) |

### Gates de Fase (Lifecycle Backpressure)

OMEGA v2 adiciona gates de fase que impedem transicoes invalidas no lifecycle:

| Transicao | Gate Bloqueante |
|-----------|----------------|
| pending -> discussing | PM autorizou |
| discussing -> planning | CONTEXT.md existe |
| planning -> executing | PLAN.md existe + SHADOW verdict != BLOCKED + PM autorizou |
| executing -> verifying | Commits existem + OMEGA score >= 90 em execucao |
| verifying -> completed | OMEGA score >= 95 em verificacao + PM valida |
| milestone:new | Milestone anterior concluido ou e o primeiro |
| milestone:complete | Audit com verdict != BLOCKED |

### Integracao com Quality Gates Existentes

OMEGA respeita e complementa o pipeline de 9 Quality Gates definido em `QUALITY-GATES.md`. A relacao e:

| Quality Gate | OMEGA Role |
|-------------|-----------|
| Gate 1 (Security) | OMEGA bloqueia se security gate falha |
| Gate 2 (Auto-Lint) | OMEGA conta lint_clean como completion signal |
| Gate 3 (Architecture) | OMEGA registra warnings no progress log |
| Gate 4 (Pre-Commit) | OMEGA valida antes de permitir exit_signal |
| Gate 5 (Coverage) | OMEGA usa coverage como evidencia de scoring |
| Gate 6 (Docs) | OMEGA registra como aviso, nao bloqueia |
| Gate 7 (Dependency) | OMEGA bloqueia se vulnerabilidades criticas |
| Gate 8 (Bundle Size) | OMEGA registra como aviso |
| Gate 9 (Session Memory) | OMEGA usa para auto-checkpoint |

### Event Transformation (Backpressure como Eventos)

Quando um agente declara uma task como concluida, OMEGA transforma o evento baseado nas evidencias:

| Evento Original | Condicao | Evento Transformado |
|----------------|----------|-------------------|
| `task.done` | Score >= threshold E dual-gate met | `task.completed` (aceito) |
| `task.done` | Score < threshold | `task.needs_refinement` (volta ao loop) |
| `task.done` | Gate bloqueante falha | `task.blocked` (backpressure) |
| `task.done` | Circuit breaker OPEN | `task.escalated` (router de escalacao) |
| `build.done` | Testes nao passam | `build.blocked` (backpressure) |
| `review.done` | Evidencias insuficientes | `review.incomplete` (mais verificacao) |
| `phase.done` | Guard de transicao falha | `phase.blocked` (lifecycle backpressure) |

### YAML Validation para Mind Clones

Para tasks do tipo `mind_clone`, OMEGA aplica validacoes especificas nos artefatos YAML:

| Validacao | Criterio | Acao se Falhar |
|-----------|----------|----------------|
| YAML parseia sem erro | Parser nao retorna erro | Bloqueante — corrigir sintaxe |
| Campos obrigatorios presentes | identity, camadas 1-6, metadata | Bloqueante — preencher campos |
| source_path em cada insight | Rastreabilidade presente | Bloqueante — adicionar fonte |
| versao_dna incrementada | versao_dna_depois > versao_dna_antes | Bloqueante — incrementar |
| Minimo 2 paradoxos (camada 6) | len(paradoxos) >= 2 | Aviso — adicionar se possivel |
| Triangulacao (3 fontes/paradoxo) | Cada paradoxo com >= 3 fontes | Aviso — marcar como nao-confirmado |

---

## 8. Model Routing

### Roteamento por Complexidade

OMEGA determina qual modelo usar baseado na complexidade estimada da task. Isso otimiza custo e velocidade sem sacrificar qualidade onde importa.

| Complexidade | Score | Modelo | Latencia | Custo | Casos de Uso |
|-------------|-------|--------|----------|-------|-------------|
| Baixa | 1-4 | Haiku | Rapido | Baixo | Formatacao, correcoes triviais, queries simples |
| Media | 5-6 | Sonnet | Medio | Medio | Implementacao padrao, testes, CRUD, refactoring simples |
| Alta | 7-10 | Opus | Lento | Alto | Arquitetura, seguranca, debug complexo, mind clones |

### Calculo de Complexidade

A complexidade e estimada antes do inicio do OMEGA loop, baseado em fatores da task:

| Fator | Peso | 1 (baixo) | 5 (medio) | 10 (alto) |
|-------|------|-----------|-----------|-----------|
| Arquivos envolvidos | 20% | 1 arquivo | 3-5 arquivos | 10+ arquivos |
| Interdependencias | 20% | Independente | 2-3 dependencias | Cadeia longa |
| Dominio tecnico | 20% | CRUD, config | API, integracao | Seguranca, crypto, concorrencia |
| Impacto em caso de erro | 20% | Cosmetico | Funcional | Dados, seguranca, financeiro |
| Novidade | 20% | Pattern conhecido | Variacao de pattern | Problema inedito |

Formula: `complexity = sum(fator * peso) / sum(pesos)`, arredondado para inteiro.

### Routing por Tipo de Task

Alem da complexidade, certos tipos de task tem routing pre-definido:

| Tipo de Task | Modelo Minimo | Justificativa |
|-------------|---------------|---------------|
| `validation` | Sonnet | Testes e verificacao precisam de atencao |
| `mind_clone` | Opus | Fidelidade cognitiva exige capacidade maxima |
| `mind_update` | Opus | Merge incremental requer profundidade |
| Escalacao nivel 2+ | Opus | Problemas que ja falharam precisam do melhor |
| Contestacao (SHADOW) | Opus | Devil's advocate precisa de profundidade |
| Security audit | Opus | Risco alto demais para modelos menores |

### Regras de Routing

1. **O modelo sugerido e o MINIMO.** O agente pode usar modelo superior se julgar necessario.
2. **Escalacao aumenta modelo.** Cada nivel de escalacao pode subir o modelo.
3. **Mind clones sempre Opus.** Sem excecao — fidelidade cognitiva nao admite atalhos.
4. **Override manual.** O usuario pode forcar qualquer modelo para qualquer task.
5. **Log de routing.** Cada decisao de routing e registrada no progress log.

---

## 9. State Persistence

### Arquitetura de Estado

OMEGA v2 persiste seu estado em multiplos locais organizados hierarquicamente:

```
.claude/omega/                    <- Estado do engine
  config.yaml                     <- Configuracao do OMEGA
  state.json                      <- Estado atual do loop + lifecycle
  progress.log                    <- Log append-only de iteracoes
  checkpoints/                    <- Snapshots automaticos
    {timestamp}.json              <- Checkpoint individual
  checklists/                     <- Checklists por task_type
    research.md
    planning.md
    implementation.md
    validation.md
    mind-clone.md
    mind-update.md

.planning/                        <- Artefatos de lifecycle (gerido pelo OMEGA)
  config.json                     <- Config do projeto
  PROJECT.md                      <- Descricao do projeto
  ROADMAP.md                      <- Roadmap com milestones e fases
  STATE.md                        <- Estado para pause/resume (handoff)
  phases/                         <- Artefatos por fase
    {N}/
      CONTEXT.md                  <- Output de discuss
      RESEARCH.md                 <- Output de research
      PLAN-{NN}.md                <- Planos de task
      SUMMARY.md                  <- Resultado da execucao
      UAT.md                      <- Resultado da verificacao
  milestones/
    {N}/
      AUDIT.md                    <- Resultado do audit
  quick/
    {NNN}/
      TASK.md                     <- Descricao + resultado
      VERIFY.md                   <- Verificacao (se --full)
  debug/
    {slug}.md                     <- Resultado de debug
  codebase/
    ARCHITECTURE.md               <- Output de map-codebase
    DEPENDENCIES.md
    API-MAP.md
    DATA-MODEL.md
    PATTERNS.md
    RISKS.md
    TECH-DEBT.md
  todos/
    TODO.md                       <- Lista de pendencias

.claude/synapse/                  <- Estado dos agentes (Synapse v3)
  {agent-id}.yaml                 <- Estado + omega_history
  minds/                          <- DNA dos mind clones
  dossiers/                       <- Dossies tematicos
  ingestion/                      <- Log de ingestao

.claude/session-context.md        <- Checkpoint continuo
```

### state.json — Estado Corrente (v2)

```json
{
  "version": "2.0.0",
  "last_updated": "2026-03-03T14:30:00Z",

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

### Auto-Checkpoint a 75% Context

Quando a utilizacao de contexto atinge 75%, OMEGA dispara um auto-checkpoint:

1. Salvar `state.json` completo em `checkpoints/{timestamp}.json`
2. Salvar resumo da task corrente no `progress.log`
3. Gerar handoff com todas as informacoes necessarias para continuar:

```json
{
  "checkpoint_type": "auto_context_75",
  "timestamp": "2026-03-03T15:00:00Z",
  "task": { "...estado completo..." },
  "lifecycle": { "...estado do lifecycle..." },
  "resume_instructions": "Continuar task {id} na iteracao {N}. Score atual: {score}. Faltam: {evidencias}.",
  "files_in_progress": ["src/middleware/auth.ts", "tests/auth.test.ts"],
  "git_sha": "abc1234",
  "progress_log_line": 423
}
```

Apos o checkpoint, OMEGA pode:
- Continuar na mesma sessao se contexto suficiente
- Escalar a nova sessao do mesmo agente com handoff
- Escalar ao PM para decisao

### Limpeza de Estado

| Evento | Acao |
|--------|------|
| Task completada | Mover `current_task` para historico no progress.log. Limpar `current_task` em state.json. |
| Task cancelada | Registrar cancelamento no progress.log. Limpar state.json. |
| Sessao encerrada | Auto-checkpoint. Estado persiste para resume. |
| Circuit breaker reset | Zerar contadores. Manter historico. |
| Rotacao de log | Mover progress.log para progress.log.{timestamp}. Criar novo. |

---

## 10. Integracao com Agentes DuarteOS

### ATLAS (PM) — Orquestrador do OMEGA

ATLAS e o unico agente com autoridade para:

| Acao | Contexto |
|------|----------|
| Configurar thresholds por task | Pode ajustar threshold se justificado |
| Decidir nivel de escalacao | Aceitar output abaixo do threshold ou escalar |
| Cancelar OMEGA loop | Se o custo excede o beneficio |
| Override de circuit breaker | Em emergencia, pode forcar re-tentativa |
| Routing de escalacao vertical | Escolher qual agente substituto |
| Spawnar escalacao horizontal | Decidir quais agentes rodam em paralelo |
| Consultar progress log | Diagnosticar gargalos e patterns |
| Autorizar transicoes de fase | Unico que autoriza pending -> executing |
| Iniciar/completar milestones | Unico autorizado |
| Inserir/remover fases | Unico autorizado |
| Rollback | Unico autorizado |

**ATLAS NAO executa tasks.** ATLAS apenas orquestra. O OMEGA loop roda dentro de cada agente executor.

### Manifests por Agente (comandos /omega:*)

#### PM (ATLAS) — Lifecycle e Orquestracao

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:project:new` | Demanda com 3+ fases estimadas | Nenhum projeto ativo sem milestone concluido | PROJECT.md, ROADMAP.md |
| `/omega:milestone:new` | Milestone anterior concluido ou primeiro | Audit aprovado (se nao primeiro) | ROADMAP.md atualizado |
| `/omega:milestone:audit` | Todas fases do milestone executadas | Nenhum | Audit report |
| `/omega:milestone:complete` | Audit aprovado | Verdict != BLOCKED | Milestone arquivado |
| `/omega:progress` | Projeto inicializado (.planning/ existe) | Nenhum | Status visual |
| `/omega:session:pause` | Trabalho em andamento | Nenhum | STATE.md handoff |
| `/omega:session:resume` | STATE.md com handoff existente | Nenhum | Contexto restaurado |
| `/omega:todo:add` | Ideia fora do escopo atual | Nenhum | Todo registrado |
| `/omega:todo:list` | Nenhum | Nenhum | Lista de pendencias |
| `/omega:phase:add` | Roadmap existente | PM autorizou | Fase adicionada ao final |
| `/omega:phase:insert` | Roadmap existente, urgencia justificada | PM autorizou | Fase inserida como decimal |
| `/omega:phase:remove` | Fase futura (nao iniciada) | PM autorizou | Fase removida, renumerada |
| `/omega:build-system` | PRD, workflow N8N, URL ou briefing recebido | Nenhum | Sistema completo |

**Autoridade especial:** PM pode invocar qualquer comando OMEGA se justificado. PM autoriza transicoes entre fases.

#### Architect (NEXUS) — Estrutura e Planejamento

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:map-codebase` | Antes de refactor grande ou inicio de projeto | Nenhum | 7 docs em .planning/codebase/ |
| `/omega:phase:plan {N}` | Fase com 3+ tasks interdependentes | CONTEXT.md existe (ou sera criado) | PLAN.md files |
| `/omega:phase:research {N}` | Tech nova ou integracao complexa | Nenhum | RESEARCH.md |
| `/omega:phase:assumptions {N}` | Antes de planejar (expor premissas) | Nenhum | Lista de assumptions |
| `/omega:phase:add` | Necessidade estrutural identificada | PM aprovou | Fase adicionada |
| `/omega:phase:insert` | Dependencia critica descoberta | PM aprovou | Fase inserida |

**Guard critico:** Nunca planejar sem antes mapear codebase (se projeto brownfield).

#### QA (SENTINEL) — Verificacao e Debug

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:phase:verify {N}` | Fase executada (commits existem) | Nenhum | UAT.md + diagnostico |
| `/omega:debug "desc"` | Bug persistente (2+ tentativas falharam) | Nenhum | debug/{slug}.md com root cause |
| `/omega:health` | Suspeita de inconsistencia em .planning/ | Nenhum | Diagnostico de saude |

**Guard critico:** Sempre verificar apos execute-phase. Nunca declarar fase concluida sem verify-work.

**OMEGA Gate (verify):** Verificacao roda com threshold de validation (>= 95). O agente verificador deve:
1. Emitir OMEGA_STATUS com evidencias de teste
2. Atingir score >= 95 com completion signals de testes/cobertura
3. Se nao atingir: documentar gaps e escalar

#### Backend (FORGE) — Execucao Server-Side

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:phase:execute {N}` | PLAN.md aprovado existe | PM autorizou execucao | Commits atomicos + SUMMARY.md |
| `/omega:quick "desc"` | Task pequena (1-3 steps) | Nenhum | quick/{NNN}/ |
| `/omega:quick --full "desc"` | Task pequena que precisa verificacao | Nenhum | quick/{NNN}/ + verificado |

**Guard critico:** Nunca executar sem PLAN.md. Cada task = 1 commit atomico.

#### Frontend (PRISM) — Execucao UI

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:phase:execute {N}` | PLAN.md de UI aprovado existe | PM autorizou execucao | Commits atomicos + SUMMARY.md |
| `/omega:quick "desc"` | Ajuste UI pequeno (1-3 steps) | Nenhum | quick/{NNN}/ |
| `/omega:quick --full "desc"` | Componente que precisa verificacao | Nenhum | quick/{NNN}/ + verificado |

**Guard critico:** Nunca executar sem PLAN.md. Verificar mudancas visuais.

#### Context Engineer (COMPASS) — Coerencia e Pesquisa

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:phase:discuss {N}` | SEMPRE antes de planejar fase | Nenhum | CONTEXT.md |
| `/omega:phase:research {N}` | Tech nova ou abordagem incerta | Nenhum | RESEARCH.md |
| `/omega:settings` | Ajuste de profundidade de pesquisa | Nenhum | Config atualizado |

**Guard critico:** SEMPRE executar discuss antes de plan. CONTEXT.md alimenta o planner.

#### Devil's Advocate (SHADOW) — Contestacao e Red Team

| Comando OMEGA | Pre-condicao | Guard | Output |
|--------------|-------------|-------|--------|
| `/omega:phase:assumptions {N}` | SEMPRE antes de aprovar planos | Nenhum | Lista de premissas |
| `/omega:validate-plan` | PLAN.md existe para contestar | Nenhum | Verdict: APPROVED/CAVEATS/BLOCKED |

**Guard critico:** Nunca aprovar sem expor assumptions primeiro. Critica sem alternativa e INVALIDA.

#### Agentes Custom (TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE)

Agentes custom operam dentro do escopo delegado pelo PM, usando os mesmos subcomandos dos agentes core mas restritos ao seu dominio:

| Agente | Dominio | Subcomandos Permitidos |
|--------|---------|----------------------|
| TITAN (System Builder) | Sistemas complexos | `/omega:phase:execute`, `/omega:quick`, `/omega:build-system` |
| SPARK (Python Executor) | Scripts Python | `/omega:quick`, `/omega:phase:execute` |
| LENS (Data Scientist) | Dados e analytics | `/omega:phase:research`, `/omega:quick` |
| VAULT (DevOps) | Infraestrutura | `/omega:phase:execute`, `/omega:quick`, `/omega:debug` |
| SPECTER (Security Auditor) | Seguranca | `/omega:phase:verify`, `/omega:phase:research` |
| BRIDGE (Fullstack) | End-to-end | `/omega:phase:execute`, `/omega:quick`, `/omega:debug` |

### Fluxo ATLAS + OMEGA

```
1. Usuario pede algo
2. ATLAS avalia escopo e complexidade
3. ATLAS delega ao agente com task_type e complexity definidos
4. OMEGA loop inicia dentro do agente delegado
5. Se o agente resolve: OMEGA finaliza, ATLAS recebe confirmacao
6. Se escalacao necessaria:
   a. OMEGA notifica ATLAS com score + gap
   b. ATLAS decide: retry / vertical / horizontal / human
   c. ATLAS executa a decisao
   d. OMEGA loop reinicia no novo contexto
7. ATLAS registra resultado no session-context.md (save-context automatico)
```

---

## 11. Lifecycle Management

### Hierarquia de Lifecycle

```
Projeto (Project)
  +-- Milestone 1
  |    +-- Fase 1.1 (discuss -> plan -> execute -> verify)
  |    +-- Fase 1.2
  |    +-- Fase 1.3
  +-- Milestone 2
  |    +-- Fase 2.1
  |    +-- Fase 2.2
  +-- Quick Tasks (fora do lifecycle formal)
```

### 11.1 Projetos

**Comando:** `/omega:project:new`

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

### 11.2 Milestones

**Comandos:**

| Comando | task_type | Threshold | Output |
|---------|-----------|-----------|--------|
| `/omega:milestone:new` | planning | 85 | ROADMAP.md atualizado |
| `/omega:milestone:audit` | validation | 95 | AUDIT.md |
| `/omega:milestone:complete` | validation | 95 | Milestone arquivado |

**Guards de milestone:**
- `milestone:new` — milestone anterior concluido ou primeiro milestone. Audit aprovado (se nao for primeiro).
- `milestone:audit` — todas as fases do milestone executadas e verificadas.
- `milestone:complete` — audit com verdict != BLOCKED.

**Transicoes de estado:**

```
created -> active -> auditing -> completed -> archived
                       |
                    blocked (se audit falha)
                       |
                    active (volta para corrigir)
```

### 11.3 Fases

**Comandos:**

| Comando | task_type | Threshold | Output |
|---------|-----------|-----------|--------|
| `/omega:phase:discuss {N}` | research | 80 | CONTEXT.md |
| `/omega:phase:research {N}` | research | 80 | RESEARCH.md |
| `/omega:phase:plan {N}` | planning | 85 | PLAN.md files |
| `/omega:phase:execute {N}` | implementation | 90 | Commits + SUMMARY.md |
| `/omega:phase:verify {N}` | validation | 95 | UAT.md |
| `/omega:phase:add` | planning | 85 | Fase adicionada ao final |
| `/omega:phase:insert` | planning | 85 | Fase inserida como decimal |
| `/omega:phase:remove` | planning | 85 | Fase removida, renumerada |
| `/omega:phase:assumptions {N}` | research | 80 | Lista de premissas |

**State machine de fases:**

```
pending -> discussing -> planning -> executing -> verifying -> completed
                                        |             |
                                     blocked <-> (retorna ao estado anterior)
```

**Guards de transicao:**

| Transicao | Guard |
|-----------|-------|
| pending -> discussing | PM autoriza |
| discussing -> planning | CONTEXT.md existe |
| planning -> executing | PLAN.md existe + SHADOW verdict != BLOCKED + PM autoriza |
| executing -> verifying | Commits existem + OMEGA score >= 90 em execucao |
| verifying -> completed | OMEGA score >= 95 em verificacao + PM valida |

**Artefatos por estado:**

| Estado | Artefato Produzido | Localizacao |
|--------|--------------------|-------------|
| discussing | CONTEXT.md | `.planning/phases/{N}/CONTEXT.md` |
| planning | PLAN.md(s) | `.planning/phases/{N}/PLAN-{NN}.md` |
| executing | SUMMARY.md | `.planning/phases/{N}/SUMMARY.md` |
| verifying | UAT.md | `.planning/phases/{N}/UAT.md` |

### 11.4 Quick Tasks

**Comandos:** `/omega:quick "descricao"` e `/omega:quick --full "descricao"`

| Aspecto | Quick | Quick --full |
|---------|-------|-------------|
| task_type | implementation | implementation |
| Threshold | >= 90 | >= 90 |
| Max iterations | 2 | 2 |
| Verificacao inclusa | Nao | Sim (auto-verify) |
| Artefatos | `.planning/quick/{NNN}/` | `.planning/quick/{NNN}/` + verificacao |
| Guard | Task < 3 steps | Task < 3 steps |

**Regra de numeracao:** `{NNN}` e sequencial (001, 002, ...), determinado pelo proximo numero livre no diretorio `.planning/quick/`.

### 11.5 Debug

**Comando:** `/omega:debug "descricao"`

| Aspecto | Definicao |
|---------|-----------|
| Pre-condicao | Bug persistente (2+ tentativas falharam) |
| task_type | implementation |
| Threshold | >= 90 |
| Artefato | `.planning/debug/{slug}.md` |
| Metodologia | 5 Whys + bisect + log analysis |

---

## 12. Session Management

### 12.1 Pause — Handoff Completo

**Comando:** `/omega:session:pause`

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

### 12.2 Resume — Context Restore

**Comando:** `/omega:session:resume`

Ao retomar, OMEGA v2:

1. Le `.planning/STATE.md` para restaurar estado
2. Le `.claude/omega/state.json` para restaurar estado do loop
3. Le `.claude/session-context.md` para contexto adicional
4. Carrega Synapse context stack (L0-L7) relevante para a fase atual
5. Apresenta resumo ao usuario com proximo passo sugerido
6. Aguarda confirmacao antes de continuar

### 12.3 Save-Context Automatico

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

**Regras:**
- **OBRIGATORIO:** Todo agente que executa operacao da tabela acima DEVE salvar contexto
- **AUTOMATICO:** Nao depende do usuario pedir — e pos-acao implicita
- **INCREMENTAL:** Atualizar apenas as secoes relevantes, nao reescrever tudo
- **CONCISO:** Cada entrada no maximo 1-2 linhas. Estado, nao narrativa

---

## 13. Artifact Management

### Schemas dos Artefatos .planning/

Cada artefato produzido pelo OMEGA v2 segue um schema definido.

### 13.1 CONTEXT.md (output de phase:discuss)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} phase:{N} timestamp:{ISO} -->
# Contexto — Fase {N}: {Nome}

## Objetivo da Fase
{O que esta fase deve alcançar}

## Decisoes Tomadas
| Decisao | Justificativa | Alternativas Consideradas |
|---------|-------------|--------------------------|
| {decisao} | {por que} | {opcoes descartadas} |

## Restricoes Identificadas
- {restricao 1}
- {restricao 2}

## Dependencias
- **De outras fases:** {lista}
- **Externas:** {lista}

## Perguntas em Aberto
- {pergunta 1 — quem deve responder}

## Fontes Consultadas
- {fonte 1}
- {fonte 2}
```

### 13.2 RESEARCH.md (output de phase:research)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} phase:{N} timestamp:{ISO} -->
# Pesquisa — Fase {N}: {Nome}

## Objetivo da Pesquisa
{O que precisa ser investigado}

## Descobertas
### {Topico 1}
- **Resumo:** {texto}
- **Fontes:** {lista}
- **Implicacoes:** {texto}

## Alternativas Avaliadas
| Alternativa | Pros | Cons | Recomendacao |
|------------|------|------|-------------|
| {opcao A} | {pros} | {cons} | {sim/nao/talvez} |

## Trade-offs
- {tradeoff 1: descricao}

## Recomendacao
{Recomendacao final com justificativa}
```

### 13.3 PLAN.md (output de phase:plan)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} phase:{N} timestamp:{ISO} -->
# Plano — Fase {N}, Task {NN}: {Nome}

## Objetivo
{Objetivo unico e mensuravel}

## Pre-condicoes
- {pre-condicao 1}

## Steps
1. {step 1 — descricao acionavel}
2. {step 2}

## Arquivos Afetados
- `{path/to/file}` — {o que muda}

## Dependencias
- blockedBy: [{task IDs}]
- blocks: [{task IDs}]

## Riscos
| Risco | Probabilidade | Impacto | Mitigacao |
|-------|-------------|---------|-----------|
| {risco} | {alta/media/baixa} | {alto/medio/baixo} | {como mitigar} |

## Rollback
{Como desfazer se der errado}

## Criterio de Sucesso
- {criterio quantitativo 1}
- {criterio quantitativo 2}

## Estimativa
{T-shirt size: S/M/L/XL}
```

### 13.4 SUMMARY.md (output de phase:execute)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} phase:{N} timestamp:{ISO} -->
# Sumario de Execucao — Fase {N}: {Nome}

## Tasks Executadas
| Task | Status | Commits | OMEGA Score |
|------|--------|---------|------------|
| {task 1} | done | {sha} | {score}/{threshold} |

## Mudancas Realizadas
- {descricao da mudanca 1}
- {descricao da mudanca 2}

## Testes
- **Adicionados:** {N}
- **Total passando:** {N}/{total}
- **Coverage:** {%}

## Decisoes Tomadas Durante Execucao
- {decisao 1}

## Problemas Encontrados
- {problema 1 — como foi resolvido}

## Proximo Passo
{Verificacao com SENTINEL via /omega:phase:verify}
```

### 13.5 UAT.md (output de phase:verify)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} phase:{N} timestamp:{ISO} -->
# Verificacao — Fase {N}: {Nome}

## Resultado: {PASSED | FAILED | PARTIAL}

## Testes Executados
| Categoria | Total | Passaram | Falharam |
|-----------|-------|---------|---------|
| Unit | {N} | {N} | {N} |
| Integration | {N} | {N} | {N} |
| Edge-case | {N} | {N} | {N} |

## Edge Cases Verificados
1. {edge case 1 — resultado}
2. {edge case 2 — resultado}

## Regressao
- **Status:** {nenhuma regressao | N regressoes encontradas}
- **Detalhes:** {se houver regressao}

## Security
- **OWASP top 10:** {verificado | N/A}
- **Secrets scan:** {limpo | N alertas}

## OMEGA Score
- **Score:** {score}/{threshold}
- **Evidencias:** {lista}

## Gaps (se FAILED ou PARTIAL)
- {gap 1 — o que falta}

## Recomendacao
{Aprovar fase | Voltar para execucao com fix-plan}
```

### 13.6 AUDIT.md (output de milestone:audit)

```markdown
<!-- OMEGA_SIGNATURE agent:{CODENAME} milestone:{N} timestamp:{ISO} -->
# Auditoria — Milestone {N}: {Nome}

## Verdict: {APPROVED | CAVEATS | BLOCKED}

## Fases Auditadas
| Fase | Status | OMEGA Score | Issues |
|------|--------|------------|--------|
| {fase 1} | completed | {score} | {N issues} |

## Criterios de Aprovacao
| Criterio | Status | Evidencia |
|----------|--------|-----------|
| Todas fases verificadas | {pass/fail} | {lista} |
| Zero regressoes | {pass/fail} | {test suite} |
| Security clear | {pass/fail} | {scan result} |
| Documentation updated | {pass/fail} | {lista} |

## Issues Encontrados
- {issue 1 — severidade — recomendacao}

## Recomendacao
{Aprovar milestone | Reabrir fases X e Y}
```

---

## 14. Workflow Recipes

### Recipe 1: Nova Feature (Completa)

```
TRIGGER: Usuario descreve feature
FLUXO:
  1. ATLAS avalia escopo
     -> Se grande: /omega:project:new
     -> Se medio: /omega:phase:discuss {N}
  2. COMPASS: /omega:phase:discuss {N} -> CONTEXT.md
     (OMEGA loop: research, threshold 80)
  3. NEXUS: /omega:phase:research {N} -> RESEARCH.md (se tech nova)
     (OMEGA loop: research, threshold 80)
  4. NEXUS: /omega:phase:plan {N} -> PLAN.md files
     (OMEGA loop: planning, threshold 85)
  5. SHADOW: /omega:validate-plan -> Verdict
     (OMEGA loop: validation, threshold 95)
     -> Se BLOCKED: volta para step 4
     -> Se CAVEATS: ATLAS decide
  6. FORGE/PRISM: /omega:phase:execute {N} -> commits
     (OMEGA loop: implementation, threshold 90)
  7. SENTINEL: /omega:phase:verify {N} -> UAT.md
     (OMEGA loop: validation, threshold 95)
     -> Se falhou: SENTINEL cria fix-plan -> volta step 6
  8. ATLAS: valida e fecha fase
     (save-context automatico)
```

### Recipe 2: Bug Fix

```
TRIGGER: Bug reportado
FLUXO:
  1. ATLAS avalia severidade
     -> Se critico: /omega:quick --full "fix: desc"
     -> Se persistente: /omega:debug "desc"
  2. SENTINEL: /omega:debug "desc" -> root cause
  3. FORGE/PRISM: /omega:quick "fix: desc" -> commit
  4. SENTINEL: valida fix
```

### Recipe 3: Refactoring

```
TRIGGER: Divida tecnica identificada
FLUXO:
  1. ATLAS autoriza refactor
  2. NEXUS: /omega:map-codebase -> 7 docs
  3. NEXUS: /omega:phase:plan {N} -> PLAN.md
  4. SHADOW: /omega:phase:assumptions {N} -> riscos
  5. FORGE/PRISM: /omega:phase:execute {N} -> commits
  6. SENTINEL: /omega:phase:verify {N} -> regressao
  7. ATLAS: valida conclusao
```

### Recipe 4: Novo Projeto do Zero

```
TRIGGER: PRD, briefing ou URL recebido
FLUXO:
  1. ATLAS: /omega:project:new -> roadmap
     OU /omega:build-system -> sistema completo (modo YOLO)
  2. Para cada fase do roadmap:
     a. /omega:phase:discuss {N}
     b. /omega:phase:plan {N}
     c. /omega:phase:execute {N}
     d. /omega:phase:verify {N}
  3. /omega:milestone:audit -> auditoria final
  4. /omega:milestone:complete -> milestone arquivado
```

### Recipe 5: Sessao de Trabalho (Retomada)

```
TRIGGER: Inicio de nova sessao
FLUXO:
  1. ATLAS: /omega:session:resume -> contexto restaurado
  2. ATLAS: /omega:progress -> status atual
  3. ATLAS decide proximo passo
  4. Ao encerrar: /omega:session:pause -> handoff salvo
```

### Recipe 6: Task Rapida

```
TRIGGER: Pedido simples (1-3 steps)
FLUXO:
  1. ATLAS avalia: cabe em quick?
     -> Se sim: /omega:quick "desc"
     -> Se precisa verificacao: /omega:quick --full "desc"
  2. Pronto. Sem burocracia.
```

### Recipe 7: Mind Clone (NOVO)

```
TRIGGER: Novo expert a clonar
FLUXO:
  1. ATLAS: /omega:mmos:clone-mind {nome}
  2. Pipeline MMOS executa 6 fases (cada uma com OMEGA loop):
     Fase 1: Coleta (research, threshold 80)
     Fase 2: Extracao (research, threshold 80)
     Fase 3: Inferencia (mind_clone, threshold 95)
     Fase 4: Mapeamento (mind_clone, threshold 95)
     Fase 5: Perfil (mind_clone, threshold 95)
     Fase 6: Recomendacao (mind_clone, threshold 95)
  3. Gates Gawande entre fases (bloqueantes)
  4. Resultado: DNA YAML + squad files em DUARTEOS/squad/{categoria}/{mind-name}/
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
     -> Se delta > 5%: auto-rollback
  7. Score >= 95 para aprovacao
```

---

## 15. Invocation Rules

### DEVE invocar OMEGA formal quando:

| Condicao | Subcomando |
|----------|-----------|
| Task tem 3+ arquivos a modificar | `/omega:phase:plan` ou `/omega:phase:execute` |
| Bug persistiu apos 2+ tentativas | `/omega:debug` |
| Codebase desconhecido | `/omega:map-codebase` |
| Fase foi executada | `/omega:phase:verify` |
| Sessao encerrando com trabalho pendente | `/omega:session:pause` |
| Nova sessao com trabalho anterior | `/omega:session:resume` |
| Projeto novo com 3+ fases | `/omega:project:new` |
| Novo mind clone a criar | `/omega:mmos:clone-mind` |
| Mind clone a atualizar | `/omega:mmos:mind-update` |
| Conteudo no inbox para processar | `/omega:mmos:ingest` |

### NAO deve invocar OMEGA formal quando:

| Condicao | Acao |
|----------|------|
| Task trivial (1 arquivo, mudanca obvia) | Agente faz direto (mas AINDA emite OMEGA_STATUS) |
| Pergunta de esclarecimento | Agente responde diretamente |
| Analise sem acao | Agente analisa e reporta |
| Decisao arquitetural simples | Agente decide e documenta |
| Consulta informativa | `/omega:progress`, `/omega:synapse` (sem OMEGA loop) |

> **Regra critica:** Mesmo quando OMEGA formal nao e invocado, o agente DEVE emitir OMEGA_STATUS no final de qualquer task de execucao. A unica excecao sao respostas puramente conversacionais (perguntas, esclarecimentos).

### Guards de Invocacao

Antes de executar qualquer subcomando OMEGA, verificar:

```
PRE_INVOKE_CHECK(subcommand, agent, context):
  // 1. Agente tem permissao para este subcomando?
  IF subcommand NOT IN agent.manifest:
    REJECT("Agente {agent} nao tem permissao para {subcommand}")

  // 2. Pre-condicoes do subcomando satisfeitas?
  IF NOT preconditions_met(subcommand, context):
    REJECT("Pre-condicao nao satisfeita: {missing}")

  // 3. Guards do subcomando passam?
  IF NOT guards_pass(subcommand, context):
    REJECT("Guard falhou: {reason}")

  // 4. Rate limit ok?
  IF rate_limiter.calls_this_hour >= config.rate_limiter.max_calls_per_hour:
    REJECT("Rate limit atingido. Aguardar cooldown.")

  ACCEPT
```

### Fallback

Se OMEGA nao se aplicar a uma task, o agente pode executar manualmente, mas deve:
1. Documentar por que OMEGA nao foi usado
2. Manter rastreabilidade equivalente (OMEGA_STATUS ainda emitido)
3. Registrar na memoria do agente (Synapse)

---

## 16. Save-Context Protocol

### Operacoes que Disparam Save-Context

Toda operacao OMEGA que muda estado do projeto dispara atualizacao automatica do `.claude/session-context.md`. Esta e uma acao pos-execucao implicita — nao depende do usuario pedir.

A tabela completa de operacoes e o que salvar esta na secao 12.3 (Session Management).

### Regras do Save-Context

1. **OBRIGATORIO** — todo agente que executa operacao da tabela DEVE salvar contexto
2. **AUTOMATICO** — nao depende do usuario pedir
3. **INCREMENTAL** — atualizar apenas secoes relevantes, nao reescrever tudo
4. **CONCISO** — cada entrada no maximo 1-2 linhas. Estado, nao narrativa
5. **IDEMPOTENTE** — salvar contexto multiplas vezes com mesmo estado produz mesmo resultado

### Diferenca entre Save-Context e Pause

| Aspecto | Save-Context | Session:Pause |
|---------|-------------|---------------|
| **Quando** | Apos cada operacao OMEGA | Ao encerrar sessao |
| **Onde** | `.claude/session-context.md` | `.planning/STATE.md` |
| **Profundidade** | Resumo rapido (3-5 linhas) | Handoff completo (20+ linhas) |
| **Objetivo** | Checkpoint intermediario | Handoff entre sessoes |
| **Quem le** | Mesmo agente, mesma sessao | Qualquer agente, nova sessao |

---

## 17. Subcommand Manifest

### Tabela Completa dos Subcomandos /omega:*

#### Categoria: Lifecycle

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 1 | `/omega:project:new` | Demanda com 3+ fases | Nenhum projeto ativo sem milestone | planning | 85 | PROJECT.md, ROADMAP.md |
| 2 | `/omega:milestone:new` | Milestone anterior concluido ou primeiro | Audit aprovado (se nao primeiro) | planning | 85 | ROADMAP.md atualizado |
| 3 | `/omega:milestone:audit` | Todas fases do milestone executadas | Nenhum | validation | 95 | AUDIT.md |
| 4 | `/omega:milestone:complete` | Audit aprovado | Verdict != BLOCKED | validation | 95 | Milestone arquivado |
| 5 | `/omega:phase:add` | Roadmap existente | PM autorizou | planning | 85 | Fase adicionada |
| 6 | `/omega:phase:insert` | Roadmap existente, urgencia | PM autorizou | planning | 85 | Fase inserida |
| 7 | `/omega:phase:remove` | Fase futura (nao iniciada) | PM autorizou | planning | 85 | Fase removida |

#### Categoria: Context

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 8 | `/omega:phase:discuss {N}` | Antes de planejar fase | Nenhum | research | 80 | CONTEXT.md |
| 9 | `/omega:phase:research {N}` | Tech nova ou complexa | Nenhum | research | 80 | RESEARCH.md |
| 10 | `/omega:map-codebase` | Codebase a analisar | Nenhum | research | 80 | 7 docs em codebase/ |
| 11 | `/omega:phase:assumptions {N}` | Antes de aprovar planos | Nenhum | research | 80 | Lista de premissas |

#### Categoria: Planning

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 12 | `/omega:phase:plan {N}` | CONTEXT.md existe | PM autorizou | planning | 85 | PLAN.md files |
| 13 | `/omega:validate-plan` | PLAN.md existe | Nenhum | validation | 95 | Verdict |

#### Categoria: Execution

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 14 | `/omega:phase:execute {N}` | PLAN.md aprovado | PM autorizou | implementation | 90 | Commits + SUMMARY.md |
| 15 | `/omega:quick "desc"` | Task < 3 steps | Nenhum | implementation | 90 | quick/{NNN}/ |
| 16 | `/omega:quick --full "desc"` | Task que precisa verificacao | Nenhum | implementation | 90 | quick/{NNN}/ + verify |
| 17 | `/omega:debug "desc"` | Bug persistente (2+ falhas) | Nenhum | implementation | 90 | debug/{slug}.md |
| 18 | `/omega:build-system` | PRD/N8N/URL/briefing | Nenhum | implementation | 90 | Sistema completo |

#### Categoria: Quality

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 19 | `/omega:phase:verify {N}` | Fase executada (commits) | Nenhum | validation | 95 | UAT.md |

#### Categoria: Session

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 20 | `/omega:progress` | Projeto inicializado | Nenhum | — | — | Status visual |
| 21 | `/omega:session:pause` | Trabalho em andamento | Nenhum | — | — | STATE.md handoff |
| 22 | `/omega:session:resume` | STATE.md com handoff | Nenhum | — | — | Contexto restaurado |
| 23 | `/omega:todo:add` | Ideia fora do escopo | Nenhum | — | — | Todo registrado |
| 24 | `/omega:todo:list` | Nenhum | Nenhum | — | — | Lista de pendencias |

#### Categoria: Config

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 25 | `/omega:settings` | Nenhum | Nenhum | — | — | Config atualizado |
| 26 | `/omega:synapse` | Nenhum | Nenhum | — | — | Dashboard agentes |
| 27 | `/omega:health` | Suspeita de inconsistencia | Nenhum | — | — | Diagnostico |

#### Categoria: Mind Clone (MMOS v2)

| # | Subcomando | Pre-condicao | Guard | task_type | Threshold | Output |
|---|-----------|-------------|-------|-----------|-----------|--------|
| 28 | `/omega:mmos:clone-mind {nome}` | Conteudo fonte disponivel | Nenhum | mind_clone | 95 | DNA YAML completo |
| 29 | `/omega:mmos:mind-update {nome}` | Clone existente + conteudo | Clone existe | mind_update | 95 | DNA atualizado |
| 30 | `/omega:mmos:dossie {tema}` | Clones existentes sobre tema | Nenhum | mind_clone | 95 | Dossie tematico |
| 31 | `/omega:mmos:ingest` | Conteudo no inbox/ | Nenhum | research | 80 | Conteudo processado |

### Subcomandos SEM OMEGA Loop (informativos)

Os seguintes subcomandos NAO disparam o OMEGA loop (nao produzem output executavel):

- `/omega:progress` — apenas le e exibe estado
- `/omega:session:pause` — apenas persiste estado
- `/omega:session:resume` — apenas restaura estado
- `/omega:todo:add` / `/omega:todo:list` — apenas registra/lista
- `/omega:settings` — apenas exibe/atualiza config
- `/omega:synapse` — apenas exibe dashboard
- `/omega:health` — apenas diagnostica

**Regra:** Subcomandos informativos nao emitem OMEGA_STATUS block e nao contam para o rate limiter.

**Total: 31 subcomandos** (24 com OMEGA loop + 7 informativos).

---

## 18. Authorization Chain

### 18.1 Matriz de Permissoes

| Acao | PM (ATLAS) | Architect (NEXUS) | Backend (FORGE) | Frontend (PRISM) | QA (SENTINEL) | Context (COMPASS) | Devil (SHADOW) | Outros |
|------|-----------|-------------------|-----------------|------------------|---------------|-------------------|----------------|--------|
| Iniciar projeto | **AUTORIZA** | Executa design | — | — | — | — | — | — |
| Criar milestone | **AUTORIZA** | Valida viabilidade | — | — | — | — | — | — |
| Discutir fase | Delega | Participa | — | — | — | **EXECUTA** | — | — |
| Pesquisar fase | Delega | **EXECUTA** | — | — | — | **EXECUTA** | — | — |
| Planejar fase | Delega | **EXECUTA** | — | — | — | Alimenta contexto | — | — |
| Validar plano | Aprova final | — | — | — | — | — | **EXECUTA** | — |
| Executar fase | **AUTORIZA** | — | **EXECUTA** | **EXECUTA** | — | — | — | BRIDGE, TITAN |
| Verificar fase | Valida conclusao | — | — | — | **EXECUTA** | — | — | — |
| Auditar milestone | Decide | — | — | — | **EXECUTA** | Audita contexto | Contesta | — |
| Completar milestone | **UNICO** | — | — | — | — | — | — | — |
| Quick task | Avalia escopo | Pode executar | **EXECUTA** | **EXECUTA** | — | — | — | BRIDGE |
| Debug | Avalia | — | **EXECUTA** | — | **EXECUTA** | — | — | BRIDGE |
| Map codebase | Delega | **EXECUTA** | — | — | — | — | — | — |
| Pause/Resume | **EXECUTA** | — | — | — | — | — | — | — |
| Inserir/Remover fase | **UNICO** | Propoe | — | — | — | — | — | — |
| Rollback | **UNICO** | — | — | — | — | — | — | — |
| Override circuit breaker | **UNICO** | — | — | — | — | — | — | — |
| Cancelar OMEGA loop | **UNICO** | — | — | — | — | — | — | — |
| Ajustar thresholds | **UNICO** | Recomenda | — | — | — | — | — | — |
| Mind clone | Delega | — | — | — | — | **EXECUTA** | — | LENS |
| Mind update | Delega | — | — | — | — | **EXECUTA** | — | LENS |

### 18.2 Fluxo de Decisao

```
DECISAO DE EXECUCAO:
  Usuario pede algo
  -> ATLAS (PM) avalia escopo e complexidade
  -> Se escopo < 3 tasks: /omega:quick (agente competente)
  -> Se escopo >= 3 tasks: /omega:project:new (workflow formal)

WORKFLOW FORMAL:
  ATLAS autoriza
  -> COMPASS: /omega:phase:discuss {N}
  -> NEXUS: /omega:phase:plan {N}
  -> SHADOW: /omega:validate-plan
  -> ATLAS aprova plano
  -> FORGE/PRISM: /omega:phase:execute {N}
  -> SENTINEL: /omega:phase:verify {N}
  -> ATLAS valida conclusao

ESCALACAO (OMEGA Router — 4 niveis):
  Nivel 1: Retry (mesmo agente, nova iteracao)
  Nivel 2: Vertical (outro agente assume)
  Nivel 3: Horizontal (multiplos agentes paralelos)
  Nivel 4: Human (usuario decide)
```

### 18.3 Regras Especiais

| Regra | Detalhe |
|-------|---------|
| PM nunca executa | ATLAS orquestra e autoriza. Nunca escreve codigo, nunca audita, nunca projeta. |
| SHADOW nao executa tasks | SHADOW contesta, nao implementa. Influencia OMEGA via validacao de planos. |
| QA pode bloquear release | SENTINEL com score < 95 em verify = fase nao pode ser declarada completa. |
| Agentes custom sao escopo-limitados | TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE operam dentro do escopo delegado pelo PM. |
| Nenhum agente auto-aprova | Score OMEGA e calculado por evidencias, nao por declaracao do agente. |

---

## 19. Synapse v3 Integration

### 19.1 Synapse Context Stack — 8 Camadas (L0-L7)

OMEGA v2 carrega e consome o Synapse Context Stack em 8 camadas. A carga acontece ANTES do inicio de cada task.

```
+--------------------------------------------------+
| L7: Star Commands (comandos prioritarios)        | <- Carregado se agente tem star commands
| L6: Keywords (termos relevantes da task)         | <- Injetado pelo OMEGA ao iniciar task
| L5: Squad Context (time de agentes atual)        | <- Carregado se task envolve multi-agent
| L4: Task Parameters (dados especificos da task)  | <- Injetado pelo OMEGA com task details
| L3: Fase do Workflow (discuss/plan/execute/...)   | <- Determinado pelo OMEGA lifecycle state
| L2: Persona do Agente (quem esta executando)     | <- Carregado do agent definition file
| L1: Global Framework (OMEGA como framework)      | <- Este protocolo (OMEGA v2)
| L0: Constitution (principios inviolaveis)        | <- Sempre carregado primeiro
+--------------------------------------------------+
```

### 19.2 L0 — Constitution

**Quando carregar:** SEMPRE. Toda task, todo agente, toda sessao.

**Como OMEGA carrega:**
1. OMEGA verifica se `.claude/protocols/CONSTITUTION.md` existe
2. Principios constitucionais sao carregados como hard stops (violacao = terminacao imediata)
3. Artigo 5 (OMEGA obrigatorio) e referencia circular — OMEGA carrega a si mesmo como obrigacao constitucional

**O que OMEGA faz com L0:**
- Usa como base para as 13 condicoes de terminacao (condicao #6: violacao constitucional)
- Valida que nenhum output viola artigos 1-5

### 19.3 L1 — Global Framework (OMEGA como framework)

**Quando carregar:** SEMPRE para tasks que passam pelo OMEGA loop.

**Como OMEGA se posiciona:**
- OMEGA v2 e O framework global de execucao. Nao e mais um "wrapper" sobre o GSD.
- L1 carrega as regras do OMEGA: thresholds, loop config, circuit breaker settings

**O que OMEGA faz com L1:**
- Configura o execution environment baseado no `config.yaml`
- Define max_iterations, thresholds e escalation order para a sessao

### 19.4 L2 — Persona do Agente

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

### 19.5 L3 — Fase do Workflow

**Quando carregar:** Em tasks que fazem parte de um lifecycle formal (projeto/milestone/fase).

**Como OMEGA mapeia a fase atual:**
1. Le `.planning/ROADMAP.md` para determinar milestone e fase ativos
2. Le `.claude/session-context.md` para estado mais recente
3. Determina o estado da fase: `discussing | planning | executing | verifying | completed`

**Mapeamento fase -> Synapse state:**

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

### 19.6 L4 — Task Parameters

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

### 19.7 L5 — Squad Context

**Quando carregar:** Em tasks que envolvem multiplos agentes (squad operations).

**Como OMEGA popula contexto de squad:**
1. Le a team config (se existir): `~/.claude/teams/{team-name}/config.json`
2. Le Synapse state de todos os agentes do squad: `.claude/synapse/{agent}.yaml`
3. Compila visao consolidada: quem esta ativo, quem esta blocked, quem esta idle

**O que OMEGA faz com L5:**
- Informa ao agente atual quais agentes estao disponiveis para escalacao
- Identifica gargalos (agentes blocked)
- Permite escalacao horizontal informada

### 19.8 L6 — Keywords

**Quando carregar:** Opcionalmente, quando a task tem termos tecnicos relevantes.

**Como OMEGA injeta keywords:**
1. Extrai termos-chave da descricao da task
2. Extrai termos do CONTEXT.md e RESEARCH.md (se existirem)
3. Compila lista de keywords para enrichment de contexto

**O que OMEGA faz com L6:**
- Passa keywords ao agente como contexto adicional
- Permite busca semantica em dossies e mind clones (se relevante)

### 19.9 L7 — Star Commands

**Quando carregar:** Quando o agente tem comandos prioritarios definidos.

**Como OMEGA registra star commands:**
- Star commands sao subcomandos marcados como prioritarios para um agente especifico
- Exemplo: SENTINEL tem `/omega:phase:verify` como star command
- Carregados do agent definition file

**O que OMEGA faz com L7:**
- Prioriza star commands na sugestao de proximo passo
- Usa star commands para routing automatico (qual agente para qual task)

### 19.10 Atualizacao do Synapse pelo OMEGA

OMEGA nao apenas consome Synapse — tambem atualiza:

| Evento OMEGA | Atualizacao Synapse |
|-------------|-------------------|
| Task iniciada | `state: activated`, `task: {desc}`, timestamp |
| Fase mudou | `state: {analyzing/planning/executing/reviewing}` |
| Score calculado | `omega_history.last_score`, `last_task_type` |
| Task completada | `state: completed`, `omega_history.session_scores` append |
| Task escalada | `state: blocked`, `blocked_by: "escalation"` |
| Sessao encerrada | Manter ultimo estado (nao resetar) |

### 19.11 Registro OMEGA no Synapse

O Synapse registra o historico de scores OMEGA por agente. Cada agent state file (`.claude/synapse/{agente}.yaml`) inclui:

```yaml
omega_history:
  last_score: {0-100}
  last_task_type: "{type}"
  last_iteration: {1-3}
  last_result: "{completed|escalated|circuit_open}"
  session_scores:
    - date: "{YYYY-MM-DD}"
      task: "{descricao}"
      score: {N}
      result: "{completed|escalated}"
```

**Regras de registro:**
1. Atualizar `omega_history` apos cada task finalizada (completed ou escalated)
2. Manter apenas as ultimas 10 entradas em `session_scores` (FIFO)
3. Se um agente consistentemente fica abaixo do threshold (3+ vezes consecutivas), registrar flag `needs_attention: true`
4. Scores OMEGA sao READ-ONLY para o agente — apenas o protocolo OMEGA pode atualizar

**Uso pelo PM:** ATLAS pode consultar `omega_history` dos agentes para decidir delegacao. Um agente com historico de scores baixos em `implementation` pode ser substituido por outro para tasks criticas.

---

## 20. MMOS v2 Integration

### 20.1 Cada Fase MMOS como Task OMEGA

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

### 20.2 As 5 Autoridades como Camadas de Validacao

O MMOS define 5 autoridades que operam em cada fase. No OMEGA v2, cada autoridade se mapeia para um aspecto do loop de validacao:

| Autoridade MMOS | Papel | Mapeamento OMEGA v2 |
|----------------|-------|---------------------|
| **Allen (GTD)** | Captura, clarificacao, organizacao | Pre-processing: OMEGA classifica task antes do loop |
| **Forte (CODE)** | Summarizacao progressiva, packets intermediarios | Progress tracking: cada iteracao = progressive summarization |
| **Deming (PDSA)** | Plan-Do-Study-Act, hipoteses e metricas | OMEGA loop = PDSA: Plan(config) -> Do(execute) -> Study(score) -> Act(feedback/escalate) |
| **Kahneman** | Anti-vieses, base rates, avaliacao independente | Fresh reviewer principle + escalacao horizontal (avaliadores independentes) |
| **Gawande** | Checklists DO-CONFIRM, kill items | Dual-gate exit + backpressure gates |

### 20.3 Mapeamento OMEGA Loop = Deming PDSA

```
OMEGA LOOP          <->  DEMING PDSA
-----------------        ---------------
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

### 20.4 Kahneman dentro do OMEGA

| Principio Kahneman | Implementacao OMEGA |
|-------------------|---------------------|
| Anti-ancoragem | Contexto fresco por iteracao (principio fundamental #4) |
| Avaliacao independente | Escalacao horizontal: multiplos agentes independentes |
| Base rate | Checklists com criterios quantitativos (nao subjetivos) |
| Pre-mortem | SHADOW (Devil's Advocate) como validador obrigatorio em planning |
| Fragmentacao de julgamento | Cada criterio avaliado independentemente (nao nota global) |

### 20.5 Formula de Fidelidade MMOS v2

A fidelidade de um mind clone e calculada pela formula:

```
F = (L x 0.20) + (B x 0.30) + (C x 0.15) + (K x 0.20) + (V x 0.15)

Onde:
  L = Linguistic Accuracy   (0-100) — precisao linguistica
  B = Behavioral Fidelity   (0-100) — fidelidade comportamental
  C = Cognitive Consistency  (0-100) — consistencia cognitiva
  K = Knowledge Depth        (0-100) — profundidade de conhecimento
  V = Voice Authenticity     (0-100) — autenticidade da voz narrativa
```

**Meta de fidelidade:** >= 95%
**Se fidelidade < 95%:** usuario deve ser notificado e consultado antes de publicar o clone.

### 20.6 MMOS dentro do OMEGA — Fluxo Completo

```
/omega:mmos:clone-mind {nome}
  |
  +-- OMEGA inicializa pipeline MMOS
  |   +-- Carrega Synapse L0-L7 com contexto de mind clone
  |
  +-- FASE 1: Coleta (task_type: research, threshold: 80)
  |   +-- OMEGA loop: executa, score, feedback, repeat
  |   +-- Gate Gawande 1->2: kill items bloqueantes
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 2: Extracao (task_type: research, threshold: 80)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 2->3
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 3: Inferencia (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop (modelo: Opus obrigatorio)
  |   +-- Gate Gawande 3->4
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 4: Mapeamento (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 4->5
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 5: Perfil (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 5->6 (inclui blind test + pre-mortem)
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 6: Recomendacao (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Dual-gate met -> clone completo
  |
  +-- OMEGA finaliza: atualiza Synapse, registra em progress.log
```

### 20.7 Estrutura de Pastas dos Squads (Mind Clones)

Os artefatos de mind clones ficam em:

```
DUARTEOS/squad/{categoria}/{mind-name}/
  +-- cognitive-profile.md
  +-- behavioral-model.md
  +-- linguistic-fingerprint.md
  +-- narrative-voice.md
  +-- config.yaml
  +-- ...
```

**Categorias validas:** Copywriting, Marketing, UX-Design, AI, Tech, Business, Content, Product, Saude, Juridico

### 20.8 Mind Update dentro do OMEGA

```
/omega:mmos:mind-update {nome}
  |
  +-- OMEGA inicializa pipeline de update
  |
  +-- BACKUP automatico (antes de qualquer mudanca)
  |   +-- Copia completa para .claude/omega/backups/{clone-slug}/{timestamp}/
  |
  +-- DELTA ANALYSIS
  |   +-- Classifica cada mudanca: NOVO / REFORCO / EVOLUCAO
  |   +-- NOVO: informacao inexistente -> adiciona
  |   +-- REFORCO: confirma existente -> incrementa peso/fonte
  |   +-- EVOLUCAO: modifica/nuanca -> preserva ambas visoes com evidencia
  |
  +-- MERGE ADITIVO
  |   +-- NUNCA remove dados existentes
  |   +-- Contradicoes: armazena AMBAS perspectivas com fontes
  |   +-- Incrementa versao_dna
  |
  +-- REGRESSION CHECK
  |   +-- Re-roda testes do clone
  |   +-- Todos testes anteriores devem continuar passando
  |
  +-- FIDELITY CHECK
  |   +-- Calcula fidelidade pos-update
  |   +-- Se delta > 5%: AUTO-ROLLBACK do backup
  |   +-- Se delta <= 5%: update aceito
  |
  +-- OMEGA finaliza: score >= 95 para aprovacao
```

---

## 21. Gawande Gate Mapping

### 21.1 Conceito

Os Gates Gawande do MMOS sao checklists DO-CONFIRM entre fases. No OMEGA v2, cada gate e mapeado diretamente para o dual-gate exit:

```
Gate Gawande (DO-CONFIRM)
  |
  +-- Items "critical: true" -> Bloqueantes no OMEGA (backpressure)
  |   Se qualquer kill_item falha -> task.blocked (nao avanca)
  |
  +-- Items "critical: false" -> Warnings no OMEGA (nao-bloqueantes)
  |   Registrados no progress.log, mas nao impedem avancar
  |
  +-- Todos critical pass -> Mapeado como completion_signals
      + exit_signal: true -> dual-gate met -> proxima fase
```

### 21.2 Mapeamento por Gate

| Gate Gawande | Posicao | Kill Items (bloqueantes) | Warning Items | OMEGA Signals Requeridos |
|-------------|---------|------------------------|---------------|------------------------|
| Gate 1->2 | Apos Coleta | Coverage >= 90%, Zero fontes secundarias | Min 4 tipos fonte, Material preservado, Span temporal | `coverage_met`, `sources_validated` |
| Gate 2->3 | Apos Extracao | MIUs validados, Fragmentos com contexto | Dedup executado, Tags normalizadas | `schema_valid`, `data_integrity` |
| Gate 3->4 | Apos Inferencia | Drivers com evidencia, Correlacoes mapeadas | Confidence scores calculados | `fidelity_check`, `evidence_linked` |
| Gate 4->5 | Apos Mapeamento | Scores em todos sistemas, Mapa componente-driver | Coverage de sistemas >= 80% | `mapping_complete`, `scores_calculated` |
| Gate 5->6 | Apos Perfil | Perfil agregado coerente, Mind entity criada, Blind test passado | Pre-mortem executado | `fidelity_check`, `tests_pass` |

### 21.3 Exemplo de Mapeamento (Gate 1->2 — Coleta)

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

### 21.4 Regras de Interacao Gates Gawande <-> OMEGA

1. **Kill items sao bloqueantes.** Se qualquer kill item falha, a task OMEGA fica em estado `blocked` e nao avanca para a proxima fase.
2. **Warning items sao registrados.** Items nao-criticos que falham sao registrados no progress.log com tag `[GAWANDE_WARNING]`.
3. **Gates operam ENTRE fases.** O gate e verificado APOS a fase concluir no OMEGA loop e ANTES da proxima fase iniciar.
4. **Gate fallback.** Se um gate nao pode ser verificado (dados insuficientes), ele e tratado como WARNING e registrado. O PM decide se avanca.
5. **Acumulacao de warnings.** Se 3+ warnings acumulam no mesmo pipeline, OMEGA emite alerta ao PM para revisao.

---

## Apendice A — Glossario

| Termo | Definicao |
|-------|-----------|
| **OMEGA Loop** | O ciclo de execucao-avaliacao-refinamento que roda em toda task |
| **OMEGA_STATUS** | Bloco de metadados que todo agente emite ao final da execucao |
| **OMEGA_SIGNATURE** | Assinatura do agente em artefatos que modificam estado |
| **Dual-Gate** | Condicao de saida que exige score >= threshold E >= 2 completion signals + exit_signal |
| **Circuit Breaker** | Mecanismo de protecao contra loops infinitos (CLOSED/HALF_OPEN/OPEN) |
| **Backpressure** | Transformacao de evento "done" em "blocked" quando evidencias faltam |
| **Escalacao Vertical** | Outro agente assume a task que o agente atual nao resolveu |
| **Escalacao Horizontal** | Multiplos agentes tentam em paralelo |
| **Fresh Reviewer** | Principio de usar instancia sem ancoragem no trabalho anterior |
| **No-progress** | Iteracao onde score nao aumentou, nenhum arquivo mudou e SHA nao mudou |
| **Thrashing** | Alternar entre dois estados sem convergir |
| **Completion Signal** | Evidencia verificavel de que um aspecto da task esta concluido |
| **Progress Log** | Arquivo append-only com historico de todas as iteracoes OMEGA |
| **Auto-Checkpoint** | Snapshot automatico quando context utilization atinge 75% |
| **Model Routing** | Roteamento de task para modelo (Haiku/Sonnet/Opus) baseado em complexidade |
| **Lifecycle** | Hierarquia de execucao: Projeto > Milestone > Fase > Task |
| **Phase** | Unidade de trabalho dentro de um milestone com state machine propria |
| **Milestone** | Conjunto de fases que formam uma entrega auditavel |
| **Quick Task** | Task simples (1-3 steps) executada fora do lifecycle formal |
| **Save-Context** | Checkpoint automatico apos operacoes que mudam estado |
| **Handoff** | Estado completo salvo para retomada em nova sessao (STATE.md) |
| **Gate Gawande** | Checklist DO-CONFIRM entre fases do pipeline MMOS |
| **Kill Item** | Item do gate Gawande que e bloqueante (critical: true) |
| **DNA** | Estrutura de 6 camadas cognitivas de um mind clone no Synapse |
| **MIU** | Micro-Unidade Interpretativa Neural — fragmento semantico atomico do MMOS |
| **Fidelidade** | Score composto que mede quao fiel o clone e a pessoa real |
| **Delta Analysis** | Classificacao de mudancas como NOVO/REFORCO/EVOLUCAO em mind updates |
| **Merge Aditivo** | Principio de nunca remover dados existentes ao atualizar um clone |
| **Context Stack** | As 8 camadas (L0-L7) de contexto carregadas pelo Synapse v3 |
| **Star Command** | Subcomando prioritario para um agente especifico |
| **APEX Score** | Metrica composta de qualidade de mind clone (linguistica + comportamental + cognitiva + conhecimento + voz) |

---

## Apendice B — Referencia Rapida para Agentes

### Checklist: O Que Todo Agente Deve Fazer

1. Ler este protocolo no inicio de cada sessao que envolva execucao de tasks
2. Emitir OMEGA_STATUS block ao final de toda resposta de execucao
3. Incluir OMEGA_SIGNATURE em todo artefato que modifique estado
4. Respeitar thresholds — nao declarar "feito" se score < threshold
5. Aceitar feedback OMEGA — iterar ate atingir threshold ou ser escalado
6. Registrar progresso — SHA, files, tests no delta do OMEGA_STATUS
7. Reportar blockers — nao tentar resolver sozinho alem de max_iterations
8. Usar Edit > Write — desenvolvimento incremental e evidencia verificada pelo OMEGA
9. Save-context apos operacoes — atualizar session-context.md automaticamente
10. Respeitar guards de fase — nao pular etapas do lifecycle

### Template OMEGA_STATUS v2 (copiar e preencher)

```
<!-- OMEGA_STATUS
agent: {CODENAME}
task: {descricao}
iteration: {N de max_iterations}
task_type: {research | planning | implementation | validation | mind_clone | mind_update}
score: {0-100}
threshold: {threshold para este task_type}
phase: {N | null}
milestone: {N | null}
project: {slug | null}
evidence:
  - {evidencia 1}
  - {evidencia 2}
completion_signals:
  - {sinal 1}
  - {sinal 2}
exit_signal: {true | false}
blockers:
  - {bloqueio, se houver}
delta:
  files_modified: {N}
  files_created: {N}
  git_sha_before: {sha}
  git_sha_after: {sha}
  tests_added: {N}
  tests_passing: {N}/{total}
synapse_state: {activated | analyzing | planning | executing | reviewing | completed | blocked}
notes: {observacoes}
-->
```

### Diagrama de Decisao Rapida

```
Recebi uma task?
  |
  +-- SIM -> Emitir OMEGA_STATUS ao final? -> SIM (obrigatorio)
  |
  +-- Score >= threshold? -> SIM + 2 signals + exit_signal -> DONE
  |                       -> NAO -> proxima iteracao
  |
  +-- max_iterations sem sucesso? -> ESCALAR (nao insistir)
  |
  +-- Circuit breaker OPEN? -> PARAR (aguardar cooldown ou escalacao)
```

### Comandos Mais Usados por Agente

| Agente | Comando Primario | Comando Secundario |
|--------|-----------------|-------------------|
| ATLAS (PM) | `/omega:project:new` | `/omega:progress`, `/omega:session:pause` |
| NEXUS (Architect) | `/omega:phase:plan` | `/omega:map-codebase` |
| FORGE (Backend) | `/omega:phase:execute` | `/omega:quick` |
| PRISM (Frontend) | `/omega:phase:execute` | `/omega:quick` |
| SENTINEL (QA) | `/omega:phase:verify` | `/omega:debug` |
| COMPASS (Context) | `/omega:phase:discuss` | `/omega:phase:research` |
| SHADOW (Devil) | `/omega:validate-plan` | `/omega:phase:assumptions` |
| BRIDGE (Fullstack) | `/omega:phase:execute` | `/omega:quick`, `/omega:debug` |

---

## Apendice C — Mapa de Integracao

### OMEGA v2 no Ecossistema DuarteOS

```
+-----------------------------------------------------------------+
|  USUARIO                                                         |
|  Demanda -> ATLAS (PM) -> Delega task                           |
+-----------------------------------------------------------------+
|  OMEGA v2 ENGINE (este protocolo)                                |
|                                                                  |
|  +-----------------------------------------------------------+  |
|  |  OMEGA Loop                                                |  |
|  |  [Execute -> Score -> Threshold? -> Feedback -> Repeat]    |  |
|  |                                                            |  |
|  |  Camadas:                                                  |  |
|  |  +-- LIFECYCLE (projetos, milestones, fases)              |  |
|  |  +-- EXECUTION (loop, circuit breaker, escalation)        |  |
|  |  +-- QUALITY (checklists, dual-gate, backpressure)        |  |
|  |  +-- CONTEXT (Synapse L0-L7 stack)                        |  |
|  |  +-- MIND CLONE (MMOS v2 pipeline)                        |  |
|  |                                                            |  |
|  |  Protocolos consumidos:                                    |  |
|  |  +-- CONSTITUTION.md (principios inviolaveis)             |  |
|  |  +-- SYNAPSE.md (estado + DNA + dossiers)                 |  |
|  |  +-- QUALITY-GATES.md (9 gates existentes)                |  |
|  |  +-- Checklists em .claude/omega/checklists/              |  |
|  +-----------------------------------------------------------+  |
|                                                                  |
+-----------------------------------------------------------------+
|  AGENTES (executam DENTRO do OMEGA loop)                         |
|  ATLAS, NEXUS, FORGE, PRISM, SENTINEL, COMPASS, SHADOW,        |
|  TITAN, SPARK, LENS, VAULT, SPECTER, BRIDGE                     |
+-----------------------------------------------------------------+
|  PERSISTENCIA                                                    |
|  .planning/ (artefatos de lifecycle)                            |
|  .claude/omega/ (engine state, progress log, checkpoints)       |
|  .claude/synapse/ (agent state, DNA, dossiers)                  |
|  .claude/session-context.md (checkpoint continuo)               |
+-----------------------------------------------------------------+
```

### Dependencias entre Protocolos

| Protocolo | OMEGA Depende De | Depende de OMEGA |
|-----------|-----------------|------------------|
| CONSTITUTION.md | SIM — principios sao hard stops | NAO |
| QUALITY-GATES.md | SIM — gates sao completion signals | SIM — OMEGA orquestra gates |
| SYNAPSE.md | SIM — estado e contexto dos agentes | SIM — OMEGA atualiza estado |
| mmos-extraction-engine-v2.md | SIM — pipeline de mind clones | SIM — cada fase passa por OMEGA |

> **Nota:** O AGENT-GSD-PROTOCOL.md esta **deprecado**. Todo seu conteudo foi absorvido por este protocolo (OMEGA v2). O arquivo sera arquivado em v6.1.

---

## Apendice D — Cenarios de Uso

### Cenario 1: Task Simples que Passa na Primeira Iteracao

```
ATLAS delega: "Adicionar campo email ao schema User"
Agente: FORGE
Complexidade: 2 -> Modelo: Haiku

Iteracao 1:
  FORGE: adiciona campo, atualiza tipo, adiciona teste
  OMEGA_STATUS: score 94/90, signals: [tests_pass, types_check, lint_clean, incremental_edit], exit_signal: true
  OMEGA: dual-gate met. Task concluida em 1 iteracao.
```

### Cenario 2: Task que Precisa de Refinamento

```
ATLAS delega: "Implementar rate limiting no API gateway"
Agente: FORGE
Complexidade: 7 -> Modelo: Opus

Iteracao 1:
  FORGE: implementa rate limiter basico
  OMEGA_STATUS: score 65/90
  OMEGA_FEEDBACK: "Faltam: testes para edge cases, lint errors, nao tratou cenario de distributed rate limiting"

Iteracao 2:
  FORGE: adiciona testes, corrige lint, adiciona Redis adapter
  OMEGA_STATUS: score 82/90
  OMEGA_FEEDBACK: "Faltam: teste de concorrencia, coverage para fallback path"

Iteracao 3:
  FORGE: adiciona teste de concorrencia, cobre fallback
  OMEGA_STATUS: score 93/90, signals: [tests_pass, types_check, lint_clean, coverage_met], exit_signal: true
  OMEGA: dual-gate met. Task concluida em 3 iteracoes.
```

### Cenario 3: Task que Escala Verticalmente

```
ATLAS delega: "Refatorar sistema de permissoes para RBAC"
Agente: FORGE
Complexidade: 9 -> Modelo: Opus

Iteracao 1-3: FORGE tenta, melhor score = 72/90 (arquitetura inadequada)

OMEGA escala verticalmente: gap = arquitetura
ATLAS redireciona para NEXUS (Architect)

NEXUS redesenha a arquitetura, gera PLAN.md

ATLAS redireciona para FORGE com novo plano
FORGE implementa seguindo o plano de NEXUS

Iteracao 1 (nova tentativa):
  FORGE: implementa RBAC conforme plano
  OMEGA_STATUS: score 91/90, dual-gate met
  OMEGA: Task concluida apos escalacao vertical.
```

### Cenario 4: Circuit Breaker Ativado

```
ATLAS delega: "Integrar API externa XYZ"
Agente: FORGE

Iteracao 1: score 45. API retorna 500.
Iteracao 2: score 45. Mesmo erro. (no-progress #1)
  Circuit breaker: CLOSED -> HALF_OPEN

Iteracao 3: score 45. Mesmo erro. (no-progress #2, same-error #3)
  Circuit breaker: HALF_OPEN -> OPEN

OMEGA: Circuit breaker OPEN. Escalacao ao usuario.

OMEGA ESCALACAO:
  Task: Integrar API externa XYZ
  Melhor score: 45/90
  Gap: API externa retornando 500 — dependencia fora do controle
  Opcoes: 1) ACCEPT 2) CONTINUE (apos API resolver) 3) CANCEL 4) ADJUST
```

### Cenario 5: Mind Clone com OMEGA + MMOS

```
ATLAS delega: "Criar mind clone para novo expert"
Pipeline: /omega:mmos:clone-mind
Modelo: Opus (obrigatorio)

Fase 1 (Coleta):
  COMPASS coleta 25 fontes primarias
  OMEGA_STATUS: score 85/80, dual-gate met
  Gate Gawande 1->2: coverage 92%, zero secundarias -> PASS

Fase 2 (Extracao):
  COMPASS extrai MIUs com contexto
  OMEGA_STATUS: score 82/80, dual-gate met
  Gate Gawande 2->3: MIUs validados, fragmentos com contexto -> PASS

Fase 3 (Inferencia):
  COMPASS infere drivers e frameworks
  Iteracao 1: score 88/95 -> paradoxos insuficientes
  Iteracao 2: score 96/95 -> dual-gate met
  Gate Gawande 3->4: drivers com evidencia -> PASS

Fase 4-6: (similar)

Resultado: DNA YAML completo, fidelidade 96%
```

### Cenario 6: Lifecycle Completo com /omega:*

```
1. ATLAS: /omega:project:new -> ROADMAP com 2 milestones, 5 fases
2. COMPASS: /omega:phase:discuss 1 -> CONTEXT.md (score 83/80)
3. NEXUS: /omega:phase:plan 1 -> 3 PLAN.md files (score 87/85)
4. SHADOW: /omega:validate-plan -> APPROVED com 1 caveat
5. FORGE: /omega:phase:execute 1 -> 5 commits (score 92/90)
6. SENTINEL: /omega:phase:verify 1 -> PASSED (score 96/95)
7. ATLAS: fase 1 completed, avanca para fase 2
8. [...fases 2-5...]
9. SENTINEL: /omega:milestone:audit -> APPROVED
10. ATLAS: /omega:milestone:complete -> Milestone 1 archived
```

---

## Apendice E — Configuracao

### Parametros Configuraveis

Arquivo: `.claude/omega/config.yaml`

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

  # Lifecycle (absorvido do GSD)
  lifecycle:
    artifacts_dir: ".planning"
    phases_dir: ".planning/phases"
    milestones_dir: ".planning/milestones"
    quick_dir: ".planning/quick"
    debug_dir: ".planning/debug"
    codebase_dir: ".planning/codebase"
    todos_dir: ".planning/todos"
    state_file: ".planning/STATE.md"

  # Session management
  session:
    context_file: ".claude/session-context.md"
    auto_save_context: true
    auto_checkpoint_context_percent: 75

  # Synapse integration
  synapse:
    context_stack_enabled: true
    agent_state_dir: ".claude/synapse"
    minds_dir: ".claude/synapse/minds"
    auto_update_agent_state: true

  # MMOS integration
  mmos:
    pipeline_enabled: true
    model_override: "opus"
    gate_gawande_blocking: true
    fidelity_threshold: 95
    fidelity_formula: "F = (L*0.20) + (B*0.30) + (C*0.15) + (K*0.20) + (V*0.15)"

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

### Desabilitando OMEGA

Para desabilitar OMEGA (nao recomendado), setar `omega.enabled: false` no `config.yaml`. Isso desativa o loop, mas mantem os quality gates existentes (QUALITY-GATES.md) ativos.

**Aviso:** Desabilitar OMEGA remove o loop de refinamento e a escalacao automatica. Tasks serao consideradas completas na primeira tentativa, sem verificacao de evidencias. Use apenas para debug ou sessoes interativas de exploracao.

---

## Apendice F — Migration Guide (GSD -> OMEGA v2)

### O Que Mudou

| Aspecto | GSD (antes) | OMEGA v2 (depois) |
|---------|------------|-------------------|
| Motor de execucao | GSD Engine + OMEGA wrapper | OMEGA v2 (unico motor) |
| Namespace de comandos | `/gsd:*` + `/DUARTEOS:squad:*` | `/omega:*` (unificado) |
| Protocolo principal | AGENT-GSD-PROTOCOL.md | OMEGA.md (este arquivo) |
| Quality gates | OMEGA envolve GSD | Nativo no OMEGA |
| Artefatos | `.planning/` (gerido pelo GSD) | `.planning/` (gerido pelo OMEGA) |
| Estado do loop | `.claude/omega/state.json` | `.claude/omega/state.json` (expandido) |
| Session management | GSD pause/resume | OMEGA session:pause/resume |
| Lifecycle | GSD new-project, milestones | OMEGA project, milestone, phase |

### Mapeamento de Comandos (GSD -> OMEGA v2)

| Comando GSD Antigo | Comando OMEGA v2 |
|-------------------|------------------|
| `/gsd:new-project` | `/omega:project:new` |
| `/gsd:new-milestone` | `/omega:milestone:new` |
| `/gsd:complete-milestone` | `/omega:milestone:complete` |
| `/gsd:audit-milestone` | `/omega:milestone:audit` |
| `/gsd:discuss-phase N` | `/omega:phase:discuss {N}` |
| `/gsd:research-phase N` | `/omega:phase:research {N}` |
| `/gsd:plan-phase N` | `/omega:phase:plan {N}` |
| `/gsd:execute-phase N` | `/omega:phase:execute {N}` |
| `/gsd:verify-work N` | `/omega:phase:verify {N}` |
| `/gsd:add-phase` | `/omega:phase:add` |
| `/gsd:insert-phase` | `/omega:phase:insert` |
| `/gsd:remove-phase` | `/omega:phase:remove` |
| `/gsd:list-phase-assumptions N` | `/omega:phase:assumptions {N}` |
| `/gsd:quick "desc"` | `/omega:quick "desc"` |
| `/gsd:quick --full "desc"` | `/omega:quick --full "desc"` |
| `/gsd:debug "desc"` | `/omega:debug "desc"` |
| `/gsd:progress` | `/omega:progress` |
| `/gsd:pause-work` | `/omega:session:pause` |
| `/gsd:resume-work` | `/omega:session:resume` |
| `/gsd:add-todo` | `/omega:todo:add` |
| `/gsd:check-todos` | `/omega:todo:list` |
| `/gsd:settings` | `/omega:settings` |
| `/gsd:health` | `/omega:health` |
| `/gsd:map-codebase` | `/omega:map-codebase` |
| `/DUARTEOS:squad:new-project` | `/omega:project:new` (via squad) |
| `/DUARTEOS:squad:plan-phase N` | `/omega:phase:plan {N}` (via squad) |
| `/DUARTEOS:squad:execute-phase N` | `/omega:phase:execute {N}` (via squad) |
| `/DUARTEOS:squad:verify-work N` | `/omega:phase:verify {N}` (via squad) |
| `/DUARTEOS:squad:discuss-phase N` | `/omega:phase:discuss {N}` (via squad) |
| `/DUARTEOS:squad:validate-plan` | `/omega:validate-plan` (via squad) |
| `/DUARTEOS:squad:audit` | `/omega:milestone:audit` (via squad) |
| `/DUARTEOS:squad:quick "desc"` | `/omega:quick "desc"` (via squad) |
| `/DUARTEOS:squad:debug "desc"` | `/omega:debug "desc"` (via squad) |
| `/DUARTEOS:squad:progress` | `/omega:progress` (via squad) |
| `/DUARTEOS:squad:pause` | `/omega:session:pause` (via squad) |
| `/DUARTEOS:squad:resume` | `/omega:session:resume` (via squad) |
| `/DUARTEOS:squad:build-system` | `/omega:build-system` (via squad) |
| `/DUARTEOS:squad:map-codebase` | `/omega:map-codebase` (via squad) |
| `/DUARTEOS:squad:synapse` | `/omega:synapse` |
| `/DUARTEOS:squad:clone-mind` | `/omega:mmos:clone-mind` |
| `/DUARTEOS:squad:ingest` | `/omega:mmos:ingest` |
| `/DUARTEOS:squad:dossie` | `/omega:mmos:dossie` |
| `/DUARTEOS:mmos:mind-clone` | `/omega:mmos:clone-mind` |
| `/DUARTEOS:mmos:mind-update` | `/omega:mmos:mind-update` |

### Compatibilidade Backward

**Periodo de transicao (v6.0):**

Durante a versao 6.0, ambos os namespaces serao aceitos:
- `/gsd:*` -> redireciona internamente para `/omega:*` com warning de deprecation
- `/DUARTEOS:squad:*` -> permanece como alias para operacoes multi-agente

**Mecanismo de redirect:**
- Cada invocacao de `/gsd:*` emite: `[OMEGA] WARN: /gsd:{command} esta deprecado. Use /omega:{equivalent}. Executando normalmente.`
- Log de uso de comandos deprecados para metricas de migracao

**Remocao (v6.1):**
- `/gsd:*` removido completamente
- AGENT-GSD-PROTOCOL.md arquivado
- Apenas `/omega:*` aceito

### Ordem de Implementacao

```
Fase 1: Fundacao (esta fase)
  +-- Escrever OMEGA v2 protocolo (este documento)
  +-- Atualizar config.yaml com novas secoes
  +-- Expandir state.json schema

Fase 2: Redirect Layer
  +-- Implementar redirect /gsd:* -> /omega:* com warning
  +-- Atualizar squad commands para invocar /omega:*
  +-- Testes de compatibilidade

Fase 3: Agent Updates
  +-- Atualizar manifests de cada agente (13 agentes)
  +-- Atualizar CONSTITUTION.md
  +-- Atualizar SYNAPSE.md

Fase 4: Cleanup
  +-- Remover redirects /gsd:*
  +-- Arquivar AGENT-GSD-PROTOCOL.md
  +-- Arquivar OMEGA v1

Fase 5: Distribution
  +-- Atualizar templates/ para novos usuarios
  +-- Atualizar src/init.mjs e src/update.mjs
  +-- Bump versao para 6.0.0
```

---

## Versionamento

| Versao | Data | Mudanca |
|--------|------|---------|
| 1.0.0 | 2026-03-02 | Protocolo inicial — core loop, quality gates, circuit breaker, escalation router, progress tracking, backpressure, model routing, state persistence, integracao com agentes |
| 2.0.0 | 2026-03-03 | OMEGA v2 — absorve GSD (lifecycle, session, artifacts, recipes, authorization), integra Synapse v3 (8 camadas L0-L7), integra MMOS v2 (6 fases, 5 autoridades, gates Gawande, formula fidelidade). Namespace unificado /omega:*. 31 subcomandos. Migration guide GSD -> OMEGA v2. |
