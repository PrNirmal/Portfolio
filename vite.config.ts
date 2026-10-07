import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  const isVercel = Boolean(
    process.env["VERCEL"] || process.env["NITRO_PRESET"] === "vercel"
  );

  return {
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        server: { entry: "server" },
      }),
      viteReact(),
      ...(isBuild
        ? [
            nitro(
              isVercel
                ? { preset: "vercel" }
                : {
                    preset: "cloudflare-module",
                    output: {
                      dir: "dist",
                      serverDir: "dist/server",
                      publicDir: "dist/client",
                    },
                    cloudflare: {
                      nodeCompat: true,
                      deployConfig: true,
                    },
                  }
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
