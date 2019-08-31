import { mkdirSync } from 'fs';
import { chdir } from 'process';
import { exec } from 'shelljs';
import rimraf from 'rimraf';
import TempDirectory from '../TempDirectory';

export const initEmptyGitRepo = (path: string) => {
  rimraf.sync(path);
  mkdirSync(path);
  chdir(path);
  exec('git init', { silent: true });
};

export const deleteTempFolder = () => {
  rimraf.sync(TempDirectory.getPath());
};

export const deleteDirectory = (path: string) => {
  rimraf.sync(path);
};
