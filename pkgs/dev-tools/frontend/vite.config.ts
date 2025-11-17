import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), wasm(), topLevelAwait()],
	optimizeDeps: {
		exclude: ["@midnight-ntwrk/wallet-sdk-address-format"],
	},
	define: {
		global: "globalThis",
	},
	resolve: {
		alias: {
			buffer: "buffer",
		},
	},
});
