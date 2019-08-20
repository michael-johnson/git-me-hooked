import { join, normalize, resolve } from 'path';
import { writeFileSync } from 'fs';
import { env } from 'process';
import { exec } from 'shelljs';
import HookManager from './HookManager';

export default class HookVariableInitializer {
  public static initEnvVariables(repoPath: string, hookType: string, hookArguments: string[]) {
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

  protected static initPreCommitVars() {
    const stagedFilesPath = join(HookManager.getTempDirectory(), 'staged-files.json');
    writeFileSync(stagedFilesPath, HookVariableInitializer.getStagedFilesJson());

    env.GMH_STAGED_FILES = stagedFilesPath;
  }

  protected static getStagedFilesJson() {
    const rawStagedFiles = exec(
      'git diff --cached --name-only --diff-filter=ACM',
      { silent: true },
    );
    const stagedFiles = rawStagedFiles
      .slice(0, -1)
      .split('\n')
      .map(file => resolve(normalize(file)));

    return JSON.stringify(stagedFiles);
  }
}
