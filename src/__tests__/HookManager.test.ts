import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { chdir } from 'process';
import { exec } from 'shelljs';
import rimraf from 'rimraf';

import HookManager from '../HookManager';

const tempRepoPath = join(tmpdir(), 'gmh-test-repo');
const hookRunnersDir = join(__dirname, '../HookRunners/');

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
  const preCommitHookRunner = readFileSync(join(hookRunnersDir, 'pre-commit.js'), { encoding: 'utf-8' });
  expect(installedPreCommitHook).toEqual(preCommitHookRunner);
});
