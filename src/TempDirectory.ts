import { tmpdir } from 'os';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from 'fs';
import { join } from 'path';

export default class TempDirectory {
  public static getPath(): string {
    return join(tmpdir(), 'git-me-hooked');
  }

  public static init(): void {
    if (!existsSync(TempDirectory.getPath())) {
      mkdirSync(TempDirectory.getPath());
    }
  }

  public static remove(): void {
    const tempDirectory = TempDirectory.getPath();
    if (existsSync(tempDirectory)) {
      const files = readdirSync(tempDirectory);
      files.forEach(file => {
        unlinkSync(join(tempDirectory, file));
      });
    }
  }
}
