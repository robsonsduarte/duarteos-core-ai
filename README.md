# DuarteOS Core AI

Sistema multi-agente deliberativo-executivo para [Claude Code](https://claude.ai/code). Instala 7 agentes especializados com orquestracao Squad e integracao GSD (Get Shit Done) em qualquer projeto.

## O que e

Um pacote que injeta inteligencia de orquestracao no seu projeto Claude Code:

- **7 Agentes Especializados** com lentes cognitivas distintas
- **14 Comandos Squad** integrados com o motor GSD
- **Fluxo deliberativo-executivo** com loop fechado
- **Zero dependencias** — apenas arquivos `.claude/` no seu projeto

## Agentes

| Agente | Lente Cognitiva | Poder Executivo |
|--------|-----------------|-----------------|
| **PM** (Supreme Orchestrator) | Orquestracao, priorizacao, decisao | Reabrir fases, forcar rollback, encerrar loops |
| **Arquiteto** | Sistemas, trade-offs, estrutura | Criar/refatorar estrutura, implementar esqueleto |
| **Backend Dev** | Logica server-side, seguranca | Implementar features, corrigir bugs |
| **Frontend Dev** | UI premium, viralidade visual | Implementar interfaces, elevar padrao |
| **QA** | Rigor, prova, evidencia | Escrever testes, bloquear sem prova |
| **Context Engineer** | Semantica, coerencia, anti-drift | Reestruturar prompts, corrigir drift |
| **Advogado do Diabo** | Ceticismo, red team | Questionar tudo, bloquear riscos criticos |

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

## O que instala

```
.claude/
  settings.json                    # Habilita agent teams
  session-context.md               # Template de contexto persistente
  commands/
    agents/
      squad.md                     # Orquestrador multi-agente
      pm.md                        # Gerente de Projetos
      architect.md                 # Arquiteto de Software
      backend.md                   # Desenvolvedor Backend
      frontend.md                  # Desenvolvedor Frontend
      qa.md                        # Analista de Qualidade
      context-engineer.md          # Engenheiro de Coerencia
      devils-advocate.md           # Advogado do Diabo (Red Team)
    squad/
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
.planning/
  config.json                      # Configuracao GSD
```

## Pre-requisitos

1. **Claude Code** instalado ([claude.ai/code](https://claude.ai/code))
2. **GSD** instalado ([github.com/cleyio/gsd](https://github.com/cleyio/gsd))

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

## Licenca

MIT
