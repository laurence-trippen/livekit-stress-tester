import fs from "node:fs";
import os from "node:os";

import { spawnLivekitLoadTest } from "./livekit.js";
import { formatBytes } from "./utils.js";

function prepareOutputDirectory(folderName = "output") {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error("Failed to create ");
    console.error(err);
  }
}

function getArgs() {
  const args = process.argv.slice(2);

  let [rooms, testDuration, ipAddress] = args;

  if (!rooms || isNaN(Number(rooms)) || rooms < 1) {
    const defaultRooms = 4;

    console.error("Invalid 1st positional argument 'rooms' must be a number (> 1)");
    console.log("Fallback to rooms: ", defaultRooms);
    
    rooms = defaultRooms;
  }

  if (!testDuration || isNaN(Number(testDuration)) || testDuration < 1) {
    console.error("Invalid 2nd positional argument 'testDuration' must a number in seconds");
    console.log("Fallback to test duration seconds: ", testDuration);

    testDuration = 10; // seconds
  }

  return [rooms, testDuration, ipAddress];
}

async function main() {
  const [rooms, testDuration, ipAddress] = getArgs();

  console.log("Livekit Stress Tester");
  console.log("PWD: ", process.cwd());

  prepareOutputDirectory();

  for (let i = 0; i < rooms; i++) {
    const roomName = `lk-test-${i + 1}`;

    console.log("Spawning room " + roomName);

    spawnLivekitLoadTest({ roomName, testDuration, ipAddress });
  }

  const intervalHandle = setInterval(() => {
    const total = os.totalmem();
    const free = os.freemem();

    const allocated = total - free;

    console.log(`Alloc.: ${formatBytes(allocated)}\t|\tFree: ${formatBytes(free)}\t|\tTotal: ${formatBytes(total)}`);
  }, 1000);

  const cooldownTime = 10_000;

  setTimeout(() => {
    clearInterval(intervalHandle);
  }, testDuration * 1000 + cooldownTime);
}
main();
