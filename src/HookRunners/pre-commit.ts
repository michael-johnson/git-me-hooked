#!/usr/bin/env node
import { execSync } from 'child_process';

try {
  execSync(`git-me-hooked exec ${__dirname} pre-commit`, { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status);
}
