# DuarteOS — Referencia Master de Constantes

> Este arquivo contem TODAS as constantes de infraestrutura disponiveis no ecossistema DuarteOS.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Cada agente tem seu proprio brain em `.claude/agents/brains/{agente}.md` com subset relevante.

---

## IAs Generativas

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| API_CLAUDE_KEY | `$API_CLAUDE_KEY` | Chave API Anthropic Claude |
| API_OPENAI_KEY | `$API_OPENAI_KEY` | Chave API OpenAI |
| API_GROK_KEY | `$API_GROK_KEY` | Chave API xAI Grok |
| API_PERPLEXITY_KEY | `$API_PERPLEXITY_KEY` | Chave API Perplexity |
| API_GEMINI_KEY | `$API_GEMINI_KEY` | Chave API Google Gemini |
| API_MISTRAL_KEY | `$API_MISTRAL_KEY` | Chave API Mistral AI |
| API_DEEPSEEK_KEY | `$API_DEEPSEEK_KEY` | Chave API DeepSeek |
| API_COHERE_KEY | `$API_COHERE_KEY` | Chave API Cohere |
| API_GROQ_KEY | `$API_GROQ_KEY` | Chave API Groq |

## Tokens de Servicos

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| TOKEN_GITHUB_VALUE | `$TOKEN_GITHUB_VALUE` | Personal Access Token GitHub |
| TOKEN_VERCEL_VALUE | `$TOKEN_VERCEL_VALUE` | Token Vercel |
| TOKEN_STRIPE_VALUE | `$TOKEN_STRIPE_VALUE` | Token Stripe |
| TOKEN_RESEND_VALUE | `$TOKEN_RESEND_VALUE` | Token Resend (email) |
| TOKEN_CLERK_VALUE | `$TOKEN_CLERK_VALUE` | Token Clerk (auth) |
| TOKEN_SUPABASE_VALUE | `$TOKEN_SUPABASE_VALUE` | Token Supabase |
| TOKEN_FIREBASE_VALUE | `$TOKEN_FIREBASE_VALUE` | Token Firebase |
| TOKEN_TWILIO_VALUE | `$TOKEN_TWILIO_VALUE` | Token Twilio |
| TOKEN_SENDGRID_VALUE | `$TOKEN_SENDGRID_VALUE` | Token SendGrid |
| TOKEN_SLACK_VALUE | `$TOKEN_SLACK_VALUE` | Token Slack |
| TOKEN_DISCORD_VALUE | `$TOKEN_DISCORD_VALUE` | Token Discord |
| TOKEN_LINEAR_VALUE | `$TOKEN_LINEAR_VALUE` | Token Linear |
| TOKEN_NOTION_VALUE | `$TOKEN_NOTION_VALUE` | Token Notion |
| TOKEN_AIRTABLE_VALUE | `$TOKEN_AIRTABLE_VALUE` | Token Airtable |
| TOKEN_HUBSPOT_VALUE | `$TOKEN_HUBSPOT_VALUE` | Token HubSpot |
| TOKEN_ZAPIER_VALUE | `$TOKEN_ZAPIER_VALUE` | Token Zapier |
| TOKEN_N8N_VALUE | `$TOKEN_N8N_VALUE` | Token n8n |
| TOKEN_SENTRY_VALUE | `$TOKEN_SENTRY_VALUE` | Token Sentry |
| TOKEN_DATADOG_VALUE | `$TOKEN_DATADOG_VALUE` | Token Datadog |
| TOKEN_NEWRELIC_VALUE | `$TOKEN_NEWRELIC_VALUE` | Token New Relic |
| TOKEN_CLOUDFLARE_VALUE | `$TOKEN_CLOUDFLARE_VALUE` | Token Cloudflare |
| TOKEN_DOCKER_VALUE | `$TOKEN_DOCKER_VALUE` | Token Docker Hub |
| TOKEN_NPM_VALUE | `$TOKEN_NPM_VALUE` | Token npm registry |
| TOKEN_RAILWAY_VALUE | `$TOKEN_RAILWAY_VALUE` | Token Railway |
| TOKEN_FLY_VALUE | `$TOKEN_FLY_VALUE` | Token Fly.io |
| TOKEN_RENDER_VALUE | `$TOKEN_RENDER_VALUE` | Token Render |
| TOKEN_PLANETSCALE_VALUE | `$TOKEN_PLANETSCALE_VALUE` | Token PlanetScale |
| TOKEN_NEON_VALUE | `$TOKEN_NEON_VALUE` | Token Neon |
| TOKEN_UPSTASH_VALUE | `$TOKEN_UPSTASH_VALUE` | Token Upstash |
| TOKEN_REDIS_VALUE | `$TOKEN_REDIS_VALUE` | Token Redis Cloud |

## Banco de Dados — Primary

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_PRIMARY_HOST | `$DB_PRIMARY_HOST` | Host do banco principal |
| DB_PRIMARY_PORT | `$DB_PRIMARY_PORT` | Porta (default: 5432) |
| DB_PRIMARY_NAME | `$DB_PRIMARY_NAME` | Nome do database |
| DB_PRIMARY_USER | `$DB_PRIMARY_USER` | Usuario de conexao |
| DB_PRIMARY_PASSWORD | `$DB_PRIMARY_PASSWORD` | Senha de conexao |
| DB_PRIMARY_SSL | `$DB_PRIMARY_SSL` | SSL habilitado (true/false) |
| DB_PRIMARY_URL | `$DB_PRIMARY_URL` | Connection string completa |

## Banco de Dados — Replica

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_REPLICA_HOST | `$DB_REPLICA_HOST` | Host da replica read-only |
| DB_REPLICA_PORT | `$DB_REPLICA_PORT` | Porta da replica |
| DB_REPLICA_NAME | `$DB_REPLICA_NAME` | Nome do database replica |
| DB_REPLICA_USER | `$DB_REPLICA_USER` | Usuario read-only |
| DB_REPLICA_PASSWORD | `$DB_REPLICA_PASSWORD` | Senha read-only |
| DB_REPLICA_URL | `$DB_REPLICA_URL` | Connection string replica |

## Banco de Dados — Redis

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_REDIS_HOST | `$DB_REDIS_HOST` | Host do Redis |
| DB_REDIS_PORT | `$DB_REDIS_PORT` | Porta do Redis (default: 6379) |
| DB_REDIS_PASSWORD | `$DB_REDIS_PASSWORD` | Senha do Redis |
| DB_REDIS_URL | `$DB_REDIS_URL` | Connection string Redis |

## Banco de Dados — MongoDB

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DB_MONGO_HOST | `$DB_MONGO_HOST` | Host do MongoDB |
| DB_MONGO_PORT | `$DB_MONGO_PORT` | Porta do MongoDB (default: 27017) |
| DB_MONGO_NAME | `$DB_MONGO_NAME` | Nome do database |
| DB_MONGO_USER | `$DB_MONGO_USER` | Usuario MongoDB |
| DB_MONGO_PASSWORD | `$DB_MONGO_PASSWORD` | Senha MongoDB |
| DB_MONGO_URL | `$DB_MONGO_URL` | Connection string MongoDB |

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

## MCP Servers

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| MCP_MEMORY_URL | `$MCP_MEMORY_URL` | URL do MCP Memory |
| MCP_MEMORY_KEY | `$MCP_MEMORY_KEY` | Chave do MCP Memory |
| MCP_REDIS_URL | `$MCP_REDIS_URL` | URL do MCP Redis |
| MCP_REDIS_KEY | `$MCP_REDIS_KEY` | Chave do MCP Redis |
| MCP_OBSIDIAN_VAULT_PATH | `$MCP_OBSIDIAN_VAULT_PATH` | Path do vault Obsidian |
| MCP_GITHUB_TOKEN | `$MCP_GITHUB_TOKEN` | Token GitHub para MCP |
| MCP_FETCH_URL | `$MCP_FETCH_URL` | URL do MCP Fetch |
| MCP_N8N_URL | `$MCP_N8N_URL` | URL do MCP n8n |
| MCP_N8N_KEY | `$MCP_N8N_KEY` | Chave do MCP n8n |
| MCP_EXA_KEY | `$MCP_EXA_KEY` | Chave Exa para MCP |
| MCP_APIFY_KEY | `$MCP_APIFY_KEY` | Chave Apify para MCP |
| MCP_CONTEXT7_URL | `$MCP_CONTEXT7_URL` | URL do MCP Context7 |
| MCP_GOOGLE_WORKSPACE_CREDENTIALS | `$MCP_GOOGLE_WORKSPACE_CREDENTIALS` | Credenciais Google Workspace |
| MCP_YOUTUBE_KEY | `$MCP_YOUTUBE_KEY` | Chave YouTube para MCP |

## Storage / CDN

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| STORAGE_S3_ENDPOINT | `$STORAGE_S3_ENDPOINT` | Endpoint S3-compatible |
| STORAGE_S3_BUCKET | `$STORAGE_S3_BUCKET` | Bucket S3 |
| STORAGE_S3_KEY | `$STORAGE_S3_KEY` | Access key S3 |
| STORAGE_S3_SECRET | `$STORAGE_S3_SECRET` | Secret key S3 |
| STORAGE_CLOUDINARY_URL | `$STORAGE_CLOUDINARY_URL` | URL Cloudinary |
| STORAGE_CLOUDINARY_KEY | `$STORAGE_CLOUDINARY_KEY` | API key Cloudinary |
| STORAGE_CLOUDINARY_SECRET | `$STORAGE_CLOUDINARY_SECRET` | API secret Cloudinary |
| STORAGE_R2_ENDPOINT | `$STORAGE_R2_ENDPOINT` | Endpoint Cloudflare R2 |
| STORAGE_R2_BUCKET | `$STORAGE_R2_BUCKET` | Bucket R2 |
| STORAGE_R2_KEY | `$STORAGE_R2_KEY` | Access key R2 |
| STORAGE_R2_SECRET | `$STORAGE_R2_SECRET` | Secret key R2 |

## Auth / OAuth

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

## Email / SMS

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| EMAIL_SMTP_HOST | `$EMAIL_SMTP_HOST` | Host SMTP |
| EMAIL_SMTP_PORT | `$EMAIL_SMTP_PORT` | Porta SMTP (default: 587) |
| EMAIL_SMTP_USER | `$EMAIL_SMTP_USER` | Usuario SMTP |
| EMAIL_SMTP_PASSWORD | `$EMAIL_SMTP_PASSWORD` | Senha SMTP |
| EMAIL_FROM | `$EMAIL_FROM` | Email remetente padrao |
| SMS_TWILIO_SID | `$SMS_TWILIO_SID` | Twilio Account SID |
| SMS_TWILIO_TOKEN | `$SMS_TWILIO_TOKEN` | Twilio Auth Token |
| SMS_TWILIO_FROM | `$SMS_TWILIO_FROM` | Numero remetente Twilio |

## Payment

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| PAYMENT_STRIPE_SECRET_KEY | `$PAYMENT_STRIPE_SECRET_KEY` | Stripe Secret Key |
| PAYMENT_STRIPE_PUBLISHABLE_KEY | `$PAYMENT_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
| PAYMENT_STRIPE_WEBHOOK_SECRET | `$PAYMENT_STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret |
| PAYMENT_MERCADOPAGO_ACCESS_TOKEN | `$PAYMENT_MERCADOPAGO_ACCESS_TOKEN` | MercadoPago Access Token |
| PAYMENT_MERCADOPAGO_PUBLIC_KEY | `$PAYMENT_MERCADOPAGO_PUBLIC_KEY` | MercadoPago Public Key |
| PAYMENT_HOTMART_TOKEN | `$PAYMENT_HOTMART_TOKEN` | Hotmart API Token |
| PAYMENT_HOTMART_SECRET | `$PAYMENT_HOTMART_SECRET` | Hotmart Webhook Secret |

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

## DNS / Domains

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DNS_CLOUDFLARE_ZONE_ID | `$DNS_CLOUDFLARE_ZONE_ID` | Cloudflare Zone ID |
| DNS_CLOUDFLARE_API_TOKEN | `$DNS_CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| DNS_DOMAIN_PRIMARY | `$DNS_DOMAIN_PRIMARY` | Dominio principal (producao) |
| DNS_DOMAIN_STAGING | `$DNS_DOMAIN_STAGING` | Dominio staging |
| DNS_DOMAIN_API | `$DNS_DOMAIN_API` | Dominio da API |

## Infra / VPS

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| INFRA_VPS_HOST | `$INFRA_VPS_HOST` | IP/hostname do VPS |
| INFRA_VPS_USER | `$INFRA_VPS_USER` | Usuario SSH |
| INFRA_VPS_SSH_KEY_PATH | `$INFRA_VPS_SSH_KEY_PATH` | Path da chave SSH |
| INFRA_VPS_PORT | `$INFRA_VPS_PORT` | Porta SSH (default: 22) |

## Feature Flags

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| FF_LAUNCH_DARKLY_KEY | `$FF_LAUNCH_DARKLY_KEY` | LaunchDarkly SDK Key |
| FF_POSTHOG_KEY | `$FF_POSTHOG_KEY` | PostHog Project API Key |
| FF_POSTHOG_HOST | `$FF_POSTHOG_HOST` | PostHog Host URL |

## Analytics

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| ANALYTICS_GA_ID | `$ANALYTICS_GA_ID` | Google Analytics Measurement ID |
| ANALYTICS_MIXPANEL_TOKEN | `$ANALYTICS_MIXPANEL_TOKEN` | Mixpanel Project Token |
| ANALYTICS_POSTHOG_KEY | `$ANALYTICS_POSTHOG_KEY` | PostHog Project API Key |
| ANALYTICS_HOTJAR_ID | `$ANALYTICS_HOTJAR_ID` | Hotjar Site ID |
| ANALYTICS_AMPLITUDE_KEY | `$ANALYTICS_AMPLITUDE_KEY` | Amplitude API Key |

## Search

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| SEARCH_ALGOLIA_APP_ID | `$SEARCH_ALGOLIA_APP_ID` | Algolia Application ID |
| SEARCH_ALGOLIA_KEY | `$SEARCH_ALGOLIA_KEY` | Algolia Search-Only Key |
| SEARCH_ALGOLIA_ADMIN_KEY | `$SEARCH_ALGOLIA_ADMIN_KEY` | Algolia Admin API Key |
| SEARCH_MEILISEARCH_URL | `$SEARCH_MEILISEARCH_URL` | URL do MeiliSearch |
| SEARCH_MEILISEARCH_KEY | `$SEARCH_MEILISEARCH_KEY` | MeiliSearch API Key |
| SEARCH_TYPESENSE_URL | `$SEARCH_TYPESENSE_URL` | URL do Typesense |
| SEARCH_TYPESENSE_KEY | `$SEARCH_TYPESENSE_KEY` | Typesense API Key |

## Queue / Messaging

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| QUEUE_RABBITMQ_URL | `$QUEUE_RABBITMQ_URL` | URL do RabbitMQ |
| QUEUE_SQS_URL | `$QUEUE_SQS_URL` | URL da fila SQS |
| QUEUE_KAFKA_BROKERS | `$QUEUE_KAFKA_BROKERS` | Kafka brokers (comma-separated) |
| QUEUE_BULLMQ_REDIS_URL | `$QUEUE_BULLMQ_REDIS_URL` | Redis URL para BullMQ |

## Websockets / Realtime

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| REALTIME_PUSHER_KEY | `$REALTIME_PUSHER_KEY` | Pusher App Key |
| REALTIME_PUSHER_SECRET | `$REALTIME_PUSHER_SECRET` | Pusher App Secret |
| REALTIME_PUSHER_APP_ID | `$REALTIME_PUSHER_APP_ID` | Pusher App ID |
| REALTIME_ABLY_KEY | `$REALTIME_ABLY_KEY` | Ably API Key |
| REALTIME_SOCKETIO_URL | `$REALTIME_SOCKETIO_URL` | URL do Socket.IO server |

## Scraping / Data

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| SCRAPE_APIFY_TOKEN | `$SCRAPE_APIFY_TOKEN` | Apify API Token |
| SCRAPE_BROWSERLESS_TOKEN | `$SCRAPE_BROWSERLESS_TOKEN` | Browserless Token |
| SCRAPE_PROXYCURL_KEY | `$SCRAPE_PROXYCURL_KEY` | Proxycurl API Key |
| SCRAPE_SCRAPINGBEE_KEY | `$SCRAPE_SCRAPINGBEE_KEY` | ScrapingBee API Key |

## Maps / Geo

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| GEO_GOOGLE_MAPS_KEY | `$GEO_GOOGLE_MAPS_KEY` | Google Maps API Key |
| GEO_MAPBOX_TOKEN | `$GEO_MAPBOX_TOKEN` | Mapbox Access Token |

## CRM / Marketing

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CRM_HUBSPOT_KEY | `$CRM_HUBSPOT_KEY` | HubSpot API Key |
| CRM_ACTIVECAMPAIGN_URL | `$CRM_ACTIVECAMPAIGN_URL` | ActiveCampaign URL |
| CRM_ACTIVECAMPAIGN_KEY | `$CRM_ACTIVECAMPAIGN_KEY` | ActiveCampaign API Key |
| CRM_MAILCHIMP_KEY | `$CRM_MAILCHIMP_KEY` | Mailchimp API Key |
| CRM_CONVERTKIT_KEY | `$CRM_CONVERTKIT_KEY` | ConvertKit API Key |
| CRM_RD_STATION_TOKEN | `$CRM_RD_STATION_TOKEN` | RD Station Token |

## Whatsapp / Chat

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| CHAT_WHATSAPP_TOKEN | `$CHAT_WHATSAPP_TOKEN` | WhatsApp Business Token |
| CHAT_WHATSAPP_PHONE_ID | `$CHAT_WHATSAPP_PHONE_ID` | WhatsApp Phone Number ID |
| CHAT_WHATSAPP_VERIFY_TOKEN | `$CHAT_WHATSAPP_VERIFY_TOKEN` | WhatsApp Webhook Verify Token |
| CHAT_INTERCOM_TOKEN | `$CHAT_INTERCOM_TOKEN` | Intercom Access Token |
| CHAT_CRISP_ID | `$CHAT_CRISP_ID` | Crisp Website ID |
| CHAT_ZENDESK_TOKEN | `$CHAT_ZENDESK_TOKEN` | Zendesk API Token |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |
| DUARTEOS_DASHBOARD_URL | `$DUARTEOS_DASHBOARD_URL` | URL do Dashboard DuarteOS |

---

## Como Usar

1. Copie `.env.agents.example` para `.env.agents`
2. Preencha APENAS as variaveis que voce usa
3. Cada agente consulta seu brain em `.claude/agents/brains/{agente}.md`
4. O brain aponta para a variavel — o agente resolve via `.env.agents`
5. NUNCA commite `.env.agents` — ele esta no `.gitignore`
