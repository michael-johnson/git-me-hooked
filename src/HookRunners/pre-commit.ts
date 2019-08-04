#!/usr/bin/env node
import { execSync } from 'child_process';
import { join } from 'path';
import { env } from 'process';

try {
  const rawStagedFiles = execSync('git diff --name-only --cached', { encoding: 'utf-8' });
  const stagedFiles = rawStagedFiles.split('\n').join(',').slice(0, -1); // TODO: cross platform testing
  env.GMH_STAGED_FILES = stagedFiles;

  execSync(`git-me-hooked exec ${join(__dirname, '../../')} pre-commit`, { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status);
}
