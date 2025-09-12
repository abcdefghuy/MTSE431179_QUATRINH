import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.js"),
          name: "ReactCartLibrary",
          fileName: (format) => `index.${format}.js`,
          formats: ["es", "umd", "cjs"],
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
            exports: "named",
            banner:
              "/* React Cart Library v1.0.0 | MIT License | (c) 2025 YourOrg */",
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === "style.css") {
                return "style.css";
              }
              return assetInfo.name;
            },
          },
        },
        cssCodeSplit: false,
        minify: "terser",
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
      define: {
        __DEV__: false,
      },
      css: {
        modules: {
          generateScopedName: "rcl-[name]__[local]___[hash:base64:5]",
        },
        postcss: {
          plugins: [],
        },
      },
    };
  }

  // Development configuration
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    css: {
      devSourcemap: true,
    },
    define: {
      __DEV__: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
