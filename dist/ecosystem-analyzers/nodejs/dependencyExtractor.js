"use strict";
// core-engine/src/ecosystem-analyzers/nodejs/dependencyExtractor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeJsDependencies = getNodeJsDependencies;
const fileSystem_1 = require("../../utils/fileSystem");
const commandExecutor_1 = require("../../utils/commandExecutor"); // Import the new utility
// parsePackageJson and parsePackageLockJson helper functions remain the same
// ... (paste parsePackageJson and parsePackageLockJson here) ...
async function parsePackageJson(projectPath) {
    const packageJsonPath = (0, fileSystem_1.joinPath)(projectPath, 'package.json');
    if (await (0, fileSystem_1.pathExists)(packageJsonPath)) {
        try {
            const content = await (0, fileSystem_1.readFileContent)(packageJsonPath);
            return JSON.parse(content);
        }
        catch (error) {
            console.error(`Error parsing package.json at ${packageJsonPath}:`, error);
            return null;
        }
    }
    return null;
}
async function parsePackageLockJson(projectPath) {
    const packageLockPath = (0, fileSystem_1.joinPath)(projectPath, 'package-lock.json');
    if (await (0, fileSystem_1.pathExists)(packageLockPath)) {
        try {
            const content = await (0, fileSystem_1.readFileContent)(packageLockPath);
            return JSON.parse(content);
        }
        catch (error) {
            console.error(`Error parsing package-lock.json at ${packageLockPath}:`, error);
            return null;
        }
    }
    return null;
}
async function getNodeJsDependencies(projectPath) {
    const dependenciesMap = new Map();
    const packageJsonPath = (0, fileSystem_1.joinPath)(projectPath, 'package.json');
    const packageLockPath = (0, fileSystem_1.joinPath)(projectPath, 'package-lock.json');
    const yarnLockPath = (0, fileSystem_1.joinPath)(projectPath, 'yarn.lock');
    const parsedPackageJson = await parsePackageJson(projectPath);
    // --- Yarn Lock Logic ---
    if (await (0, fileSystem_1.pathExists)(yarnLockPath)) {
        console.info(`yarn.lock found in ${projectPath}. Attempting to use Yarn for dependency listing.`);
        const yarnCommand = 'yarn list --json --no-progress --prod'; // Gives a tree for Yarn v1
        const result = await (0, commandExecutor_1.executeCommand)(yarnCommand, { cwd: projectPath });
        if (result.exitCode === 0 && result.stdout) {
            try {
                const yarnOutput = JSON.parse(result.stdout);
                let itemsToProcess = [];
                if (yarnOutput.type === 'tree' && yarnOutput.data?.trees) {
                    itemsToProcess = yarnOutput.data.trees;
                }
                // Add more conditions here if supporting other `yarn list` output types (e.g., --flat)
                const processYarnItems = (items, isDevInitially) => {
                    for (const item of items) {
                        let nameStr = item.name; // item.name is type string
                        let versionStr = item.version; // item.version is type string | undefined
                        // Attempt to parse name and version if version is part of the name string
                        // e.g., name: "lodash@4.17.21", version: undefined
                        // or name: "@scope/pkg@1.0.0", version: undefined
                        if ((versionStr === undefined || versionStr === "") && nameStr.includes('@')) {
                            const atParts = nameStr.split('@');
                            if (nameStr.startsWith('@') && atParts.length > 2) { // Scoped package like @user/pkg@1.0.0
                                versionStr = atParts.pop(); // Last part is version
                                nameStr = atParts.join('@'); // Join the rest for name (e.g., @user/pkg)
                            }
                            else if (!nameStr.startsWith('@') && atParts.length > 1) { // Non-scoped package like pkg@1.0.0
                                versionStr = atParts.pop();
                                nameStr = atParts.join('@');
                            }
                            // If parsing didn't yield a version, versionStr remains undefined
                        }
                        // Case: nameStr is "pkg@1.2.3" AND versionStr is also "1.2.3" (redundant info)
                        // Clean up nameStr by removing the version suffix if it matches versionStr
                        else if (versionStr && versionStr !== "" && nameStr.endsWith(`@${versionStr}`)) {
                            if (nameStr.startsWith('@')) { // Scoped: @user/pkg@1.2.3
                                const expectedSuffix = `@${versionStr}`;
                                if (nameStr.endsWith(expectedSuffix)) {
                                    nameStr = nameStr.substring(0, nameStr.length - expectedSuffix.length);
                                }
                            }
                            else { // Non-scoped: pkg@1.2.3
                                const parts = nameStr.split('@');
                                if (parts.length > 1 && parts[parts.length - 1] === versionStr) {
                                    nameStr = parts.slice(0, -1).join('@');
                                }
                            }
                        }
                        if (!nameStr || nameStr === "") {
                            console.warn('Yarn: Encountered an item with no derivable name, skipping:', JSON.stringify(item));
                            continue;
                        }
                        const finalVersion = (versionStr && versionStr !== "") ? versionStr : 'unknown';
                        const depKey = `${nameStr}@${finalVersion}`;
                        let isDev = isDevInitially;
                        if (parsedPackageJson?.devDependencies?.[nameStr] && !parsedPackageJson?.dependencies?.[nameStr]) {
                            isDev = true;
                        }
                        if (!dependenciesMap.has(depKey) || (dependenciesMap.get(depKey).isDevDependency && !isDev)) {
                            dependenciesMap.set(depKey, {
                                name: nameStr,
                                version: finalVersion,
                                ecosystem: 'yarn',
                                filePath: yarnLockPath,
                                isDevDependency: isDev,
                            });
                        }
                        if (item.children) {
                            processYarnItems(item.children, isDev);
                        }
                    }
                };
                processYarnItems(itemsToProcess, false);
                if (dependenciesMap.size > 0) {
                    console.info(`Successfully extracted ${dependenciesMap.size} dependencies using Yarn.`);
                    return Array.from(dependenciesMap.values());
                }
                else {
                    console.warn(`yarn.lock found, but no dependencies extracted via 'yarn list'. Output: ${result.stdout}`);
                }
            }
            catch (parseError) {
                console.error(`Error parsing JSON output from 'yarn list' for ${projectPath}: ${parseError}. Output was: ${result.stdout.substring(0, 500)}...`);
            }
        }
        else {
            console.warn(`'yarn list' command failed or produced no output for ${projectPath}. Exit code: ${result.exitCode}, Stderr: ${result.stderr}`);
        }
    }
    // --- Package Lock (npm) Logic ---
    if (dependenciesMap.size === 0 && await (0, fileSystem_1.pathExists)(packageLockPath)) {
        const parsedPackageLock = await parsePackageLockJson(projectPath);
        if (parsedPackageLock && parsedPackageLock.packages && (parsedPackageLock.lockfileVersion >= 2)) {
            console.info(`Using package-lock.json v${parsedPackageLock.lockfileVersion} for dependencies in ${projectPath}.`);
            for (const [pkgPath, entryDetails] of Object.entries(parsedPackageLock.packages)) {
                if (!entryDetails || pkgPath === "" || !pkgPath.startsWith('node_modules/')) {
                    continue;
                }
                const depValue = entryDetails;
                if (depValue.link === true) {
                    // console.info(`Skipping linked package: ${pkgPath}`); // Can be noisy
                    continue;
                }
                let name;
                const pathWithoutNodeModules = pkgPath.substring('node_modules/'.length);
                if (pathWithoutNodeModules.startsWith('@')) {
                    const parts = pathWithoutNodeModules.split('/');
                    if (parts.length >= 2) {
                        name = `${parts[0]}/${parts[1]}`;
                    }
                }
                else {
                    name = pathWithoutNodeModules.split('/')[0];
                }
                if (!name) {
                    console.warn(`Could not determine package name from path: ${pkgPath}`);
                    continue;
                }
                const version = depValue.version;
                const isDev = depValue.dev === true || depValue.devOptional === true;
                const depKey = `${name}@${version}`;
                if (dependenciesMap.has(depKey)) {
                    const existingDep = dependenciesMap.get(depKey);
                    if (existingDep.isDevDependency && !isDev) {
                        existingDep.isDevDependency = false;
                    }
                }
                else {
                    dependenciesMap.set(depKey, {
                        name,
                        version,
                        ecosystem: 'npm',
                        filePath: packageLockPath,
                        isDevDependency: isDev,
                    });
                }
            }
        }
    }
    // --- Fallback to package.json ---
    if (dependenciesMap.size === 0 && parsedPackageJson) {
        console.warn(`Using package.json for dependencies in ${projectPath}. Lockfile preferred for accurate versions.`);
        const processDeps = (deps, isDev) => {
            if (deps) {
                for (const [name, versionRange] of Object.entries(deps)) {
                    const depKey = `${name}@${versionRange}`;
                    if (!dependenciesMap.has(depKey)) {
                        dependenciesMap.set(depKey, {
                            name,
                            version: versionRange,
                            ecosystem: 'npm',
                            filePath: packageJsonPath,
                            isDevDependency: isDev,
                        });
                    }
                }
            }
        };
        processDeps(parsedPackageJson.dependencies, false);
        processDeps(parsedPackageJson.devDependencies, true);
    }
    return Array.from(dependenciesMap.values());
}
