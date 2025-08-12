# Core Engine - Vulnerability Scanner & Analyzer

A powerful, extensible core engine for detecting vulnerabilities in software projects across multiple programming ecosystems. Built with TypeScript, it provides comprehensive dependency analysis, vulnerability scanning, and AI-enhanced remediation guidance.

## 🚀 Features

- **Multi-Ecosystem Support**: Currently supports Node.js and Python projects with extensible architecture
- **Comprehensive Vulnerability Scanning**: 
  - NPM audit integration for Node.js projects
  - OSV (Open Source Vulnerabilities) API scanning
  - Cross-reference vulnerability data for accuracy
- **AI-Enhanced Analysis**: 
  - Gemini AI integration for vulnerability summarization
  - Intelligent remediation guidance generation
  - Context-aware security recommendations
- **Dependency Analysis**: 
  - Automatic ecosystem detection
  - Dependency tree extraction
  - Version compatibility analysis
- **Remediation Guidance**: 
  - Automated fix suggestions
  - Version upgrade recommendations
  - Breaking change warnings

## 🏗️ Architecture

The core engine is built with a modular, extensible architecture:

```
src/
├── ecosystem-analyzers/     # Ecosystem-specific analyzers
│   ├── nodejs/             # Node.js project analysis
│   └── python/             # Python project analysis
├── vulnerability-scanners/  # Vulnerability detection engines
│   ├── npmAuditScanner.ts  # NPM audit integration
│   └── osvApiScanner.ts    # OSV API integration
├── ai-enhancer/            # AI-powered analysis
│   └── geminiEnhancer.ts   # Gemini AI integration
├── remediation-guidance/   # Fix generation
│   ├── nodeJsRemediationGenerator.ts
│   └── pythonRemediationGenerator.ts
├── shared/                 # Common types and interfaces
│   └── types.ts           # Core data structures
└── utils/                  # Utility functions
    ├── commandExecutor.ts  # Command execution
    ├── fileSystem.ts       # File system operations
    └── logger.ts          # Logging utilities
```

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd core-engine

# Install dependencies
npm install

# Build the project
npm run build
```

## 🔧 Usage

### Basic Usage

```typescript
import { analyzeProject } from 'core-engine';

// Analyze a project directory
const projectPath = '/path/to/your/project';
const ecosystems = await analyzeProject(projectPath);

// Process results
for (const ecosystem of ecosystems) {
  if (ecosystem.isSupported) {
    console.log(`Ecosystem: ${ecosystem.ecosystemName}`);
    console.log(`Dependencies: ${ecosystem.dependencies?.length || 0}`);
    console.log(`Vulnerabilities: ${ecosystem.vulnerabilities?.length || 0}`);
    
    if (ecosystem.aiSummary) {
      console.log(`AI Summary: ${ecosystem.aiSummary}`);
    }
  }
}
```

### Supported Ecosystems

#### Node.js Projects
- Detects `package.json` and `package-lock.json`
- Runs `npm audit` for vulnerability scanning
- Extracts dependency information
- Generates Node.js specific remediation steps

#### Python Projects
- Detects `requirements.txt`, `pyproject.toml`, and `Pipfile`
- Scans dependencies via OSV API
- Provides Python-specific security guidance

## 🔍 API Reference

### Core Functions

#### `analyzeProject(projectPath: string): Promise<EcosystemInfo[]>`

Analyzes a project directory and returns information about detected ecosystems.

**Parameters:**
- `projectPath`: Absolute path to the project directory

**Returns:** Promise resolving to an array of `EcosystemInfo` objects

### Data Structures

#### `EcosystemInfo`
```typescript
interface EcosystemInfo {
  isSupported: boolean;
  ecosystemName?: 'nodejs' | 'python' | string;
  dependencies?: Dependency[];
  vulnerabilities?: Vulnerability[];
  aiSummary?: string;
  error?: string;
}
```

#### `Vulnerability`
```typescript
interface Vulnerability {
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
```

## 🤖 AI Integration

The core engine integrates with Google's Gemini AI to provide:

- **Vulnerability Summarization**: High-level security posture assessment
- **Intelligent Remediation**: Context-aware fix suggestions
- **Risk Assessment**: Severity-based prioritization

### AI Features

- Automatic vulnerability summarization
- Personalized remediation steps
- Breaking change warnings
- Test suite recommendations

## 🔒 Security Features

- **Comprehensive Scanning**: Multiple vulnerability databases
- **Real-time Updates**: OSV API integration for latest threats
- **False Positive Reduction**: Cross-reference validation
- **Secure API Handling**: Environment-based configuration

## 🚧 Development

### Prerequisites
- Node.js 18+
- TypeScript 5.8+
- npm or yarn

### Development Commands

```bash
# Build the project
npm run build

# Watch for changes
npm run build -- --watch

# Run tests (when implemented)
npm test
```

### Adding New Ecosystems

To add support for a new programming ecosystem:

1. Create a new directory in `ecosystem-analyzers/`
2. Implement the required interfaces:
   - `detector.ts` - Ecosystem detection logic
   - `dependencyExtractor.ts` - Dependency parsing
   - `index.ts` - Main analysis function
3. Add the analyzer to the main `analyzeProject` function
4. Update types and documentation

### Adding New Vulnerability Scanners

1. Create a new scanner in `vulnerability-scanners/`
2. Implement the scanning logic
3. Integrate with the ecosystem analyzers
4. Update the vulnerability collection pipeline

## 📋 Requirements

- **Node.js**: 18.0.0 or higher
- **TypeScript**: 5.8.0 or higher
- **Dependencies**: See `package.json` for complete list

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

## 🔮 Roadmap

- [ ] Java ecosystem support
- [ ] Go ecosystem support
- [ ] Enhanced AI capabilities
- [ ] Real-time monitoring
- [ ] CI/CD integration
- [ ] Performance optimizations
- [ ] Additional vulnerability databases

---

**Note**: This is a core engine library. For end-user applications, consider building CLI tools, VS Code extensions, or web interfaces on top of this foundation.
