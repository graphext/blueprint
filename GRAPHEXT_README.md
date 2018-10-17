# Blueprint Graphext fork
Before starting developing, please see "One-time setup" section in [Readme](README.md) file.

## How to sync with upstream
This is a fork of [Palantir's blueprint library](https://github.com/palantir/blueprint) for React UI components, and the main branch of this repository is `graphext`.

- Retrieve latest changes from `upstream develop` into a new branch in `origin`:
```
git checkout graphext && git pull upstream develop
```
- Push all incoming commits to the branch created in `origin`.
- Prepare a Pull Request to `origin graphext`.
- If the Pull Request is accepted, all commits must be **squashed** into one.

## Updating Blueprint styles
The purpose of this repository is to update adapt blueprint UI components' styles to Graphext design, then, it is forbidden to update blueprint javascript. Graphext developers must only update blueprint styles. To do that, the steps to follow must be:
- Blueprint uses `!default` flag at the end of some `scss` variable declarations. Therefore, graphext developers must see if they can use `scss` variables in order to get the desired style.
- If the first approach cannot be done, then the developer must add the `scss` styles to `_overrides.scss` files stayed in `packages/core` and `packages/select`.

  Note that many Blueprint components are build using others Blueprint components. Then, it is important that styles overwriting be done by using specific classnames.


## Generating CSS
In [graphext](https://github.com/graphext/graphext) repository, `packages/core` and `packages/select` compiled CSSs are used. Note that these CSSs must be always synchronized with their corresponding Javascript versions.
Steps to generate CSS files:
- Change to the corresponding directory you want to genetate its CSS. For instance, if you want to generate `packages/core` CSS you can do:
```
cd packages/core
```
- Run the following command:
```
yarn run generate-graphext-css
```
This command compile all `.scss` files into a single `.css`.
- Update [blueprint-core.global.css](https://github.com/graphext/graphext/blob/master/app/javascript/rsc/blueprint-core.global.css) file in `graphext/app/javascript/rsc/blueprint-core.global.css` with the new CSS.

## How to add new icons

The icons generator script is [`generate-icons-source.js`](packages/node-build-scripts/generate-icons-source.js). This script uses [`icons.json` ](packages/icons/resources/icons/icons.json) as entry, which is the file we have to modify in order to add a new icon.
- 1. Add a new object at the end of the array:

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
- `iconName` is the most important parameter. and it represents the svg filename and it's the name that must be used in the code to use this icon.
- `tags` is just useful to search icons in the documentation.
- `group` is only used in the documentation too. We must add all icons to **Graphext** group to see all icons added by graphext together.
- `content` must be an hexadecimal **unique** number of length 4.
- Add `svg` resources in the following folders
    - `resources/icons/16px`
    - `resources/icons/20px`

  Note that unless we can add the same `svg` in both folders, it is interesting to respect the 16px and 20 pixels to get better results when we want the the icon to be small.
- Finally, icons must be compiled:
```
cd packages/icons && yarn compile
```
