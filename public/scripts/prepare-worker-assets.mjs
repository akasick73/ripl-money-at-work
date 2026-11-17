import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
// Workers static assets must never publish a Pages _worker.js file.
mkdirSync('dist', { recursive: true });
if (existsSync('dist/_worker.js')) rmSync('dist/_worker.js');
writeFileSync('dist/.assetsignore', '_worker.js\n');
