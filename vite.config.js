// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// // =====================
// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";

// // // Vitest config tích hợp trong defineConfig()
// // export default defineConfig({
// //   plugins: [react()],

// //   test: {
// //     environment: "jsdom", // 👈 Quan trọng: mặc định toàn project dùng jsdom
// //     globals: true,
// //     setupFiles: "./src/test/setupTests.js",
// //     css: false,
// //     restoreMocks: true,
// //   },
// // });

// // ======================
// // // Setup để chạy test Pha C
// // // vite.config.js
// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";

// // export default defineConfig({
// //   plugins: [react()],
// //   test: {
// //     environment: "jsdom", // bắt buộc để window/document có sẵn
// //     globals: true, // dùng describe/it/expect mà không import
// //     setupFiles: "./src/test/setupTests.js", // nếu cần setup global mocks
// //   },
// // });

// // =========================================
// // SỬA vite.config.js → TỐI GIẢN CHO PHASE 6
// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: "node",
//   },
// });

// ==============================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
// 🔧 FIX __dirname cho ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
