# BRIDGE — Brain Operacional

> Cerebro do agente BRIDGE (Fullstack). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: BRIDGE combina os escopos de FORGE (Backend) + PRISM (Frontend).

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

## Queue / Messaging

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| QUEUE_RABBITMQ_URL | `$QUEUE_RABBITMQ_URL` | URL do RabbitMQ |
| QUEUE_SQS_URL | `$QUEUE_SQS_URL` | URL da fila SQS |
| QUEUE_KAFKA_BROKERS | `$QUEUE_KAFKA_BROKERS` | Kafka brokers (comma-separated) |
| QUEUE_BULLMQ_REDIS_URL | `$QUEUE_BULLMQ_REDIS_URL` | Redis URL para BullMQ |

## Analytics

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| ANALYTICS_GA_ID | `$ANALYTICS_GA_ID` | Google Analytics Measurement ID |
| ANALYTICS_MIXPANEL_TOKEN | `$ANALYTICS_MIXPANEL_TOKEN` | Mixpanel Project Token |
| ANALYTICS_POSTHOG_KEY | `$ANALYTICS_POSTHOG_KEY` | PostHog Project API Key |
| ANALYTICS_HOTJAR_ID | `$ANALYTICS_HOTJAR_ID` | Hotjar Site ID |
| ANALYTICS_AMPLITUDE_KEY | `$ANALYTICS_AMPLITUDE_KEY` | Amplitude API Key |

## Feature Flags

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| FF_LAUNCH_DARKLY_KEY | `$FF_LAUNCH_DARKLY_KEY` | LaunchDarkly SDK Key |
| FF_POSTHOG_KEY | `$FF_POSTHOG_KEY` | PostHog Project API Key |
| FF_POSTHOG_HOST | `$FF_POSTHOG_HOST` | PostHog Host URL |

## Websockets / Realtime

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| REALTIME_PUSHER_KEY | `$REALTIME_PUSHER_KEY` | Pusher App Key |
| REALTIME_PUSHER_SECRET | `$REALTIME_PUSHER_SECRET` | Pusher App Secret |
| REALTIME_PUSHER_APP_ID | `$REALTIME_PUSHER_APP_ID` | Pusher App ID |
| REALTIME_ABLY_KEY | `$REALTIME_ABLY_KEY` | Ably API Key |
| REALTIME_SOCKETIO_URL | `$REALTIME_SOCKETIO_URL` | URL do Socket.IO server |

## Storage (Cloudinary)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| STORAGE_CLOUDINARY_URL | `$STORAGE_CLOUDINARY_URL` | URL Cloudinary |
| STORAGE_CLOUDINARY_KEY | `$STORAGE_CLOUDINARY_KEY` | API key Cloudinary |
| STORAGE_CLOUDINARY_SECRET | `$STORAGE_CLOUDINARY_SECRET` | API secret Cloudinary |

## Maps / Geo

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| GEO_GOOGLE_MAPS_KEY | `$GEO_GOOGLE_MAPS_KEY` | Google Maps API Key |
| GEO_MAPBOX_TOKEN | `$GEO_MAPBOX_TOKEN` | Mapbox Access Token |

## Search

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| SEARCH_ALGOLIA_APP_ID | `$SEARCH_ALGOLIA_APP_ID` | Algolia Application ID |
| SEARCH_ALGOLIA_KEY | `$SEARCH_ALGOLIA_KEY` | Algolia Search-Only Key |
| SEARCH_ALGOLIA_ADMIN_KEY | `$SEARCH_ALGOLIA_ADMIN_KEY` | Algolia Admin API Key |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |
| DUARTEOS_DASHBOARD_URL | `$DUARTEOS_DASHBOARD_URL` | URL do Dashboard DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. No frontend: use APENAS publishable/public keys (CLIENT_IDs, publishable keys)
4. No backend: pode usar secrets normalmente
5. NUNCA hardcode valores — sempre referencie a variavel
6. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
