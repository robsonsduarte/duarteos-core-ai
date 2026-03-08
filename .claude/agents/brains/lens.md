# LENS — Brain Operacional

> Cerebro do agente LENS (Data Scientist). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`
>
> NOTA: LENS acessa DBs em modo READ-ONLY para analise. Nunca escreve em producao.

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
| DB_MONGO_HOST | `$DB_MONGO_HOST` | Host do MongoDB |
| DB_MONGO_PORT | `$DB_MONGO_PORT` | Porta do MongoDB |
| DB_MONGO_URL | `$DB_MONGO_URL` | Connection string MongoDB |

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
| SEARCH_MEILISEARCH_URL | `$SEARCH_MEILISEARCH_URL` | URL do MeiliSearch |
| SEARCH_MEILISEARCH_KEY | `$SEARCH_MEILISEARCH_KEY` | MeiliSearch API Key |

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. SEMPRE use replicas read-only — NUNCA o primary para analise
4. Para notebooks Python, use `python-dotenv` para carregar `.env.agents`
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
