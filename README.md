# ChatRoom

Real-time global chat MVP with theming and color accessibility constraints.

## Stack

- Fastify + Socket.IO (Node/TS)
- React + Vite + Tailwind + Zustand
- Prisma + SQLite (persist last 100 messages)

## Dev Quickstart

```bash
npm i -g pnpm
pnpm install
pnpm exec prisma generate --filter @chatroom/server
pnpm dev
```
Server on :4000, web on :5173.

Run tests:
```bash
pnpm test
```

## Scripts
- `pnpm dev` run both apps
- `pnpm build` build all
- `pnpm test` (placeholder)

## Theming
CSS variables per `[data-theme]` root; Tailwind consumes var names for tokens.

Contrast enforcement utilities ensure WCAG AA (>=4.5:1) for name/message text vs backgrounds.

## Roadmap
See specification in initial prompt.
