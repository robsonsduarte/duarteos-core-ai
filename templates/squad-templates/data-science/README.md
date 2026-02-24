# Squad: Data Science

Squad para projetos de dados e machine learning — analise, pipelines e validacao.

## Agentes

| Agente | Role | Funcao |
|--------|------|--------|
| analyst | researcher | EDA, estatisticas, insights, visualizacoes |
| pipeline-builder | executor | ETL, limpeza, feature engineering, ML pipelines |
| validator | validator | Qualidade de dados, validacao de modelos, testes A/B |

## Quando Usar

- Projetos de analise de dados
- Pipelines de ETL e processamento
- Treinamento e deploy de modelos ML
- Dashboards e relatorios analiticos
- Projetos que exigem validacao estatistica

## Fluxo Tipico

1. Analyst explora os dados e gera insights
2. Pipeline-builder constroi o pipeline de processamento
3. Validator verifica qualidade dos dados e performance do modelo
4. Ciclo repete conforme necessidade

## Como Customizar

- Adicione tarefas especificas em `tasks/` e referencie no `squad.yaml`
- Ajuste ferramentas dos agentes (ex: adicione Jupyter, DuckDB)
- Adicione agente de MLOps para deploy e monitoramento
- Mude `model` para opus quando precisar de raciocinio mais profundo
