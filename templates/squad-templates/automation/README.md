# Squad: Automation

Squad para automacoes e integrações — orquestracao, scripts e testes.

## Agentes

| Agente | Role | Funcao |
|--------|------|--------|
| orchestrator | orchestrator | Planeja workflows, coordena execucao, monitora |
| script-builder | executor | Python, Bash, cron, webhooks, integrações |
| tester | validator | Validacao, edge cases, retry, monitoramento |

## Quando Usar

- Automacao de processos manuais repetitivos
- Integrações entre sistemas via API/webhook
- Scripts de deploy e provisioning
- Cron jobs e tarefas agendadas
- Workflows que exigem confiabilidade

## Fluxo Tipico

1. Orchestrator mapeia o processo e projeta o workflow
2. Script-builder implementa os scripts
3. Tester valida fluxos, edge cases e confiabilidade
4. Orchestrator coordena deploy e monitora

## Config: Modo YOLO

Este template usa `mode: "yolo"` — execucao rapida com menos validacoes intermediarias. Ideal para automacoes onde velocidade importa mais que processo.

## Como Customizar

- Adicione tarefas em `tasks/` para workflows especificos
- Mude `mode` para `balanced` se precisar de mais validacao
- Adicione agente de monitoring para observabilidade
- Ajuste ferramentas dos agentes conforme stack (ex: Docker, AWS CLI)
