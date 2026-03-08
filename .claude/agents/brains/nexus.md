# NEXUS — Brain Operacional

> Cerebro do agente NEXUS (Architect). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
>
> NEXUS tem acesso a TODAS as constantes para decisoes arquiteturais.
> Referencia master: `.claude/agents/brains/_CONSTANTS.md`

---

## Acesso Completo

NEXUS e o arquiteto do sistema e precisa conhecer TODAS as constantes para:
- Projetar integracao entre servicos
- Definir contratos de comunicacao
- Mapear dependencias de infraestrutura
- Decidir sobre cloud providers, databases, filas, etc.

**Consulte `.claude/agents/brains/_CONSTANTS.md` para a referencia completa.**

Abaixo, um resumo das categorias disponiveis:

| Categoria | Qtd Vars | Uso Principal |
|-----------|----------|---------------|
| IAs Generativas | 9 | Roteamento de modelos, fallback chains |
| Tokens de Servicos | 30 | Integracoes com servicos externos |
| Banco de Dados | 25 | Design de data layer, replicacao, cache |
| Cloud Providers | 12 | Multi-cloud strategy, disaster recovery |
| MCP Servers | 14 | Orquestracao de ferramentas AI |
| Storage / CDN | 11 | Estrategia de armazenamento e distribuicao |
| Auth / OAuth | 8 | Arquitetura de autenticacao e autorizacao |
| Email / SMS | 8 | Comunicacao transacional e marketing |
| Payment | 7 | Gateway de pagamentos e webhooks |
| Monitoring | 6 | Observabilidade e alertas |
| CI/CD | 5 | Pipeline de deploy |
| DNS / Domains | 5 | Roteamento e dominios |
| Infra / VPS | 4 | Infraestrutura de servidores |
| Feature Flags | 3 | Rollout progressivo |
| Analytics | 5 | Tracking e metricas de produto |
| Search | 7 | Estrategia de busca |
| Queue / Messaging | 4 | Arquitetura assincrona |
| Realtime | 5 | Websockets e pub/sub |
| Scraping / Data | 4 | Coleta de dados externos |
| Maps / Geo | 2 | Servicos de geolocalizacao |
| CRM / Marketing | 6 | Automacao de marketing |
| Chat | 6 | Canais de comunicacao |
| DuarteOS | 3 | Ecossistema interno |

**Total: ~189 constantes**

---

## Como Usar

1. Para decisoes arquiteturais, consulte `_CONSTANTS.md` diretamente
2. Ao projetar um sistema, mapeie quais constantes cada componente precisa
3. Use este brain para validar se um agente tem acesso as constantes corretas
4. NUNCA hardcode valores — sempre referencie a variavel via `.env.agents`
