// core-engine/src/index.ts

import { analyzeNodeJsProject } from './ecosystem-analyzers/nodejs';
import { analyzePythonProject } from './ecosystem-analyzers/python'; // NEW: Import Python analyzer
import { EcosystemInfo } from './shared/types';

/**
 * Analyzes a project directory to detect its ecosystem(s) and extract relevant information,
 * such as dependencies.
 *
 * This function iterates through all supported ecosystem analyzers.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to an array of EcosystemInfo objects,
 * one for each detected and supported ecosystem.
 */
export async function analyzeProject(projectPath: string): Promise<EcosystemInfo[]> {
  const detectedEcosystems: EcosystemInfo[] = [];

  if (!projectPath) {
    console.error('Error: Project path was not provided to analyzeProject.');
    return [];
  }

  try {
    // We can run analyzers in parallel for efficiency
    const analysisPromises = [
      analyzeNodeJsProject(projectPath),
      analyzePythonProject(projectPath),
      // Future analyzers can be added here:
      // analyzeJavaProject(projectPath),
    ];

    const results = await Promise.all(analysisPromises);

    for (const result of results) {
      if (result.isSupported) {
        detectedEcosystems.push(result);
      }
    }

    if (detectedEcosystems.length === 0) {
      console.warn(`No supported ecosystem detected or no information extracted for project at: ${projectPath}`);
    }

  } catch (error) {
    console.error(`Critical error during project analysis for ${projectPath}:`, error);
    return [{
      isSupported: false,
      error: `Top-level analysis error: ${error instanceof Error ? error.message : String(error)}`,
    }];
  }

  return detectedEcosystems;
}

// Re-exporting types for consumers of the core-engine library (like the CLI or VS Code extension)
export type { Dependency, CVSS, Vulnerability, EcosystemInfo } from './shared/types';
