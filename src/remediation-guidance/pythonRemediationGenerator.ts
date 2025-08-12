// core-engine/src/remediation-guidance/pythonRemediationGenerator.ts

import { Vulnerability, Dependency } from '../shared/types';

/**
 * Generates remediation steps for a given vulnerability in a Python package.
 *
 * @param vulnerability The Vulnerability object.
 * @param dependency The corresponding Dependency object from the project.
 * @returns A string containing formatted remediation steps.
 */
export function generatePythonRemediation(
  vulnerability: Vulnerability,
  dependency: Dependency
): string {
  let steps = `To remediate ${vulnerability.id} (${vulnerability.title}) in package ${vulnerability.packageName} (project version: ${dependency.version}):\n\n`;

  if (vulnerability.fixedVersions && vulnerability.fixedVersions.length > 0) {
    const targetVersion = vulnerability.fixedVersions[0].replace(/[<>=~^]/g, '');

    steps += `1. Recommended Action: Update '${vulnerability.packageName}' to a non-vulnerable version.\n`;
    steps += `   A known safe version is ${vulnerability.fixedVersions.join(' or ')}.\n\n`;
    
    steps += `2. Open your '${dependency.filePath.split('/').pop()}' file (likely requirements.txt).\n`;
    steps += `3. Find the line for "${vulnerability.packageName}". It might look like: ` +
             `'${dependency.name}==${dependency.version}' or similar.\n`;
    steps += `4. Modify it to specify a safe version, for example: ` +
             `'${dependency.name}>=${targetVersion}'.\n\n`;

    steps += `5. Save the file.\n`;
    steps += `6. Run 'pip install -r ${dependency.filePath.split('/').pop()}' or 'pip install --upgrade ${dependency.name}' in your terminal to update the package.\n`;
    steps += `7. After updating, run your project's tests to ensure compatibility.\n`;

  } else {
    steps += `No specific fixed versions were automatically identified. Please consult the advisory links for manual review.\n`;
  }

  if (vulnerability.references && vulnerability.references.length > 0) {
    steps += `\nFurther Information:\n`;
    vulnerability.references.forEach(ref => {
      steps += `- ${ref.url}\n`;
    });
  }

  return steps.trim();
}
