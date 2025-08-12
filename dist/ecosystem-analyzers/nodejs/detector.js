"use strict";
// core-engine/src/ecosystem-analyzers/nodejs/detector.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeJsProject = isNodeJsProject;
const fileSystem_1 = require("../../utils/fileSystem"); // Corrected path assuming utils is at ../../utils
/**
 * Determines if the given directory path represents a Node.js project.
 * It checks for the presence of a 'package.json' file in the root of the directory.
 *
 * @param projectPath The absolute path to the project directory.
 * @returns A Promise that resolves to true if it's a Node.js project, false otherwise.
 */
async function isNodeJsProject(projectPath) {
    if (!projectPath) {
        // Or throw an error, or use your logger
        console.warn('Project path is not provided to isNodeJsProject detector.');
        return false;
    }
    const packageJsonPath = (0, fileSystem_1.joinPath)(projectPath, 'package.json');
    const exists = await (0, fileSystem_1.pathExists)(packageJsonPath);
    // You might want to add more sophisticated checks later,
    // e.g., validating if package.json is valid JSON, but for detection, existence is often enough.
    return exists;
}
