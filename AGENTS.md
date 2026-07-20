# Blueprint.js Agentic Development Guide

> **This is the Graphext fork of Palantir's Blueprint.** Before any upstream version bump, fork
> publish, or `-graphextNN` version change, read [`GRAPHEXT_README.md`](GRAPHEXT_README.md) — it
> documents the upstream-sync strategy (squash upstream, never squash the PR), the version suffix
> scheme, the styles-only rule, and how publishing works (push to `deploy`).

**Downstream — to test a change in an environment.** The fork publishes `@blueprintjs/*`
(tagged `-graphextNN`) to the private registry on push to `deploy`. Publishing is not enough to
see it in a running app — bump the exact `@blueprintjs/*` pins in `graphext/package.json`
(and, since it also consumes the fork, `gatekeeper/package.json`), `pnpm install`, and deploy
that consumer (graphext to `pre` first). There is no local dev shortcut. Full chain:
`docs/cross-repo-workflows.md` §3 (workspace root).

## Build/Test Commands

- **Build**: `pnpm compile` (all packages), `pnpm nx compile @blueprintjs/core` (single package)
- **Test all**: `pnpm test`, `pnpm nx run-many -t test`
- **Test single package**: `pnpm nx test:vitest:run @blueprintjs/core` or `cd packages/core && pnpm test:vitest:run`
- **Distribute**: `pnpm dist`, `pnpm nx dist @blueprintjs/core` (single package)
- **Lint**: `pnpm lint`, `pnpm lint-fix` (auto-fix), `pnpm nx lint @blueprintjs/core` (single package)
- **Format**: `pnpm format`, `pnpm format-check`
- **Verify all**: `pnpm verify` (compile + dist + test + lint + format-check)

## Architecture

- **Monorepo** using pnpm workspaces + Nx task runner
- **Package manager**: pnpm v10.29.3 (strict dependency resolution)
- **Packages**: Core UI components in `packages/` - core, datetime, select, table, icons, colors
- **Apps**: docs-app (blueprintjs.com), demo-app, table-dev-app for development
- **Build tools**: node-build-scripts, webpack-build-scripts
- **Testing**: Vitest (components), Jest (build scripts), Enzyme + Chai + Sinon
    - New tests should be written with React Testing Library (RTL)

## Code Style

- **Prettier**: 120 char width, 4-space tabs (2 for SCSS/YAML), trailing commas
- **ESLint**: TypeScript-ESLint + custom @blueprintjs rules, no console.log
- **Imports**: Use workspace: deps
- **Types**: Strict TypeScript, React 18 peer deps
- **Components**: Follow existing patterns in packages/core/src/components/
- **Styling**: SCSS in src/, compiled to lib/css/
