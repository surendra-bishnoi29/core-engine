"use strict";
// core-engine/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeProject = analyzeProject;
const nodejs_1 = require("./ecosystem-analyzers/nodejs"); // Assuming this is the correct export path
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
async function analyzeProject(projectPath) {
    const detectedEcosystems = [];
    if (!projectPath) {
        console.error('Error: Project path was not provided to analyzeProject.');
        // Optionally, return an EcosystemInfo with an error
        // return [{ isSupported: false, error: 'Project path not provided' }];
        return [];
    }
    try {
        // --- Node.js Analysis ---
        // In a multi-ecosystem setup, we might check if it's even worth calling analyzeNodeJsProject
        // if a primary ecosystem has already been strongly identified, or run them in parallel.
        // For now, we'll call it directly.
        const nodeJsInfo = await (0, nodejs_1.analyzeNodeJsProject)(projectPath);
        if (nodeJsInfo.isSupported) {
            detectedEcosystems.push(nodeJsInfo);
        }
        // --- Placeholder for Python Analysis (Future) ---
        // if (someConditionToRunPythonAnalysis || !nodeJsInfo.isSupported) {
        //   const pythonInfo = await analyzePythonProject(projectPath);
        //   if (pythonInfo.isSupported) {
        //     detectedEcosystems.push(pythonInfo);
        //   }
        // }
        // --- Placeholder for other ecosystem analyses ---
        if (detectedEcosystems.length === 0) {
            console.warn(`No supported ecosystem detected or no information extracted for project at: ${projectPath}`);
            // Optionally, return a specific "not supported" EcosystemInfo
            // detectedEcosystems.push({ isSupported: false, error: 'No supported ecosystem found or anaylzed.' });
        }
    }
    catch (error) {
        console.error(`Critical error during project analysis for ${projectPath}:`, error);
        // Return an EcosystemInfo with the top-level error
        // This might indicate a problem with the orchestrator itself or an unhandled exception from an analyzer
        return [{
                isSupported: false, // Indicates analysis failed at a high level
                error: `Top-level analysis error: ${error instanceof Error ? error.message : String(error)}`,
            }];
    }
    return detectedEcosystems;
}
// Potentially, you might want other top-level exports from your core engine later
// export * from './shared/types'; // If you want to re-export types
