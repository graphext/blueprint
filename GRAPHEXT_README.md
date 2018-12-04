# Blueprint Graphext fork
Before starting developing, please see "One-time setup" section in [Readme](README.md) file.

## How to sync with upstream
This is a fork of [Palantir's blueprint library](https://github.com/palantir/blueprint) for React UI components, and the main branch of this repository is `graphext`.
We should always pull commits of a completed released version of blueprint.
- If the latest commit of `develop` branch is the last of the desired release, we can retrieve the changes from `upstream develop` into a new branch in `origin`:
```
git checkout updateUpstream && git pull upstream develop
```
- Otherwise, the *pull* must be done from the release's specific commit.
- Push all incoming commits to the branch created in `origin`.
- Prepare a Pull Request to `origin graphext`.
- Note that all commits coming from upstream must be **squashed** into one.

## Updating Blueprint styles
The purpose of this repository is to adapt blueprint UI components' styles to Graphext design, then, it is forbidden to update blueprint javascript. Graphext developers must only update blueprint styles. To do that, the steps to follow must be:
- Blueprint uses `!default` flag at the end of some `scss` variable declarations. Therefore, graphext developers must see if they can use `scss` variables in order to get the desired style.
- If the first approach cannot be done, then the developer must add the `scss` styles to `_overrides.scss` files stayed in `packages/core` and `packages/select`.

  Note that many Blueprint components are build using others Blueprint components. Then, it is important that styles overwriting be done by using specific classnames.

The following packages of this monorepo have been already updated by Graphext and they are already published in graphext npm registry:
    - `core`
    - `select`
    - `table`

## How to publish the changes

In the top directory you can complie all the packages
```
yarn compile
```
And then create the bundles with
```
yarn dist:libs
```
After that you can upgrade the version of the changed packages adding +1 after the `graphext` part of the version. Take into account the dependencies between packages, like the icons --> core dependency.

And publish the affected packages like:
```
cd packages/core && npm publish
```

## How to add new icons

The icons generator script is [`generate-icons-source.js`](packages/node-build-scripts/generate-icons-source.js). This script uses [`packages/icons/resources/icons/icons.json` ](packages/icons/resources/icons/icons.json) as entry, which is the file we have to modify in order to add a new icon.
- 1. Add a new object at the end of the other Graphext components:

```
    ...
    , {
        "displayName": "The Paco",
        "iconName": "paco",
        "tags": "hombre, mozo, machote",
        "group": "Graphext",
        "content": "\\e7c5"
    },
    ...
```
- `iconName` is the most important parameter. It has to resembles the svg filename, choose a good one because it is also the name that must be used in the code to use this icon.
- `tags` is just useful to search icons in the documentation.
- `group` is only used in the documentation too. We must add all icons to **Graphext** group to see all icons added by graphext together.
- `content` must be an hexadecimal **unique** number of length 4. This number must be **unique** in the file. (Search before commit) One way of selecting a name is using https://unicode-table.com/ Search for the concept you want to add and copy the number.
- Add `svg` resources in the following folders
    - `resources/icons/16px`
    - `resources/icons/20px`

  We can add the same `svg` in both folders, but could be nicer to generate one for 16px and another one for 20px.
- Finally, icons must be compiled, open a new terminal and paste:
```
docker-compose run bp yarn --cwd packages/icons compile
```
