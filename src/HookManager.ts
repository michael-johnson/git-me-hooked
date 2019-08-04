import {
  existsSync,
  copyFileSync,
  renameSync,
  unlinkSync,
} from 'fs';
import { normalize, join, resolve } from 'path';

export default class HookManager {
  protected static hookTypes = [
    'pre-commit',
  ];

  public static init(repoPath: string): void {
    const path = normalize(repoPath);
    if (existsSync(path) && HookManager.isGitRepo(path)) {
      HookManager.install(path);
    } else {
      console.log('The given directory is not a git repository.');
    }
  }

  public static uninit(repoPath: string): void {
    console.log('hit uninit fxn');
    const path = normalize(repoPath);
    if (existsSync(path) && existsSync(join(path, 'git-me-hooked.json'))) {
      HookManager.uninstall(path);
    } else {
      console.log('The given directory does not have a git-me-hooked.json file in it.');
    }
  }

  protected static isGitRepo(path: string): boolean {
    return existsSync(join(path, '.git'));
  }

  protected static install(repoPath: string): void {
    const hooksDir = resolve(join(repoPath, '.git', 'hooks'));

    HookManager.hookTypes.forEach(hookName => {
      const hookFile = join(hooksDir, hookName);
      if (existsSync(hookFile)) {
        renameSync(hookFile, `${hookFile}.git-me-hooked.backup`);
      }
      copyFileSync(join(__dirname, '/HookRunners/', `${hookName}.js`), hookFile);
    });

    const localConfigFile = resolve(join(repoPath, 'git-me-hooked.json'));
    if (!existsSync(localConfigFile)) {
      copyFileSync(join(__dirname, '/../ConfigTemplates/', 'local.json'), localConfigFile);
    }
  }

  protected static uninstall(repoPath: string): void {
    console.log('hit uninstall fxn');
    const hooksDir = resolve(join(repoPath, '.git', 'hooks'));

    HookManager.hookTypes.forEach(hookName => {
      const hookFile = join(hooksDir, hookName);
      const backupHookFile = join(hooksDir, `${hookName}.git-me-hooked.backup`);
      console.log('hookFile', hookFile);
      console.log('backupHookFile', backupHookFile);
      if (existsSync(hookFile) && existsSync(backupHookFile)) {
        unlinkSync(hookFile);
        renameSync(backupHookFile, hookFile);
      }
    });
  }
}
