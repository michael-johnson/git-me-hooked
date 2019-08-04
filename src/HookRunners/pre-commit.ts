#!/usr/bin/env node
import { execSync } from 'child_process';
import { join, normalize, resolve } from 'path';
import { env } from 'process';

try {
  const rawStagedFiles = execSync('git diff --name-only --cached', { encoding: 'utf-8' });
  const stagedFiles = rawStagedFiles
    .slice(0, -1)
    .split('\n')
    .map(file => resolve(normalize(file)));
  env.GMH_STAGED_FILES = JSON.stringify(stagedFiles);

  execSync(`git-me-hooked exec ${join(__dirname, '../../')} pre-commit`, { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status);
}
