# Squad: Fullstack

Squad para projetos web completos — backend, frontend e QA trabalhando em paralelo.

## Agentes

| Agente | Role | Funcao |
|--------|------|--------|
| backend-lead | executor | APIs, banco de dados, autenticacao |
| frontend-lead | executor | UI, componentes, UX |
| qa-lead | validator | Testes, validacao, quality gates |

## Quando Usar

- Projetos web com backend e frontend
- Aplicacoes SaaS
- APIs com interface de usuario
- Projetos que precisam de quality gates

## Fluxo de Tarefas

```
setup-db -> build-api -> build-ui
                           |
                      qa-lead valida
```

1. Backend-lead configura o banco de dados
2. Backend-lead implementa a API (depende do DB)
3. Frontend-lead constroi a UI (depende da API)
4. QA-lead valida cada entrega

## Como Customizar

- Adicione tarefas em `tasks/` e referencie no `squad.yaml`
- Ajuste `depends_on` para mudar o fluxo de dependencias
- Adicione agentes especializados (ex: devops, design)
- Mude regras dos agentes em `agents/*.md`
- Herda do template `context-engineer` — remova de `inherit` se nao precisar
