import { ExecOptions } from 'child_process';
export interface CommandResult {
    stdout: string;
    stderr: string;
    exitCode: number | null;
    error?: Error;
}
/**
 * Executes a shell command and returns its output.
 *
 * @param command The command string to execute.
 * @param options Optional ExecOptions for child_process.exec, including `cwd` (current working directory).
 * @returns A Promise that resolves to a CommandResult object.
 */
export declare function executeCommand(command: string, options?: ExecOptions): Promise<CommandResult>;
