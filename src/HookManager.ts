import { existsSync, copyFileSync, renameSync } from 'fs';
import { normalize, join, resolve } from 'path';

export default class HookManager {
  protected static hookTypes = [
    'pre-commit',
  ];

  public static init(repositoryPath: string): void {
    const path = normalize(repositoryPath);
    if (existsSync(path) && HookManager.underGit(path)) {
      HookManager.install(path);
    } else {
      // TODO: handle error case
    }
  }

  protected static underGit(path: string): boolean {
    return path.length > 0; // TODO: make this a real check
  }

  protected static install(repositoryPath: string): void {
    const hooksDir = resolve(join(repositoryPath, '.git', 'hooks'));

    HookManager.hookTypes.forEach(hookName => {
      const hookFile = join(hooksDir, hookName);
      if (existsSync(hookFile)) {
        renameSync(hookFile, `${hookFile}.git-me-hooked.backup`);
      }
      copyFileSync(join(__dirname, '/HookRunners/', `${hookName}.js`), hookFile);
    });

    const localConfigFile = resolve(join(repositoryPath, 'git-me-hooked.json'));
    if (!existsSync(localConfigFile)) {
      copyFileSync(join(__dirname, '/../ConfigTemplates/', 'local.json'), localConfigFile);
    }
  }
}
