# TITAN — Brain Operacional

> Cerebro do agente TITAN (System Builder). Consulte este arquivo para resolver constantes de infraestrutura.
> Valores reais em `.env.agents` (NUNCA commitado). Aqui ficam apenas REFERENCIAS.
>
> TITAN tem acesso a TODAS as constantes para build from scratch.
> Referencia master: `.claude/agents/brains/_CONSTANTS.md`

---

## Acesso Completo

TITAN e o system builder e precisa de TODAS as constantes para:
- Construir sistemas do zero
- Configurar toda infraestrutura
- Integrar todos os servicos
- Provisionar ambientes completos

**Consulte `.claude/agents/brains/_CONSTANTS.md` para a referencia completa.**

Abaixo, um resumo das categorias disponiveis:

| Categoria | Qtd Vars | Uso Principal |
|-----------|----------|---------------|
| IAs Generativas | 9 | Integracao com LLMs |
| Tokens de Servicos | 30 | Setup de todas as integracoes |
| Banco de Dados | 25 | Provisionamento de data layer |
| Cloud Providers | 12 | Setup multi-cloud |
| MCP Servers | 14 | Configuracao de ferramentas AI |
| Storage / CDN | 11 | Setup de armazenamento |
| Auth / OAuth | 8 | Implementacao de auth |
| Email / SMS | 8 | Setup de comunicacao |
| Payment | 7 | Integracao de pagamentos |
| Monitoring | 6 | Setup de observabilidade |
| CI/CD | 5 | Configuracao de pipelines |
| DNS / Domains | 5 | Setup de dominios |
| Infra / VPS | 4 | Provisionamento de servidores |
| Feature Flags | 3 | Setup de feature flags |
| Analytics | 5 | Integracao de analytics |
| Search | 7 | Setup de busca |
| Queue / Messaging | 4 | Setup de filas e mensageria |
| Realtime | 5 | Setup de websockets |
| Scraping / Data | 4 | Setup de scraping |
| Maps / Geo | 2 | Integracao de mapas |
| CRM / Marketing | 6 | Setup de CRM |
| Chat | 6 | Setup de canais de chat |
| DuarteOS | 3 | Configuracao do ecossistema |

**Total: ~189 constantes**

---

## Como Usar

1. Para builds from scratch, consulte `_CONSTANTS.md` diretamente
2. Configure cada servico usando as variaveis de `.env.agents`
3. NUNCA hardcode valores — sempre referencie a variavel
4. Documente quais constantes cada componente do sistema usa
