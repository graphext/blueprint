#!/usr/bin/env node
/**
 * Resolves workspace:^ references in package.json dependencies
 * to actual versions from the monorepo. Run before npm publish.
 */
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const dirs = fs.readdirSync(packagesDir);

// Collect all package versions
const versions = {};
for (const dir of dirs) {
    const pkgPath = path.join(packagesDir, dir, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    versions[pkg.name] = pkg.version;
}

// Resolve workspace: references
for (const dir of dirs) {
    const pkgPath = path.join(packagesDir, dir, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const raw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    let changed = false;

    for (const section of ['dependencies', 'peerDependencies']) {
        if (!pkg[section]) continue;
        for (const [name, value] of Object.entries(pkg[section])) {
            if (typeof value === 'string' && value.startsWith('workspace:')) {
                const range = value.slice('workspace:'.length);
                if (range === '^' || range === '~') {
                    pkg[section][name] = range + versions[name];
                } else if (range === '*') {
                    pkg[section][name] = versions[name];
                }
                changed = true;
            }
        }
    }

    if (changed) {
        const indent = raw.match(/^\{\n(\s+)/);
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, indent ? indent[1].length : 4) + '\n');
        console.log('Resolved workspace refs in', dir);
    }
}
