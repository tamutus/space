import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { alias } from "./alias";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  root: ".",
  esbuild: {
    tsconfigRaw: "{}",
  },
  resolve: {
    alias,
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vitest"],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // defaultExportByFilename: true,
      dirs: ["./composables/**", "./components/**", "./pages/**"],
      dts: true, // generate TypeScript declaration
      vueTemplate: true,
    }),
    Components({
      dirs: ["./components/**"],
      directoryAsNamespace: false, // components/nested/Child.vue => <NestedChild />
    }),
  ],
  test: {
    environment: "jsdom",
    deps: {
      inline: [/@nuxt\/test-utils-edge/],
    },
  },
});
