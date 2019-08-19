#!/usr/bin/env node
import { execSync } from 'child_process';
import { join, resolve } from 'path';

process.exit(
  execSync(
    `git-me-hooked exec ${resolve(join(__dirname, '../../'))} pre-commit`,
    { stdio: 'inherit' },
  ),
);
