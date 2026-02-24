# Squad: Build System — App Factory

Recebe um PRD, workflow N8N, ou URL de referencia e constroi um sistema completo automaticamente.

**Agente lider:** PM (Supreme Orchestrator)
**Agentes envolvidos:** Todos os 12 agentes (7 deliberativos + 5 custom)
**Motor:** GSD completo (new-project → plan → execute → verify)
**Modo:** YOLO — executa tudo automaticamente, so pergunta quando CRITICO

## Descricao

O comando mais poderoso do DuarteOS. Recebe um input (PRD, workflow, ou URL), analisa automaticamente, gera blueprint completo, e executa a construcao do sistema inteiro com:
- Banco de dados configurado
- Autenticacao (login, registro, middleware)
- API routes completas
- Interface grafica com UX clara e design coerente
- Error handling, loading states, responsivo

## Input aceito

| Tipo | Exemplo | Como funciona |
|------|---------|---------------|
| **PRD** (arquivo) | `build-system PRD.md` | Analisa requisitos, features, regras de negocio |
| **N8N Workflow** (JSON) | `build-system workflow.json` | Extrai nodes, conexoes, transforma em features |
| **URL** (site referencia) | `build-system https://example.com` | Scrape + analise: estrutura, design, features, UX |
| **Texto livre** | `build-system "SaaS de gestao de clinicas"` | Interpreta como briefing verbal |

## Modo YOLO

Este comando opera em YOLO mode por padrao:
- **NAO pergunta** sobre stack (usa defaults inteligentes)
- **NAO pergunta** sobre design (gera paleta coerente automaticamente)
- **NAO pergunta** sobre patterns (segue melhores praticas)
- **SO pergunta** quando:
  1. Input ambiguo que pode gerar 2 sistemas completamente diferentes
  2. Decisao de EXCLUIR feature que estava no input original
  3. Custo significativo (API paga, servico externo obrigatorio)
  4. Seguranca (expor dados sensiveis, permissoes criticas)

## Como funciona

### FASE 0 — INPUT ANALYSIS (automatica, ~2 min)

```
1. Detectar tipo de input:
   - Se termina em .md/.txt/.pdf → PRD
   - Se termina em .json e tem "nodes" → N8N workflow
   - Se comeca com http → URL para scraping
   - Senao → texto livre (briefing)

2. Executar analise especializada:
   - PRD: extrair features, data models, regras de negocio, personas
   - N8N: extrair nodes → mapear para features, trigger → eventos, connections → fluxos
   - URL: scrape → extrair paginas, navegacao, design, cores, features visiveis
   - Texto: inferir dominio, features minimas viaveis, publico

3. Gerar BLUEPRINT.md em .planning/:
   - Nome do projeto
   - Stack (inferido ou default)
   - Data models (entidades, campos, relacionamentos)
   - Auth requirements (roles, permissoes)
   - Pages/Routes (cada tela com descricao)
   - API endpoints (CRUD + custom)
   - Design (paleta de cores, tipografia, layout)
   - Features (priorizadas: MVP → Nice-to-have)
```

### FASE 1 — ARCHITECTURE DECISION (automatica, ~3 min)

```
1. Architect analisa BLUEPRINT.md e define:
   - Stack final (Next.js 15 + Supabase default, ou detectado do input)
   - Database schema completo (SQL ready)
   - API contract (OpenAPI-like)
   - Component tree (paginas → componentes)
   - Auth strategy (Supabase Auth default)

2. Security Auditor valida:
   - Schema seguro? (sem dados sensiveis expostos)
   - Auth adequado? (RBAC se multi-role)
   - Input validation planejado?

3. Devil's Advocate contesta (silent mode — so bloqueia se CRITICO)

4. PM aprova automaticamente se nao houve bloqueio critico
```

### FASE 2 — FOUNDATION (auto-execute, ~10 min)

```
Wave 1 — Infraestrutura:
  - DevOps: scaffold do projeto (next.js, package.json, tsconfig, tailwind)
  - Backend: database schema + migrations (SQL)
  - Backend: auth setup (login, register, middleware, protected routes)

Wave 2 — Base UI:
  - Frontend: layout base (header, sidebar, main content)
  - Frontend: design system (cores, tipografia, componentes base)
  - Frontend: paginas de auth (login, register, forgot-password)
```

### FASE 3 — FEATURES (auto-execute, waves paralelas)

```
Para cada feature no BLUEPRINT.md, em ordem de prioridade:

Wave N:
  - Backend: API route + service + validation
  - Frontend: pagina + componentes + integracao
  - Fullstack: conecta front ↔ back, loading states, error handling

Cada wave = 1 feature completa com commit atomico
```

### FASE 4 — POLISH (auto-execute, ~5 min)

```
Wave 1 — UX:
  - Frontend: responsivo (mobile-first)
  - Frontend: loading states, empty states, error states
  - Frontend: animacoes sutis (framer-motion)

Wave 2 — Quality:
  - QA: smoke tests das rotas principais
  - Security Auditor: scan rapido (OWASP basics)
  - Context Engineer: coerencia visual e semantica
```

### FASE 5 — DELIVERY (auto)

```
1. QA gera relatorio final de verificacao
2. DevOps gera instrucoes de deploy
3. PM gera DELIVERY.md com:
   - O que foi construido
   - Como rodar (dev + prod)
   - Credenciais criadas
   - Proximos passos sugeridos
   - Gaps conhecidos (se houver)
```

## Stack Defaults (quando nao especificado)

| Camada | Default | Alternativas detectaveis |
|--------|---------|-------------------------|
| Framework | Next.js 15 (App Router) | Nuxt, SvelteKit, Remix |
| UI | Tailwind CSS + shadcn/ui | Material UI, Chakra |
| Auth | Supabase Auth | NextAuth, Clerk |
| Database | Supabase (PostgreSQL) | PlanetScale, Neon |
| ORM | Supabase Client | Prisma, Drizzle |
| Deploy | Vercel / VPS | Railway, Fly.io |

## Design Defaults

| Aspecto | Default |
|---------|---------|
| Paleta | Inferida do input. Fallback: slate + emerald accent |
| Tipografia | Inter (sans-serif) |
| Layout | Sidebar + main content |
| Dark mode | Sim (default) |
| Responsivo | Mobile-first |
| Animacoes | Sutis (framer-motion) |

## Flags

- `--stack=nextjs|nuxt|svelte` — forca stack especifica
- `--db=supabase|postgres|mysql` — forca banco
- `--auth=supabase|nextauth|clerk` — forca auth provider
- `--no-auth` — sistema sem autenticacao
- `--verbose` — mostra logs detalhados de cada fase
- `--dry-run` — gera BLUEPRINT.md sem executar (para revisar antes)

## Exemplos

```bash
# A partir de um PRD
/squad:build-system docs/PRD.md

# A partir de um workflow N8N
/squad:build-system automation/lead-capture.json

# A partir de um site de referencia
/squad:build-system https://linear.app

# A partir de um briefing
/squad:build-system "Sistema de agendamento para clinicas com painel admin, area do paciente e notificacoes por email"

# Dry run (so gera blueprint)
/squad:build-system --dry-run docs/PRD.md

# Stack especifica
/squad:build-system --stack=nuxt --db=postgres docs/PRD.md
```

## Output esperado

```
.planning/
  BLUEPRINT.md          — Blueprint completo do sistema
  ARCHITECTURE.md       — Decisoes arquiteturais
  SCHEMA.sql            — Database schema
  DELIVERY.md           — Instrucoes de deploy e uso
  phases/               — Artefatos de cada fase
src/                    — Codigo fonte completo
  app/                  — Pages e routes
  components/           — UI components
  lib/                  — Services e utils
  middleware.ts         — Auth middleware
public/                 — Assets estaticos
```

## Regras YOLO

1. **Assume defaults inteligentes** — nao pergunta o que pode inferir
2. **Feature completa > feature perfeita** — entrega funcional, refina depois
3. **Commit por feature** — atomico e rastreavel
4. **So pergunta quando CRITICO** — ambiguidade, exclusao, custo, seguranca
5. **Design coerente automatico** — paleta + tipografia + layout sem pedir input
6. **Auth incluso por padrao** — login + registro + middleware + RBAC se multi-role
7. **Banco configurado** — schema + seeds + migrations prontos
8. **Pronto pra rodar** — npm run dev funciona ao final
