// core-engine/src/ecosystem-analyzers/python/index.ts

import { isPythonProject } from './detector';
import { getPythonDependencies } from './dependencyExtractor';
import { EcosystemInfo } from '../../shared/types';

/**
 * Analyzes a given project directory for Python specific information.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to an EcosystemInfo object containing
 * Python project details and its dependencies.
 */
export async function analyzePythonProject(projectPath: string): Promise<EcosystemInfo> {
  const isPython = await isPythonProject(projectPath);

  if (!isPython) {
    return {
      isSupported: false,
    };
  }

  try {
    const dependencies = await getPythonDependencies(projectPath);
    return {
      isSupported: true,
      ecosystemName: 'python',
      dependencies: dependencies,
    };
  } catch (error) {
    console.error(`Error analyzing Python project at ${projectPath}:`, error);
    return {
      isSupported: true, // It was detected as Python, but analysis failed
      ecosystemName: 'python',
      error: `Failed to extract Python dependencies: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
