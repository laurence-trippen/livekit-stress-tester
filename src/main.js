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

async function main() {
  const args = process.argv.slice(2);

  let [rooms] = args;
  if (!rooms || isNaN(Number(rooms)) || rooms < 1) {
    console.error("Invalid first positional argument 'rooms' must be a number (> 1)");

    const defaultRooms = 4;

    console.log("Fallback to rooms: ", defaultRooms);
    
    rooms = defaultRooms;
  }

  console.log("Livekit Stress Tester");
  console.log("PWD: ", process.cwd());

  prepareOutputDirectory();

  for (let i = 0; i < rooms; i++) {
    const roomName = `lk-test-${i + 1}`;

    console.log("Spawning room " + roomName);

    spawnLivekitLoadTest({ roomName });
  }

  const intervalHandle = setInterval(() => {
    const total = os.totalmem();
    const free = os.freemem();

    const allocated = total - free;

    console.log(`Alloc.: ${formatBytes(allocated)}\t|\tFree: ${formatBytes(free)}\t|\tTotal: ${formatBytes(total)}`);
  }, 1000);

  setTimeout(() => {
    clearInterval(intervalHandle);
  }, 40_000);
}
main();
