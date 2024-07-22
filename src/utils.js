export function generateTestDate() {
  const date = new Date();

  const dateString = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return `${dateString}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}
