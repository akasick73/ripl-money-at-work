import { rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const dist = join(process.cwd(), 'dist');
rmSync(join(dist, '_worker.js'), { force: true, recursive: true });
// Never expose Pages server bundles as Worker static assets.
writeFileSync(join(dist, '.assetsignore'), '_worker.js\n');
