"use strict";
// core-engine/src/utils/commandExecutor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = executeCommand;
const child_process_1 = require("child_process"); // Using Node.js built-in child_process
/**
 * Executes a shell command and returns its output.
 *
 * @param command The command string to execute.
 * @param options Optional ExecOptions for child_process.exec, including `cwd` (current working directory).
 * @returns A Promise that resolves to a CommandResult object.
 */
async function executeCommand(command, options) {
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, options || {}, (error, stdout, stderr) => {
            resolve({
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                exitCode: error ? error.code || 1 : 0, // Provide a non-zero exit code on error
                error: error || undefined,
            });
        });
    });
}
