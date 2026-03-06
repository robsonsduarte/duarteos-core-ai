# {{PROJECT_NAME}} — Instrucoes do Projeto

## Modo de Operacao: YOLO

Este projeto opera em **YOLO mode** — execucao autonoma com guardrails minimos.

### Auto-Approve (executar sem perguntar)

- Ler qualquer arquivo
- Editar/criar arquivos no projeto (versionados pelo git)
- Rodar testes, builds, linters, formatters
- Commits locais (git add, git commit)
- Criar branches (git checkout -b, git branch)
- Instalar dependencias do projeto (npm/bun/yarn install)
- Deletar arquivos em /tmp/ ou /temp/
- Operacoes de busca (grep, find, glob)
- Copiar, mover, renomear arquivos dentro do projeto
- Qualquer operacao reversivel via git

### Confirmar Antes (pedir autorizacao explicita)

- Deletar arquivos ou diretorios fora de /tmp/ e /temp/
- Alterar arquivos nao versionados de forma irreversivel
- `git push` (qualquer variante, especialmente --force)
- `git reset --hard`
- Criar, fechar ou comentar em PRs e Issues (gh pr create, gh issue, etc.)
- Enviar mensagens externas (email, Slack, webhooks)
- Modificar .env, credentials, tokens ou secrets
- Instalar ou remover pacotes globais do sistema (brew, apt, etc.)
- Qualquer operacao destrutiva no SO (rm -rf fora do projeto, kill, etc.)

### Bloqueado (nunca executar)

- `rm -rf /` ou qualquer variante que apague raiz do sistema
- `rm -rf ~` ou qualquer variante que apague home do usuario
- `sudo rm` em diretorios do sistema
- Qualquer comando que possa corromper o SO

## Stack & Convencoes

- **Linguagem:** TypeScript (strict, zero `any`)
- **Commits:** Conventional Commits (feat:, fix:, docs:, chore:, refactor:)
- **Idioma:** Comunicacao sempre em portugues. Codigo e identificadores em ingles.
- **Principio:** Ler antes de editar. Planejar antes de executar. Simplicidade > sofisticacao.
- **Qualidade:** Protocolo OMEGA ativo em todos os agentes. Toda task emite OMEGA_STATUS com score por evidencia. Thresholds: Research >=80, Planning >=85, Implementation >=90, Validation/Mind Clone >=95. Detalhes em `.claude/protocols/OMEGA.md`.
- **Process Chief:** TODA tarefa — sem excecao — passa pelo crivo do Process Chief (Deming) antes de ser executada. O Process Chief define o processo, o OMEGA valida a qualidade. Protocolo em `.claude/protocols/PROCESS-CHIEF.md`. Agente em `/agents:process-chief`.

## Roteamento de Modelos (Model Routing) — Regra Obrigatoria

Todo agente DEVE rotear para o modelo correto conforme o tipo de operacao. Protocolo completo em `.claude/protocols/MODEL-ROUTING.md`.

```
COLETA   → haiku   | WebSearch, WebFetch, Exa, Apify, fetch, web-scraper, youtube-transcript
PROCESSAR → sonnet  | Interpretar, sintetizar, analisar, classificar dados coletados
CRIAR    → opus    | Escrever codigo, decisoes complexas, arquitetura, dados estruturados
```

### Aplicacao Pratica (ao spawnar agentes via Agent tool)

| Tipo de Tarefa | model= | Exemplos |
|----------------|--------|----------|
| Pesquisa web, scraping, coleta | `"haiku"` | EXA search, Apify scrape, WebSearch, WebFetch |
| Analise de dados, sintese, classificacao | `"sonnet"` | Processar MIUs, sintetizar fontes, extrair insights |
| Codigo, implementacao, orquestracao | `"opus"` | Backend, Frontend, Architect, PM, QA final |

**Regra de ouro:** Na duvida, suba um tier (nunca desça). PM (ATLAS) sempre em opus.

## ⛔ Regra Absoluta: Desenvolvimento 100% INCREMENTAL

**Todo codigo DEVE ser construido de forma incremental. Sem excecao.**

### O que significa INCREMENTAL:

1. **Sempre use Edit, nunca Write** para arquivos existentes — modifique apenas o trecho necessario
2. **Nunca reescreva um arquivo inteiro** — edite apenas as partes que precisam mudar
3. **Nunca delete e recrie um arquivo** — evolua o que ja existe
4. **Adicione funcionalidades em cima do existente** — nao substitua blocos inteiros
5. **Mudancas pequenas e validaveis** — cada edit deve ser verificavel isoladamente

### Hierarquia de acoes (em ordem de preferencia):

```
1. EDITAR trecho especifico (Edit tool) ← SEMPRE preferir
2. ADICIONAR codigo novo ao arquivo existente (Edit tool)
3. CRIAR arquivo novo (Write tool) ← so para features genuinamente novas
4. DELETAR e RECRIAR arquivo (Write tool) ← ULTIMO recurso, justificar por que
```

### Quando DELETE + RECREATE e aceitavel (UNICO cenario):

- O arquivo esta tao corrompido/incoerente que editar seria MAIS custoso que reescrever
- Voce DEVE justificar explicitamente POR QUE antes de executar
- Voce DEVE ter lido o arquivo original por completo antes de decidir

### Anti-patterns PROIBIDOS:

- Copiar conteudo inteiro de um arquivo, modificar, e usar Write para sobrescrever
- Usar Write em arquivo existente sem antes tentar Edit
- Reescrever funcoes inteiras quando so uma linha precisa mudar
- "Refatorar por completo" quando ajustes pontuais resolvem
- Gerar codigo novo quando existe codigo reutilizavel no projeto
