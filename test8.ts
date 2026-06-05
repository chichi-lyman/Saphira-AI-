import { fork } from "child_process";
import fs from "fs";
import http from "http";

let serverCode = fs.readFileSync('dist/server.cjs', 'utf-8');
serverCode = serverCode.replace(/PORT = process.env.PORT \? parseInt\(process.env.PORT\) : 3000;/g, 'PORT = 3003;');
fs.writeFileSync('dist/server_test.cjs', serverCode);

const child = fork('dist/server_test.cjs', { env: { ...process.env, NODE_ENV: 'production' } });
child.on('message', m => console.log(m));
child.on('error', e => console.error(e));
child.on('exit', c => console.log("EXIT:", c));

setTimeout(() => {
  http.get('http://localhost:3003/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log("Health check:", data));
  }).on('error', err => console.error("Health check error:", err));
}, 1000);

setTimeout(() => { child.kill(); }, 3000);
