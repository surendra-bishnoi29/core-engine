// core-engine/src/utils/fileSystem.ts

import * as fs from 'fs/promises'; // Using Node.js built-in promise-based fs
import * as path from 'path';

/**
 * Checks if a file or directory exists at the given path.
 * @param itemPath Path to the file or directory.
 * @returns True if the item exists, false otherwise.
 */
export async function pathExists(itemPath: string): Promise<boolean> {
  try {
    await fs.access(itemPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the content of a file.
 * @param filePath Path to the file.
 * @returns The content of the file as a string.
 * @throws Error if the file cannot be read.
 */
export async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
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
export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}