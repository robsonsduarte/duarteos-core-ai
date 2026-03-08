# SENTINEL — Brain Operacional

> Cerebro do agente SENTINEL (QA). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: SENTINEL acessa DBs em modo READ-ONLY e usa test keys das APIs.

---

## IAs Generativas (test keys)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| API_CLAUDE_KEY | `$API_CLAUDE_KEY` | Chave API Claude (test environment) |
| API_OPENAI_KEY | `$API_OPENAI_KEY` | Chave API OpenAI (test environment) |
| API_GEMINI_KEY | `$API_GEMINI_KEY` | Chave API Gemini (test environment) |

## Banco de Dados — Read-Only Access

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_REPLICA_HOST | `$DB_REPLICA_HOST` | Host da replica read-only |
| DB_REPLICA_PORT | `$DB_REPLICA_PORT` | Porta da replica |
| DB_REPLICA_NAME | `$DB_REPLICA_NAME` | Nome do database replica |
| DB_REPLICA_USER | `$DB_REPLICA_USER` | Usuario read-only |
| DB_REPLICA_PASSWORD | `$DB_REPLICA_PASSWORD` | Senha read-only |
| DB_REPLICA_URL | `$DB_REPLICA_URL` | Connection string replica |
| DB_REDIS_HOST | `$DB_REDIS_HOST` | Host do Redis |
| DB_REDIS_PORT | `$DB_REDIS_PORT` | Porta do Redis |
| DB_REDIS_URL | `$DB_REDIS_URL` | Connection string Redis |

## Monitoring / Observability

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| MONITOR_SENTRY_DSN | `$MONITOR_SENTRY_DSN` | Sentry DSN |
| MONITOR_DATADOG_KEY | `$MONITOR_DATADOG_KEY` | Datadog API Key |
| MONITOR_NEWRELIC_KEY | `$MONITOR_NEWRELIC_KEY` | New Relic License Key |
| MONITOR_LOGTAIL_TOKEN | `$MONITOR_LOGTAIL_TOKEN` | Logtail Source Token |
| MONITOR_GRAFANA_URL | `$MONITOR_GRAFANA_URL` | URL do Grafana |
| MONITOR_GRAFANA_KEY | `$MONITOR_GRAFANA_KEY` | Grafana API Key |

## CI/CD

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CICD_GITHUB_ACTIONS_TOKEN | `$CICD_GITHUB_ACTIONS_TOKEN` | Token GitHub Actions |
| CICD_VERCEL_TOKEN | `$CICD_VERCEL_TOKEN` | Token Vercel para deploy |
| CICD_DOCKER_USERNAME | `$CICD_DOCKER_USERNAME` | Usuario Docker Hub |
| CICD_DOCKER_PASSWORD | `$CICD_DOCKER_PASSWORD` | Senha Docker Hub |
| CICD_DOCKER_REGISTRY | `$CICD_DOCKER_REGISTRY` | Registry Docker customizado |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. SEMPRE use replicas read-only para queries de validacao — NUNCA o primary
4. Use test keys para APIs — NUNCA production keys em testes
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
