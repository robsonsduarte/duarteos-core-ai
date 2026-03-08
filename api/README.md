# DuarteOS API

REST API para acesso HTTP aos Mind Clones e Conselhos do DuarteOS Core AI.

Permite que qualquer projeto web converse com os 67 consultores cognitivos via HTTP, sem necessidade de acesso direto ao filesystem ou ao Claude Code. Clones MMOS v3 recebem o DNA completo (drivers, voice, frameworks, behavioral, cognitive, linguistic, narrative) injetado no system prompt — a mesma fidelidade do Claude Code, agora via endpoint.

---

## Indice

- [Arquitetura](#arquitetura)
- [Setup Local](#setup-local)
- [Deploy em VPS](#deploy-em-vps)
- [Autenticacao](#autenticacao)
- [Endpoints](#endpoints)
  - [Health](#health)
  - [Minds](#minds)
  - [Councils](#councils)
- [Exemplos de Uso](#exemplos-de-uso)
  - [cURL](#curl)
  - [JavaScript / Frontend](#javascript--frontend)
  - [Python](#python)
  - [SSE Streaming](#sse-streaming)
- [Configuracao](#configuracao)
- [Arquitetura Interna](#arquitetura-interna)
- [Troubleshooting](#troubleshooting)

---

## Arquitetura

```
                    ┌──────────────────────────┐
                    │   Qualquer App Web        │
                    │  (React, Next, Vue, etc)  │
                    └──────────┬───────────────┘
                               │ HTTPS
                               ▼
                    ┌──────────────────────────┐
                    │     DuarteOS API          │
                    │  Express + Node.js 18+    │
                    │  Porta 3333 (default)     │
                    └──────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌──────────────┐  ┌────────────┐  ┌──────────────┐
     │  MindLoader   │  │ PromptBuild│  │ ClaudeClient │
     │  67 clones    │  │ System     │  │ Anthropic SDK│
     │  YAML + MD    │  │ prompt     │  │ Chat/Stream  │
     └──────────────┘  └────────────┘  └──────┬───────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │  Claude API       │
                                     │  (Anthropic)      │
                                     └──────────────────┘
```

### Estrutura de Arquivos

```
api/
├── package.json              # Dependencias e scripts
├── .env.example              # Template de variaveis de ambiente
├── README.md                 # Este arquivo
├── server.mjs                # Entry point — Express server
├── config.mjs                # Configuracao centralizada via .env
├── routes/
│   ├── health.mjs            # GET /api/health
│   ├── minds.mjs             # Endpoints de mind clones
│   └── councils.mjs          # Endpoints de conselhos
├── services/
│   ├── mind-loader.mjs       # Carrega 67 clones do filesystem
│   ├── prompt-builder.mjs    # Constroi system prompt com DNA completo
│   ├── claude-client.mjs     # Wrapper Anthropic SDK (chat + stream)
│   └── council-loader.mjs    # Parseia conselhos dos .md
└── middleware/
    ├── auth.mjs              # Bearer token authentication
    └── error-handler.mjs     # Error handler global
```

---

## Setup Local

### 1. Instalar dependencias

```bash
cd api
npm install
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-SUA_CHAVE_AQUI
DUARTEOS_API_KEY=
PORT=3333
DEFAULT_MODEL=claude-sonnet-4-20250514
DEFAULT_MAX_TOKENS=4096
DEFAULT_TEMPERATURE=0.7
```

> **Nota:** Sem `DUARTEOS_API_KEY`, o acesso local (localhost) e liberado sem auth. Para producao, sempre configure uma chave.

### 3. Iniciar servidor

```bash
# Producao
npm start

# Desenvolvimento (hot-reload)
npm run dev
```

O servidor sobe em `http://localhost:3333`.

```
╔══════════════════════════════════════════╗
║         DuarteOS API v1.0.0              ║
╠══════════════════════════════════════════╣
║  Port:    3333                           ║
║  Minds:   67                             ║
║  Model:   claude-sonnet-4-20250514       ║
║  Auth:    Aberto (local only)            ║
╚══════════════════════════════════════════╝
```

---

## Deploy em VPS

### Requisitos do Servidor

| Recurso | Minimo | Recomendado |
|---------|--------|-------------|
| RAM     | 1 GB   | 2 GB        |
| CPU     | 1 vCPU | 2 vCPU      |
| Disco   | 10 GB  | 20 GB       |
| SO      | Ubuntu 22.04+ | Ubuntu 24.04 LTS |

A API e leve — o processamento pesado acontece na Anthropic (Claude API). A VPS so serve como proxy autenticado.

### Passo 1 — Preparar o servidor

```bash
ssh root@SEU_IP

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Criar usuario dedicado (nao rodar como root)
adduser duarteos --disabled-password
usermod -aG sudo duarteos
su - duarteos
```

### Passo 2 — Clonar e configurar

```bash
# Clonar repo (privado — usar SSH key ou token)
git clone https://github.com/robsonsduarte/duarteos-core-ai.git
cd duarteos-core-ai/api

# Instalar dependencias
npm install

# Configurar env
cp .env.example .env
nano .env
```

Gerar uma API key forte:

```bash
openssl rand -hex 32
```

Configurar `.env` na VPS:

```env
ANTHROPIC_API_KEY=sk-ant-api03-SUA_CHAVE_REAL
DUARTEOS_API_KEY=a1b2c3d4e5f6...  # gerado acima
PORT=3333
DEFAULT_MODEL=claude-sonnet-4-20250514
DEFAULT_MAX_TOKENS=4096
DEFAULT_TEMPERATURE=0.7
```

### Passo 3 — PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar API
pm2 start server.mjs --name duarteos-api

# Auto-restart no boot do servidor
pm2 startup
pm2 save
```

Comandos uteis do PM2:

```bash
pm2 status              # Ver status
pm2 logs duarteos-api    # Logs em tempo real
pm2 restart duarteos-api # Reiniciar
pm2 stop duarteos-api    # Parar
pm2 monit               # Monitor interativo
```

### Passo 4 — Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/duarteos-api
```

Conteudo:

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # SSE streaming support
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/duarteos-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 5 — SSL com Certbot (HTTPS gratis)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.seudominio.com
```

A renovacao automatica ja fica configurada pelo Certbot.

### Passo 6 — Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirect para HTTPS)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Resultado

Apos os 6 passos, a API esta acessivel em:

```
https://api.seudominio.com/api/health
https://api.seudominio.com/api/minds
https://api.seudominio.com/api/minds/gary-halbert/chat
```

Ou sem dominio (apenas IP, sem SSL):

```
http://SEU_IP:3333/api/health
```

### Atualizacoes Futuras

```bash
ssh duarteos@SEU_IP
cd duarteos-core-ai
git pull
cd api && npm install
pm2 restart duarteos-api
```

Mind clones novos aparecem automaticamente — o `MindLoader` escaneia `DUARTEOS/minds/` no startup.

---

## Autenticacao

### Modo Local (desenvolvimento)

Se `DUARTEOS_API_KEY` **nao estiver** configurado no `.env`:
- Acesso via localhost/127.0.0.1 e liberado sem auth
- Acesso remoto e bloqueado (401)

### Modo Producao

Se `DUARTEOS_API_KEY` **estiver** configurado:
- Todas as rotas (exceto `/api/health`) exigem header:

```
Authorization: Bearer {sua-chave}
```

### Respostas de Erro de Auth

| Situacao | Status | Code |
|----------|--------|------|
| Header ausente | 401 | `UNAUTHORIZED` |
| Token invalido | 403 | `FORBIDDEN` |
| Acesso remoto sem key configurada | 401 | `UNAUTHORIZED` |

---

## Endpoints

### Health

#### `GET /api/health`

Health check publico (nao requer auth).

```bash
curl http://localhost:3333/api/health
```

**Response:**

```json
{
  "status": "ok",
  "version": "1.0.0",
  "minds_count": 67,
  "uptime_seconds": 42,
  "timestamp": "2026-03-07T10:00:00.000Z"
}
```

---

### Minds

#### `GET /api/minds`

Lista todos os mind clones com metadados do `config.yaml`.

**Query Params (opcionais):**

| Param | Tipo | Descricao | Exemplo |
|-------|------|-----------|---------|
| `category` | string | Filtrar por categoria | `Copywriting`, `UX-Design`, `Juridico` |
| `status` | string | Filtrar por status | `active`, `draft`, `completed` |
| `pipeline` | string | Filtrar por versao do pipeline | `3` (MMOS v3), `legacy` |

**Categorias disponiveis:** Copywriting, Marketing, UX-Design, AI, Tech, Business, Content, Product, Saude, Juridico

```bash
# Todos os clones
curl http://localhost:3333/api/minds

# Apenas Copywriting
curl "http://localhost:3333/api/minds?category=Copywriting"

# Apenas MMOS v3 (pipeline completo)
curl "http://localhost:3333/api/minds?pipeline=3"

# Combinar filtros
curl "http://localhost:3333/api/minds?category=Copywriting&pipeline=3"
```

**Response:**

```json
{
  "minds": [
    {
      "name": "Gary Halbert",
      "slug": "gary-halbert",
      "category": "Copywriting",
      "domain": "Direct Mail Marketing e Copywriting de Resposta Direta",
      "archetype": "The Prince of Print — genio de rua do direct mail...",
      "fidelity_score": 95.65,
      "fidelity_estimated": 91.9,
      "pipeline_version": "3",
      "status": "active"
    },
    {
      "name": "David Ogilvy",
      "slug": "david-ogilvy",
      "category": "Marketing",
      "domain": "Publicidade, Brand Building, Direct Response",
      "archetype": "O Cientista Aristocratico...",
      "fidelity_score": null,
      "fidelity_estimated": null,
      "pipeline_version": "legacy",
      "status": "active"
    }
  ],
  "total": 67
}
```

---

#### `GET /api/minds/:slug`

Detalhes completos de um clone, incluindo artifacts disponiveis.

```bash
curl http://localhost:3333/api/minds/gary-halbert
```

**Response:**

```json
{
  "mind": {
    "name": "Gary Halbert",
    "slug": "gary-halbert",
    "category": "Copywriting",
    "domain": "Direct Mail Marketing e Copywriting de Resposta Direta",
    "archetype": "The Prince of Print...",
    "fidelity_score": 95.65,
    "fidelity_estimated": 91.9,
    "pipeline_version": "3",
    "status": "active",
    "version": "1.0.0",
    "created_at": "2026-03-07",
    "pcfe_approved": true,
    "has_full_squad": true,
    "artifacts_available": [
      "drivers",
      "voice",
      "phrases",
      "system_components",
      "checklists",
      "frameworks",
      "behavioral",
      "cognitive",
      "linguistic",
      "narrative",
      "synapse_dna"
    ]
  }
}
```

**Erro (clone nao existe):**

```json
{
  "error": {
    "code": "MIND_NOT_FOUND",
    "message": "Mind clone 'xyz' nao encontrado."
  }
}
```

---

#### `GET /api/minds/:slug/artifacts`

Todos os artefatos YAML parseados de um clone. Disponivel apenas para clones MMOS v3 (com squad completo).

```bash
curl http://localhost:3333/api/minds/gary-halbert/artifacts
```

**Response (MMOS v3):**

```json
{
  "artifacts": {
    "drivers": {
      "driver_identity": { "mind": "gary-halbert", "total_drivers": 12 },
      "drivers": [
        { "name": "Acao Imediata", "tier": "gold", "strength": 0.95 }
      ]
    },
    "voice": { "voice_identity": { "mind": "gary-halbert" } },
    "phrases": { "phrases": ["The only advantage I want is A STARVING CROWD!"] },
    "frameworks": [
      { "_file": "starving-crowd.yaml", "framework_identity": { "name": "Starving Crowd" } }
    ],
    "behavioral": [ ... ],
    "cognitive": [ ... ],
    "linguistic": [ ... ],
    "narrative": [ ... ],
    "system_components": { ... }
  }
}
```

**Response (clone legacy — sem squad):**

```json
{
  "artifacts": {},
  "note": "Clone legacy — sem squad artifacts. Apenas agent.md disponvel."
}
```

---

#### `POST /api/minds/:slug/chat`

Conversar com um mind clone. O clone responde com a personalidade, frameworks e voz do especialista.

```bash
curl -X POST http://localhost:3333/api/minds/gary-halbert/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUA_KEY" \
  -d '{
    "message": "Como eu devo estruturar minha oferta de lancamento?",
    "history": [],
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 2048
  }'
```

**Body Params:**

| Campo | Tipo | Obrigatorio | Default | Descricao |
|-------|------|-------------|---------|-----------|
| `message` | string | Sim | — | Mensagem do usuario |
| `history` | array | Nao | `[]` | Historico `[{role: "user"\|"assistant", content: "..."}]` |
| `model` | string | Nao | `claude-sonnet-4-20250514` | Modelo Claude a usar |
| `max_tokens` | number | Nao | `4096` | Max tokens na resposta |
| `temperature` | number | Nao | `0.7` | Criatividade (0.0 a 1.0) |

**Response:**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "mind": {
    "name": "Gary Halbert",
    "slug": "gary-halbert",
    "category": "Copywriting",
    "fidelity_score": 95.65
  },
  "response": "Listen up, pal...\n\nAntes de pensar em oferta, me responde UMA coisa: quem eh seu mercado faminto? ...",
  "model": "claude-sonnet-4-20250514",
  "usage": {
    "input_tokens": 8420,
    "output_tokens": 634
  }
}
```

**Modelos recomendados:**

| Modelo | Uso | Custo |
|--------|-----|-------|
| `claude-sonnet-4-20250514` | Chat geral (default) | Medio |
| `claude-opus-4-20250514` | Respostas mais profundas e nuancadas | Alto |
| `claude-haiku-4-5-20251001` | Respostas rapidas e economicas | Baixo |

---

#### `POST /api/minds/:slug/chat/stream`

Chat com SSE (Server-Sent Events) streaming. Mesmo body do `/chat`. A resposta chega em chunks para exibicao em tempo real.

**SSE Events:**

| Event | Descricao |
|-------|-----------|
| `text_delta` | Chunk de texto `{ type: "text_delta", text: "..." }` |
| `message_stop` | Fim da mensagem `{ type: "message_stop", usage: {...} }` |
| `error` | Erro durante stream `{ type: "error", message: "..." }` |

```bash
curl -X POST http://localhost:3333/api/minds/gary-halbert/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "O que e o Starving Crowd?"}'
```

**Response (SSE):**

```
data: {"type":"text_delta","text":"Listen"}

data: {"type":"text_delta","text":" up,"}

data: {"type":"text_delta","text":" pal..."}

data: {"type":"message_stop","usage":{"input_tokens":8420,"output_tokens":234}}
```

---

### Councils

#### `GET /api/councils`

Lista todos os 11 conselhos de especialistas.

```bash
curl http://localhost:3333/api/councils
```

**Response:**

```json
{
  "councils": [
    {
      "slug": "copywriting",
      "name": "Conselho de Copywriting — Advisory Board",
      "domain": "Copy de vendas, headlines, VSLs, paginas de vendas, emails, persuasao, storytelling",
      "members": ["gary-halbert", "eugene-schwartz", "joseph-sugarman", "gary-bencivenga", "amanda-khayat"],
      "members_count": 5
    },
    {
      "slug": "ux",
      "name": "Conselho de UX — Advisory Board",
      "domain": "Usabilidade, Design Systems, Human-Centered Design",
      "members": ["don-norman", "jakob-nielsen", "steve-krug", "brad-frost", "luke-wroblewski", "nathan-curtis"],
      "members_count": 6
    }
  ],
  "total": 11
}
```

**Conselhos disponiveis:**

| Slug | Membros | Dominio |
|------|---------|---------|
| `copywriting` | 5-7 | Copy de vendas, headlines, VSLs, persuasao |
| `marketing` | 9 | Trafego pago, growth, branding, performance |
| `ux` | 6 | Usabilidade, Design Systems, HCD |
| `ia` | 5 | Deep Learning, AI Safety, LLMs |
| `tech` | 5 | Produto digital, plataformas, engenharia |
| `business` | 6 | Produtividade, decisao, qualidade, GTD |
| `content` | 4 | Video, storytelling, audiencia, viral |
| `product` | 3 | SaaS, e-commerce, product management |
| `saude` | 7 | Medicina, nutricao, psicanalise, fitness |
| `juridico` | 7 | LGPD, Direito Digital, IA, Compliance |
| `process` | 5 | Qualidade, processos, checklists, melhoria continua |

---

#### `GET /api/councils/:slug`

Detalhes de um conselho com dados enriquecidos dos membros.

```bash
curl http://localhost:3333/api/councils/copywriting
```

**Response:**

```json
{
  "council": {
    "slug": "copywriting",
    "name": "Conselho de Copywriting — Advisory Board",
    "domain": "Copy de vendas, headlines, VSLs...",
    "members": [
      {
        "slug": "gary-halbert",
        "name": "Gary Halbert",
        "category": "Copywriting",
        "domain": "Direct Mail Marketing e Copywriting de Resposta Direta",
        "fidelity_score": 95.65
      },
      {
        "slug": "eugene-schwartz",
        "name": "Eugene M. Schwartz",
        "category": "Copywriting",
        "domain": "Copywriting Cientifico e Sofisticacao de Mercado",
        "fidelity_score": 95.40
      }
    ]
  }
}
```

---

#### `POST /api/councils/:slug/discuss`

Sessao de discussao — todos os membros analisam o topico em PARALELO, seguido de uma sintese final com consensos e divergencias.

```bash
curl -X POST http://localhost:3333/api/councils/copywriting/discuss \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUA_KEY" \
  -d '{
    "topic": "Como estruturar uma VSL de 12 minutos para venda de curso de investimentos?",
    "max_tokens_per_member": 1500
  }'
```

**Body Params:**

| Campo | Tipo | Obrigatorio | Default | Descricao |
|-------|------|-------------|---------|-----------|
| `topic` | string | Sim | — | Topico para discussao |
| `model` | string | Nao | `claude-sonnet-4-20250514` | Modelo Claude |
| `max_tokens_per_member` | number | Nao | `2048` | Max tokens por contribuicao |

**Response:**

```json
{
  "council": {
    "slug": "copywriting",
    "name": "Conselho de Copywriting — Advisory Board"
  },
  "topic": "Como estruturar uma VSL de 12 minutos...",
  "contributions": [
    {
      "member": {
        "slug": "gary-halbert",
        "name": "Gary Halbert",
        "category": "Copywriting",
        "fidelity_score": 95.65
      },
      "analysis": "O primeiro problema e que voce esta pensando em VSL antes de pensar em MERCADO...",
      "recommendations": [
        "Descubra o mercado faminto antes de gravar um segundo",
        "Use o A-Pile System na abertura — parecendo pessoal, nao comercial",
        "HBD no gancho: Heat + Believability + Desire nos primeiros 90 segundos"
      ],
      "risks": [
        "VSL longa demais sem teste de retencao e suicidio financeiro",
        "Sem numeros especificos nos beneficios, ninguem acredita"
      ],
      "summary_phrase": "Encontre o mercado faminto antes de gravar um segundo sequer."
    },
    {
      "member": {
        "slug": "eugene-schwartz",
        "name": "Eugene M. Schwartz",
        "category": "Copywriting",
        "fidelity_score": 95.40
      },
      "analysis": "A questao central e o nivel de sofisticacao do mercado...",
      "recommendations": [ ... ],
      "risks": [ ... ],
      "summary_phrase": "Nao tente criar desejo — canalize o desejo que ja existe."
    }
  ],
  "synthesis": {
    "consensus": [
      "Abertura com historia de dor especifica, nao generica",
      "Prova social e numeros concretos sao essenciais",
      "Teste de retencao antes de escalar"
    ],
    "divergences": [
      {
        "topic": "Abordagem do gancho inicial",
        "position_a": "Historia pessoal de fracasso",
        "advocates_a": ["Gary Halbert"],
        "position_b": "Mecanismo unico do produto",
        "advocates_b": ["Eugene M. Schwartz"]
      }
    ],
    "final_recommendation": "Confianca ALTA. Todos concordam que o gancho deve ser construido sobre dor especifica do publico-alvo, com prova numerica. A divergencia sobre o tipo de abertura pode ser resolvida com teste A/B."
  }
}
```

> **Custo:** O endpoint `/discuss` faz N+1 chamadas a API Anthropic (N membros em paralelo + 1 sintese). Para conselhos grandes (7+ membros), use `max_tokens_per_member` menor para controlar custo.

---

## Exemplos de Uso

### cURL

```bash
# Health check
curl https://api.seudominio.com/api/health

# Listar clones de UX-Design
curl -H "Authorization: Bearer SUA_KEY" \
  "https://api.seudominio.com/api/minds?category=UX-Design"

# Detalhes do Don Norman
curl -H "Authorization: Bearer SUA_KEY" \
  "https://api.seudominio.com/api/minds/don-norman"

# Artifacts completos do Don Norman
curl -H "Authorization: Bearer SUA_KEY" \
  "https://api.seudominio.com/api/minds/don-norman/artifacts"

# Chat com Don Norman
curl -X POST \
  -H "Authorization: Bearer SUA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Como melhorar a usabilidade de um checkout mobile?"}' \
  "https://api.seudominio.com/api/minds/don-norman/chat"

# Chat com modelo especifico (Opus para mais profundidade)
curl -X POST \
  -H "Authorization: Bearer SUA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Analise minha landing page","model":"claude-opus-4-20250514"}' \
  "https://api.seudominio.com/api/minds/gary-halbert/chat"

# Discussao no conselho de Marketing
curl -X POST \
  -H "Authorization: Bearer SUA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Estrategia de lancamento para SaaS B2B com ticket de R$297/mes"}' \
  "https://api.seudominio.com/api/councils/marketing/discuss"
```

### JavaScript / Frontend

```javascript
const API = 'https://api.seudominio.com'
const KEY = 'sua-duarteos-api-key'

const headers = {
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json'
}

// --- Listar clones por categoria ---
async function listMinds(category) {
  const url = category
    ? `${API}/api/minds?category=${category}`
    : `${API}/api/minds`
  const { minds } = await fetch(url, { headers }).then(r => r.json())
  return minds
}

// --- Chat com um mind clone ---
async function chatWithMind(slug, message, history = []) {
  const { response, usage } = await fetch(`${API}/api/minds/${slug}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, history })
  }).then(r => r.json())

  console.log(response)
  console.log(`Tokens: ${usage.input_tokens} in / ${usage.output_tokens} out`)
  return response
}

// --- Conversa multi-turno ---
async function conversation(slug) {
  const history = []

  // Turno 1
  const r1 = await fetch(`${API}/api/minds/${slug}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: 'Qual o framework mais importante do seu trabalho?',
      history
    })
  }).then(r => r.json())

  history.push({ role: 'user', content: 'Qual o framework mais importante do seu trabalho?' })
  history.push({ role: 'assistant', content: r1.response })

  // Turno 2 (com contexto do turno 1)
  const r2 = await fetch(`${API}/api/minds/${slug}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: 'Me da um exemplo pratico de aplicacao?',
      history
    })
  }).then(r => r.json())

  return r2.response
}

// --- Discussao com conselho ---
async function councilDiscuss(councilSlug, topic) {
  const result = await fetch(`${API}/api/councils/${councilSlug}/discuss`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic, max_tokens_per_member: 1500 })
  }).then(r => r.json())

  // Cada membro contribui independentemente
  result.contributions.forEach(c => {
    console.log(`\n${c.member.name}: ${c.summary_phrase}`)
  })

  // Sintese consolidada
  console.log('\nRecomendacao final:', result.synthesis.final_recommendation)
  return result
}
```

### Python

```python
import requests

API = "https://api.seudominio.com"
KEY = "sua-duarteos-api-key"
HEADERS = {
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json"
}

# Listar clones
minds = requests.get(f"{API}/api/minds?category=Copywriting", headers=HEADERS).json()
for m in minds["minds"]:
    print(f"{m['name']} — F={m['fidelity_score']}%")

# Chat com clone
response = requests.post(
    f"{API}/api/minds/gary-halbert/chat",
    headers=HEADERS,
    json={"message": "Como criar uma headline que converte?"}
).json()
print(response["response"])

# Conselho
discussion = requests.post(
    f"{API}/api/councils/ux/discuss",
    headers=HEADERS,
    json={"topic": "Redesign de checkout mobile para e-commerce"}
).json()
for c in discussion["contributions"]:
    print(f"{c['member']['name']}: {c['summary_phrase']}")
```

### SSE Streaming

#### Browser (JavaScript)

```javascript
async function streamChat(slug, message) {
  const response = await fetch(`${API}/api/minds/${slug}/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

    for (const line of lines) {
      const event = JSON.parse(line.slice(6))

      if (event.type === 'text_delta') {
        fullResponse += event.text
        // Atualizar DOM em tempo real
        document.getElementById('output').textContent = fullResponse
      }

      if (event.type === 'message_stop') {
        console.log('Tokens:', event.usage)
      }
    }
  }

  return fullResponse
}
```

#### React Hook

```javascript
function useMindChat(slug) {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async (message, history = []) => {
    setLoading(true)
    setResponse('')

    const res = await fetch(`${API}/api/minds/${slug}/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, history })
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let accumulated = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

      for (const line of lines) {
        const event = JSON.parse(line.slice(6))
        if (event.type === 'text_delta') {
          accumulated += event.text
          setResponse(accumulated)
        }
      }
    }

    setLoading(false)
    return accumulated
  }

  return { response, loading, send }
}

// Uso:
// const { response, loading, send } = useMindChat('gary-halbert')
// await send('Como criar uma oferta irresistivel?')
```

#### Node.js

```javascript
import { createParser } from 'eventsource-parser'

async function streamChat(slug, message) {
  const response = await fetch(`http://localhost:3333/api/minds/${slug}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    const lines = text.split('\n').filter(l => l.startsWith('data: '))

    for (const line of lines) {
      const event = JSON.parse(line.slice(6))
      if (event.type === 'text_delta') {
        process.stdout.write(event.text)
      }
      if (event.type === 'message_stop') {
        console.log('\n\nTokens:', event.usage)
      }
    }
  }
}
```

---

## Configuracao

### Variaveis de Ambiente

| Variavel | Obrigatoria | Default | Descricao |
|----------|-------------|---------|-----------|
| `ANTHROPIC_API_KEY` | Sim (para chat/discuss) | — | Chave da API Anthropic |
| `DUARTEOS_API_KEY` | Nao | — | Token de auth. Sem ele, acesso local liberado |
| `PORT` | Nao | `3333` | Porta do servidor |
| `DUARTEOS_BASE_PATH` | Nao | `../` (raiz do repo) | Path para o diretorio duarteos-core-ai |
| `DEFAULT_MODEL` | Nao | `claude-sonnet-4-20250514` | Modelo Claude padrao |
| `DEFAULT_MAX_TOKENS` | Nao | `4096` | Max tokens padrao por resposta |
| `DEFAULT_TEMPERATURE` | Nao | `0.7` | Temperature padrao (0.0 a 1.0) |

### Dependencias

| Pacote | Versao | Funcao |
|--------|--------|--------|
| `express` | ^4.21 | Framework web |
| `@anthropic-ai/sdk` | ^0.36 | SDK oficial da Anthropic |
| `js-yaml` | ^4.1 | Parser de YAML |
| `cors` | ^2.8 | CORS middleware |
| `helmet` | ^8.0 | Security headers |
| `dotenv` | ^16.4 | Variaveis de ambiente |

---

## Arquitetura Interna

### MindLoader

Carrega dados dos mind clones do filesystem com cache em memoria (`Map`).

- `listSlugs()` — lista todos os diretorios em `DUARTEOS/minds/`
- `loadAll()` — carrega `config.yaml` de todos os clones
- `loadOne(slug)` — config + deteccao de artifacts disponiveis
- `loadArtifacts(slug)` — parseia todos os YAMLs do squad
- `loadAgentMd(slug)` — carrega `agents/{slug}.md` (MMOS v3) ou `agent.md` (legacy)
- `loadSynapseDna(slug)` — carrega `.claude/synapse/minds/{slug}.yaml`
- `invalidateCache(slug?)` — limpa cache (util apos atualizar clones)

### PromptBuilder

Constroi o system prompt completo para enviar ao Claude API.

**Clone MMOS v3 (com squad):**
1. Carrega `agents/{slug}.md`
2. Remove a secao `## Bootstrap` (nao precisa — dados serao inlined)
3. Carrega todos os artifacts YAML
4. Carrega Synapse DNA
5. Injeta tudo no prompt: agent.md + artifacts YAML + DNA + instrucao de operacao

**Clone Legacy (sem squad):**
1. Carrega `agent.md` puro
2. Usa como system prompt sem transformacao

### ClaudeClient

Wrapper do Anthropic SDK com dois modos:
- `chat()` — resposta completa (await)
- `chatStream()` — AsyncGenerator que emite SSE events (`text_delta`, `message_stop`)

### CouncilLoader

Parseia os arquivos `.md` de conselhos em `.claude/commands/DUARTEOS/conselho/`, extraindo nome, dominio e lista de membros (slugs).

---

## Troubleshooting

### "ANTHROPIC_API_KEY nao configurado" (503)

A chave da Anthropic nao esta no `.env`. Endpoints de chat e discuss nao funcionam sem ela.

```bash
# Verificar
cat api/.env | grep ANTHROPIC
```

### "Mind clone 'xyz' nao encontrado" (404)

O slug nao existe em `DUARTEOS/minds/`. Verificar slugs disponiveis:

```bash
curl http://localhost:3333/api/minds | jq '.minds[].slug'
```

### Clone responde de forma generica (sem personalidade)

Provavelmente e um clone legacy sem squad artifacts. Verificar:

```bash
curl http://localhost:3333/api/minds/SLUG | jq '.mind.has_full_squad'
```

Clones com `has_full_squad: true` tem personalidade muito mais rica. Clones MMOS v3 tem fidelidade >= 90%.

### SSE streaming nao funciona atras de Nginx

Verificar que a config do Nginx inclui:

```nginx
proxy_buffering off;
proxy_read_timeout 300s;
```

### Cache desatualizado apos adicionar novo clone

Reiniciar o servidor limpa o cache:

```bash
pm2 restart duarteos-api
```

### Erro de CORS

Por padrao, CORS esta aberto para qualquer origem (`*`). Se precisar restringir, editar `server.mjs`:

```javascript
app.use(cors({ origin: 'https://seusite.com' }))
```

---

## Licenca

MIT — mesmo do DuarteOS Core AI.
