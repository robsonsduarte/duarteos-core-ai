# SPARK — Brain Operacional

> Cerebro do agente SPARK (Python Executor). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`

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

## Scraping / Data

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| SCRAPE_APIFY_TOKEN | `$SCRAPE_APIFY_TOKEN` | Apify API Token |
| SCRAPE_BROWSERLESS_TOKEN | `$SCRAPE_BROWSERLESS_TOKEN` | Browserless Token |
| SCRAPE_PROXYCURL_KEY | `$SCRAPE_PROXYCURL_KEY` | Proxycurl API Key |
| SCRAPE_SCRAPINGBEE_KEY | `$SCRAPE_SCRAPINGBEE_KEY` | ScrapingBee API Key |

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

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. Em scripts Python, use `os.environ.get('VARIAVEL')` ou `python-dotenv`
4. NUNCA hardcode valores — sempre referencie a variavel
5. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
