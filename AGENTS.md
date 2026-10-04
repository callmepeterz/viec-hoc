<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Use the Next.js App Router under `src/app` for pages and route behavior.
- Reuse the dependencies already installed in `package.json`; do not introduce a replacement framework or duplicate dependency without a clear need.
- Keep the layout, colors, typography, spacing, and interaction intent aligned with the reference files in `design/stitch`.
- Do not read, display, or print `.env.local` or any other environment secret file.
- Never write passwords, tokens, API keys, or other secrets to logs, error messages, or committed files.
- After every code or configuration change, state how to verify it and run the most relevant available check when possible, such as `npm run lint` or `npm run build`.
