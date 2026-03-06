# Plano de Migracao — Padronizacao de Mind Clones

**Data:** 2026-03-05
**Versao:** 5.21.0 (pos-migracao)
**Objetivo:** Consolidar todos os 64 mind clones numa estrutura unica e padronizada

---

## Problema

Os dados dos mind clones estao espalhados em 5+ locais diferentes:

| Local atual | O que tem | Qtd |
|-------------|-----------|-----|
| `.claude/commands/DUARTEOS/{Cat}/{slug}.md` | Agent slash command | 64 |
| `.claude/synapse/minds/{slug}.yaml` | DNA YAML | 64 |
| `DUARTEOS/Business/squad/tiago-forte/` | Squad completo MMOS v3 | 1 |
| `data/minds/` | Backups, deltas, regressions (amanda-khayat, brad-frost, pavel-durov) | ~15 files |
| `inbox/` | Dados intermediarios (brad-frost-*, tiago-forte-*) | ~5 files |
| `.claude/commands/DUARTEOS/Copywriting/squad/` | Dirs vazios com .DS_Store | lixo |
| Git history (commit 3ee6b2c) | Squads deletados de atul-gawande, david-allen, w-edwards-deming | 3 squads |

## Estrutura Alvo

```
DUARTEOS/
  minds/                              <-- pasta unica para TODOS os clones
    {slug}/                           <-- 1 dir por clone (FLAT, sem categorias)
      config.yaml                     <-- metadados + status + fidelidade + categoria
      agent.md                        <-- copia do slash command

      # Para clones MMOS v3 (4 clones: tiago-forte, atul-gawande, david-allen, w-edwards-deming)
      00-viability/                   <-- PCFE + viability
        pcfe.yaml
      01-research/                    <-- catalogo de fontes + material bruto
        catalogo-fontes.yaml
      02-analysis/                    <-- MIUs + estilometria
        mius-completas.yaml
        estilometria.yaml
      03-inference/                   <-- drivers + evidencias
        drivers.yaml
      04-mapping/                     <-- system components (Big5, MBTI, Enneagram)
        system-components.yaml
      05-profile/                     <-- fidelity report + blind test
        fidelity-report.yaml
        blind-test.yaml
      artifacts/                      <-- squad artifacts (Fase 10)
        behavioral/
        cognitive/
        linguistic/
        narrative/
      frameworks/
      voice/
      phrases/
      checklists/
      tasks/

      # Para clones LEGACY (60 clones)
      # Estrutura minima: config.yaml + agent.md
      # Dados extras se existirem (backups, deltas, etc.)
      data/                           <-- dados legacy migrados (se existirem)
```

## O que NAO muda

- `.claude/commands/DUARTEOS/{Cat}/{slug}.md` — slash commands ficam onde estao
- `.claude/synapse/minds/{slug}.yaml` — DNA YAML fica onde esta
- `templates/commands/DUARTEOS/{Cat}/{slug}.md` — templates ficam onde estao
- Comandos: `/DUARTEOS:{Categoria}:{slug}` — sem mudanca

## O que muda

- Bootstrap no agent .md: glob path muda de `DUARTEOS/Business/squad/tiago-forte/` para `DUARTEOS/minds/tiago-forte/`
- Squad data centralizado em `DUARTEOS/minds/`
- `data/minds/` migrado e removido
- Dados de `inbox/` relativos a clones migrados para respectivos dirs

---

## Inventario dos 64 Clones

### MMOS v3 — Squad Completo (4 clones)

| Slug | Categoria | F | Squad atual | Acao |
|------|-----------|---|-------------|------|
| tiago-forte | Business | 95.80% | `DUARTEOS/Business/squad/tiago-forte/` (33 files) | Mover para `DUARTEOS/minds/tiago-forte/` |
| atul-gawande | Saude | 95.75% | Deletado (git 3ee6b2c) | Recuperar do git + mover |
| david-allen | Business | 95.20% | Deletado (git 3ee6b2c) | Recuperar do git + mover |
| w-edwards-deming | Business | 96.05% | Deletado (git 3ee6b2c) | Recuperar do git + mover |

### LEGACY — Sem Squad (60 clones)

| Categoria | Clones | Qtd |
|-----------|--------|-----|
| AI | andrew-ng, demis-hassabis, geoffrey-hinton, yann-lecun, yoshua-bengio | 5 |
| Business | bill-gates, daiane-cavalcante, guilherme-bifi, pedro-valerio-lopez, thiago-finch, vinicius-greco | 6 |
| Content | camila-porto, luciana-papini, mrbeast, virginia-fonseca | 4 |
| Copywriting | amanda-khayat, claude-hopkins, eugene-schwartz, gary-bencivenga, gary-halbert, joseph-sugarman, robert-collier | 7 |
| Juridico | erik-nybo, guilherme-martins, ivson-coelho, jose-faleiros-junior, patricia-peck, ricardo-calcini, ronaldo-lemos | 7 |
| Marketing | dan-kennedy, david-ogilvy, diego-carmona, diogo-kobata, marcello-safe, pedro-sobral, sexta-feira, stefan-georgi, tiago-tessmann | 9 |
| Product | brennan-dunn, ezra-firestone, julie-zhuo | 3 |
| Saude | claudio-miyake, drauzio-varella, juliana-trentini, marcio-atalla, patricia-leite, raquel-castanharo, vera-iaconelli | 7 |
| Tech | dustin-moskovitz, evan-spiegel, jan-koum, larry-page, mark-zuckerberg, pavel-durov | 6 |
| UX-Design | brad-frost, don-norman, jakob-nielsen, luke-wroblewski, nathan-curtis, steve-krug | 6 |

### Dados espalhados a consolidar

| Arquivo/Dir | Clone | Destino |
|-------------|-------|---------|
| `data/minds/amanda-khayat_backup_*.yaml` | amanda-khayat | `DUARTEOS/minds/amanda-khayat/data/` |
| `data/minds/amanda-khayat_delta_*.md` | amanda-khayat | `DUARTEOS/minds/amanda-khayat/data/` |
| `data/minds/amanda-khayat_regression_*.md` | amanda-khayat | `DUARTEOS/minds/amanda-khayat/data/` |
| `data/minds/brad-frost-mind-clone-insights.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `data/minds/brad-frost-quotes-index.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `data/minds/brad-frost-research-compilation.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `data/minds/brad-frost_backup_*.yaml` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `data/minds/brad-frost_regression_*.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `data/minds/pavel-durov_backup_*.yaml` | pavel-durov | `DUARTEOS/minds/pavel-durov/data/` |
| `data/minds/pavel-durov_delta_*.md` | pavel-durov | `DUARTEOS/minds/pavel-durov/data/` |
| `data/minds/pavel-durov_regression_*.md` | pavel-durov | `DUARTEOS/minds/pavel-durov/data/` |
| `inbox/brad-frost-gaps-analysis.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `inbox/brad-frost-mius-structured.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `inbox/brad-frost-research-2025-2026.md` | brad-frost | `DUARTEOS/minds/brad-frost/data/` |
| `inbox/tiago-forte-fontes-primarias.yaml` | tiago-forte | `DUARTEOS/minds/tiago-forte/01-research/` |
| `inbox/tiago-forte-pcfe-analysis.yaml` | tiago-forte | `DUARTEOS/minds/tiago-forte/00-viability/` |
| `.claude/commands/DUARTEOS/Copywriting/squad/` | — | DELETAR (dirs vazios + .DS_Store) |

---

## Fases de Execucao

### Fase 1: Criar estrutura base (DUARTEOS/minds/)

**Tarefas:**
- [ ] Criar `DUARTEOS/minds/` dir
- [ ] Criar 64 subdirs (1 por clone)
- [ ] Para cada clone LEGACY (60): criar `config.yaml` minimo
- [ ] Para cada clone (64): copiar agent .md de `.claude/commands/` para `DUARTEOS/minds/{slug}/agent.md`

**Config.yaml minimo (template para LEGACY):**
```yaml
clone:
  name: "{Nome Completo}"
  slug: "{slug}"
  version: "1.0.0"
  pipeline_version: "legacy"
  category: "{Categoria}"
  status: "active"
  fidelity_score: null
  fidelity_estimated: null
  domain: "{dominio extraido do agent .md}"
```

### Fase 2: Migrar clones MMOS v3

**Tarefas:**
- [ ] Recuperar squad de atul-gawande do git (commit anterior a 3ee6b2c)
- [ ] Recuperar squad de david-allen do git
- [ ] Recuperar squad de w-edwards-deming do git
- [ ] Mover `DUARTEOS/Business/squad/tiago-forte/` para `DUARTEOS/minds/tiago-forte/`

**Para cada clone MMOS v3, reorganizar em fases numeradas:**
- [ ] `data/processed/pcfe-*.yaml` → `00-viability/pcfe.yaml`
- [ ] `data/processed/catalogo-fontes.yaml` → `01-research/catalogo-fontes.yaml`
- [ ] `data/processed/mius-completas.yaml` → `02-analysis/mius-completas.yaml`
- [ ] `data/processed/estilometria.yaml` → `02-analysis/estilometria.yaml`
- [ ] `drivers/*-drivers.yaml` → `03-inference/drivers.yaml`
- [ ] `system-components/*-system.yaml` → `04-mapping/system-components.yaml`
- [ ] `fidelity-report.yaml` → `05-profile/fidelity-report.yaml`
- [ ] `blind-test-v2.yaml` → `05-profile/blind-test.yaml`
- [ ] `config.yaml` → `config.yaml` (manter na raiz)
- [ ] `agents/*.md` → `agent.md` (raiz)
- [ ] Manter: `artifacts/`, `frameworks/`, `voice/`, `phrases/`, `checklists/`, `tasks/`
- [ ] Remover: `data/raw/` (dirs vazios), `data/processed/` (migrado para fases)

### Fase 3: Consolidar dados espalhados

**Tarefas:**
- [ ] Mover `data/minds/amanda-khayat_*` → `DUARTEOS/minds/amanda-khayat/data/`
- [ ] Mover `data/minds/brad-frost*` → `DUARTEOS/minds/brad-frost/data/`
- [ ] Mover `data/minds/pavel-durov_*` → `DUARTEOS/minds/pavel-durov/data/`
- [ ] Mover `inbox/brad-frost-*` → `DUARTEOS/minds/brad-frost/data/`
- [ ] Mover `inbox/tiago-forte-fontes-primarias.yaml` → `DUARTEOS/minds/tiago-forte/01-research/fontes-primarias.yaml`
- [ ] Mover `inbox/tiago-forte-pcfe-analysis.yaml` → `DUARTEOS/minds/tiago-forte/00-viability/pcfe-analysis.yaml`
- [ ] Remover `data/minds/` (vazio apos migracao)

### Fase 4: Atualizar referencias

**Tarefas:**
- [ ] Atualizar bootstrap path nos 4 agent .md MMOS v3 (glob para `DUARTEOS/minds/{slug}/`)
- [ ] Atualizar templates correspondentes
- [ ] Atualizar `.claude/synapse/minds/_index.yaml` — campo squad_path para todos
- [ ] Atualizar `MMOS-PIPELINE.md` — squad path default
- [ ] Atualizar `mind-clone.md` — Fase 5 scaffold path
- [ ] Atualizar MEMORY.md — nova decisao arquitetural

### Fase 5: Cleanup + Commit

**Tarefas:**
- [ ] Remover `.claude/commands/DUARTEOS/Copywriting/squad/` (dirs vazios + .DS_Store)
- [ ] Remover `DUARTEOS/Business/` (vazio apos migracao do tiago-forte)
- [ ] Remover `data/minds/` (vazio apos migracao)
- [ ] Verificar que nenhum .md parasita existe em `DUARTEOS/minds/*/tasks/`
- [ ] git add + commit: `feat: v5.21.0 — Migracao Estrutural — 64 mind clones padronizados em DUARTEOS/minds/`
- [ ] Atualizar package.json, src/update.mjs changelog, src/init.mjs banner

---

## Validacao Pos-Migracao

| Check | Comando | Esperado |
|-------|---------|----------|
| 64 dirs em minds/ | `ls DUARTEOS/minds/ \| wc -l` | 64 |
| 64 config.yaml | `find DUARTEOS/minds -name config.yaml \| wc -l` | 64 |
| 64 agent.md | `find DUARTEOS/minds -name agent.md \| wc -l` | 64 |
| 4 MMOS v3 com fases | `find DUARTEOS/minds -name "pcfe.yaml" \| wc -l` | 4 |
| 0 .md em tasks/ | `find DUARTEOS/minds -path "*/tasks/*.md" \| wc -l` | 0 |
| 0 dirs vazios em commands/ | `find .claude/commands/DUARTEOS -type d -name squad` | 0 |
| data/minds/ nao existe | `ls data/minds/ 2>/dev/null` | erro |
| Slash commands inalterados | `find .claude/commands/DUARTEOS -name "*.md" -not -path "*/squad/*" \| wc -l` | 75 |
| Synapse DNA inalterado | `ls .claude/synapse/minds/*.yaml \| wc -l` | 65 (64 + _index) |

---

## Estimativa

- Fase 1: ~5min (script cria dirs + configs em batch)
- Fase 2: ~10min (git checkout de 3 squads + reorganizacao)
- Fase 3: ~3min (mover arquivos)
- Fase 4: ~10min (editar referencias)
- Fase 5: ~5min (cleanup + commit)
- **Total: ~30min**

## Comando para Iniciar

Na proxima sessao, dizer: **"vamos migrar"** e referenciar este arquivo:
`.planning/MIGRATION-MINDS-STRUCTURE.md`
