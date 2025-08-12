/**
 * Checks if a file or directory exists at the given path.
 * @param itemPath Path to the file or directory.
 * @returns True if the item exists, false otherwise.
 */
export declare function pathExists(itemPath: string): Promise<boolean>;
/**
 * Reads the content of a file.
 * @param filePath Path to the file.
 * @returns The content of the file as a string.
 * @throws Error if the file cannot be read.
 */
export declare function readFileContent(filePath: string): Promise<string>;
/**
 * Joins multiple path segments into a single path.
 * Delegates to path.join.
 * @param paths An array of path segments.
 * @returns The joined path.
 */
export declare function joinPath(...paths: string[]): string;
