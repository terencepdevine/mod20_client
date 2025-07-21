export const joinWithComma = (items: string[] | { name: string }[]) => {
  return items
    .map((item) => (typeof item === "string" ? item : item.name))
    .join(", ");
};
