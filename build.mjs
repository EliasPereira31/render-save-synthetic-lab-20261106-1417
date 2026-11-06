import { readFileSync } from 'node:fs';
console.log(JSON.stringify({event:'LAB_BUILD',version:readFileSync(new URL('./version.txt', import.meta.url),'utf8').trim(),at:new Date().toISOString()}));
