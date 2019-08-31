import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { exec } from 'shelljs';
import { initEmptyGitRepo } from './utils';
import HookVariableInitializer from '../HookVariableInitializer';

const tempRepoPath = join(tmpdir(), 'gmh-test-repo');

jest.spyOn(global.console, 'log').mockImplementation(() => {});

beforeAll(() => {
  initEmptyGitRepo(tempRepoPath);
});

it('GMH_RUNNING is always set', () => {
  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'doesn\'t matter', []);

  // Assert
  expect(process.env.GMH_RUNNING).toEqual('true');
});

it('GMH_REPO_DIRECTORY is always set', () => {
  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'doesn\'t matter', []);

  // Assert
  expect(process.env.GMH_REPO_DIRECTORY).toEqual(tempRepoPath);
});

it('GMH_GIT_ARGUMENTS is empty if nothing passed', () => {
  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'doesn\'t matter', []);

  // Assert
  expect(process.env.GMH_GIT_ARGUMENTS).toEqual('');
});

it('GMH_GIT_ARGUMENTS has arguments if passed', () => {
  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'doesn\'t matter', ['argA', 'argB']);

  // Assert
  expect(process.env.GMH_GIT_ARGUMENTS).toEqual('argA argB');
});

it('GMH_GIT_ARGUMENTS has correct contents if nothing staged', () => {
  // Arrange
  initEmptyGitRepo(tempRepoPath);
  const fileAPath = join(tempRepoPath, 'fileA');
  writeFileSync(fileAPath, 'some data in A');
  const fileBPath = join(tempRepoPath, 'fileB');
  writeFileSync(fileBPath, 'some data in B');

  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(existsSync(process.env.GMH_STAGED_FILES || '')).toEqual(true);
  const stagedFiles = JSON.parse(readFileSync(process.env.GMH_STAGED_FILES || '', { encoding: 'utf-8' }));
  expect(stagedFiles).toStrictEqual([]);
});

it('GMH_GIT_ARGUMENTS has correct contents if all staged', () => {
  // Arrange
  initEmptyGitRepo(tempRepoPath);
  const fileAPath = join(tempRepoPath, 'fileA');
  writeFileSync(fileAPath, 'some data in A');
  const fileBPath = join(tempRepoPath, 'fileB');
  writeFileSync(fileBPath, 'some data in B');
  exec('git add fileA fileB', { silent: true });

  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(existsSync(process.env.GMH_STAGED_FILES || '')).toEqual(true);
  const stagedFiles = JSON.parse(readFileSync(process.env.GMH_STAGED_FILES || '', { encoding: 'utf-8' }));
  expect(stagedFiles).toStrictEqual([fileAPath, fileBPath]);
});

it('GMH_GIT_ARGUMENTS has correct contents if some staged', () => {
  // Arrange
  initEmptyGitRepo(tempRepoPath);
  const fileAPath = join(tempRepoPath, 'fileA');
  writeFileSync(fileAPath, 'some data in A');
  const fileBPath = join(tempRepoPath, 'fileB');
  writeFileSync(fileBPath, 'some data in B');
  exec('git add fileA', { silent: true });

  // Act
  HookVariableInitializer.initEnvVariables(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(existsSync(process.env.GMH_STAGED_FILES || '')).toEqual(true);
  const stagedFiles = JSON.parse(readFileSync(process.env.GMH_STAGED_FILES || '', { encoding: 'utf-8' }));
  expect(stagedFiles).toStrictEqual([fileAPath]);
});
