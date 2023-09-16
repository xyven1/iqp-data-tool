/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { VueFire, VueFireAuth } from "vuefire";
import router from "../router";
import pinia from "../store";
import { firebaseApp } from "../utils/firebase";
import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";
// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(VueFire, {
      firebaseApp,
      modules: [VueFireAuth()],
    })
    .use(vuetify)
    .use(router)
    .use(pinia);
}
