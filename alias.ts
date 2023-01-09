import { resolve } from "path";

const r = (p: string) => resolve(__dirname, p);

export const alias: Record<string, string> = {
  "~~": r("."),
  "~~/*": r("./*"),
  "@@": r("."),
  "@@/*": r("./*"),
  "~": r("."),
  "~/*": r("./*"),
  "@": r("."),
  "@/*": r("./*"),
  assets: r("assets"),
  public: r("public"),
  "public/*": r("public/*"),
  "#app": r("node_modules/nuxt/dist/app"),
  "#app/*": r("node_modules/nuxt/dist/app/*"),
  "vue-demi": r("node_modules/nuxt/dist/app/compat/vue-demi"),
  "#head": r("node_modules/nuxt/dist/head/runtime"),
  "#head/*": r("node_modules/nuxt/dist/head/runtime/*"),
  "#imports": r(".nuxt/imports"),
  "#build": r(".nuxt"),
  "#build/*": r(".nuxt/*"),
  "#components": r(".nuxt/components"),
};
