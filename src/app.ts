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
  .command('init <directoryPath>')
  .description('Initialize a repository to use git-me-hooked.')
  .action((directoryPath: string) => {
    HookManager.init(directoryPath);
  });

cli.command('uninstall <directoryPath>', 'Remove git-me-hooked from a repository.');

cli.parse(process.argv);
