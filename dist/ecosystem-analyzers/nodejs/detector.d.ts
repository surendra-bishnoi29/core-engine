/**
 * Determines if the given directory path represents a Node.js project.
 * It checks for the presence of a 'package.json' file in the root of the directory.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to true if it's a Node.js project, false otherwise.
 */
export declare function isNodeJsProject(projectPath: string): Promise<boolean>;
