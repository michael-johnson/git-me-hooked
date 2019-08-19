import { join, normalize, resolve } from 'path';
import { writeFileSync } from 'fs';
import { env } from 'process';
import { exec } from 'shelljs';
import HookManager from './HookManager';

export default class HookVariableInitializer {
  public static initEnvVariables(repoPath: string, hookType: string) {
    switch (hookType) {
      case 'pre-commit':
        HookVariableInitializer.initPreCommitVars(repoPath);
        break;
      default:
        break;
    }
  }

  protected static initPreCommitVars(repoPath: string) {
    const stagedFilesPath = join(HookManager.getTempDirectory(), 'staged-files.json');
    writeFileSync(stagedFilesPath, HookVariableInitializer.getStagedFilesJson());

    env.GMH_STAGED_FILES = stagedFilesPath;
    env.GMH_REPO_DIRECTORY = repoPath;
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
