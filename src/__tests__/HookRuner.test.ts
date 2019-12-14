import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { initEmptyGitRepo, deleteDirectory } from './utils';
import HookRunner from '../HookRunner';
import TempDirectory from '../TempDirectory';
import HookManager from '../HookManager';

const tempRepoPath = join(tmpdir(), 'gmh-test-repo');
const origStderrWrite = process.stderr.write;
const origConsoleLog = global.console.log;

beforeEach(() => {
  TempDirectory.init();
  initEmptyGitRepo(tempRepoPath);
  HookManager.init(tempRepoPath);
  process.stderr.write = jest.fn();
  global.console.log = jest.fn();
});

afterEach(() => {
  TempDirectory.remove();
  deleteDirectory(tempRepoPath);
  process.stderr.write = origStderrWrite;
  global.console.log = origConsoleLog;
});

it('pre-commit with no exit codes exits 0', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "echo hi"
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with exit code 0 exits 0', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "exit 0"
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with exit code non-zero exits 1', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "exit 3"
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(1);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks failed.'));
});

it('pre-commit with includes runs all scripts', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "includes": ["./includes.json"],
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stdout.write('hi1');\\""
          }
        ]
      }
    }`,
  );
  writeFileSync(
    join(tempRepoPath, 'includes.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stdout.write('hi2');\\""
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith('hi1');
  expect(global.console.log).toBeCalledWith('hi2');
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with no scripts exits 0', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    '{}',
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with no scripts for hook type exits 0', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {}
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with script writing to stderr writes output', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stderr.write('hi23');\\""
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith('hi23');
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with script writing to stdout writes output', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stdout.write('hi23');\\""
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith('hi23');
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with silenced scripts writing to stdout and stderr suppresses output', async () => {
  // Arrange
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "silence": true,
            "exec": "node -e \\"process.stdout.write('hi1');\\""
          },
          {
            "silence": true,
            "exec": "node -e \\"process.stderr.write('hi2');\\""
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith();
  expect(global.console.log).toBeCalledTimes(1);
  expect(process.stderr.write).toBeCalledWith(expect.stringContaining('hooks passed.'));
});

it('pre-commit with no config set gives empty environment variable', async () => {
  // Arrange
  const config = '{}';
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stdout.write(fs.readFileSync(process.env.GMH_SCRIPT_CONFIG_PATH, { encoding: 'utf8' }));\\""
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith(config);
});

it('pre-commit with config set config environment variable', async () => {
  // Arrange
  const config = JSON.stringify({
    a: 1,
    b: 2,
    c: true,
    d: {
      e: false,
      f: 'some string',
    },
  });
  writeFileSync(
    join(tempRepoPath, 'git-me-hooked.json'),
    `{
      "scripts": {
        "pre-commit": [
          {
            "exec": "node -e \\"process.stdout.write(fs.readFileSync(process.env.GMH_SCRIPT_CONFIG_PATH, { encoding: 'utf8' }));\\"",
            "config": ${config}
          }
        ]
      }
    }`,
  );

  // Act
  const runner = new HookRunner();
  const responseCode = await runner.run(tempRepoPath, 'pre-commit', []);

  // Assert
  expect(responseCode).toEqual(0);
  expect(global.console.log).toBeCalledWith(config);
});
