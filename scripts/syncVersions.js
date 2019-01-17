#!/usr/bin/env node
const fs = require('fs');

// The master file of versions
const masterFile = 'graphext-versions.json';


const dirs = fs.readdirSync("packages/");

const packagesNames = [];
const paths = {};

// All the packages.json by package name
const packages = {};

// Get all configs
for (const fileName of dirs) {
    const packagePath = `packages/${fileName}/package.json`;
    if (fs.existsSync(packagePath)) {
        const config = JSON.parse(fs.readFileSync(packagePath));
        packages[config.name] = config;
        paths[config.name] = packagePath;
        packagesNames.push(config.name);
    }
}

// Read the master file of versions
const masterVersions = JSON.parse(fs.readFileSync(masterFile));
const pinedPackages = Object.keys(masterVersions);
const dependants = {};

// Pin all dependencies to the version of previous packages
for (const name of packagesNames) {
    const {dependencies = {}} = packages[name];
    for (const pined of pinedPackages) {
        if (pined === name) {
            packages[name].version = masterVersions[pined];
        }
        if (pined in dependencies) {
            dependencies[pined] = masterVersions[pined];
            if (name in masterVersions) {
                dependants[pined] = Object.assign(dependants[pined] || {}, {[name]: true});
            }
        }
    }
    fs.writeFileSync(paths[name], JSON.stringify(packages[name], null, 2)+'\n');
}

promptRemember(dependants);
console.log("Sync versions: Done");
// ---------------------------------------------------------------------------

/**
 * Write 'graphext-versions.json' from all package.json
 */
function recreateGraphextVersions() {
    const versions = {};
    for (const name of packagesNames) {
        const { version } = packages[name];
        versions[name] = version;
    }
    fs.writeFileSync(masterFile, JSON.stringify(versions, null, 2));
}

/**
 * Prompt a remember of the transitive dependencies of pined packages
 */
function promptRemember(dependants) {
    function promptSons(father) {
        for (const son in dependants[father]) {
            console.log(`\t- ${son}`);
            promptSons(son);
        }
    }

    for (const father in dependants) {
        console.log(`If you updated "${father}" remember to update:`);
        promptSons(father);
        console.log('\n');
    }
}
