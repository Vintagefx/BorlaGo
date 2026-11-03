# BorlaGo AI kit — read me first

This folder gives the AI everything it needs to build BorlaGo the way we designed it.

## What's inside

- `CLAUDE.md` — the main instructions for the AI (the AI reads this automatically)
- `AGENTS.md` — the same instructions, for other AI coding tools
- `design/` — design rules, screen pictures, logo and images
- `docs/` — how the app works

## Where to put it

1. Create the Expo project first (in the VS Code terminal):
   `npx create-expo-app@latest borlago`
2. Open the new `borlago` folder in VS Code.
3. Copy **everything inside this kit** (CLAUDE.md, AGENTS.md, design, docs) into the `borlago` folder, next to `package.json`.

It should look like this:

```
borlago/
├── app/              ← made by Expo (the screens go here)
├── assets/           ← made by Expo
├── package.json      ← made by Expo
├── CLAUDE.md         ← from this kit
├── AGENTS.md         ← from this kit
├── design/           ← from this kit
└── docs/             ← from this kit
```

## How to use it with the AI

Start every session by saying:

> Read CLAUDE.md, then let's do step 1 of the build order.

Then go one step at a time.
