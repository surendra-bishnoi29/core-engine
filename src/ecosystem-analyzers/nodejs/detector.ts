// core-engine/src/ecosystem-analyzers/nodejs/detector.ts

import { pathExists, joinPath } from '../../utils/fileSystem'; // Corrected path assuming utils is at ../../utils

/**
 * Determines if the given directory path represents a Node.js project.
 * It checks for the presence of a 'package.json' file in the root of the directory.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to true if it's a Node.js project, false otherwise.
 */
export async function isNodeJsProject(projectPath: string): Promise<boolean> {
  if (!projectPath) {
    // Or throw an error, or use your logger
    console.warn('Project path is not provided to isNodeJsProject detector.');
    return false;
  }

  const packageJsonPath = joinPath(projectPath, 'package.json');
  const exists = await pathExists(packageJsonPath);

  // You might want to add more sophisticated checks later,
  // e.g., validating if package.json is valid JSON, but for detection, existence is often enough.

  return exists;
}