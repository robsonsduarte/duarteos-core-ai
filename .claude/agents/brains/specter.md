# SPECTER — Brain Operacional

> Cerebro do agente SPECTER (Security Auditor). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: SPECTER audita seguranca — precisa visibilidade em auth, DNS, infra, monitoring e DBs.

---

## Auth / OAuth (auditoria de seguranca)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| AUTH_JWT_SECRET | `$AUTH_JWT_SECRET` | Secret para assinar JWTs |
| AUTH_SESSION_SECRET | `$AUTH_SESSION_SECRET` | Secret para sessoes |
| AUTH_GOOGLE_CLIENT_ID | `$AUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| AUTH_GOOGLE_CLIENT_SECRET | `$AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| AUTH_GITHUB_CLIENT_ID | `$AUTH_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| AUTH_GITHUB_CLIENT_SECRET | `$AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret |
| AUTH_APPLE_CLIENT_ID | `$AUTH_APPLE_CLIENT_ID` | Apple OAuth Client ID |
| AUTH_APPLE_CLIENT_SECRET | `$AUTH_APPLE_CLIENT_SECRET` | Apple OAuth Client Secret |

## DNS / Domains (auditoria de exposicao)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DNS_CLOUDFLARE_ZONE_ID | `$DNS_CLOUDFLARE_ZONE_ID` | Cloudflare Zone ID |
| DNS_CLOUDFLARE_API_TOKEN | `$DNS_CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| DNS_DOMAIN_PRIMARY | `$DNS_DOMAIN_PRIMARY` | Dominio principal (producao) |
| DNS_DOMAIN_STAGING | `$DNS_DOMAIN_STAGING` | Dominio staging |
| DNS_DOMAIN_API | `$DNS_DOMAIN_API` | Dominio da API |

## Infra / VPS (auditoria de acesso)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| INFRA_VPS_HOST | `$INFRA_VPS_HOST` | IP/hostname do VPS |
| INFRA_VPS_USER | `$INFRA_VPS_USER` | Usuario SSH |
| INFRA_VPS_SSH_KEY_PATH | `$INFRA_VPS_SSH_KEY_PATH` | Path da chave SSH |
| INFRA_VPS_PORT | `$INFRA_VPS_PORT` | Porta SSH (default: 22) |

## Monitoring / Observability (deteccao de incidentes)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| MONITOR_SENTRY_DSN | `$MONITOR_SENTRY_DSN` | Sentry DSN |
| MONITOR_DATADOG_KEY | `$MONITOR_DATADOG_KEY` | Datadog API Key |
| MONITOR_NEWRELIC_KEY | `$MONITOR_NEWRELIC_KEY` | New Relic License Key |
| MONITOR_LOGTAIL_TOKEN | `$MONITOR_LOGTAIL_TOKEN` | Logtail Source Token |
| MONITOR_GRAFANA_URL | `$MONITOR_GRAFANA_URL` | URL do Grafana |
| MONITOR_GRAFANA_KEY | `$MONITOR_GRAFANA_KEY` | Grafana API Key |

## Banco de Dados — Audit Access

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_PRIMARY_HOST | `$DB_PRIMARY_HOST` | Host do banco principal |
| DB_PRIMARY_PORT | `$DB_PRIMARY_PORT` | Porta (default: 5432) |
| DB_PRIMARY_SSL | `$DB_PRIMARY_SSL` | SSL habilitado (true/false) |
| DB_PRIMARY_URL | `$DB_PRIMARY_URL` | Connection string (para validar SSL/TLS) |
| DB_REDIS_HOST | `$DB_REDIS_HOST` | Host do Redis |
| DB_REDIS_PORT | `$DB_REDIS_PORT` | Porta do Redis |
| DB_REDIS_URL | `$DB_REDIS_URL` | Connection string Redis |
| DB_MONGO_HOST | `$DB_MONGO_HOST` | Host do MongoDB |
| DB_MONGO_URL | `$DB_MONGO_URL` | Connection string MongoDB |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. Use estas constantes para AUDITAR seguranca — validar SSL, rotacao de secrets, permissoes
4. Verifique: JWT secrets fortes? Portas expostas? Redis protegido? SSL ativo em DBs?
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
