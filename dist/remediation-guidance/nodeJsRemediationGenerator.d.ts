import { Vulnerability, Dependency } from '../shared/types';
/**
 * Generates remediation steps for a given vulnerability in a Node.js package.
 *
 * @param vulnerability The Vulnerability object.
 * @param dependency The corresponding Dependency object from the project.
 * @returns A string containing formatted remediation steps, or a default message if no specific action can be determined.
 */
export declare function generateNodeJsRemediation(vulnerability: Vulnerability, dependency: Dependency): string;
