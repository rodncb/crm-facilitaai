import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use base: "/" para desenvolvimento local e "/crm-facilitaai/" para produção
  const base = mode === "production" ? "/crm-facilitaai/" : "/";

  return {
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
              // Arquivo copiado com sucesso
            } else {
              // Arquivo não encontrado
            }
          } catch (err) {
            // Erro ao copiar arquivo
          }
        },
      },
    ],
    base,
  };
});
