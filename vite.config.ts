import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mod20/types": path.resolve(__dirname, "../mod20_types"),
    },
  },
});
