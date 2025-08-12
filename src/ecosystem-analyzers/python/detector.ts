// core-engine/src/ecosystem-analyzers/python/detector.ts

import { pathExists, joinPath } from '../../utils/fileSystem';

/**
 * Determines if the given directory path represents a Python project.
 * It checks for the presence of common Python dependency management files.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to true if it's a Python project, false otherwise.
 */
export async function isPythonProject(projectPath: string): Promise<boolean> {
  if (!projectPath) {
    console.warn('Project path is not provided to isPythonProject detector.');
    return false;
  }

  // List of common Python project indicator files
  const indicatorFiles = [
    'requirements.txt',
    'Pipfile',            // For Pipenv
    'pyproject.toml',     // For Poetry, modern pip, etc.
    'setup.py'            // For older setuptools projects
  ];

  // Check if any of the indicator files exist in the project root
  for (const file of indicatorFiles) {
    const filePath = joinPath(projectPath, file);
    if (await pathExists(filePath)) {
      console.info(`Python project detected based on presence of: ${file}`);
      return true; // Found a Python file, no need to check further
    }
  }

  return false;
}
