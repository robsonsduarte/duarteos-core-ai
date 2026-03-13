#!/bin/sh
# framework-guard.sh — DuarteOS pre-commit hook
#
# Protects read-only framework files (.claude/protocols/*, .claude/config/system.yaml)
# from accidental modification. Users may freely edit project.yaml, user.yaml,
# agent-memory/*, and synapse/* files.
#
# Set DUARTEOS_NO_GUARD=1 to bypass (for system updates / duarteos update).

set -e

# Bypass guard when explicitly requested
if [ "${DUARTEOS_NO_GUARD:-0}" = "1" ]; then
  exit 0
fi

# Protected framework paths (read-only)
PROTECTED_PATHS="
.claude/protocols/CONSTITUTION.md
.claude/protocols/GOVERNANCE.md
.claude/protocols/OMEGA.md
.claude/protocols/SYNAPSE.md
.claude/protocols/QUALITY-GATES.md
.claude/protocols/CONFIG-PROTOCOL.md
.claude/protocols/MODEL-ROUTING.md
.claude/protocols/PROCESS-CHIEF.md
.claude/config/system.yaml
"

BLOCKED=""

# Check staged files against protected paths
for staged in $(git diff --cached --name-only); do
  for protected in $PROTECTED_PATHS; do
    if [ "$staged" = "$protected" ]; then
      BLOCKED="${BLOCKED}  - ${staged}\n"
    fi
  done
done

# Block commit if any protected file was modified
if [ -n "$BLOCKED" ]; then
  echo ""
  echo "[DuarteOS] Arquivos protegidos detectados no commit:"
  echo ""
  printf "%b" "$BLOCKED"
  echo ""
  echo "Estes arquivos sao protegidos pelo DuarteOS. Use --force ou 'duarteos update' para atualiza-los."
  echo "Para ignorar esta verificacao, execute: DUARTEOS_NO_GUARD=1 git commit ..."
  echo ""
  exit 1
fi

exit 0
