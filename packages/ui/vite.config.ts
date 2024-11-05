/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    watch: false,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
