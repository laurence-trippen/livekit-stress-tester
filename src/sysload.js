import os from "node:os";

export function getCpuUsage() {
  const cpus = os.cpus();

  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;

  for (let cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }

  const total = user + nice + sys + idle + irq;

  return {
    user: (user / total) * 100,
    nice: (nice / total) * 100,
    sys: (sys / total) * 100,
    idle: (idle / total) * 100,
    irq: (irq / total) * 100
  };
}
