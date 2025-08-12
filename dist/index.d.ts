import { EcosystemInfo } from './shared/types';
/**
 * Analyzes a project directory to detect its ecosystem(s) and extract relevant information,
 * such as dependencies.
 *
 * In the future, this function will iterate through all supported ecosystem analyzers.
 * For now, it primarily focuses on Node.js.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to an array of EcosystemInfo objects,
 * one for each detected and supported ecosystem.
 * Returns an empty array if no supported ecosystem is detected or an error occurs at this top level.
 */
export declare function analyzeProject(projectPath: string): Promise<EcosystemInfo[]>;
export type { Dependency, CVSS, Vulnerability, EcosystemInfo } from './shared/types';
