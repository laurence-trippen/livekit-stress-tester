import os from "node:os";

// export function getCpuUsage() {
//   const cpus = os.cpus();

//   let user = 0;
//   let nice = 0;
//   let sys = 0;
//   let idle = 0;
//   let irq = 0;

//   for (let cpu of cpus) {
//     user += cpu.times.user;
//     nice += cpu.times.nice;
//     sys += cpu.times.sys;
//     idle += cpu.times.idle;
//     irq += cpu.times.irq;
//   }

//   const total = user + nice + sys + idle + irq;

//   return {
//     user: (user / total) * 100,
//     nice: (nice / total) * 100,
//     sys: (sys / total) * 100,
//     idle: (idle / total) * 100,
//     irq: (irq / total) * 100
//   };
// }

function calculateCPUUsage(start, end) {
  const idleDiff = end.idle - start.idle;
  const totalDiff = end.total - start.total;
  const usage = 100 - (100 * idleDiff) / totalDiff;
  
  return usage;
}

export function getAllCPUsUsage(start, end) {
  return start.map((cpu, idx) => calculateCPUUsage(cpu, end[idx]));
}

export function getCPUUsage() {
  const cpus = os.cpus();
  const cpuInfo = cpus.map((cpu) => {
    const times = cpu.times;
    const total = times.user + times.nice + times.sys + times.idle + times.irq;
    return {
      idle: times.idle,
      total: total,
    };
  });

  return cpuInfo;
}
