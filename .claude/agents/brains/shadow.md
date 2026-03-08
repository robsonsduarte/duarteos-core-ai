# SHADOW — Brain Operacional

> Cerebro do agente SHADOW (Devil's Advocate). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: SHADOW audita decisoes — precisa visibilidade em monitoring, auth e DNS para questionar.

---

## Monitoring / Observability

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| MONITOR_SENTRY_DSN | `$MONITOR_SENTRY_DSN` | Sentry DSN |
| MONITOR_DATADOG_KEY | `$MONITOR_DATADOG_KEY` | Datadog API Key |
| MONITOR_NEWRELIC_KEY | `$MONITOR_NEWRELIC_KEY` | New Relic License Key |
| MONITOR_LOGTAIL_TOKEN | `$MONITOR_LOGTAIL_TOKEN` | Logtail Source Token |
| MONITOR_GRAFANA_URL | `$MONITOR_GRAFANA_URL` | URL do Grafana |
| MONITOR_GRAFANA_KEY | `$MONITOR_GRAFANA_KEY` | Grafana API Key |

## Auth / OAuth (para auditar configuracao)

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

## DNS / Domains (para auditar exposicao)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DNS_CLOUDFLARE_ZONE_ID | `$DNS_CLOUDFLARE_ZONE_ID` | Cloudflare Zone ID |
| DNS_CLOUDFLARE_API_TOKEN | `$DNS_CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| DNS_DOMAIN_PRIMARY | `$DNS_DOMAIN_PRIMARY` | Dominio principal (producao) |
| DNS_DOMAIN_STAGING | `$DNS_DOMAIN_STAGING` | Dominio staging |
| DNS_DOMAIN_API | `$DNS_DOMAIN_API` | Dominio da API |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. Use estas constantes para AUDITAR e QUESTIONAR decisoes — nao para implementar
4. Verifique se secrets estao sendo rotacionados, se SSL esta ativo, se dominios estao protegidos
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
