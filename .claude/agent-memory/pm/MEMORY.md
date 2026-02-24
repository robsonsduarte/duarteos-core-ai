# PM (ATLAS) — Memoria Persistente

## Decisoes

- [2026-02-24] arquitetura: Integrou GSD como subcomandos formais dos agentes DuarteOS. Criado AGENT-GSD-PROTOCOL.md definindo manifests, guards, pre-condicoes e cadeia de autorizacao por agente. Todos os 8 agentes atualizados com secao padronizada "Motor GSD" referenciando o protocolo.
- [2026-02-24] processo: Adicionado AGENT-GSD-PROTOCOL.md a leitura obrigatoria de inicializacao de todos os agentes (step 3 na sequencia).
- [2026-02-24] processo: Adicionado save-context como pos-acao obrigatoria em todos os agentes. Checkpoint continuo em session-context.md apos operacoes GSD que mudam estado.

## Padroes Observados

- [2026-02-24] consistencia: Todos os agentes seguem inicializacao identica (CONSTITUTION → CONFIG → GSD-PROTOCOL → MEMORY → SYNAPSE)
- [2026-02-24] nomenclatura: Secoes GSD nos agentes renomeadas de "Superpoderes GSD" para "Motor GSD — Subcomandos de [dominio]"

## Preferencias do Usuario

- [2026-02-24] estilo: Usuario aprova decisoes rapidas e quer execucao imediata ("concordo, bora executar")
- [2026-02-24] arquitetura: Usuario quer GSD como subcomandos integrados ao duarteos-core, nao como sistema paralelo

## Erros e Resolucoes

_Nenhum erro registrado ainda._
