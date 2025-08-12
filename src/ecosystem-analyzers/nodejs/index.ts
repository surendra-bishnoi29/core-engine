// core-engine/src/ecosystem-analyzers/nodejs/index.ts

import { isNodeJsProject } from './detector';
import { getNodeJsDependencies } from './dependencyExtractor';
import { EcosystemInfo, Vulnerability } from '../../shared/types';
import { pathExists, joinPath } from '../../utils/fileSystem';

import { scanNpmAudit } from '../../vulnerability-scanners/npmAuditScanner';
import { scanOsvApi } from '../../vulnerability-scanners/osvApiScanner';
import { generateNodeJsRemediation } from '../../remediation-guidance/nodeJsRemediationGenerator';
// NEW AI IMPORTS
import { summarizeVulnerabilities, generateAiRemediation } from '../../ai-enhancer/geminiEnhancer';

export async function analyzeNodeJsProject(projectPath: string): Promise<EcosystemInfo> {
  const isNode = await isNodeJsProject(projectPath);

  if (!isNode) {
    return { isSupported: false };
  }

  try {
    const dependencies = await getNodeJsDependencies(projectPath);
    // ... (logic to run npm audit and osv api scan to get collectedVulnerabilities) ...
    let collectedVulnerabilities: Vulnerability[] = [];
    const usesNpmLock = await pathExists(joinPath(projectPath, 'package-lock.json'));

    if (usesNpmLock) {
      const npmVulnerabilities = await scanNpmAudit(projectPath, dependencies);
      collectedVulnerabilities.push(...npmVulnerabilities);
    }
    if (dependencies.length > 0) {
      const osvVulnerabilities = await scanOsvApi(dependencies);
      collectedVulnerabilities.push(...osvVulnerabilities);
    }

    const uniqueVulnerabilitiesMap = new Map<string, Vulnerability>();
    for (const vuln of collectedVulnerabilities) {
      const key = `${vuln.id}-${vuln.packageName}`;
      if (!uniqueVulnerabilitiesMap.has(key)) {
        uniqueVulnerabilitiesMap.set(key, vuln);
      }
    }

    let finalVulnerabilities = Array.from(uniqueVulnerabilitiesMap.values());

    // --- AI ENHANCEMENT STEP ---
    let aiSummary: string | null = null;
    if (finalVulnerabilities.length > 0) {
        console.info('Requesting AI summary and remediation...');
        // Get the overall summary
        aiSummary = await summarizeVulnerabilities(finalVulnerabilities);

        // Get AI remediation for each vulnerability in parallel
        const remediationPromises = finalVulnerabilities.map(vuln => 
            generateAiRemediation(vuln).then(aiSteps => {
                vuln.aiRemediation = aiSteps || 'AI could not generate remediation steps.';
                return vuln;
            })
        );
        finalVulnerabilities = await Promise.all(remediationPromises);
    } else {
        aiSummary = "Scan complete. No vulnerabilities were found.";
    }
    // --- END AI ENHANCEMENT ---


    // Populate original remediation steps as a fallback
    finalVulnerabilities.forEach(vuln => {
        const affectedDependency = dependencies.find(dep => dep.name === vuln.packageName);
        if (affectedDependency) {
            vuln.remediationSteps = generateNodeJsRemediation(vuln, affectedDependency);
        }
    });

    return {
      isSupported: true,
      ecosystemName: 'nodejs',
      dependencies: dependencies,
      vulnerabilities: finalVulnerabilities,
      aiSummary: aiSummary || undefined,
    };
  } catch (error) {
    // ... (error handling)
    console.error(`Error analyzing Node.js project at ${projectPath}:`, error);
    return {
      isSupported: true,
      ecosystemName: 'nodejs',
      error: `Failed to analyze Node.js project: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
