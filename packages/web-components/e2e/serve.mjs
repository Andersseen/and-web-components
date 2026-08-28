#!/usr/bin/env node
/**
 * Zero-dependency static file server for the Playwright e2e suite.
 *
 * Serves the whole `packages/web-components` directory (including `dist/`,
 * `src/global/*.css`, and `node_modules/@andersseen/*` — pnpm workspace
 * symlinks, followed transparently by `fs.readFile`) so the fixture pages
 * under `e2e/fixtures/` can register the real *built* custom elements the
 * same way `.storybook/preview.ts` does, without pulling in a bundler.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT ?? 4173);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url ?? '/', `http://localhost:${port}`);
  const decodedPath = decodeURIComponent(requestUrl.pathname);

  if (decodedPath.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Bad request');
    return;
  }

  const filePath = path.join(packageRoot, decodedPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end(`Not found: ${decodedPath}`);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`[e2e] static server serving ${packageRoot} on http://localhost:${port}`);
});
