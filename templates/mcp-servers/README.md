# DuarteOS MCP Servers (Python)

MCP Servers customizados em Python via FastMCP para estender as capacidades dos agentes.

## Servidores

| Server | Descricao | Tools |
|--------|-----------|-------|
| **data-analyzer** | Analise de dados, estatisticas, graficos | `analyze_csv`, `query_dataframe`, `create_chart`, `correlate` |
| **web-scraper** | Web scraping avancado | `scrape_page`, `extract_links`, `extract_tables`, `scrape_structured` |
| **automation** | Automacao de sistema | `find_duplicates`, `disk_usage`, `batch_rename`, `run_and_capture`, `file_stats` |

## Pre-requisitos

- Python 3.10+
- uv (recomendado) ou pip

## Instalacao

```bash
# Com uv (recomendado)
uv pip install -r .claude/mcp-servers/requirements.txt

# Ou com pip
pip install -r .claude/mcp-servers/requirements.txt
```

## Ativar no .mcp.json

Os servidores sao adicionados automaticamente pelo `duarteos init --python`.

Configuracao manual:

```json
{
  "mcpServers": {
    "data-analyzer": {
      "command": "python3",
      "args": [".claude/mcp-servers/data-analyzer/server.py"]
    },
    "web-scraper": {
      "command": "python3",
      "args": [".claude/mcp-servers/web-scraper/server.py"]
    },
    "automation": {
      "command": "python3",
      "args": [".claude/mcp-servers/automation/server.py"]
    }
  }
}
```

## Criar Seu Proprio MCP

```python
from fastmcp import FastMCP

mcp = FastMCP("meu-server", description="Meu MCP customizado")

@mcp.tool()
def minha_ferramenta(param: str) -> str:
    """Descricao da ferramenta."""
    return f"Resultado: {param}"

if __name__ == "__main__":
    mcp.run()
```
