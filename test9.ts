import { fork } from "child_process";
import fs from "fs";
import http from "http";

const child = fork('dist/server.cjs', { env: { ...process.env, NODE_ENV: 'production', PORT: '3003' } });

setTimeout(() => {
  http.get('http://localhost:3003/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log("Health check:", data));
  }).on('error', err => console.error("Health check error:", err));
}, 2500);

setTimeout(() => { child.kill(); }, 4000);
