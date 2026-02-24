import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { frontendbasename } from "./src/utils/params";
export default defineConfig({
    plugins: [react()],
    base: frontendbasename,
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
