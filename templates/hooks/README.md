# DuarteOS Hooks

Hooks do Claude Code que automatizam quality gates e seguranca.

## Hooks Incluidos

| Hook | Evento | Descricao |
|------|--------|-----------|
| `post-edit-lint.sh` | PostToolUse (Write/Edit) | Auto-lint apos editar arquivos |
| `pre-commit-check.sh` | PreToolUse (Bash: git commit) | TypeScript + ESLint + testes antes do commit |
| `security-gate.sh` | PreToolUse (Bash) | Bloqueia comandos perigosos (rm -rf, DROP, etc) |
| `session-memory.sh` | Stop | Salva contexto da sessao automaticamente |

## Como Ativar

Os hooks sao configurados no `.claude/settings.json` automaticamente pelo `duarteos init`.

Para ativar o pre-commit check manualmente, adicione ao `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/pre-commit-check.sh \"$INPUT\""
          }
        ]
      }
    ]
  }
}
```

## Personalizar

Edite os scripts em `.claude/hooks/` para ajustar ao seu projeto.

## Desativar

Remova a secao `hooks` do `.claude/settings.json`.
