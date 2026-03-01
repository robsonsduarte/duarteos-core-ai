# Squad: Planejar Fase

Planejamento completo de uma fase do roadmap com pesquisa, planos executaveis e validacao.

**Agente Lider:** ATLAS (PM) — orquestra o pipeline via Task tool
**Pipeline:** COMPASS (Context Engineer) → NEXUS (Architect) → SHADOW (Devil's Advocate)
**Motor:** GSD `plan-phase` (researcher → planner → plan-checker loop)

## Descricao

Cria PLAN.md executaveis para uma fase do roadmap. Segue o loop de qualidade: Research → Plan → Verify → Revision (max 3x). Cada plano tem tasks atomicas com criterios de verificacao automatizados.

## Quando usar

- Apos o roadmap estar definido e a fase escolhida
- Quando uma fase precisa de planejamento detalhado antes da execucao
- Corresponde a Fase 1 (Arquitetura) do fluxo do Squad

## Como funciona

**Pipeline sequencial (ATLAS orquestra via Task tool):**

1. **COMPASS (Context Engineer)** — Se CONTEXT.md da fase NAO existe, ATLAS spawna COMPASS para executar `/gsd:discuss-phase $ARGUMENTS` e produzir CONTEXT.md com decisoes capturadas.

2. **NEXUS (Architect)** — ATLAS spawna NEXUS para criar PLAN.md usando CONTEXT.md + ROADMAP.md. NEXUS executa `/gsd:plan-phase $ARGUMENTS` que ira:
   - Pesquisar implementacao da fase (gsd-phase-researcher)
   - Criar PLAN.md files com tasks atomicas (gsd-planner)
   - Estruturar dependencias e wave ordering

3. **SHADOW (Devil's Advocate)** — ATLAS spawna SHADOW para validar/contestar o plano. SHADOW executa o plan-checker do GSD e avalia:
   - Planos cobrem o goal da fase?
   - Ha riscos nao mapeados ou dependencias ocultas?
   - Tasks sao realmente atomicas e verificaveis?

4. **Loop de revisao** — Se SHADOW identifica bloqueios:
   - Feedback retorna ao passo 2 (NEXUS revisa o plano)
   - Maximo 3 iteracoes do loop NEXUS → SHADOW
   - Se apos 3 iteracoes ainda houver bloqueios, ATLAS apresenta divergencias ao usuario

5. **ATLAS apresenta** plano aprovado ao usuario com trade-offs e riscos identificados

> **IMPORTANTE:** ATLAS (PM) NUNCA executa os passos diretamente — apenas orquestra spawns. Cada agente opera com sua especializacao exclusiva.

## Flags disponiveis

- `--research` — forca pesquisa mesmo se RESEARCH.md ja existe
- `--skip-research` — pula pesquisa
- `--gaps` — planeja apenas gaps encontrados em verificacao anterior
- `--skip-verify` — pula plan-checker
- `--auto` — executa sem parar para confirmacao

## Output esperado

`.planning/phases/{NN}-{nome}/` com:
- `{NN}-CONTEXT.md` (decisoes de implementacao)
- `{NN}-RESEARCH.md` (pesquisa tecnica)
- `{NN}-{01..N}-PLAN.md` (planos executaveis com waves)
