import { readFileSync } from 'fs';
import { join, parse, resolve } from 'path';
import { exec } from 'shelljs';
import { chdir } from 'process';

export default class HookRunner {
  protected commands: ExecConfig = {};

  public run(repoPath: string, hookType: string): number {
    let responseCode = 0;
    this.commands = {};

    const repoConfig = HookRunner.readConfigFile(join(repoPath, 'git-me-hooked.json'));
    this.getIncludes(repoConfig, repoPath, hookType);

    Object.keys(this.commands).forEach(key => {
      const path = key;
      chdir(path);
      const commands = this.commands[key];
      commands.forEach(command => {
        if (exec(command.exec).code !== 0) {
          responseCode = 1;
        }
      });
    });

    return responseCode;
  }

  protected getIncludes(repoConfig: GitMeHookedConfig, currentPath: string, hookType: string) {
    const { includes } = repoConfig;
    chdir(currentPath);

    const commands = repoConfig.scripts[hookType];
    this.commands[currentPath] = commands;

    if (includes != null) {
      Object.values(includes).forEach(include => {
        const newPath = resolve(join(currentPath, parse(include).dir));
        this.getIncludes(HookRunner.readConfigFile((include)), newPath, hookType);
      });
    }
  }

  protected static readConfigFile(path: string): GitMeHookedConfig {
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  }
}
