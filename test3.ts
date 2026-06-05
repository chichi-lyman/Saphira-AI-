import { exec } from "child_process";
import fs from "fs";

let serverCode = fs.readFileSync('dist/server.cjs', 'utf-8');
serverCode = serverCode.replace(/const PORT = 3000;/g, 'const PORT = 3001;');
fs.writeFileSync('dist/server_test.cjs', serverCode);

exec("npx node dist/server_test.cjs", (error, stdout, stderr) => {
  console.log("STDOUT:", stdout);
  console.log("STDERR:", stderr);
  if (error) console.error("ERROR:", error);
});
