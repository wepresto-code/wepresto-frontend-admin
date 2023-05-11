export const formatDate = (date = new Date(), timeZone = "America/Bogota") => {
  const year = date.toLocaleString("default", { timeZone, year: "numeric" });
  const month = date.toLocaleString("default", { timeZone, month: "2-digit" });
  const day = date.toLocaleString("default", { timeZone, day: "2-digit" });

  return `${year}-${month}-${day}`;
};
