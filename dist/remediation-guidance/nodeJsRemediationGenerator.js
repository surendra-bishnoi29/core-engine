"use strict";
// core-engine/src/remediation-guidance/nodeJsRemediationGenerator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNodeJsRemediation = generateNodeJsRemediation;
/**
 * Generates remediation steps for a given vulnerability in a Node.js package.
 *
 * @param vulnerability The Vulnerability object.
 * @param dependency The corresponding Dependency object from the project.
 * @returns A string containing formatted remediation steps, or a default message if no specific action can be determined.
 */
function generateNodeJsRemediation(vulnerability, dependency // The actual dependency instance from the project
) {
    let steps = `To remediate ${vulnerability.id} (${vulnerability.title}) in package ${vulnerability.packageName}@${dependency.version}:\n\n`;
    if (vulnerability.fixedVersions && vulnerability.fixedVersions.length > 0) {
        // Assuming fixedVersions contains concrete versions or clear upgrade paths like ">1.2.3" or "1.2.3, 1.3.0"
        // For simplicity, let's pick the first one or suggest a general update.
        // A more sophisticated approach might check semver compatibility or present multiple options.
        const targetVersion = vulnerability.fixedVersions[0]; // This might be a range or a specific version
        steps += `1. Recommended Action: Update '${vulnerability.packageName}' to a non-vulnerable version.\n`;
        steps += `   Consider updating to version(s): ${vulnerability.fixedVersions.join(' or ')}.\n\n`;
        steps += `2. Open your 'package.json' file.\n`;
        steps += `3. Locate the line for "${vulnerability.packageName}". It might look like: ` +
            `'"${vulnerability.packageName}": "${dependency.version}"' (or a similar version range).\n`;
        steps += `4. Modify it to specify a safe version, for example: ` +
            `'"${vulnerability.packageName}": "^${targetVersion.replace(/[<>=~^]/g, '')}"'` +
            ` (Ensure this version is compatible with your project and non-vulnerable).\n`;
        steps += `   Alternatively, you can use a tool to help update: 'npm install ${vulnerability.packageName}@latest' or 'yarn upgrade ${vulnerability.packageName}'.\n\n`;
        steps += `5. Save the 'package.json' file.\n`;
        if (dependency.ecosystem === 'npm') {
            steps += `6. Run 'npm install' in your terminal to update the package and regenerate 'package-lock.json'.\n`;
        }
        else if (dependency.ecosystem === 'yarn') {
            steps += `6. Run 'yarn install' (or 'yarn upgrade ${vulnerability.packageName}') in your terminal to update the package and regenerate 'yarn.lock'.\n`;
        }
        else {
            steps += `6. Run your package manager's install/update command.\n`;
        }
        steps += `7. After updating, thoroughly test your application to ensure compatibility and that no functionality is broken.\n`;
    }
    else {
        steps += `No specific fixed versions were automatically identified for this vulnerability through this scan.\n`;
        steps += `Please consult the advisory links for manual review and mitigation steps:\n`;
    }
    if (vulnerability.references && vulnerability.references.length > 0) {
        steps += `\nFurther Information:\n`;
        vulnerability.references.forEach(ref => {
            steps += `- ${ref.url}\n`;
        });
    }
    else {
        steps += `\nNo further advisory links were automatically found. Please search for ${vulnerability.id} or ${vulnerability.packageName} for more details.\n`;
    }
    return steps.trim();
}
