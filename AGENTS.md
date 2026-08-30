# Agent Instructions

Conventions for AI agents working in this repository.

## Naming

**All files and directories created by an AI agent must have lowercase names.**

Use lowercase throughout, with `_` or `-` separating words. This applies to every path component
an agent creates — directories as well as files — and to file extensions.

```
✅  story/04_expansion.md          ❌  STORY/04_Expansion.md
✅  notes/art-direction.md         ❌  notes/Art-Direction.MD
✅  path.pdf                       ❌  PATH.pdf
```

Exceptions, only where an external convention requires a specific case:

- Files whose name is fixed by a tool or ecosystem — `README.md`, `LICENSE`, `AGENTS.md`,
  `CLAUDE.md`, `Makefile`, `Dockerfile`, `CHANGELOG.md`.
- Files whose name is dictated by a language or framework convention that requires other casing.
- Existing paths. Match the casing already in use rather than renaming; do not rename a file to
  satisfy this rule unless asked.
