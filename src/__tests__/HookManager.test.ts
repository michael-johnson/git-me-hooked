import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { chdir } from 'process';
import { exec } from 'shelljs';
import rimraf from 'rimraf';

import HookManager from '../HookManager';

const tempRepoPath = join(tmpdir(), 'gmh-test-repo');
const hookTemplatePath = join(__dirname, '../hookTemplate.ts');

beforeAll(() => {
  // Setup empty git repo for testing
  rimraf.sync(tempRepoPath);
  mkdirSync(tempRepoPath);
  chdir(tempRepoPath);
  exec('git init');
});

it('init copies hooks', () => {
  // Act
  HookManager.init(tempRepoPath);

  // Assert
  const installedPreCommitHook = readFileSync(join(tempRepoPath, '.git', 'hooks', 'pre-commit'), { encoding: 'utf-8' });
  const hookTemplate = readFileSync(hookTemplatePath, { encoding: 'utf-8' });
  const preCommitHookRunner = hookTemplate.replace('%%_HOOK_NAME_%%', 'pre-commit');
  expect(installedPreCommitHook).toEqual(preCommitHookRunner);
});
