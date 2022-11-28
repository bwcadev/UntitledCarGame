import { defineConfig } from "vite";

// vite.config.js
export default defineConfig({
    root: './',
    base: '/UntitledCarGame/',
    build: {
        outDir: 'dist', 
        publicDir: 'assets'
    }
})