import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
const version = readFileSync(new URL('./version.txt', import.meta.url), 'utf8').trim();
const boot = randomUUID();
const startedAt = new Date().toISOString();
const values = Object.fromEntries(['LAB_PROFILE','LAB_REV','LAB_SENTINEL'].map(k => [k, process.env[k] ?? null]));
const body = JSON.stringify({ version, boot, startedAt, commit: process.env.RENDER_GIT_COMMIT ?? null, values });
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' || !['/', '/health'].includes(req.url)) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { 'Content-Type':'application/json', 'Cache-Control':'no-store' });
  res.end(body);
});
server.listen(Number(process.env.PORT || 10000), '0.0.0.0', () => console.log(JSON.stringify({event:'LAB_BOOT',version,boot,startedAt})));
process.on('SIGTERM', () => {
  console.log(JSON.stringify({event:'LAB_SIGTERM',boot,at:new Date().toISOString()}));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
});
