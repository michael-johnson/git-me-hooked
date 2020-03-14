import {
  existsSync,
  copyFileSync,
  renameSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
  chmodSync,
} from 'fs';
import { normalize, join, resolve } from 'path';
import { ERROR_NOT_GIT_REPO, ERROR_NOT_INITIALIZED } from './strings/errors';

export default class HookManager {
  protected static hookTypes = [
    'applypatch-msg',
    'commit-msg',
    'post-applypatch',
    'post-checkout',
    'post-commit',
    'post-merge',
    'post-receive',
    'post-rewrite',
    'pre-applypatch',
    'pre-auto-gc',
    'pre-commit',
    'pre-push',
    'pre-rebase',
    'pre-receive',
    'prepare-commit-msg',
    'update',
  ];

  public static init(repoPath: string): void {
    const path = normalize(repoPath);
    if (existsSync(path) && HookManager.isGitRepo(path)) {
      HookManager.install(path);
    } else {
      console.log(ERROR_NOT_GIT_REPO);
    }
  }

  public static uninit(repoPath: string): void {
    const path = normalize(repoPath);
    if (existsSync(path) && existsSync(join(path, 'git-me-hooked.json'))) {
      HookManager.uninstall(path);
    } else {
      console.log(ERROR_NOT_INITIALIZED);
    }
  }

  protected static isGitRepo(path: string): boolean {
    return existsSync(join(path, '.git'));
  }

  protected static install(repoPath: string): void {
    const hooksDir = resolve(join(repoPath, '.git', 'hooks'));
    const hookTemplate = HookManager.getHookTemplate();

    HookManager.hookTypes.forEach(hookName => {
      const hookFile = join(hooksDir, hookName);
      if (existsSync(hookFile)) {
        renameSync(hookFile, `${hookFile}.git-me-hooked.backup`);
      }
      writeFileSync(hookFile, hookTemplate.replace('%%_HOOK_NAME_%%', hookName));
      chmodSync(hookFile, '777');
    });

    const localConfigFile = resolve(join(repoPath, 'git-me-hooked.json'));
    if (!existsSync(localConfigFile)) {
      copyFileSync(join(__dirname, '/../ConfigTemplates/', 'local.json'), localConfigFile);
    }
  }

  private static getHookTemplate() {
    let hookTemplatePath;
    /* istanbul ignore if: The tests execute .ts files not .js */
    if (existsSync(join(__dirname, 'hookTemplate.js'))) {
      hookTemplatePath = join(__dirname, 'hookTemplate.js');
    } else {
      hookTemplatePath = join(__dirname, 'hookTemplate.ts'); // Tests only
    }
    const hookTemplate = readFileSync(hookTemplatePath, { encoding: 'utf-8' });

    return hookTemplate;
  }

  protected static uninstall(repoPath: string): void {
    const hooksDir = resolve(join(repoPath, '.git', 'hooks'));

    HookManager.hookTypes.forEach(hookName => {
      const hookFile = join(hooksDir, hookName);
      const backupHookFile = join(hooksDir, `${hookName}.git-me-hooked.backup`);
      if (existsSync(hookFile) && existsSync(backupHookFile)) {
        unlinkSync(hookFile);
        renameSync(backupHookFile, hookFile);
      }
    });
  }
}
