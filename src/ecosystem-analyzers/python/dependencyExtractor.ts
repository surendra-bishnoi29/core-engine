// core-engine/src/ecosystem-analyzers/python/dependencyExtractor.ts

import { Dependency } from '../../shared/types';
import { pathExists, readFileContent, joinPath } from '../../utils/fileSystem';

/**
 * Parses a requirements.txt file to extract dependencies.
 * This is a simplified parser and may not handle all edge cases like
 * editable installs (-e), hashes, or complex version specifiers perfectly.
 * * @param projectPath The absolute path to the project directory.
 * @param filePath The full path to the requirements.txt file.
 * @returns A Promise that resolves to an array of Dependency objects.
 */
async function parseRequirementsTxt(projectPath: string, filePath: string): Promise<Dependency[]> {
    const dependencies: Dependency[] = [];
    const content = await readFileContent(filePath);
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        // Trim whitespace and skip empty lines or comments
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            continue;
        }

        // Skip lines that are references to other files or special pip commands
        if (trimmedLine.startsWith('-r') || trimmedLine.startsWith('-e') || trimmedLine.startsWith('-c') || trimmedLine.startsWith('--')) {
            // A more advanced parser could recursively parse referenced files (-r)
            // or handle editable installs (-e)
            continue;
        }

        // Regex to separate package name from version specifier
        // Handles specifiers like ==, >=, <=, ~=, <, >
        // Example: "requests==2.25.1", "django>=3.2", "numpy"
        const match = trimmedLine.match(/^([a-zA-Z0-9_.-]+)(.*)/);
        if (match) {
            const name = match[1];
            // The rest of the line is the version specifier, which can be complex.
            // For vulnerability scanning, we often just need the package name and can let
            // the scanner handle version resolution, or we can extract a specific version if available.
            // Let's extract the version if it's pinned (==).
            let version = match[2].trim().replace(/==/g, '').trim() || 'latest'; // Default to 'latest' if no version specified
            
            // A simple cleanup for specifiers like '>=3.2', we'll take '3.2' for now.
            // A better scanner might handle the range.
            version = version.replace(/[<>=~]/g, '').trim();


            dependencies.push({
                name: name,
                version: version,
                ecosystem: 'PyPI' as any, // This should be added to the Dependency type
                filePath: filePath,
                isDevDependency: false // requirements.txt doesn't have a standard way to distinguish dev
            });
        }
    }
    return dependencies;
}

/**
 * Extracts dependencies for a Python project.
 * It currently prioritizes parsing `requirements.txt`.
 * * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to an array of Dependency objects.
 */
export async function getPythonDependencies(projectPath: string): Promise<Dependency[]> {
    // We can add support for Pipfile, pyproject.toml etc. here later.
    // Let's start with requirements.txt.
    const requirementsPath = joinPath(projectPath, 'requirements.txt');

    if (await pathExists(requirementsPath)) {
        console.info(`Found requirements.txt, parsing dependencies...`);
        return parseRequirementsTxt(projectPath, requirementsPath);
    }
    
    // Placeholder for other file types
    // if (await pathExists(joinPath(projectPath, 'pyproject.toml'))) { ... }
    
    console.warn(`No supported dependency file (e.g., requirements.txt) found for Python project at ${projectPath}.`);
    return [];
}
