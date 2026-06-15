# Blueprint Graphext fork

This is a fork of [Palantir's Blueprint library](https://github.com/palantir/blueprint) for React UI
components. The main branch of this repository is `graphext`; publishing happens from `deploy`.

> **Toolchain:** pnpm `10.33.0` + Node `>=24.14.1` (pinned via `packageManager` / `engines` in
> `package.json`, enabled through `corepack`). The repo migrated off yarn + `docker-compose run bp`
> during the BP6 upgrade — run the pnpm scripts directly.
>
> **Day-to-day commands** (compile, test, lint, dist, single-package targets) live in
> [`AGENTS.md`](AGENTS.md). This file documents the *fork-specific* concerns: syncing with upstream,
> the version suffix scheme, and how to publish.

## How to sync with upstream

We should always pull commits of a **completed released version** of Blueprint (a tag like
`@blueprintjs/core@X.Y.Z`), never an arbitrary `develop` commit.

1. Retrieve the upstream changes into a new branch in `origin`:
   ```bash
   git checkout -b updateUpstream-X.Y.Z origin/graphext
   git pull upstream develop          # or `git merge <release-tag>` if develop has moved past it
   ```
2. **Squash all commits coming from upstream into a single commit** (e.g.
   `chore: merge upstream Blueprint X.Y.Z (squashed)`). The fork deliberately does **not** track
   upstream's git ancestry — see *A bit of history* below for why real merges were abandoned.
3. Re-apply the Graphext adaptation layer **as separate, well-labelled commits on top** of that one
   squashed commit (see *Updating Blueprint styles*). Keeping the boundary "1 upstream-import commit
   ↔ N Graphext commits" sharp is what makes the *next* upgrade easy: the next person can see at a
   glance which commits/files are ours to carry forward.
4. Open a Pull Request against `origin/graphext`.

### Merge strategy for the PR — this matters

- ✅ **Rebase-and-merge** (or a merge commit). Preserves the labelled commits and the
  upstream-vs-Graphext boundary.
- ❌ **Never "Squash and merge" the whole PR.** It collapses the upstream import together with every
  Graphext adaptation into one commit, destroying exactly the boundary that keeps future upgrades
  cheap.

## Version suffix scheme (`-graphextNN`)

Published packages carry a `-graphextNN` suffix on top of the upstream semver, e.g.
`@blueprintjs/core@6.15.0-graphext53`. The suffix is bumped on every Graphext-side change.

On a **major upstream version change** (e.g. 5.x → 6.x) you must temporarily **remove the
`-graphext[OldVersion]` suffix** from every `packages/*/package.json` so the first install/compile
resolves real upstream versions:

```bash
pnpm install
pnpm compile
pnpm dist
```

Then **re-add the `-graphext[NewVersion]` suffix** in each `packages/*/package.json`. Otherwise the
build assembles against an older published Blueprint and won't be compatible with our environment.

## Updating Blueprint styles

The purpose of this fork is to adapt Blueprint components' styles to the Graphext design. **Do not
modify Blueprint JavaScript** — Graphext developers should only change styles:

- Blueprint declares many `scss` variables with a `!default` flag, so prefer overriding those
  variables to get the desired look.
- When that isn't enough, add the overrides to the `_overrides.scss` files in `packages/core` and
  `packages/select`, and (since BP6) to the **CSS-vars bridge** introduced in the 6.15 upgrade that
  re-maps BP6 design tokens back to the BP5 visual baseline.

  Many Blueprint components are composed from other Blueprint components, so scope overrides with
  specific classnames.

The packages Graphext customizes and publishes to the registry (matching the `publish` step in
`.woodpecker.yml`) are:

- `core`
- `icons`
- `select`
- `datetime`
- `datetime2`
- `table`

## How to publish the changes

1. Compile and build the bundles:
   ```bash
   pnpm compile
   pnpm dist
   ```
2. Bump the `-graphextNN` suffix of the changed packages in each `packages/*/package.json`. Mind the
   inter-package dependencies (e.g. `icons → core`).
3. **Merge `graphext` into `deploy`.** Woodpecker CI (`.woodpecker.yml`) publishes the packages to the
   private registry (GAR) and deploys the docs on every push to `deploy`.

## How to add new icons

The icon generator script is
[`generate-icons-source.js`](packages/node-build-scripts/generate-icons-source.js). It reads
[`packages/icons/resources/icons/icons.json`](packages/icons/resources/icons/icons.json), which is the
file to edit when adding a new icon.

1. Add a new object at the end of the other Graphext components:
   ```json
       , {
           "displayName": "The Paco",
           "iconName": "paco",
           "tags": "hombre, mozo, machote",
           "group": "Graphext",
           "codepoint":  99999
       }
   ```
   - `iconName` is the most important parameter. It must resemble the SVG filename — choose well, it is
     also the name used in code to reference the icon.
   - `tags` only helps searching icons in the documentation.
   - `group` is documentation-only. Add all icons to the **Graphext** group so they appear together.
   - `codepoint` must be a **unique** number in the file (search before committing).
2. Add the `svg` resources to both `resources/icons/16px` and `resources/icons/20px` (the same SVG
   works in both, though a 16px-tuned variant is nicer).
3. Compile the icons:
   ```bash
   pnpm nx compile @blueprintjs/icons
   ```
4. Check the result by running core + docs:
   ```bash
   pnpm dev:core
   ```

## A bit of history about this repository...

### How we included the changes from Palantir Blueprint

A long time ago we forked the Blueprint repository. We kept adding functionality in the `graphext`
branch, and when we wanted to deploy it we merged it into `deploy`.

Over time we wanted all the changes the Blueprint team had added since the fork. As you may be
thinking... yes, that merge was a bit scary. We tried to merge Palantir's branch into our `graphext`
branch and a lot of changes arose, many because of format changes — so we decided to say goodbye to
our beloved `graphext` branch and its history and just add our changes on top of theirs. This meant
losing our commit history (bye-bye `git blame`!), so we copied `graphext` into `graphextOld`. If you
want the rationale behind an old change, check
[there](https://github.com/graphext/blueprint/tree/graphextOld).

Just to be clear:

- we copied `graphext` into `graphextOld`
- we removed `graphext`
- we created `graphext` again from `palantir:develop`
- we [merged](https://github.com/graphext/blueprint/tree/e64b857881ab2c310600c567635f3b753e6f03e6)
  `graphextOld` into the new `graphext` branch

We faced a similar situation with `deploy`:

- we copied `deploy` into `deployOld`
- we removed `deploy`
- we created `deploy` again from `graphext`

What happened to the changes in `deploy`? They were lost, but it doesn't matter because `deploy`
should just reflect `graphext`'s history — a fresh start. The
[first version](https://npm.graphext.com/-/web/detail/@blueprintjs/core/v/3.53.0-graphext01) that
included those changes was `3.53.0-graphext01`.

This is how we included Palantir's changes. After this we were able to work as usual (PR into
`graphext`, then merge into `deploy` to publish).

### v5 upgrade

Worth reading both PRs, where the process is explained:

- [Blueprint](https://github.com/graphext/blueprint/pull/107)
- [Graphext](https://github.com/graphext/graphext/pull/2745)

### v6 upgrade (5.19.1 → 6.15.0)

[Blueprint PR #134](https://github.com/graphext/blueprint/pull/134). Approach, which is the template
for future upgrades:

- Upstream Blueprint `6.8.0` was brought in **squashed into one commit**, then bumped `6.8 → 6.15`.
- The Graphext visual baseline (BP5.19.1 styling) was preserved with a new **CSS-vars bridge** plus
  the existing `_overrides.scss`, validated against BP5.19.1 ↔ BP6.15 visual-parity fixtures.
- The toolchain migrated from **yarn → pnpm** and **Node 20 → Node 24**, and CI was reworked
  (`build` on all branches, `publish`/`docs` restricted to `deploy`, preview publishes on PRs).
- Published as `@blueprintjs/*@6.x-graphext53`.

## Developing with Graphext, Storybook and Blueprint

There are some special commands in `docker-compose.yml` to make working with Graphext, Storybook and
Blueprint easier. More info in the **WORKING WITH 🔵 BLUEPRINT** section of the
[Storybook readme](https://pre.graphext.com/storybook/?path=/story/design-system-how-to-use--page).

## Warning

**DO NOT use `%` on CSS opacity — it breaks the Graphext build.** Use `opacity: 0.5;` instead.
