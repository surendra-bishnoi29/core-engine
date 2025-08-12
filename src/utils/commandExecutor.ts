// core-engine/src/utils/commandExecutor.ts

import { exec, ExecOptions } from 'child_process'; // Using Node.js built-in child_process

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  error?: Error; // Optional error object if execution itself failed
}

/**
 * Executes a shell command and returns its output.
 *
 * @param command The command string to execute.
 * @param options Optional ExecOptions for child_process.exec, including `cwd` (current working directory).
 * @returns A Promise that resolves to a CommandResult object.
 */
export async function executeCommand(
  command: string,
  options?: ExecOptions
): Promise<CommandResult> {
  return new Promise((resolve) => {
    exec(command, options || {}, (error, stdout, stderr) => {
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: error ? error.code || 1 : 0, // Provide a non-zero exit code on error
        error: error || undefined,
      });
    });
  });
}