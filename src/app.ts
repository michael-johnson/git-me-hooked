#!/usr/bin/env node
import { Command } from 'commander';
import HookManager from './HookManager';
import HookRunner from './HookRunner';

const cli = new Command();
const myPackage = require('../package.json');

cli.version(myPackage.version);
if (!process.argv.slice(2).length) {
  cli.outputHelp();
}

cli
  .command('init <repoPath>')
  .alias('install')
  .description('Initialize a repository to use git-me-hooked.')
  .action((repoPath: string) => {
    HookManager.init(repoPath);
  });

cli
  .command('uninit <repoPath')
  .alias('uninstall')
  .description('Remove git-me-hooked from a repository.')
  .action((repoPath: string) => {
    HookManager.uninit(repoPath);
  });

cli
  .command('exec <repoPath> <hookType>')
  .description('Execute the given repository\'s git hooks of the specified type')
  .action(async (repoPath: string, hookType: string) => {
    const runner = new HookRunner();
    process.exit(await runner.run(repoPath, hookType, process.argv.slice(5)));
  });

cli.parse(process.argv);
