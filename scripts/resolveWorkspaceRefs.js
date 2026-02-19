#!/usr/bin/env node
/**
 * Resolves workspace: and catalog: references in package.json dependencies
 * to actual versions from the monorepo. Run before npm publish.
 *
 * - workspace:^ / workspace:~ / workspace:* → resolved from monorepo package versions
 * - catalog: → resolved from pnpm-workspace.yaml catalog definitions
 */
const fs = require('fs');
const path = require('path');
const yaml = require ? null : null; // we parse yaml manually below

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
const dirs = fs.readdirSync(packagesDir);

// Parse catalog from pnpm-workspace.yaml
const catalog = {};
const workspaceYaml = fs.readFileSync(path.join(rootDir, 'pnpm-workspace.yaml'), 'utf8');
const catalogMatch = workspaceYaml.match(/^catalog:\n((?:  .+\n)*)/m);
if (catalogMatch) {
    for (const line of catalogMatch[1].split('\n')) {
        const m = line.match(/^\s+(?:"([^"]+)"|([^:]+)):\s*(.+)/);
        if (m) {
            const name = m[1] || m[2];
            const value = m[3].replace(/#.*$/, '').trim().replace(/^"(.*)"$/, '$1');
            if (value && !value.startsWith('#')) {
                catalog[name] = value;
            }
        }
    }
}
console.log('Loaded catalog entries:', Object.keys(catalog).length);

// Collect all package versions
const versions = {};
for (const dir of dirs) {
    const pkgPath = path.join(packagesDir, dir, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    versions[pkg.name] = pkg.version;
}

// Resolve workspace: and catalog: references
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
            } else if (typeof value === 'string' && value === 'catalog:') {
                if (catalog[name]) {
                    pkg[section][name] = catalog[name];
                    changed = true;
                } else {
                    console.warn('WARNING: No catalog entry for', name, 'in', dir);
                }
            }
        }
    }

    if (changed) {
        const indent = raw.match(/^\{\n(\s+)/);
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, indent ? indent[1].length : 4) + '\n');
        console.log('Resolved refs in', dir);
    }
}
