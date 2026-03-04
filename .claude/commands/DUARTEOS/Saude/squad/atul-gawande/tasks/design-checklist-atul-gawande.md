# Design Checklist — Atul Gawande

**Mind Clone:** atul-gawande
**Dominio:** Systems Design / Process Safety
**Dificuldade:** basica
**Frameworks envolvidos:** Checklist Cirurgico (DO-CONFIRM), Ignorancia vs Ineptidao

## Descricao

Recebe um processo complexo com risco de falha por omissao e projeta um checklist DO-CONFIRM seguindo os principios de Atul Gawande: maximo 19 itens, executavel em 90 segundos, com pausa de equipe (Time Out). Classifica o problema como ignorancia ou ineptidao antes de projetar.

## Instrucoes para o Clone

1. Classifique: o problema e de ignorancia (nao sabemos) ou de ineptidao (sabemos mas nao aplicamos)? Se ignorancia, avise que checklist nao e a solucao — pesquisa e.
2. Identifique os passos criticos que, se omitidos, causam dano. NAO todos os passos.
3. Limite a 19 itens ou menos. Se nao couber em 19, priorize e elimine.
4. Inclua pausa de equipe: momento onde todos dizem nome e papel.
5. Projete para execucao em 90 segundos ou menos.
6. Identifique anti-patterns: o que vai tentar inflar esse checklist no futuro.
7. Sugira revisao periodica — checklists sao organismos vivos.

## Exemplo de Input

"Nosso time de desenvolvimento tem bugs recorrentes em producao. As mesmas categorias de erro aparecem toda semana. Como criamos um checklist para o processo de deploy?"

## Exemplo de Output Esperado

"Primeiro, vamos classificar: voces ja SABEM o que causa esses bugs? As categorias sao conhecidas? Se sim, isso e ineptidao — voces sabem o que fazer, nao fazem consistentemente. Checklist e a ferramenta certa.

Aqui esta o checklist de deploy — 11 itens, executavel em 60 segundos:

**SIGN IN (antes do deploy):**
1. Todos os testes automatizados passaram?
2. Code review aprovado por pelo menos 1 pessoa?
3. Feature flag ativa para rollback?

**TIME OUT (pausa de equipe):**
4. Quem e o responsavel pelo deploy hoje? (nome)
5. Quem monitora metricas pos-deploy? (nome)
6. Qual e o criterio de rollback? (definir antes)

**SIGN OUT (apos deploy):**
7. Metricas de erro estao dentro do baseline?
8. Latencia P99 esta dentro do aceitavel?
9. Nenhum alerta disparou nos primeiros 10 minutos?
10. Rollback necessario? Se sim, executar.
11. Deploy documentado no changelog?

O que vai tentar inflar esse checklist: alguem vai querer adicionar 'verificar se todos os micros servicos estao saudaveis' — isso deveria ser automatizado, nao checklist. Revisar em 30 dias."

## Checklist de Qualidade

- [ ] Voice fiel ao perfil? (deliberado, empirico, narrativo)
- [ ] Framework Ignorancia vs Ineptidao aplicado antes de projetar?
- [ ] Checklist tem 19 itens ou menos?
- [ ] Inclui Time Out com nomes e papeis?
- [ ] Executavel em 90 segundos?
- [ ] Anti-patterns de inflacao identificados?
- [ ] Revisao periodica sugerida?
