// core-engine/src/ai-enhancer/geminiEnhancer.ts

import { Vulnerability } from '../shared/types';

// IMPORTANT: In a real application, get this from a secure configuration
// (e.g., VS Code settings/secrets, environment variables).
// An empty key will work in some environments where it's provided automatically.
const API_KEY = "AIzaSyAFZtQ_kgkj1Hz8bmoc-y8frZs5ajOOFd8"; // LEAVE THIS AS-IS

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function callGeminiApi(prompt: string): Promise<string | null> {
    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        // Optional: Add safety settings and generation config if needed
        // generationConfig: { "temperature": 0.2 }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Gemini API Error: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error('Error Body:', errorBody);
            return null;
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini API Error: Invalid response structure", result);
            return null;
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
}

export async function summarizeVulnerabilities(vulnerabilities: Vulnerability[]): Promise<string | null> {
    if (!vulnerabilities || vulnerabilities.length === 0) {
        return "No vulnerabilities found. The project appears to be secure from known dependency issues.";
    }

    const prompt = `
        You are an expert cybersecurity analyst providing a high-level summary of a project's security posture based on a dependency scan.
        The summary should:
        1. Start with an overall assessment (e.g., 'critical', 'poor', 'needs attention').
        2. Mention the total number of vulnerabilities and the count of each severity level.
        3. Highlight the most critical vulnerability by name and explain its potential impact in one sentence.
        
        Here is the JSON data of vulnerabilities found:
        ${JSON.stringify(vulnerabilities, null, 2)}
        
        Provide only the summary text, formatted in clear paragraphs.
    `;

    return await callGeminiApi(prompt);
}

export async function generateAiRemediation(vulnerability: Vulnerability): Promise<string | null> {
    const prompt = `
        You are an expert software developer providing remediation advice for a Node.js project. You will be given a JSON object describing a single vulnerability.
        
        Your task is to provide clear, actionable, and safe remediation steps formatted as a Markdown list.
        The steps should:
        1. Prioritize updating to a non-vulnerable version, suggesting a specific version or range from the "fixedVersions" if available.
        2. Include the exact command to run (e.g., \`npm install ${vulnerability.packageName}@latest\` or a more specific version).
        3. Warn the user about potential breaking changes if it's a major version update.
        4. Advise the user to run their project's test suite after updating.
        
        Here is the vulnerability data:
        ${JSON.stringify(vulnerability, null, 2)}
        
        Provide only the step-by-step remediation advice as a Markdown-formatted list.
    `;
    
    return await callGeminiApi(prompt);
}
