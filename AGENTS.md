# Repository Guidelines

## Project Structure & Module Organization
- Monorepo root uses npm workspaces; run commands from the root.
- `apps/api`: TypeScript GraphQL API (Apollo/Express). Tests live in `apps/api/test/{unit,integration,canary}`.
- `apps/webapp`: Next.js frontend (MUI + Tailwind). Codegen depends on `NEXT_PUBLIC_GRAPHQL_URL`.
- `packages/commons`: Shared types, validation, and constants consumed by other workspaces.
- `infra`: AWS CDK stacks for API deployment; expects AWS creds and bootstrap.
- `tools/cli`: Python utilities; keep in sync with API contracts when modifying schemas.

## Build, Test, and Development Commands
- Install deps: `npm install` (root). Workspace-only: `npm install -w <workspace>`.
- API dev server: `npm run dev:api` (scoped; avoids workspace fan-out).
- API build + unit tests: `npm run build -w @ntlango/api`; TS-only: `npm run build:ts -w @ntlango/api`.
- API test suites: `npm run test:unit -w @ntlango/api`, `npm run test:integration -w @ntlango/api`, `npm run test:canary -w @ntlango/api`.
- Web dev: export `NEXT_PUBLIC_GRAPHQL_URL`, then `npm run dev:web`. Prod build: `npm run build -w @ntlango/webapp`.
- Commons build: `npm run build -w @ntlango/commons`. CDK synth: `npm run build:cdk -w @ntlango/cdk`.
- Repo-wide helpers: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (scoped via workspaces).

## Coding Style & Naming Conventions
- TypeScript everywhere; `tsconfig.base.json` enforces strict mode and path aliases (`@ntlango/commons/*`).
- Prettier 3 is the formatter (`apps/api/.prettierrc.json`, `packages/commons/.prettierrc.json`); Next app uses `prettier` with the Tailwind plugin via `lint:fix`.
- Prefer camelCase for variables/functions, PascalCase for types/components, kebab-case for files and workspace packages.
- Keep shared contracts in `packages/commons` and re-export types instead of duplicating.

## Testing Guidelines
- API tests use Jest; files end with `.test.ts` under `apps/api/test/{unit,integration,canary}/spec`.
- Unit tests run in-band for stability; integration tests expect MongoDB + JWT config. Use `.env` per workspace or exported vars before running.
- Aim to cover resolvers, validation, and query helpers when touching API logic; add fixtures under `apps/api/test/utils`.
- Web app currently lacks automated tests—add component or integration tests colocated with features when introducing new UI.

## Commit & Pull Request Guidelines
- Use concise, present-tense commit subjects (`feat: add event category validation`, `fix: handle missing jwt secret`) and group related changes.
- For PRs, include: scope/summary, linked issue/ticket, env variables touched, and test evidence (commands run + outputs). Add screenshots/GIFs for UI changes in `apps/webapp`.
- Keep workspaces version-aligned (`@ntlango/*@1.0.0`) when publishing; avoid committing secrets or `.env` files.

## Security & Configuration Tips
- Required env vars: API (`JWT_SECRET`, `MONGO_DB_URL`, `STAGE`, `AWS_REGION`, optional `NTLANGO_SECRET_ARN`); Web (`NEXT_PUBLIC_GRAPHQL_URL`); CDK requires AWS creds.
- Never commit secrets; use `.env` files ignored by git. For CDK, ensure AWS bootstrap is done per account/region before synth/deploy.
