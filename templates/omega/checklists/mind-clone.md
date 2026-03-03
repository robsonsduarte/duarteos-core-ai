# OMEGA Quality Gate: Mind Clone Creation

**Type:** `mind_clone`
**Threshold:** >= 95/100
**Version:** 2.0.0
**Pipeline:** MMOS Engine v2 (6 Fases, 15 Entidades, 5 Autoridades)

---

## Criteria

| # | Criterion | Weight | PASS | FAIL |
|---|-----------|--------|------|------|
| 1 | Phase 0 — APEX/ICP Gate: Viability confirmed | 5 | APEX score >= 40/60 AND ICP score >= 6/10; both documented in DNA skeleton | APEX < 40 OR ICP < 6 OR scores not documented |
| 2 | Phase 1 — Collection: Primary sources >= coverage 90% | 10 | Coverage score >= 90%; source diversity >= 4 types; ZERO secondary sources; temporal span documented | Coverage < 90% OR any secondary source in base OR < 4 source types |
| 3 | Phase 2 — Extraction: MIUs and fragments generated | 10 | MIUs extracted with semantic context preserved; fragmentation quality >= 95%; Progressive Summarization layers 1-3 complete; source references on every MIU | Fragmentation quality < 95% OR layers incomplete OR source references missing |
| 4 | Phase 3 — Inference: Drivers with evidence, 3 independent agents | 15 | Drivers calculated from evidence (>= 2 MIUs each); 3 independent agents concordance >= 0.85; predictive accuracy >= 90%; tiers classified (gold/silver/bronze) | Drivers without evidence OR concordance < 0.85 OR accuracy < 90% |
| 5 | Phase 3 — DNA 6 Layers populated | 10 | All 6 DNA layers (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas, Paradoxos Produtivos) have entries; `source_path` on each entry; >= 2 paradoxos with >= 3 sources each | Any DNA layer empty OR entries missing `source_path` OR < 2 paradoxos |
| 6 | Phase 4 — Mapping: System components scored | 10 | All components have scores; internal consistency >= 95%; mind_system_mappings generated; artifacts/ populated (cognitive, behavioral, linguistic, narrative) | Component coverage < 100% OR consistency < 95% OR artifacts missing |
| 7 | Phase 5 — Profile: Fidelity >= 95% with validation | 15 | Fidelity F >= 95% (formula: L*0.20+B*0.30+C*0.15+K*0.20+V*0.15); no component below 85%; blind test passed; noise audit >= 0.90; pre-mortem documented | F < 95% OR any component < 85% OR blind test failed OR pre-mortem missing |
| 8 | Phase 6 — Recommendation: Agent operational | 10 | Agent .md generated with full system prompt; frameworks/, phrases/, voice/ populated; recommended tools and development gaps documented | Agent .md missing OR squad directories empty |
| 9 | Gates Gawande: All kill items passed | 10 | All 5 inter-phase gates passed with kill items satisfied; no blocking items unresolved | Any kill item failed without resolution |
| 10 | Synapse integration: DNA persisted and indexed | 5 | DNA saved in `.claude/synapse/minds/{slug}.yaml`; `_index.yaml` updated; ingestion log entry created; config.yaml populated | DNA not persisted OR index not updated |

---

## Scoring Formula

```
score = SUM(criterion_weight * (1 if PASS else 0))
```

Total possible: **100**
Threshold to pass: **>= 95**

---

## Fidelity Formula (MMOS v2)

```
F = (L x 0.20) + (B x 0.30) + (C x 0.15) + (K x 0.20) + (V x 0.15)

L = Linguistic Accuracy    (0-100)
B = Behavioral Fidelity    (0-100) — HIGHEST WEIGHT
C = Contradiction Handling  (0-100)
K = Knowledge/Framework     (0-100)
V = Voice Authenticity      (0-100)

Minimum per component: 85
Minimum composite: 95
```

---

## Escalation Procedure (on failure)

| Attempt | Action |
|---------|--------|
| 1st fail | Return to creating agent with specific failed phases. Agent must address ONLY failing phases without regressing passing ones. |
| 2nd fail | Vertical escalation — ATLAS (PM) reviews. COMPASS (Context Engineer) audits source quality. SENTINEL (QA) re-runs validation suite. |
| 3rd fail | Circuit breaker OPEN — clone creation frozen. Clone marked as DRAFT (not production-ready). Human review required. Full history logged to `.claude/omega/progress.log`. |

---

## Notes

- **Primary sources** = content authored/spoken by the person being cloned (their books, their talks, their interviews).
- **DNA 6 Layers** (Synapse v3 / MMOS v2):
  1. *Filosofia*: Core beliefs, worldview, first principles.
  2. *Frameworks*: Mental models, decision-making structures, step-by-step processes.
  3. *Heuristicas*: Rules of thumb, shortcuts, practical wisdom, red flags.
  4. *Metodologias*: Repeatable processes, formal systems, tools.
  5. *Dilemas*: Known tensions, contradictions, unresolved questions, position evolution.
  6. *Paradoxos Produtivos*: Internal contradictions that coexist and generate value (GOLD LAYER — 35% of fidelity).
- **5 Authorities**: Allen (GTD workflow), Forte (CODE memory), Deming (PDSA quality), Kahneman (anti-bias), Gawande (DO-CONFIRM gates).
- **15 Entities**: contents, mius, fragments, drivers, mind_drivers, miu_driver_evidence, driver_relationships, mapping_systems, system_components, component_driver_map, mind_component_scores, mind_system_mappings, minds, mind_tools, tools (+tool_driver_affinities, tool_relations).
- **APEX score** = material viability metric (/60). ICP score = audience fit metric (/10).
- **Agent signature** format: `<!-- OMEGA:agent={agent_name} phase={phase} timestamp={ISO8601} -->` or equivalent metadata block.
- A clone that fails 3x is tagged `status: draft` in its metadata and excluded from production use until human review clears it.
