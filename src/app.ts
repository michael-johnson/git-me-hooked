#!/usr/bin/env node
import { Command } from 'commander';
import HookManager from './HookManager';

const cli = new Command();
const myPackage = require('../package.json'); // TODO: no require here, use a sane loader

cli.version(myPackage.version);
if (!process.argv.slice(2).length) {
  cli.outputHelp();
}

cli
  .command('init <repoPath>')
  .description('Initialize a repository to use git-me-hooked.')
  .action((repoPath: string) => {
    HookManager.init(repoPath);
  });

cli.command('uninstall <directoryPath>', 'Remove git-me-hooked from a repository.');

cli
  .command('exec <repoPath> <hookType>')
  .description('Execute the given repository\'s git hooks of the specified type')
  .action((repoPath: string, hookType: string) => {
    console.log('repoPath', repoPath);
    console.log('hookType', hookType);
    // JSON.parse(readFileSync(join(__dirname, '../../git-me-hooked.json'), { encoding: 'utf8' }));
    process.exit(1);
  });

cli.parse(process.argv);
