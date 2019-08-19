#!/usr/bin/env node
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { exit } from 'process';

try {
  execSync(
    `git-me-hooked exec ${resolve(join(__dirname, '../../'))} %%_HOOK_NAME_%%`,
    { stdio: 'inherit' },
  );
} catch (error) {
  exit(error.status);
}
