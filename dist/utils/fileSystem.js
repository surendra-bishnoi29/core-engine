"use strict";
// core-engine/src/utils/fileSystem.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathExists = pathExists;
exports.readFileContent = readFileContent;
exports.joinPath = joinPath;
const fs = __importStar(require("fs/promises")); // Using Node.js built-in promise-based fs
const path = __importStar(require("path"));
/**
 * Checks if a file or directory exists at the given path.
 * @param itemPath Path to the file or directory.
 * @returns True if the item exists, false otherwise.
 */
async function pathExists(itemPath) {
    try {
        await fs.access(itemPath);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Reads the content of a file.
 * @param filePath Path to the file.
 * @returns The content of the file as a string.
 * @throws Error if the file cannot be read.
 */
async function readFileContent(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    }
    catch (error) {
        // Consider using a custom error or logging with your logger.ts
        console.error(`Error reading file ${filePath}:`, error);
        throw error; // Re-throw or handle as appropriate for your error strategy
    }
}
/**
 * Joins multiple path segments into a single path.
 * Delegates to path.join.
 * @param paths An array of path segments.
 * @returns The joined path.
 */
function joinPath(...paths) {
    return path.join(...paths);
}
