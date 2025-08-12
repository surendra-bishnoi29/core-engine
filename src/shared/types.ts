// core-engine/src/shared/types.ts

export interface Dependency {
  name: string; // This will now be correctly populated
  version: string;
  ecosystem: 'npm' | 'yarn';
  filePath: string; // Path to the manifest file (e.g., package.json, package-lock.json)
  isDevDependency?: boolean;
}

export interface CVSS {
  score: number;
  vectorString: string;
  version: '2.0' | '3.0' | '3.1';
}

export interface Vulnerability {
  id: string;
  packageName: string;
  packageVersion: string;
  title: string;
  description: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';
  cvss?: CVSS;
  affectedVersions: string[];
  fixedVersions?: string[];
  references: Array<{ type?: string; url: string }>;
  remediationSteps?: string;
  aiRemediation?: string;
}

export interface EcosystemInfo {
  isSupported: boolean;
  ecosystemName?: 'nodejs' | 'python' | string;
  dependencies?: Dependency[];
  vulnerabilities?: Vulnerability[];
  aiSummary?: string; 
  error?: string;
}
