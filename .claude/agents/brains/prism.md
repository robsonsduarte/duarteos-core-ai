# PRISM — Brain Operacional

> Cerebro do agente PRISM (Frontend). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: Frontend so acessa chaves PUBLICAS. Secrets ficam no backend (FORGE).

---

## IAs Generativas (apenas publishable/public)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| API_CLAUDE_KEY | `$API_CLAUDE_KEY` | Chave API Claude (para proxy via backend) |
| API_OPENAI_KEY | `$API_OPENAI_KEY` | Chave API OpenAI (para proxy via backend) |

## Auth (apenas Client IDs — NUNCA secrets no frontend)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| AUTH_GOOGLE_CLIENT_ID | `$AUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| AUTH_GITHUB_CLIENT_ID | `$AUTH_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| AUTH_APPLE_CLIENT_ID | `$AUTH_APPLE_CLIENT_ID` | Apple OAuth Client ID |

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
| REALTIME_PUSHER_APP_ID | `$REALTIME_PUSHER_APP_ID` | Pusher App ID |
| REALTIME_ABLY_KEY | `$REALTIME_ABLY_KEY` | Ably API Key |
| REALTIME_SOCKETIO_URL | `$REALTIME_SOCKETIO_URL` | URL do Socket.IO server |

## Storage (apenas Cloudinary — upload direto)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| STORAGE_CLOUDINARY_URL | `$STORAGE_CLOUDINARY_URL` | URL Cloudinary |
| STORAGE_CLOUDINARY_KEY | `$STORAGE_CLOUDINARY_KEY` | API key Cloudinary |
| STORAGE_CLOUDINARY_SECRET | `$STORAGE_CLOUDINARY_SECRET` | API secret Cloudinary |

## Payment (apenas publishable keys)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| PAYMENT_STRIPE_PUBLISHABLE_KEY | `$PAYMENT_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
| PAYMENT_MERCADOPAGO_PUBLIC_KEY | `$PAYMENT_MERCADOPAGO_PUBLIC_KEY` | MercadoPago Public Key |

## Maps / Geo

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| GEO_GOOGLE_MAPS_KEY | `$GEO_GOOGLE_MAPS_KEY` | Google Maps API Key |
| GEO_MAPBOX_TOKEN | `$GEO_MAPBOX_TOKEN` | Mapbox Access Token |

## Search (apenas search keys — NUNCA admin keys)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| SEARCH_ALGOLIA_APP_ID | `$SEARCH_ALGOLIA_APP_ID` | Algolia Application ID |
| SEARCH_ALGOLIA_KEY | `$SEARCH_ALGOLIA_KEY` | Algolia Search-Only Key |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |
| DUARTEOS_DASHBOARD_URL | `$DUARTEOS_DASHBOARD_URL` | URL do Dashboard DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. NUNCA exponha secrets no frontend — use apenas publishable/public keys
4. Secrets devem ser acessados via API backend (FORGE)
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
