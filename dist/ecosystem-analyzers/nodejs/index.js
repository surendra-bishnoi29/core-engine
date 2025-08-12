"use strict";
// core-engine/src/ecosystem-analyzers/nodejs/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNodeJsProject = analyzeNodeJsProject;
const detector_1 = require("./detector");
const dependencyExtractor_1 = require("./dependencyExtractor");
const fileSystem_1 = require("../../utils/fileSystem");
const npmAuditScanner_1 = require("../../vulnerability-scanners/npmAuditScanner");
const osvApiScanner_1 = require("../../vulnerability-scanners/osvApiScanner");
const nodeJsRemediationGenerator_1 = require("../../remediation-guidance/nodeJsRemediationGenerator");
// NEW AI IMPORTS
const geminiEnhancer_1 = require("../../ai-enhancer/geminiEnhancer");
async function analyzeNodeJsProject(projectPath) {
    const isNode = await (0, detector_1.isNodeJsProject)(projectPath);
    if (!isNode) {
        return { isSupported: false };
    }
    try {
        const dependencies = await (0, dependencyExtractor_1.getNodeJsDependencies)(projectPath);
        // ... (logic to run npm audit and osv api scan to get collectedVulnerabilities) ...
        let collectedVulnerabilities = [];
        const usesNpmLock = await (0, fileSystem_1.pathExists)((0, fileSystem_1.joinPath)(projectPath, 'package-lock.json'));
        if (usesNpmLock) {
            const npmVulnerabilities = await (0, npmAuditScanner_1.scanNpmAudit)(projectPath, dependencies);
            collectedVulnerabilities.push(...npmVulnerabilities);
        }
        if (dependencies.length > 0) {
            const osvVulnerabilities = await (0, osvApiScanner_1.scanOsvApi)(dependencies);
            collectedVulnerabilities.push(...osvVulnerabilities);
        }
        const uniqueVulnerabilitiesMap = new Map();
        for (const vuln of collectedVulnerabilities) {
            const key = `${vuln.id}-${vuln.packageName}`;
            if (!uniqueVulnerabilitiesMap.has(key)) {
                uniqueVulnerabilitiesMap.set(key, vuln);
            }
        }
        let finalVulnerabilities = Array.from(uniqueVulnerabilitiesMap.values());
        // --- AI ENHANCEMENT STEP ---
        let aiSummary = null;
        if (finalVulnerabilities.length > 0) {
            console.info('Requesting AI summary and remediation...');
            // Get the overall summary
            aiSummary = await (0, geminiEnhancer_1.summarizeVulnerabilities)(finalVulnerabilities);
            // Get AI remediation for each vulnerability in parallel
            const remediationPromises = finalVulnerabilities.map(vuln => (0, geminiEnhancer_1.generateAiRemediation)(vuln).then(aiSteps => {
                vuln.aiRemediation = aiSteps || 'AI could not generate remediation steps.';
                return vuln;
            }));
            finalVulnerabilities = await Promise.all(remediationPromises);
        }
        else {
            aiSummary = "Scan complete. No vulnerabilities were found.";
        }
        // --- END AI ENHANCEMENT ---
        // Populate original remediation steps as a fallback
        finalVulnerabilities.forEach(vuln => {
            const affectedDependency = dependencies.find(dep => dep.name === vuln.packageName);
            if (affectedDependency) {
                vuln.remediationSteps = (0, nodeJsRemediationGenerator_1.generateNodeJsRemediation)(vuln, affectedDependency);
            }
        });
        return {
            isSupported: true,
            ecosystemName: 'nodejs',
            dependencies: dependencies,
            vulnerabilities: finalVulnerabilities,
            aiSummary: aiSummary || undefined,
        };
    }
    catch (error) {
        // ... (error handling)
        console.error(`Error analyzing Node.js project at ${projectPath}:`, error);
        return {
            isSupported: true,
            ecosystemName: 'nodejs',
            error: `Failed to analyze Node.js project: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}
