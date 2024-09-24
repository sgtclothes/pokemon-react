import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            host: "localhost",
        },
    },
    build: {
        outDir: "dist",
    },
    preview: {
        port: 3000
    },
});
