module.exports = (pollen) => ({
  output: "./pollen.css",
  modules: {
    ...pollen,
    color: {
      ...pollen.colors,
      bg: "white",
      text: "var(--color-black)",
    },
  },
  media: {
    "(prefers-color-scheme: dark)": {
      color: {
        bg: "var(--color-black)",
        text: "white",
      },
    },
  },
});
