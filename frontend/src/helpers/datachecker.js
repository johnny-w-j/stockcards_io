export const dataValidator = (data, items) => {
  return items.every((item) => {
    if (!data[item]) return false;
    if (!Array.isArray(data[item])) return false;
    if (typeof data[item][0] === "string") return false;
    if (data[item].length < 20) return false;
    return true;
  });
};
