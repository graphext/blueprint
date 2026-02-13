# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is **Graphext's fork** of [Palantir Blueprint](https://github.com/palantir/blueprint), a React-based UI toolkit. The main branch is `graphext` (not `develop`). The fork's purpose is to **customize Blueprint component styles** for Graphext's design system — JavaScript changes to Blueprint source are forbidden; only SCSS modifications are allowed.

Published packages use a `-graphextNN` version suffix (e.g., `5.19.1-graphext50`). Versions are set directly in each `packages/*/package.json`.

## Common Commands

### First-time setup
```bash
nvm use                    # Node v18.17
corepack enable            # Activate Yarn
yarn                       # Install dependencies
yarn compile               # Build all library packages
```

### Build
```bash
yarn compile               # Build all packages (respects dependency order via Nx/Lerna)
yarn dist:libs             # Create distribution bundles for published packages
yarn verify                # Full pipeline: compile → dist → test → lint → format-check
```

### Development
```bash
yarn dev                   # Watch all packages + docs app (localhost:9001)
yarn dev:core              # Watch core + icons + docs-app
yarn dev:datetime          # Watch datetime + docs-app
yarn dev:select            # Watch select + docs-app
yarn dev:table             # Watch table + table-dev-app
```

Or via Docker:
```bash
docker-compose run bp sh -c 'yarn && yarn compile'    # Initial setup
docker-compose run -p 9999:9001 bp sh -c 'yarn dev:core'  # Dev server at localhost:9999
```

### Testing
```bash
yarn test                           # Run all package tests (Mocha + Karma + Enzyme)
cd packages/core && yarn test       # Test a single package
cd packages/core && yarn test:karma # Browser tests only (Karma)
```

### Linting & Formatting
```bash
yarn lint                  # ESLint + stylelint across all packages
yarn lint-fix              # Auto-fix ESLint issues
yarn format                # Prettier format all TS/TSX/JSON files
yarn format-check          # Check formatting without fixing
```

### Version Management & Publishing
```bash
# 1. Edit version in each packages/*/package.json (use -graphextNN suffix)
# 2. Compile and create distribution:
docker-compose run bp sh -c 'yarn compile && yarn dist:libs'
# 3. Publish (yarn pack resolves workspace:^ deps, npm publish handles auth):
docker-compose run bp sh -c 'for pkg in icons core select datetime datetime2 table; do cd packages/$pkg && yarn pack -o /tmp/$pkg.tgz && npm publish /tmp/$pkg.tgz && cd ../..; done'
```

CI (Woodpecker) auto-publishes on push to `deploy` branch: build → publish to Graphext npm → deploy docs to GitHub Pages.

### Icons
```bash
# After modifying packages/icons/resources/icons/icons.json and adding SVGs to 16px/20px:
docker-compose run bp yarn --cwd packages/icons compile
```

## Architecture

**Monorepo** managed by Lerna + Yarn Workspaces + Nx (for caching/task orchestration).

### Published Packages (Graphext-customized)
- **core** — Buttons, dialogs, forms, menus, popovers, and all base components
- **icons** — Icon font generation and React icon components
- **select** — List selection components (Select, MultiSelect, Suggest)
- **datetime** / **datetime2** — Date/time pickers (datetime2 uses react-day-picker v8)
- **table** — Scalable interactive table
- **popover2** — Legacy re-export package

### Build Tooling Packages
`eslint-config`, `eslint-plugin`, `stylelint-plugin`, `karma-build-scripts`, `node-build-scripts`, `webpack-build-scripts`, `test-commons`, `docs-theme`, `tslint-config`

### App Packages
`docs-app` (documentation site), `landing-app`, `demo-app`, `table-dev-app`

### Build Pipeline per Package
Each library compiles to three module formats (ESM, CJS, ESNext) plus Sass → CSS. The `dist` step creates Webpack bundles and optimized CSS. Nx caches build outputs in `{projectRoot}/lib` and `{projectRoot}/dist`.

## Graphext Customization Pattern

**Rule: Only modify SCSS, never modify Blueprint JavaScript.**

1. **Use `!default` SCSS variables** — Blueprint declares many variables with `!default`; override them by defining the variable before Blueprint's import.
2. **Use `_overrides.scss` files** — When variables aren't enough, add styles to override files in the package. Key locations:
   - `packages/core/src/components/*/` — Many components have `_overrides.scss`
   - `packages/datetime/src/_overwrites.scss`
   - `packages/table/src/_overrides.scss`
   - `packages/popover2/src/_popover2-overrides.scss`
3. **Graphext color variables** — Overrides use Graphext-specific SCSS variables: `g-light-base*`, `g-dark-base*`, `g-light-active`, `g-dark-active`, etc.
4. **Dark theme** — Use `.#{$ns}-dark` selector for dark theme variants.

**CSS constraint:** Never use `%` in CSS opacity values (breaks Graphext's build). Use decimal form: `opacity: 0.5;`.

## Syncing with Upstream

Pull from a specific Palantir release commit into a new branch, squash all upstream commits, then PR into `graphext`. Before compiling after a version bump, temporarily remove `-graphextNN` suffixes, compile, then re-add them directly in each `package.json`.

## Code Style

- **Prettier**: 120 char width, 4-space tabs, trailing commas, no parens on single arrow params
- **Stylelint**: 2-space indent for SCSS, 100 char line length (comments excluded)
- **ESLint**: Blueprint custom config + `import/no-cycle` in CI
- **TypeScript**: v4.9.5
