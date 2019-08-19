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
import { tmpdir } from 'os';

export default class HookManager {
  protected static hookTypes = [
    'pre-commit',
    'pre-push',
    'commit-msg',
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
    const path = normalize(repoPath);
    if (existsSync(path) && existsSync(join(path, 'git-me-hooked.json'))) {
      HookManager.uninstall(path);
    } else {
      console.log('The given directory does not have a git-me-hooked.json file in it.');
    }
  }

  public static getTempDirectory(): string {
    return join(tmpdir(), 'git-me-hooked');
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
