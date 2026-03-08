# VAULT — Brain Operacional

> Cerebro do agente VAULT (DevOps). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`

---

## Cloud Providers — AWS

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CLOUD_AWS_ACCESS_KEY | `$CLOUD_AWS_ACCESS_KEY` | AWS Access Key ID |
| CLOUD_AWS_SECRET_KEY | `$CLOUD_AWS_SECRET_KEY` | AWS Secret Access Key |
| CLOUD_AWS_REGION | `$CLOUD_AWS_REGION` | Regiao AWS (ex: us-east-1) |
| CLOUD_AWS_BUCKET | `$CLOUD_AWS_BUCKET` | Bucket S3 padrao |

## Cloud Providers — GCP

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CLOUD_GCP_PROJECT_ID | `$CLOUD_GCP_PROJECT_ID` | ID do projeto GCP |
| CLOUD_GCP_CLIENT_EMAIL | `$CLOUD_GCP_CLIENT_EMAIL` | Service account email |
| CLOUD_GCP_PRIVATE_KEY | `$CLOUD_GCP_PRIVATE_KEY` | Service account private key |
| CLOUD_GCP_BUCKET | `$CLOUD_GCP_BUCKET` | Bucket GCS padrao |

## Cloud Providers — Azure

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CLOUD_AZURE_TENANT_ID | `$CLOUD_AZURE_TENANT_ID` | Azure Tenant ID |
| CLOUD_AZURE_CLIENT_ID | `$CLOUD_AZURE_CLIENT_ID` | Azure Client ID |
| CLOUD_AZURE_CLIENT_SECRET | `$CLOUD_AZURE_CLIENT_SECRET` | Azure Client Secret |
| CLOUD_AZURE_SUBSCRIPTION_ID | `$CLOUD_AZURE_SUBSCRIPTION_ID` | Azure Subscription ID |

## Infra / VPS

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| INFRA_VPS_HOST | `$INFRA_VPS_HOST` | IP/hostname do VPS |
| INFRA_VPS_USER | `$INFRA_VPS_USER` | Usuario SSH |
| INFRA_VPS_SSH_KEY_PATH | `$INFRA_VPS_SSH_KEY_PATH` | Path da chave SSH |
| INFRA_VPS_PORT | `$INFRA_VPS_PORT` | Porta SSH (default: 22) |

## CI/CD

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CICD_GITHUB_ACTIONS_TOKEN | `$CICD_GITHUB_ACTIONS_TOKEN` | Token GitHub Actions |
| CICD_VERCEL_TOKEN | `$CICD_VERCEL_TOKEN` | Token Vercel para deploy |
| CICD_DOCKER_USERNAME | `$CICD_DOCKER_USERNAME` | Usuario Docker Hub |
| CICD_DOCKER_PASSWORD | `$CICD_DOCKER_PASSWORD` | Senha Docker Hub |
| CICD_DOCKER_REGISTRY | `$CICD_DOCKER_REGISTRY` | Registry Docker customizado |

## DNS / Domains

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DNS_CLOUDFLARE_ZONE_ID | `$DNS_CLOUDFLARE_ZONE_ID` | Cloudflare Zone ID |
| DNS_CLOUDFLARE_API_TOKEN | `$DNS_CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| DNS_DOMAIN_PRIMARY | `$DNS_DOMAIN_PRIMARY` | Dominio principal (producao) |
| DNS_DOMAIN_STAGING | `$DNS_DOMAIN_STAGING` | Dominio staging |
| DNS_DOMAIN_API | `$DNS_DOMAIN_API` | Dominio da API |

## Monitoring / Observability

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| MONITOR_SENTRY_DSN | `$MONITOR_SENTRY_DSN` | Sentry DSN |
| MONITOR_DATADOG_KEY | `$MONITOR_DATADOG_KEY` | Datadog API Key |
| MONITOR_NEWRELIC_KEY | `$MONITOR_NEWRELIC_KEY` | New Relic License Key |
| MONITOR_LOGTAIL_TOKEN | `$MONITOR_LOGTAIL_TOKEN` | Logtail Source Token |
| MONITOR_GRAFANA_URL | `$MONITOR_GRAFANA_URL` | URL do Grafana |
| MONITOR_GRAFANA_KEY | `$MONITOR_GRAFANA_KEY` | Grafana API Key |

## Banco de Dados — Admin Access

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_PRIMARY_HOST | `$DB_PRIMARY_HOST` | Host do banco principal |
| DB_PRIMARY_PORT | `$DB_PRIMARY_PORT` | Porta (default: 5432) |
| DB_PRIMARY_NAME | `$DB_PRIMARY_NAME` | Nome do database |
| DB_PRIMARY_USER | `$DB_PRIMARY_USER` | Usuario de conexao |
| DB_PRIMARY_PASSWORD | `$DB_PRIMARY_PASSWORD` | Senha de conexao |
| DB_PRIMARY_SSL | `$DB_PRIMARY_SSL` | SSL habilitado (true/false) |
| DB_PRIMARY_URL | `$DB_PRIMARY_URL` | Connection string completa |
| DB_REPLICA_HOST | `$DB_REPLICA_HOST` | Host da replica |
| DB_REPLICA_URL | `$DB_REPLICA_URL` | Connection string replica |
| DB_REDIS_HOST | `$DB_REDIS_HOST` | Host do Redis |
| DB_REDIS_PORT | `$DB_REDIS_PORT` | Porta do Redis |
| DB_REDIS_PASSWORD | `$DB_REDIS_PASSWORD` | Senha do Redis |
| DB_REDIS_URL | `$DB_REDIS_URL` | Connection string Redis |
| DB_MONGO_HOST | `$DB_MONGO_HOST` | Host do MongoDB |
| DB_MONGO_URL | `$DB_MONGO_URL` | Connection string MongoDB |

## Tokens (Docker / Container Registry)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| TOKEN_DOCKER_VALUE | `$TOKEN_DOCKER_VALUE` | Token Docker Hub |
| TOKEN_CLOUDFLARE_VALUE | `$TOKEN_CLOUDFLARE_VALUE` | Token Cloudflare |
| TOKEN_RAILWAY_VALUE | `$TOKEN_RAILWAY_VALUE` | Token Railway |
| TOKEN_FLY_VALUE | `$TOKEN_FLY_VALUE` | Token Fly.io |
| TOKEN_RENDER_VALUE | `$TOKEN_RENDER_VALUE` | Token Render |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. Para provisionamento, use as credenciais de cloud providers
4. NUNCA exponha credenciais em logs ou outputs de CI/CD
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
