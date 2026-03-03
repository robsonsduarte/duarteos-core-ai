# OMEGA Quality Gate: Mind Clone Creation

**Type:** `mind_clone`
**Threshold:** >= 95/100
**Version:** 1.0.0

---

## Criteria

| # | Criterion | Weight | PASS | FAIL |
|---|-----------|--------|------|------|
| 1 | Phase 1 — Collection: >= 20 primary sources | 10 | >= 20 primary sources collected; all source types represented (books, interviews, articles, talks, podcasts) | < 20 primary sources OR any source type completely absent |
| 2 | Phase 2 — Extraction: Semantic fragments generated | 10 | Semantic fragments extracted with context preserved; timestamps and source references intact on every fragment | Fragments missing context, timestamps, or source references |
| 3 | Phase 3 — Validation: Behavioral validation passed | 10 | Behavioral tests executed; contradictions mapped with evidence A vs evidence B and resolution documented | Behavioral tests not run OR contradictions found but not mapped with evidence |
| 4 | Phase 3.5 — Synapse Sync: DNA layers populated | 10 | All 5 DNA layers (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas) have entries; `source_path` on each entry | Any DNA layer empty OR entries missing `source_path` |
| 5 | Phase 4 — Inference: Drivers and frameworks extracted | 10 | Cognitive drivers calculated from evidence; frameworks extracted as individual YAML files with examples | Drivers asserted without evidence OR frameworks missing YAML files |
| 6 | Phase 5 — System Components: All artifacts generated | 15 | All 4 artifact types present: cognitive profile, behavioral model, linguistic fingerprint, narrative voice | Any of the 4 artifact types missing |
| 7 | Phase 6 — PRD: PRD generated with APEX score | 10 | PRD document generated; todo list created; APEX score calculated and documented | PRD missing OR APEX score not calculated |
| 8 | Phase 7 — QA: Self-test protocol executed | 10 | Self-test protocol run; fidelity >= 95%; YAML integrity validated by hooks | Self-test not run OR fidelity < 95% OR YAML validation fails |
| 9 | Agent signature on every output | 5 | Every generated file contains the creating agent's signature block | Any file missing agent signature |
| 10 | All squad directories populated | 10 | All required directories under the mind clone's namespace contain their expected files (no empty dirs) | Any required directory empty or missing expected files |

---

## Scoring Formula

```
score = SUM(criterion_weight * (1 if PASS else 0))
```

Total possible: **100**
Threshold to pass: **>= 95**

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
- **DNA 5 Layers** (Synapse v2):
  1. *Filosofia*: Core beliefs, worldview, first principles.
  2. *Frameworks*: Mental models, decision-making structures, methodologies.
  3. *Heuristicas*: Rules of thumb, shortcuts, practical wisdom.
  4. *Metodologias*: Step-by-step processes, workflows, systems.
  5. *Dilemas*: Known tensions, contradictions, unresolved questions.
- **APEX score** = composite quality metric for mind clone fidelity (calculated from validation results).
- **Agent signature** format: `<!-- OMEGA:agent={agent_name} phase={phase} timestamp={ISO8601} -->` or equivalent metadata block.
- A clone that fails 3x is tagged `status: draft` in its metadata and excluded from production use until human review clears it.
