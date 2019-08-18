#!/usr/bin/env node
import { execSync } from 'child_process';
import { join, normalize, resolve } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { env } from 'process';

function getStagedFilesJson() {
  const rawStagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' });
  const stagedFiles = rawStagedFiles
    .slice(0, -1)
    .split('\n')
    .map(file => resolve(normalize(file)));

  return JSON.stringify(stagedFiles);
}

function getRepoDirectory() {
  return resolve(join(__dirname, '../../'));
}

function runHooks() {
  execSync(`git-me-hooked exec ${getRepoDirectory()} pre-commit`, { stdio: 'inherit' });
}

function cleanUp(stagedFilesPath) {
  unlinkSync(stagedFilesPath);
}

const stagedFilesPath = join(tmpdir(), 'gmh-staged-files.json');
try {
  writeFileSync(stagedFilesPath, getStagedFilesJson());
  env.GMH_STAGED_FILES = stagedFilesPath;
  env.GMH_REPO_DIRECTORY = getRepoDirectory();

  runHooks();

  cleanUp(stagedFilesPath);
} catch (error) {
  cleanUp(stagedFilesPath);
  process.exit(error.status);
}
