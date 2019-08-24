import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { chdir } from 'process';
import { exec } from 'shelljs';
import rimraf from 'rimraf';

import HookManager from '../HookManager';
import { ERROR_NOT_GIT_REPO, ERROR_NOT_INITIALIZED } from '../strings/errors';

const tempRepoPath = join(tmpdir(), 'gmh-test-repo');
const hookTemplatePath = join(__dirname, '../hookTemplate.ts');

jest.spyOn(global.console, 'log').mockImplementation(() => {});

const cleanUp = () => {
  // Setup empty git repo for testing
  rimraf.sync(tempRepoPath);
  mkdirSync(tempRepoPath);
  chdir(tempRepoPath);
  exec('git init');
};

beforeAll(() => {
  cleanUp();
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

it('init gives error if not git repo', () => {
  // Arrange
  const nonRepoPath = join(tmpdir(), 'gmh-not-a-repo');

  // Act
  HookManager.init(nonRepoPath);

  // Assert
  expect(console.log).toBeCalledWith(ERROR_NOT_GIT_REPO);
});


it('uninit re-installs backed up hook', () => {
  // Arrange
  const ORIG_HOOK_CONTENTS = 'Blah';
  writeFileSync(join(tempRepoPath, '.git', 'hooks', 'pre-commit'), ORIG_HOOK_CONTENTS); // write "Blah" pre-commit hook
  HookManager.init(tempRepoPath); // Init GMH, should back up orig hook

  // Act
  HookManager.uninit(tempRepoPath);

  // Assert: original hook should be installed again
  const installedPreCommitHook = readFileSync(join(tempRepoPath, '.git', 'hooks', 'pre-commit'), { encoding: 'utf-8' });
  expect(installedPreCommitHook).toEqual(ORIG_HOOK_CONTENTS);
});

it('uninit gives error if not git repo', () => {
  // Arrange
  const nonRepoPath = join(tmpdir(), 'gmh-not-a-repo');

  // Act
  HookManager.uninit(nonRepoPath);

  // Assert
  expect(console.log).toBeCalledWith(ERROR_NOT_GIT_REPO);
});

it('uninit gives error if git repo, but not initialized by GMH', () => {
  // Arrange
  cleanUp();

  // Act
  HookManager.uninit(tempRepoPath);

  // Assert
  expect(console.log).toBeCalledWith(ERROR_NOT_INITIALIZED);
});
