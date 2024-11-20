/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "hero-dark-future": "url('/src/assets/images/hero-dark-future.png')",
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        gray: {
          850: "#18202f",
          925: "#0c111d",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: theme("colors.gray.100"),
              fontSize: theme("fontSize.2xl"),
              fontWeight: "bold",
              display: "flex",
              paddingTop: theme("spacing.8"),
              paddingBottom: theme("spacing.8"),
              margin: "0",
              gap: theme("gap.4"),
              alignItems: "center",
              "&::after": {
                content: '""',
                background: theme("colors.gray.800"),
                height: "1px",
                flex: "1",
              },
            },
            h2: {
              color: theme("colors.gray.100"),
              fontSize: theme("fontSize.xl"),
              fontWeight: "bold",
              display: "flex",
              paddingTop: theme("spacing.8"),
              paddingBottom: theme("spacing.8"),
              margin: "0",
              gap: theme("gap.4"),
              alignItems: "center",
              "&::after": {
                content: '""',
                background: theme("colors.gray.800"),
                height: "1px",
                flex: "1",
              },
            },
            h3: {
              color: theme("colors.gray.100"),
            },
            h4: {
              color: theme("colors.gray.100"),
            },
            h5: {
              color: theme("colors.gray.100"),
            },
            h6: {
              color: theme("colors.gray.100"),
            },
            p: {
              color: theme("colors.gray.300"),
              fontSize: theme("fontSize.base"),
              marginTop: "0",
              marginBottom: theme("spacing.3"),
              "@screen xl": {
                fontSize: theme("fontSize.lg"),
              },
            },
            a: {
              color: theme("colors.sky.500"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            blockquote: {
              borderLeft: "none",
              paddingInlineStart: "0px",
              display: "flex",
              flexDirection: "column",
              marginBottom: "0",
              paddingBottom: theme("spacing.4"),
              gap: theme("spacing.4"),
              "> p": {
                "&::before": { content: '""', display: "none" }, // Remove the opening quote
                "&::after": { content: '""', display: "none" }, // Remove the closing quote
                fontSize: theme("fontSize.lg"),
                lineHeight: theme("lineHeight.snug"),
                fontWeight: "300",
                color: theme("colors.gray.300"),
                margin: "0",
                "@screen 2xl": {
                  fontSize: theme("fontSize.xl"),
                },
              },
            },
            strong: {
              color: theme("colors.gray.100"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
