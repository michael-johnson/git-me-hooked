import {
  readFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  unlinkSync,
} from 'fs';
import { join, parse, resolve } from 'path';
import { exec } from 'shelljs';
import { chdir } from 'process';
import HookVariableInitializer from './HookVariableInitializer';
import HookManager from './HookManager';

export default class HookRunner {
  protected commands: ExecConfig = {};

  public run(repoPath: string, hookType: string, hookArguments: string[]): number {
    let responseCode = 0;
    this.commands = {};

    HookRunner.initTempDirectory();
    HookVariableInitializer.initEnvVariables(repoPath, hookType, hookArguments);

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

    HookRunner.cleanTempDirectory();

    return responseCode;
  }

  protected static initTempDirectory(): void {
    if (!existsSync(HookManager.getTempDirectory())) {
      mkdirSync(HookManager.getTempDirectory());
    }
  }

  protected static cleanTempDirectory(): void {
    const tempDirectory = HookManager.getTempDirectory();
    if (existsSync(tempDirectory)) {
      const files = readdirSync(tempDirectory);
      files.forEach(file => {
        unlinkSync(join(tempDirectory, file));
      });
    }
  }

  protected getIncludes(repoConfig: GitMeHookedConfig, currentPath: string, hookType: string) {
    const { includes, scripts } = repoConfig;
    chdir(currentPath);

    if (scripts != null) {
      const commands = scripts[hookType];
      if (commands != null) {
        this.commands[currentPath] = commands;
      }
    }

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
