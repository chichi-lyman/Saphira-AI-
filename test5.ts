import { fork } from "child_process";
import fs from "fs";

let serverCode = fs.readFileSync('dist/server.cjs', 'utf-8');
serverCode = serverCode.replace(/3000/g, '3002');
fs.writeFileSync('dist/server_test.cjs', serverCode);

const child = fork('dist/server_test.cjs');
child.on('message', m => console.log(m));
child.on('error', e => console.error(e));
child.on('exit', c => console.log("EXIT:", c));
setTimeout(() => { child.kill(); console.log("Killed naturally"); }, 2000);
