import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { frontendbasename } from "./src/utils/params";
export default defineConfig({
    plugins: [react()],
    base: frontendbasename,
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: "assets/app.js",
                chunkFileNames: "assets/app.js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                        return "assets/app.css";
                    }
                    return "assets/[name][extname]";
                }
            }
        }
    }
});
