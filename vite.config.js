import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404-html",
      closeBundle() {
        // Copiar 404.html para a pasta dist após o build
        try {
          const source = resolve(__dirname, "404.html");
          const target = resolve(__dirname, "dist", "404.html");

          if (fs.existsSync(source)) {
            fs.copyFileSync(source, target);
            console.log("✓ 404.html copiado para a pasta dist");
          } else {
            console.error("Arquivo 404.html não encontrado na raiz do projeto");
          }
        } catch (err) {
          console.error("Erro ao copiar 404.html:", err);
        }
      },
    },
  ],
  base: "/crm-facilitaai/",
});
