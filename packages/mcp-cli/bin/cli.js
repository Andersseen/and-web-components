#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the compiled CLI
const cliPath = join(__dirname, '..', 'dist', 'cli.js');

const child = spawn('node', [cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', err => {
  console.error('Failed to start CLI:', err);
  process.exit(1);
});

child.on('exit', code => {
  process.exit(code || 0);
});
