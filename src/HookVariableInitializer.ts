import { join, normalize, resolve } from 'path';
import { writeFileSync } from 'fs';
import { env } from 'process';
import { exec } from 'shelljs';
import TempDirectory from './TempDirectory';

export default class HookVariableInitializer {
  public static initEnvVariables(repoPath: string, hookType: string, hookArguments: string[]) {
    env.GMH_RUNNING = 'true';
    env.GMH_REPO_DIRECTORY = repoPath;
    env.GMH_GIT_ARGUMENTS = hookArguments.join(' ');

    switch (hookType) {
      case 'pre-commit':
        HookVariableInitializer.initPreCommitVars();
        break;
      default:
        break;
    }
  }

  public static initScriptConfig(command: Command) {
    const commandConfigPath = join(TempDirectory.getPath(), 'command-config.json');
    writeFileSync(commandConfigPath, JSON.stringify(command.config || {}));

    env.GMH_SCRIPT_CONFIG_PATH = commandConfigPath;
  }

  protected static initPreCommitVars() {
    const stagedFilesPath = join(TempDirectory.getPath(), 'staged-files.json');
    writeFileSync(stagedFilesPath, HookVariableInitializer.getStagedFilesJson());

    env.GMH_STAGED_FILES = stagedFilesPath;
  }

  protected static getStagedFilesJson() {
    const rawStagedFiles = exec(
      'git diff --cached --name-only --diff-filter=ACM',
      { silent: true },
    );
    if (rawStagedFiles.length > 0) {
      const stagedFiles = rawStagedFiles
        .slice(0, -1)
        .split('\n')
        .map(file => resolve(normalize(file)));

      return JSON.stringify(stagedFiles);
    }

    return JSON.stringify([]);
  }
}
