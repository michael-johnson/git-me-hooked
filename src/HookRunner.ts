import { readFileSync } from 'fs';
import { join, parse, resolve } from 'path';
import { exec } from 'shelljs';
import { chdir } from 'process';
import ora from 'ora';
import HookVariableInitializer from './HookVariableInitializer';
import TempDirectory from './TempDirectory';

export default class HookRunner {
  protected commands: ExecConfig = {};

  public async run(repoPath: string, hookType: string, hookArguments: string[]): Promise<number> {
    let responseCode = 0;
    this.commands = {};

    TempDirectory.init();
    HookVariableInitializer.initEnvVariables(repoPath, hookType, hookArguments);

    const repoConfig = HookRunner.readConfigFile(join(repoPath, 'git-me-hooked.json'));
    this.getIncludes(repoConfig, repoPath, hookType);

    const spinner = ora().start(`Git Me Hooked: executing ${hookType} hooks...`);
    const runningCommands: Promise<CommandResult>[] = [];
    Object.keys(this.commands).forEach(key => {
      const path = key;
      chdir(path);
      const commands = this.commands[key];
      commands.forEach(command => { runningCommands.push(HookRunner.runCommand(command)); });
    });

    await Promise.all(runningCommands).then(finishedCommands => {
      finishedCommands.forEach(commandResult => {
        if (commandResult.success) {
          spinner.succeed(commandResult.name);
        } else {
          spinner.fail(commandResult.name);
          responseCode = 1;
        }

        if (commandResult.output !== '') {
          console.log(commandResult.output);
        }
      });
    });

    console.log(); // empty line
    if (responseCode === 0) {
      spinner.succeed(`Git Me Hooked: all ${hookType} hooks passed.`);
    } else {
      spinner.fail(`Git Me Hooked: one or more ${hookType} hooks failed.`);
    }

    TempDirectory.remove();

    return responseCode;
  }

  protected static runCommand(command: Command): Promise<CommandResult> {
    return new Promise(resolvePromise => {
      exec(command.exec, { silent: true, async: true }, (code, stdout, stderr) => {
        let output = '';
        if (!command.silence) {
          if (stdout !== '') {
            output += stdout.trim();
          }
          if (stderr !== '') {
            output += stderr.trim();
          }
        }

        resolvePromise({
          name: command.name || command.exec,
          success: code === 0,
          output: output.trim(),
        });
      });
    });
  }

  protected getIncludes(repoConfig: GitMeHookedConfig, currentPath: string, hookType: string) {
    const { includes, scripts } = repoConfig;
    chdir(currentPath);

    if (scripts != null) {
      const commands = scripts[hookType];
      if (commands != null) {
        const commandsInPath = this.commands[currentPath] || [];
        this.commands[currentPath] = [...commandsInPath, ...commands];
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
