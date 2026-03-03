# OMEGA Quality Gate: Mind Clone Update

**Type:** `mind_update`
**Threshold:** >= 95/100
**Version:** 1.0.0

---

## Criteria

| # | Criterion | Weight | PASS | FAIL |
|---|-----------|--------|------|------|
| 1 | Backup created before changes | 15 | Full backup of current clone state created and verified (restorable) before any modification begins | No backup, or backup is incomplete/unrestorable |
| 2 | Delta analysis completed | 20 | Every incoming change classified as NOVO (new), REFORCO (reinforcement), or EVOLUCAO (evolution) with justification | Any change not classified OR classification missing justification |
| 3 | Additive merge only (never removes) | 20 | No existing data removed; only additions, reinforcements, or evolutions applied. Contradictions resolved by adding both views with evidence, never by deleting the old view | Any existing data deleted or overwritten without preservation |
| 4 | Affected squad directories updated | 15 | All squad directories impacted by the update contain refreshed files reflecting the new data | Any affected directory left stale or inconsistent with the update |
| 5 | Regression validation passed | 15 | Pre-update test suite re-run; all previously passing tests still pass; no existing capability degraded | Any previously passing test now fails after update |
| 6 | Fidelity didn't drop > 5% | 15 | Post-update fidelity score compared to pre-update; delta <= 5 percentage points. If delta > 5%, auto-rollback triggered and backup restored. | Fidelity drop > 5% AND rollback not executed |

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
| 1st fail | Auto-rollback to backup. Return to updating agent with failed criteria and delta analysis. Agent must retry with more conservative merge. |
| 2nd fail | Vertical escalation — ATLAS (PM) reviews update scope. COMPASS (Context Engineer) validates source quality. SENTINEL (QA) performs independent fidelity comparison. |
| 3rd fail | Circuit breaker OPEN — update abandoned. Backup restored permanently. Update flagged for human review. Full history logged to `.claude/omega/progress.log`. |

---

## Notes

- **Delta classification types:**
  - *NOVO*: Information not present in any form in the current clone. Added as new entries.
  - *REFORCO*: Information that confirms/strengthens existing data. Original entry weight increased; new source appended.
  - *EVOLUCAO*: Information that modifies/nuances existing data. Both old and new views preserved with evidence and timestamps.
- **Additive merge principle**: This is the most critical criterion. Mind clones accumulate knowledge over time. Deletion of existing data is NEVER acceptable during an update. If information contradicts, both perspectives are stored with their respective evidence.
- **Fidelity auto-rollback**: If fidelity drops > 5%, the system MUST automatically restore from backup before any further action. The rollback itself is logged and the update is marked as `status: rollback` in the progress log.
- **Backup format**: Full copy of all clone files (YAML, markdown, artifacts) stored in `.claude/omega/backups/{clone-slug}/{timestamp}/`.
- Squad directories to check: all directories under the clone's namespace that were modified or depend on modified data.
