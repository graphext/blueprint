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

## If Blueprint package version change
If Blueprint package version change (for example from 3.53.0 to 4.0.0) is **needed to remove "-graphext[OldVersion]"** from all the package.json . This is made in order to get the first install and compile of the packages:
```
docker-compose run bp sh -c 'yarn && yarn compile'
```
Once it's done, we can create de dist files with:
```
docker-compose run bp sh -c 'yarn dist:libs'
```
Then **change the package names to "-graphext[NewVersion]" again** directly in each `packages/*/package.json`. Woodpecker CI will publish on push to `deploy`.
Otherwise, we will be assembling the package by downloading an older version of blueprint and it will not be compatible with our environment.

## Updating Blueprint styles
The purpose of this repository is to adapt blueprint UI components' styles to Graphext design, then, it is forbidden to update blueprint javascript. Graphext developers must only update blueprint styles. To do that, the steps to follow must be:
- Blueprint uses `!default` flag at the end of some `scss` variable declarations. Therefore, graphext developers must see if they can use `scss` variables in order to get the desired style.
- If the first approach cannot be done, then the developer must add the `scss` styles to `_overrides.scss` files stayed in `packages/core` and `packages/select`.

  Note that many Blueprint components are built using other Blueprint components. Then, it is important that style overwriting be done by using specific classnames.

The following packages of this monorepo have been already updated by Graphext and they are already published in graphext npm registry:
    - `core`
    - `datetime`
    - `select`
    - `icons`
    - `table`
    - `popover2`

## How to publish the changes

In the top directory you can compile all the packages
```
docker-compose run bp yarn compile
```
And then create the bundles with
```
docker-compose run bp yarn dist:libs
```
After that you can upgrade the version of the changed packages adding +1 after the `graphext` part of the version directly in each `packages/*/package.json`. Take into account the dependencies between packages, like the icons --> core dependency.

Woodpecker CI handles publishing automatically on push to `deploy` branch.

## How to add new icons

The icon generator script is [`generate-icons-source.js`](packages/node-build-scripts/generate-icons-source.js). This script uses [`packages/icons/resources/icons/icons.json` ](packages/icons/resources/icons/icons.json) as entry, which is the file we have to modify in order to add a new icon.
- 1. Add a new object at the end of the other Graphext components:

```
    ...
    , {
        "displayName": "The Paco",
        "iconName": "paco",
        "tags": "hombre, mozo, machote",
        "group": "Graphext",
        "codepoint":  99999
    },
    ...
```
- `iconName` is the most important parameter. It has to resemble the svg filename, choose a good one because it is also the name that must be used in the code to use this icon.
- `tags` is just useful to search icons in the documentation.
- `group` is only used in the documentation too. We must add all icons to **Graphext** group to see all icons added by graphext together.
- `codepoint` must be **unique** number. This number must be **unique** in the file. (Search before commit) One way of selecting a name is using https://unicode-table.com/ Search for the concept you want to add and copy the number.
- Add `svg` resources in the following folders
    - `resources/icons/16px`
    - `resources/icons/20px`

  We can add the same `svg` in both folders, but could be nicer to generate one for 16px and another one for 20px.
- Finally, icons must be compiled, open a new terminal and paste:
```
docker-compose run bp yarn --cwd packages/icons compile
```
- Check the results: the fastest way is running the core and the documentation
```
docker-compose run bp yarn dev:core
```

## A bit of history about this repository...
### How we included the changes from palantir blueprint
A long time ago, we did a fork from the blueprint repository. We kept adding functionality in the `graphext` branch,
and when we wanted to deploy it, we merge it into `deploy` branch.
But time goes, and we realized it would be nice if we can have all the changes that the blueprint team had added,
and we were missing since the fork. As you may be thinking...yes, that merge was a bit scary.

We tried to merge the branch from palantir in our graphext branch, but a lot of changes arise, a lot of them because of format changes...
so we thought the best solution was to say goodbye to our beloved `graphext` branch and its history and just add our changes into their branch.
This meant that we were going to lose all our commit history (bye-bye to git blame!), so we copied `graphext` into `graphextOld`.
So if you want to see the rationality behind a change, you may need to check it [there](https://github.com/graphext/blueprint/tree/graphextOld).

Just to be clear:
- we copied `graphext` branch into `graphextOld`
- we removed `graphext`
- we created `graphext` again from `palantir:develop`
- we [merged](https://github.com/graphext/blueprint/tree/e64b857881ab2c310600c567635f3b753e6f03e6) `graphextOld` into our new `graphext` branch

We were facing a similar situation with the `deploy` branch, and the process was as follows:
- we copied `deploy` branch into `deployOld`
- we removed `graphext`
- we created `deploy` again from `graphext`

Oh, wait! And what happened with the changes in the `deploy` branch? Were they lost?
Yes, but it doesn't matter because `deploy` should reflect `graphext` history branch. It is just a new beginning.
The [first version](https://npm.graphext.com/-/web/detail/@blueprintjs/core/v/3.53.0-graphext01]) that included those changes was `3.53.0-graphex01`.

This is how we included the changes from palantir in our repository.
At this point, we were able to work as we used to do (PR in `graphext` and then if you want to deploy your changes, merge it into `deploy`).

### v5 upgrade
I recommend checking both PRs, where we explained how it went:
- [Blueprint](https://github.com/graphext/blueprint/pull/107)
- [Graphext](https://github.com/graphext/graphext/pull/2745)

## Developing with Graphext, Storybook and Blueprint:

There are some special commands on `docker-compose.yml` created to work easier with Graphext, Storybook and Blueprint.
There is more information about it on **WORKING WITH 🔵 BLUEPRINT** section of [Storybook readme.](https://pre.graphext.com/storybook/?path=/story/design-system-how-to-use--page)

## Warning:
**DO NOT USE the `%` on CSS Opacity because it breaks on Graphext build**, use instead `opacity: 0.5;` for example.
