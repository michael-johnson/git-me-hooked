#!/usr/bin/env node
import { execSync } from 'child_process';
import { join } from 'path';

try {
  execSync(`git-me-hooked exec ${join(__dirname, '../../')} pre-commit`, { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status);
}
