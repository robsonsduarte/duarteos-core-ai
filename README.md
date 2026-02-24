# DuarteOS Core AI

AIOS multi-agente para [Claude Code](https://claude.ai/code). Transforma o Claude Code num time de 13 agentes especializados que constroem sistemas completos automaticamente.

**Em uma frase:** voce descreve o que quer, os agentes constroem tudo — banco de dados, login, API, telas, design.

---

## Indice

- [Instalacao](#instalacao)
- [Inicio Rapido — 5 minutos](#inicio-rapido--5-minutos)
- [Guia Completo de Uso](#guia-completo-de-uso)
  - [App Factory — Criar um Sistema do Zero](#1-app-factory--criar-um-sistema-do-zero)
  - [Chamar Agentes Individuais](#2-chamar-agentes-individuais)
  - [Orquestrar o Squad Completo](#3-orquestrar-o-squad-completo)
  - [Fluxo Completo de Projeto](#4-fluxo-completo-de-projeto)
  - [Tasks Rapidas](#5-tasks-rapidas)
  - [Debug de Bugs](#6-debug-de-bugs)
  - [Gerenciar Progresso](#7-gerenciar-progresso)
- [Exemplos Reais — Copie e Cole](#exemplos-reais--copie-e-cole)
- [Todos os Comandos](#todos-os-comandos)
- [Todos os Agentes](#todos-os-agentes)
- [Todos os MCP Servers](#todos-os-mcp-servers)
- [Perguntas Frequentes](#perguntas-frequentes)
- [Referencia Tecnica](#referencia-tecnica)

---

## Instalacao

### Passo 1: Instalar no seu projeto

Abra o terminal na pasta do seu projeto e execute:

```bash
npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos init
```

Pronto. 48 arquivos foram instalados. Nao precisa de mais nada.

**Outras formas de instalar:**

```bash
# Dar um nome ao projeto (senao detecta do package.json)
npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos init meu-projeto

# Instalar globalmente (roda "duarteos" de qualquer lugar)
npm install -g github:robsonsduarte/duarteos-core-ai
duarteos init

# Atualizar para ultima versao (preserva seus dados)
npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos update
```

### Passo 2 (opcional): Configurar Python

Se quiser usar os MCP servers Python (analise de dados, web scraping, etc):

```bash
bash .claude/scripts/setup-python.sh
```

### Passo 3 (opcional): Configurar API keys dos MCPs

Os MCPs sao ferramentas externas que dao superpoderes aos agentes.

**5 MCPs ja funcionam sem configurar NADA:**
- Context7, YouTube Transcript, Fetch, Memory, Sequential Thinking

**Para ativar os outros, pegue as keys gratuitas:**

| O que configurar | Onde pegar (gratis) | Variavel |
|------------------|-------------------|----------|
| **EXA** (busca web) | [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys) — $15 de credito gratis | `EXA_API_KEY` |
| **Brave Search** (busca) | [brave.com/search/api](https://brave.com/search/api/) — 2.000 req/mes gratis | `BRAVE_API_KEY` |
| **GitHub** (repos, PRs) | [github.com/settings/tokens](https://github.com/settings/tokens) — gratis, ilimitado | `GITHUB_PAT` |
| **Reddit** (posts, trending) | [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) — crie app tipo "script" | `REDDIT_CLIENT_ID` e `REDDIT_CLIENT_SECRET` |
| **CodeRabbit** (code review) | Usa o mesmo `GITHUB_PAT` acima | `GITHUB_PAT` |
| **Google Workspace** (Gmail, Drive, Docs) | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — crie OAuth Desktop | `GOOGLE_OAUTH_CLIENT_ID` e `GOOGLE_OAUTH_CLIENT_SECRET` |
| **Supabase** (banco) | Dashboard Supabase → Settings → General → Reference ID | `SUPABASE_PROJECT_REF` |
| **n8n** (automacao) | Sua instancia n8n → Settings → API | `N8N_API_URL` e `N8N_API_KEY` |
| **Obsidian** (notas) | Caminho da pasta do seu vault no computador | `OBSIDIAN_VAULT_PATH` |
| **E2B** (sandbox) | [e2b.dev/dashboard](https://e2b.dev) — tem free tier | `E2B_API_KEY` |

#### Como configurar (2 opcoes)

**Opcao A — Usar `.env` (recomendado):**

O `.mcp.json` ja usa variaveis `${VAR}` que o Claude Code resolve automaticamente do ambiente. Basta preencher o `.env.example`:

```bash
# 1. Copie o template
cp .env.example .env

# 2. Edite o .env e preencha suas keys
# EXA_API_KEY=exa-abc123suachaveaqui
# BRAVE_API_KEY=BSA-abc123

# 3. Carregue as variaveis e abra o Claude Code
source .env && claude
```

**Dica:** use [direnv](https://direnv.net/) para carregar automaticamente:
```bash
brew install direnv                              # macOS
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc     # adiciona ao shell
direnv allow                                     # autoriza o .env
# Agora toda vez que entrar na pasta, as vars carregam sozinhas
```

**Opcao B — Editar `.mcp.json` diretamente:**

Abra o `.mcp.json` e substitua os `${VAR}` pelos valores:

```json
// ANTES:
"env": {
  "EXA_API_KEY": "${EXA_API_KEY}"
}

// DEPOIS:
"env": {
  "EXA_API_KEY": "exa-abc123suachaveaqui"
}
```

**Dica:** dentro do Claude Code, rode `/setup-mcps` para ver o guia interativo completo com instrucoes passo a passo para cada MCP.

### Passo 4 (opcional): Atualizar para versao mais recente

Quando sair uma versao nova do DuarteOS:

```bash
npx --yes --package=github:robsonsduarte/duarteos-core-ai duarteos update
```

O update atualiza todos os arquivos do sistema (agentes, comandos, hooks, MCPs, scripts) mas **nunca sobrescreve seus dados**:
- `.mcp.json` — suas API keys
- `.env` — suas variaveis de ambiente
- `.claude/settings.json` — suas configuracoes
- `.claude/session-context.md` — seu contexto de sessao
- `.claude/memory.json` — seu grafo de conhecimento

Arquivos identicos sao pulados. So atualiza o que mudou.

---

## Inicio Rapido — 5 minutos

Apos instalar, abra o Claude Code no seu projeto e digite qualquer um destes:

```
Eu: /squad:build-system "Cria um sistema de agendamento de consultas para uma clinica"
```
Os agentes vao analisar, projetar e construir o sistema inteiro automaticamente.

```
Eu: /agents:pm Preciso de um dashboard admin para gerenciar usuarios
```
O Gerente de Projetos vai planejar tudo, dividir em fases e coordenar a execucao.

```
Eu: /squad:quick "Adiciona um botao de exportar CSV na tabela de clientes"
```
Task rapida — implementa, testa e faz commit em minutos.

**Isso e tudo. Descreva o que quer e os agentes fazem.**

---

## Guia Completo de Uso

### 1. App Factory — Criar um Sistema do Zero

O comando mais poderoso. Recebe uma descricao e entrega um sistema completo funcionando.

#### Como usar

```
/squad:build-system [o que voce quer]
```

#### 4 formas de dar input

**Forma 1 — Texto livre (a mais facil):**
```
/squad:build-system "Quero um SaaS de gestao financeira pessoal com dashboard,
categorias de gastos, graficos mensais, metas de economia e notificacoes"
```

**Forma 2 — Arquivo PRD (mais detalhado):**
Crie um arquivo `docs/PRD.md` descrevendo tudo que quer, depois:
```
/squad:build-system docs/PRD.md
```

**Forma 3 — Workflow N8N (automacao):**
Exporte um workflow do N8N como JSON, depois:
```
/squad:build-system meu-workflow.json
```

**Forma 4 — URL de referencia (clonar ideia):**
```
/squad:build-system https://cal.com
```
Os agentes analisam o site, extraem features e design, e constroem algo similar.

#### O que ele entrega

- Projeto completo com `npm run dev` funcionando
- Banco de dados com schema SQL pronto
- Sistema de login (email + senha) com registro e recuperacao
- Middleware de autenticacao protegendo rotas
- Paginas com design coerente (cores, tipografia, layout)
- API routes com validacao
- Responsivo (funciona no celular)
- Tudo com TypeScript, sem erros

#### Exemplo completo

```
Eu: /squad:build-system "Marketplace de servicos de saude. Profissionais criam perfil
com especialidades e horarios. Pacientes buscam por especialidade e agendam consultas.
Pagamento via Stripe. Painel admin para gerenciar tudo."

[Os agentes automaticamente:]
1. Analisam os requisitos
2. Definem entidades: profissional, paciente, servico, agendamento, pagamento
3. Criam o banco de dados
4. Criam login para 3 roles: admin, profissional, paciente
5. Criam todas as paginas e API routes
6. Integram Stripe para pagamento
7. Aplicam design responsivo
8. Entregam DELIVERY.md com instrucoes
```

#### Flags opcionais

```
/squad:build-system --dry-run docs/PRD.md      # So gera o blueprint, nao constroi
/squad:build-system --stack=nuxt docs/PRD.md    # Usa Nuxt ao inves de Next.js
/squad:build-system --no-auth "landing page"    # Sem sistema de login
/squad:build-system --verbose "meu sistema"     # Mostra logs detalhados
```

---

### 2. Chamar Agentes Individuais

Cada agente e um especialista. Chame o que faz sentido pra sua necessidade.

#### PM (Gerente de Projetos) — O Chefe

```
/agents:pm Preciso refatorar o sistema de pagamentos do meu SaaS
```

**O que ele faz:** Analisa tudo, cria um plano de acao com fases, define prioridades, e coordena os outros agentes. Nenhum codigo e escrito antes dele aprovar o plano.

**Quando usar:**
- Demandas grandes que precisam de planejamento
- Quando nao sabe por onde comecar
- Para coordenar trabalho entre multiplos agentes

**Mais exemplos:**
```
/agents:pm Quero adicionar multi-tenancy no meu app
/agents:pm O sistema de notificacoes esta lento, preciso otimizar
/agents:pm Quero migrar de Firebase para Supabase
/agents:pm Planeja a versao 2.0 do produto
```

#### Arquiteto — O Estrategista

```
/agents:architect Analisa a arquitetura do modulo de autenticacao
```

**O que ele faz:** Mapeia a estrutura do codigo, propoe 3 abordagens com trade-offs, e implementa a estrutura base. Pensa em escalabilidade e manutenibilidade.

**Quando usar:**
- Decisoes de arquitetura (qual pattern usar, como organizar)
- Refatoracoes grandes
- Avaliar se a estrutura atual aguenta crescimento

**Mais exemplos:**
```
/agents:architect Proponha uma arquitetura para real-time notifications
/agents:architect O banco esta com queries lentas, analise e otimize
/agents:architect Como devo organizar os microservicos?
/agents:architect Avalie se devo usar GraphQL ou REST
```

#### Backend Dev — O Implementador Server-Side

```
/agents:backend Implementa CRUD completo de produtos com validacao
```

**O que ele faz:** Escreve codigo server-side — API routes, services, validacoes, integracao com banco. Segue os padroes existentes do projeto.

**Quando usar:**
- Implementar API endpoints
- Logica de negocio
- Integracao com banco de dados
- Bug fixes no backend

**Mais exemplos:**
```
/agents:backend Cria endpoint de upload de imagens com validacao de tipo e tamanho
/agents:backend Implementa sistema de webhook que notifica quando pedido muda de status
/agents:backend Adiciona paginacao e filtros no endpoint GET /api/users
/agents:backend Corrige o bug: usuarios estao conseguindo acessar dados de outros usuarios
/agents:backend Implementa rate limiting no endpoint de login
```

#### Frontend Dev — O Construtor de Interfaces

```
/agents:frontend Cria a pagina de dashboard com graficos e metricas
```

**O que ele faz:** Constroi interfaces bonitas e funcionais. Usa componentes shadcn/ui, foca em UX clara, design responsivo e animacoes sutis.

**Quando usar:**
- Criar novas paginas e componentes
- Melhorar design existente
- Resolver problemas de UI/UX
- Tornar paginas responsivas

**Mais exemplos:**
```
/agents:frontend Refatora a tabela de pedidos pra ser filtravel e paginada
/agents:frontend Cria um formulario de cadastro multi-step com validacao em cada etapa
/agents:frontend A pagina de configuracoes esta feia, eleva pro padrao premium
/agents:frontend Cria um componente de notificacao toast com animacao de entrada
/agents:frontend Faz a sidebar ser responsiva — drawer no mobile, fixa no desktop
```

#### QA — O Testador Implacavel

```
/agents:qa Testa o fluxo completo de checkout
```

**O que ele faz:** Escreve testes, encontra bugs com PROVA, e so considera algo pronto quando tem evidencia. Se nao tem teste, nao esta testado.

**Quando usar:**
- Validar se uma feature funciona
- Encontrar bugs antes de ir pra producao
- Escrever testes automatizados
- Auditar qualidade do codigo

**Mais exemplos:**
```
/agents:qa Escreve testes para o modulo de autenticacao
/agents:qa Verifica se o RBAC esta bloqueando corretamente usuarios sem permissao
/agents:qa Faz um teste de carga simulando 100 usuarios simultaneos
/agents:qa Audita se tem alguma rota sem autenticacao que deveria ter
/agents:qa Testa todos os edge cases do formulario de pagamento
```

#### Context Engineer — O Guardiao da Coerencia

```
/agents:context-engineer Verifica se os prompts de IA estao coerentes com o branding
```

**O que ele faz:** Garante que tudo no sistema e coerente — nomes, prompts, fluxos, terminologia. Detecta e corrige "drift" (quando partes do sistema divergem).

**Quando usar:**
- Prompts de IA estao gerando resultados inconsistentes
- Terminologia esta diferente em partes do sistema
- Fluxos de usuario estao confusos ou contradictorios
- Antes de lancar uma versao nova

**Mais exemplos:**
```
/agents:context-engineer Os emails transacionais estao com tom diferente do app
/agents:context-engineer Mapeia todos os pontos onde usamos "cliente" vs "usuario" vs "paciente"
/agents:context-engineer Os fluxos de onboarding e de configuracao estao pedindo infos duplicadas
/agents:context-engineer Revisa a coerencia do design system — cores, espacamentos, tipografia
```

#### Advogado do Diabo — O Destruidor Construtivo

```
/agents:devils-advocate Tenta quebrar minha proposta de arquitetura de microservicos
```

**O que ele faz:** Questiona TUDO. Encontra falhas, riscos e problemas que ninguem pensou. Mas sempre apresenta uma alternativa — critica sem solucao e invalida.

**Quando usar:**
- Antes de tomar uma decisao importante
- Para validar se um plano esta solido
- Para encontrar riscos que ninguem viu
- Quando quer um "reality check" honesto

**Mais exemplos:**
```
/agents:devils-advocate Meu plano e usar MongoDB para um sistema financeiro. Convence-me do contrario.
/agents:devils-advocate Estou pensando em nao usar TypeScript pra ir mais rapido. O que pode dar errado?
/agents:devils-advocate Quero fazer deploy sem testes automatizados. Me da motivos pra nao fazer isso.
/agents:devils-advocate Estou armazenando tokens JWT no localStorage. Isso e seguro?
```

---

### 3. Orquestrar o Squad Completo

Quando quer todos os 7 agentes trabalhando juntos numa demanda:

```
/agents:squad Preciso de um sistema completo de e-commerce com carrinho, checkout,
estoque e painel admin
```

**O que acontece:**
1. PM analisa e cria plano de acao
2. Arquiteto propoe estrutura
3. Advogado do Diabo contesta
4. PM decide direcao
5. Backend + Frontend implementam
6. QA testa
7. Context Engineer valida coerencia
8. PM libera ou reabre

**Mais exemplos:**
```
/agents:squad Migrar a autenticacao de JWT para Supabase Auth
/agents:squad Implementar sistema de permissoes granulares (RBAC)
/agents:squad Criar modulo de relatorios com graficos e exportacao PDF
/agents:squad Otimizar performance — o app esta levando 8 segundos pra carregar
```

---

### 4. Fluxo Completo de Projeto

Para projetos grandes, siga este fluxo passo a passo:

#### Passo 1 — Iniciar projeto
```
/squad:new-project Plataforma de cursos online com area do aluno,
area do instrutor e painel admin
```
Gera: pesquisa do dominio, requirements, roadmap com fases.

#### Passo 2 — Mapear codebase (se projeto ja existente)
```
/squad:map-codebase
```
4 agentes analisam o codigo em paralelo e geram 7 documentos de mapeamento.

#### Passo 3 — Discutir a fase (capturar decisoes)
```
/squad:discuss-phase 1
```
O Context Engineer faz perguntas para capturar decisoes e gera CONTEXT.md.

#### Passo 4 — Pesquisar abordagem tecnica
```
/squad:research-phase 1
```
Pesquisa como implementar a fase (tecnologias, patterns, exemplos).

#### Passo 5 — Planejar a fase
```
/squad:plan-phase 1
```
Gera PLAN.md com tasks detalhadas, dependencias e criterios de sucesso.

#### Passo 6 — Validar o plano (red team)
```
/squad:validate-plan
```
Advogado do Diabo contesta o plano antes de executar.

#### Passo 7 — Executar a fase
```
/squad:execute-phase 1
```
Backend e Frontend executam em waves paralelas com commits atomicos.

#### Passo 8 — Verificar o trabalho
```
/squad:verify-work 1
```
QA faz UAT (User Acceptance Testing), diagnostica problemas e gera fix plans.

#### Passo 9 — Auditar
```
/squad:audit
```
Auditoria final com QA + Context Engineer + Advogado do Diabo.

#### Passo 10 — Repetir para proxima fase
```
/squad:plan-phase 2
/squad:execute-phase 2
/squad:verify-work 2
```

---

### 5. Tasks Rapidas

Para coisas pequenas que nao justificam um projeto inteiro:

```
/squad:quick "Adiciona campo telefone na tabela de clientes e no formulario"
```

```
/squad:quick "Troca a cor do botao de salvar pra verde"
```

```
/squad:quick "Adiciona loading spinner quando a pagina carrega dados"
```

```
/squad:quick "Corrige o bug: data aparecendo em formato americano"
```

```
/squad:quick --full "Implementa paginacao na listagem de produtos"
```
(`--full` adiciona verificacao pos-execucao)

---

### 6. Debug de Bugs

Para bugs persistentes que precisam de investigacao:

```
/squad:debug "Usuarios reportam que o login falha intermitentemente nas manhas"
```

```
/squad:debug "A pagina de relatorios da erro 500 quando filtra por data"
```

```
/squad:debug "Imagens de perfil nao carregam em producao mas funcionam local"
```

O debug segue metodo cientifico: observar → hipotese → testar → corrigir. Estado e salvo entre sessoes.

---

### 7. Gerenciar Progresso

```
/squad:progress              # Ver status do projeto + proximo passo
/squad:pause                 # Pausar trabalho (salva estado)
/squad:resume                # Retomar de onde parou
```

---

## Exemplos Reais — Copie e Cole

### Criar um SaaS completo
```
/squad:build-system "SaaS de gestao de projetos estilo Trello.
Boards com colunas drag-and-drop. Cards com titulo, descricao,
labels, membros e deadline. Time real — quando alguem move um card,
todos veem. Plano free (3 boards) e plano pro (ilimitado) com Stripe."
```

### Criar um app de delivery
```
/squad:build-system "App de delivery de comida. 3 roles: restaurante
(cadastra cardapio e gerencia pedidos), entregador (ve pedidos disponiveis
e aceita corridas), cliente (busca restaurantes, faz pedido, acompanha
em tempo real). Pagamento no app. Painel admin com metricas."
```

### Criar uma landing page com inteligencia
```
/squad:build-system "Landing page para produto SaaS de automacao de marketing.
Hero section com CTA. Secao de features com icones. Pricing com 3 planos.
Testimonials. FAQ. Footer. Formulario de waitlist que salva no banco.
Design moderno, dark mode, animacoes sutis."
```

### Clonar a ideia de um site
```
/squad:build-system https://notion.so
```

### Construir a partir de um PRD
```
/squad:build-system docs/meu-prd.md
```

### Refatorar sistema existente
```
/agents:pm O sistema esta com 200 arquivos sem organizacao.
Preciso refatorar para uma arquitetura limpa com modulos separados.
```

### Adicionar feature complexa em sistema existente
```
/agents:squad Preciso adicionar um sistema de notificacoes:
push no browser, email, e in-app. O usuario configura quais
quer receber. Tem um centro de notificacoes com historico.
```

### Corrigir bug especifico
```
/agents:backend Quando o usuario faz upload de imagem acima de 5MB,
o servidor retorna 500 ao inves de uma mensagem de erro amigavel.
Investiga e corrige.
```

### Melhorar UI/UX
```
/agents:frontend A pagina de listagem de produtos esta parecendo
uma planilha. Quero cards com imagem, preco, rating e botao de
comprar. Grid responsivo — 3 colunas no desktop, 1 no mobile.
```

### Revisar seguranca
```
/agents:qa Faz uma auditoria de seguranca completa:
verifica autenticacao, autorizacao, SQL injection, XSS,
CORS, headers de seguranca e dependencias vulneraveis.
```

### Contestar uma decisao
```
/agents:devils-advocate Estou pensando em usar um monorepo Turborepo
com Next.js no front e NestJS no back. O time tem 2 devs.
Isso e uma boa ideia ou estou over-engineering?
```

### Analisar dados
```
/agents:pm Preciso analisar os dados de uso do ultimo mes.
Usa o Data Scientist pra gerar graficos de usuarios ativos,
features mais usadas e taxa de churn.
```

### Fazer deploy
```
/agents:pm Configura o deploy do meu app. Dockeriza, cria
docker-compose com app + postgres + redis, configura health
checks e cria script de deploy pro servidor.
```

---

## Todos os Comandos

### Agentes (chamada direta)

| Comando | Quem responde | Pra que |
|---------|---------------|---------|
| `/agents:squad [demanda]` | Todos os 7 | Demanda que precisa de multiplas perspectivas |
| `/agents:pm [demanda]` | Gerente de Projetos | Planejar, priorizar, coordenar |
| `/agents:architect [area]` | Arquiteto | Estrutura, patterns, decisoes tecnicas |
| `/agents:backend [feature]` | Backend Dev | API, logica, banco, seguranca |
| `/agents:frontend [tela]` | Frontend Dev | UI, UX, componentes, design |
| `/agents:qa [area]` | QA | Testes, bugs, auditoria |
| `/agents:context-engineer [area]` | Context Engineer | Coerencia, prompts, terminologia |
| `/agents:devils-advocate [proposta]` | Advogado do Diabo | Contestar, encontrar riscos |

### Squad (fluxo orquestrado)

| Comando | O que faz |
|---------|-----------|
| `/squad:build-system [input]` | **APP FACTORY** — cria sistema completo a partir de PRD/N8N/URL/texto |
| `/squad:new-project [demanda]` | Inicia projeto: pesquisa → requirements → roadmap |
| `/squad:map-codebase` | 4 agentes mapeiam o codigo → 7 documentos |
| `/squad:discuss-phase N` | Captura decisoes para fase N → CONTEXT.md |
| `/squad:research-phase N` | Pesquisa tecnica para fase N → RESEARCH.md |
| `/squad:plan-phase N` | Planeja fase N → PLAN.md com tasks |
| `/squad:validate-plan` | Red team contesta planos |
| `/squad:execute-phase N` | Executa fase N em waves paralelas + commits |
| `/squad:verify-work N` | QA testa fase N (UAT) |
| `/squad:audit` | Auditoria final do milestone |
| `/squad:quick "desc"` | Task rapida (1-3 passos) |
| `/squad:debug "bug"` | Debug cientifico persistente |
| `/squad:progress` | Status do projeto + proximo passo |
| `/squad:pause` | Salva estado para retomar depois |
| `/squad:resume` | Retoma de onde parou |

---

## Todos os Agentes

### 7 Agentes Deliberativos (vivem em `/commands/agents/`)

Estes sao agentes com "lentes cognitivas" — cada um pensa de forma diferente.

| Agente | Como pensa | O que pode fazer |
|--------|-----------|------------------|
| **PM** | "O que tem mais impacto? Qual o risco?" | Planejar, priorizar, decidir, coordenar todos os outros |
| **Arquiteto** | "Qual a melhor estrutura? Vai escalar?" | Projetar arquitetura, refatorar, definir patterns |
| **Backend** | "Ta seguro? Ta validado? Segue o padrao?" | Implementar API, logica de negocio, banco de dados |
| **Frontend** | "Ta bonito? Ta usavel? Ta responsivo?" | Criar interfaces, componentes, animacoes, design |
| **QA** | "Tem prova? Tem teste? Funciona mesmo?" | Testar, auditar, encontrar bugs, escrever testes |
| **Context Engineer** | "Ta coerente? Faz sentido? Tem drift?" | Validar coerencia, corrigir terminologia, prompts |
| **Advogado do Diabo** | "E se der errado? E se falhar? Alternativa?" | Contestar, encontrar riscos, exigir alternativas |

### 6 Agentes Custom (vivem em `.claude/agents/`)

Estes sao agentes especializados com tools e permissoes especificas.

| Agente | Especialidade | Quando usar |
|--------|---------------|-------------|
| **System Builder** | Constroi sistemas completos | Chamado automaticamente pelo build-system |
| **Python Executor** | Roda scripts Python | Automacoes, integracao com APIs, processamento |
| **Data Scientist** | Analise de dados com pandas/matplotlib | Graficos, estatisticas, ML, insights |
| **DevOps** | Docker, CI/CD, deploy | Configurar infraestrutura, automatizar deploy |
| **Security Auditor** | OWASP, vulnerabilidades | Auditoria de seguranca (so le, nao escreve) |
| **Fullstack** | Frontend + Backend + DB | Feature completa rapida, ponta a ponta |

---

## Todos os MCP Servers

MCPs sao "ferramentas extras" que os agentes podem usar. 22 instalados.

### Funcionam sem configuracao (5)

| MCP | O que faz |
|-----|-----------|
| **Context7** | Busca documentacao atualizada de bibliotecas (React, Next.js, etc) |
| **YouTube Transcript** | Extrai transcricao de videos do YouTube |
| **Fetch** | Busca qualquer URL e converte pra texto |
| **Memory** | Grafo de conhecimento que persiste entre sessoes |
| **Sequential Thinking** | Raciocinio passo-a-passo para problemas complexos |

### Precisam de API key gratuita (7)

| MCP | O que faz | Onde pegar key |
|-----|-----------|---------------|
| **EXA** | Busca web avancada, codigo, empresas | [dashboard.exa.ai](https://dashboard.exa.ai) — $15 gratis |
| **Brave Search** | Busca web, noticias, imagens | [brave.com/search/api](https://brave.com/search/api) — 2k/mes gratis |
| **GitHub** | Issues, PRs, code search | [github.com/settings/tokens](https://github.com/settings/tokens) — gratis |
| **Reddit** | Posts, trending, subreddits | [reddit.com/prefs/apps](https://reddit.com/prefs/apps) — gratis |
| **Google Workspace** | Gmail, Drive, Calendar, Docs, Sheets | Google Cloud Console — gratis |
| **CodeRabbit** | Code review com IA (40+ analyzers) | Usa o mesmo token do GitHub |
| **Obsidian** | Notas do Obsidian vault | Caminho local do vault |

### Precisam de configuracao especifica (3)

| MCP | O que faz | Configuracao |
|-----|-----------|-------------|
| **REST API** | Chama qualquer API REST | URL base da sua API |
| **Supabase** | Acesso direto ao banco | Project reference ID |
| **n8n** | Gerencia workflows de automacao | URL + API key do n8n |

### Python MCP Servers (6) — requerem `setup-python.sh`

| MCP | O que faz |
|-----|-----------|
| **Input Analyzer** | Analisa PRDs, workflows N8N e URLs pra gerar blueprints |
| **Memory Graph** | Grafo de conhecimento persistente — lembra decisoes, padroes, preferencias |
| **Tool Forge** | Cria novas ferramentas dinamicamente — os agentes inventam tools quando precisam |
| **Data Analyzer** | Analisa CSVs com pandas, cria graficos com matplotlib |
| **Web Scraper** | Faz scraping de sites, extrai tabelas, links, dados estruturados |
| **Automation** | Encontra arquivos duplicados, analisa disco, renomeia em lote |

### Sandbox (1) — opcional

| MCP | O que faz | Configuracao |
|-----|-----------|-------------|
| **E2B** | Executa codigo em sandbox seguro (microVM) | API key em [e2b.dev](https://e2b.dev) |

---

## Perguntas Frequentes

### "Qual a diferenca entre `/agents:pm` e `/squad:build-system`?"

- `/agents:pm` chama o Gerente de Projetos para **planejar**. Ele analisa, cria fases e coordena.
- `/squad:build-system` e o **modo automatico total**. Ele analisa E constroi tudo, sem parar pra pedir aprovacao (YOLO mode).

Use `/agents:pm` quando quer controlar cada passo. Use `/squad:build-system` quando quer resultado rapido.

### "Posso usar sem o GSD?"

Sim. Os agentes individuais (`/agents:pm`, `/agents:backend`, etc) funcionam sem GSD. Os comandos `/squad:*` usam o GSD como motor de execucao.

### "Posso usar sem Python?"

Sim. Os 15 MCP servers Node.js e os 7 agentes deliberativos funcionam sem Python. Os 6 MCP servers Python (Data Analyzer, Web Scraper, etc) precisam de Python 3.10+.

### "Funciona com qualquer projeto?"

Sim. O DuarteOS e agnostico de stack. Os agentes se adaptam ao projeto onde foram instalados — leem o CLAUDE.md, os padroes existentes e seguem as convencoes do projeto.

### "Os agentes vao perguntar muito?"

Nao. No YOLO mode (padrao do `build-system`), os agentes so perguntam quando:
1. O input e ambiguo demais (pode gerar 2 sistemas diferentes)
2. Vao EXCLUIR uma feature que voce pediu
3. Precisam de um servico pago
4. Tem decisao de seguranca critica

### "Posso criar meus proprios agentes?"

Sim. Crie um arquivo `.md` com YAML frontmatter em `.claude/agents/`:

```markdown
---
name: meu-agente
description: O que ele faz
tools:
  - Bash
  - Read
  - Write
model: sonnet
---

# Meu Agente

Instrucoes do agente aqui...
```

### "Posso criar meus proprios MCP servers?"

Sim. Crie um `server.py` em `.claude/mcp-servers/meu-server/`:

```python
from fastmcp import FastMCP

mcp = FastMCP("meu-server")

@mcp.tool()
def minha_ferramenta(param: str) -> str:
    """O que faz."""
    return f"Resultado: {param}"

if __name__ == "__main__":
    mcp.run()
```

E adicione ao `.mcp.json`:
```json
{
  "meu-server": {
    "command": "python3",
    "args": [".claude/mcp-servers/meu-server/server.py"]
  }
}
```

Ou use o **Tool Forge** — os agentes criam tools novas sozinhos quando precisam.

---

## Referencia Tecnica

### O que instala (48 arquivos)

```
.claude/
  settings.json                    # Config com hooks + agent teams
  session-context.md               # Contexto persistente entre sessoes
  hooks/                           # 4 quality gates automaticos
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
    setup-mcps.md                  # Guia de configuracao dos MCPs
  scripts/
    setup-python.sh                # Setup Python + deps
    setup-sandbox.sh               # Setup E2B / Docker
  mcp-servers/                     # 6 Python MCP Servers
    input-analyzer/server.py
    memory-graph/server.py
    tool-forge/server.py
    data-analyzer/server.py
    web-scraper/server.py
    automation/server.py
    requirements.txt
.planning/
  config.json                      # Configuracao GSD
.mcp.json                          # 22 MCP Servers
.env.example                       # Template de variaveis de ambiente
```

### Hooks (rodam automaticamente)

| Hook | Quando roda | O que faz |
|------|------------|-----------|
| `post-edit-lint.sh` | Apos editar arquivo | Roda ESLint/Biome/Prettier automaticamente |
| `pre-commit-check.sh` | Antes de git commit | Verifica TypeScript + lint + testes |
| `security-gate.sh` | Antes de rodar comando | Bloqueia `rm -rf /`, `DROP DATABASE`, etc |
| `session-memory.sh` | Ao encerrar sessao | Salva timestamp no session-context.md |

### Arquitetura

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

### Principios

1. **Nenhum agente pode apenas analisar** — Detectar → Provar → Agir
2. **Critica sem alternativa e invalida** — sempre apresentar alternativa
3. **QA sempre entrega prova** — sem teste/evidencia, invalido
4. **Loop fechado** — evidencia + acao + proximo passo
5. **YOLO mode** — executa tudo, so pergunta quando critico
6. **Tool evolution** — agentes criam ferramentas quando precisam
7. **Memory persistence** — conhecimento sobrevive entre sessoes
8. **Disciplina > ritual** — se regra virar burocracia, simplificar

### Pre-requisitos

| Ferramenta | Obrigatorio? | Versao |
|------------|-------------|--------|
| [Claude Code](https://claude.ai/code) | Sim | Qualquer |
| [Node.js](https://nodejs.org) | Sim | 18+ |
| [GSD](https://github.com/cleyio/gsd) | Para comandos /squad | Qualquer |
| [Python](https://python.org) | Para MCP servers Python | 3.10+ |

---

## Licenca

MIT
