/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-check

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { iconResourcesDir } from "./common.mjs";
import { optimizeSvg } from "./iconSvgoConfig.mjs";

/** Generated paths/ directories that ship BP6.8-shaped path data (restored manually). */
const generatedPathsDir16 = resolve(import.meta.dirname, "../src/generated/16px/paths");
const generatedPathsDir20 = resolve(import.meta.dirname, "../src/generated/20px/paths");

/**
 * Extracts path `d` strings for an icon. Prefers the pre-generated `paths/<name>.ts`
 * modules if present (which contain BP6.8-shaped path data restored from the BP6.8
 * fork to preserve byte-identical SVG output), and falls back to running SVGO on the
 * resource SVG otherwise.
 *
 * @param {16 | 20} iconSize
 * @param {string} iconName
 * @returns {Promise<string[]>}
 */
export async function extractPathsFromResourceSvg(iconSize, iconName) {
    const pathsDir = iconSize === 16 ? generatedPathsDir16 : generatedPathsDir20;
    const pathsModulePath = join(pathsDir, `${iconName}.ts`);
    if (existsSync(pathsModulePath)) {
        const moduleSrc = readFileSync(pathsModulePath, "utf-8");
        const arrayMatch = moduleSrc.match(/export default\s*(\[[\s\S]*?\])\s*;/);
        if (arrayMatch != null) {
            return JSON.parse(arrayMatch[1]);
        }
    }
    const path = join(iconResourcesDir, `${iconSize}px`, `${iconName}.svg`);
    const source = readFileSync(path, "utf-8");
    const optimized = optimizeSvg(source, path);
    /** @type string[] */
    const paths = [];
    const re = /<path[^>]*\sd="([^"]+)"/g;
    let m;
    while ((m = re.exec(optimized)) !== null) {
        paths.push(m[1]);
    }
    return paths;
}
