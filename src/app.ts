#!/usr/bin/env node
import { Command } from 'commander';

const cli = new Command();
const myPackage = require('../package.json'); // TODO: no require here, use a sane loader

cli.version(myPackage.version);

cli.parse(process.argv);
