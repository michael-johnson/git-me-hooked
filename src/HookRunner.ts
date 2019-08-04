import { readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'shelljs';

export default class HookRunner {
  public static run(repoPath: string, hookType: string): number {
    let responseCode = 0;
    const repoConfig: GitMeHookedConfig = JSON.parse(readFileSync(join(repoPath, 'git-me-hooked.json'), { encoding: 'utf8' }));

    const commands = repoConfig.scripts[hookType];
    commands.forEach(command => {
      // TODO: parallelize this
      if (exec(command.exec).code !== 0) {
        responseCode = 1;
      }
    });

    return responseCode;
  }
}
