import { mkdirSync } from 'fs';
import { chdir } from 'process';
import { exec } from 'shelljs';
import rimraf from 'rimraf';

export const initEmptyGitRepo = (path: string) => { // eslint-disable-line
  rimraf.sync(path);
  mkdirSync(path);
  chdir(path);
  exec('git init', { silent: true });
};
