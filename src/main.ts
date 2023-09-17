/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import { registerSW } from "virtual:pwa-register";
import { initializeAuth } from "./utils/auth";

registerSW({ immediate: true });
initializeAuth();

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
