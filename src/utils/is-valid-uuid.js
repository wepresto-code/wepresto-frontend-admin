export const isValidUUID = (uuid) => {
  const safeRegex = /^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
  return safeRegex.test(uuid);
};
