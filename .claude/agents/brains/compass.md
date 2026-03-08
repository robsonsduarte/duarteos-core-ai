# COMPASS — Brain Operacional

> Cerebro do agente COMPASS (Context Engineer). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
> Referencia completa: `.claude/agents/brains/_CONSTANTS.md`

---

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

## Tokens de Servicos (gestao de contexto)

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| TOKEN_GITHUB_VALUE | `$TOKEN_GITHUB_VALUE` | Personal Access Token GitHub |
| TOKEN_NOTION_VALUE | `$TOKEN_NOTION_VALUE` | Token Notion |

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

## DuarteOS Specific

| Constante | Variavel | Descricao |
|-----------|----------|-----------|
| DUARTEOS_API_KEY | `$DUARTEOS_API_KEY` | Chave da API DuarteOS |
| DUARTEOS_API_URL | `$DUARTEOS_API_URL` | URL da API DuarteOS |

---

## Como Usar

1. Identifique a constante necessaria na tabela acima
2. Resolva o valor via `$VARIAVEL` em `.env.agents`
3. MCPs sao seu dominio principal — mantenha todas as conexoes funcionais
4. Para constantes fora do seu escopo, consulte `_CONSTANTS.md`
