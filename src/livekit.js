import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

import { generateTestDate } from "./utils.js";


const getLoadTestCommand = (options) => `lk 
  load-test 
  --url ws://192.168.1.148:7880
  --api-key devkey
  --api-secret secret
  --room ${options.roomName}
  --video-publishers 2
  --subscribers 32`;


function getLoadTestSpawn(options) {
  const commandsParts = getLoadTestCommand(options)
    .split("\n")
    .flatMap((params) => {
      params = params.trim();
      return [...params.split(" ")];
    });
  
  const program = commandsParts[0];
  const args = commandsParts.slice(1); // Range 1: (End)

  return [program, args];
}


export function spawnLivekitLoadTest(options) {
  const [program, args] = getLoadTestSpawn(options);

  const loadTestProcess = spawn(program, args, {
    detached: true,
  });

  const logFileName = generateTestDate() + `-${options.roomName}.txt`;
  const logFilePath = path.join("output", logFileName);

  const logFileStream = fs.createWriteStream(logFilePath, {
    flags: "a",
  });

  loadTestProcess.stdout.pipe(logFileStream);
  loadTestProcess.stderr.pipe(logFileStream);

  loadTestProcess.on("exit", (code) => console.log(`${options.roomName} exit with code: `, code));

  // Console Log processes output
  // loadTestProcess.stdout.on("data", (buffer) => console.log(buffer.toString()));

  setTimeout(() => {
    process.kill(loadTestProcess.pid, "SIGINT");
  }, 30_000);
}

// TODO:
export function spawnLivekitDevServer() {}
