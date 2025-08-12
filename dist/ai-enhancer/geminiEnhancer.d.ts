import { Vulnerability } from '../shared/types';
export declare function summarizeVulnerabilities(vulnerabilities: Vulnerability[]): Promise<string | null>;
export declare function generateAiRemediation(vulnerability: Vulnerability): Promise<string | null>;
