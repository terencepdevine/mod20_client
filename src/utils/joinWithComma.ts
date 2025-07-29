export const joinWithComma = (items: string[] | { name: string }[]) => {
  return items
    .filter((item) => item != null) // Remove null/undefined items
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter((name) => name != null) // Remove any remaining null/undefined names
    .join(", ");
};
