<template>
  <v-container class="fill-height flex-column">
    <v-spacer />
    <div class="text-h2 mb-4">
      Welcome
    </div>
    <div class="text-center" style="font-size: 1.75em">
      This set of tools is intended for use during IQP projects to collect data
      during observation.
    </div>
    <v-spacer />
    <v-card
      v-if="!isInStandaloneMode"
      class="text-center"
      density="compact"
      :elevation="12"
    >
      <v-card-title> Install this application </v-card-title>
      <v-card-text>
        Install this application on your home screen for quick, easy and offline
        access when you're on the go.
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn :prepend-icon="mdiDownload" color="primary" @click="installPWA">
          Install
        </v-btn>
      </v-card-actions>
      <v-overlay
        v-model="iosInstallOverlay"
        class="d-flex flex-col ma-2 justify-center align-center"
      >
        <v-card class="text-center">
          <v-card-title>Install on IOS</v-card-title>
          <v-card-text>
            Tap the “share” icon and then tap on “Add to home screen”.
            <div class="d-flex">
              <v-img src="@/assets/iphone-main.png" />
              <v-img src="@/assets/iphone-next.png" />
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="error" @click="iosInstallOverlay = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay
        v-model="alreadyInstalledOverlay"
        class="d-flex flex-col ma-2 justify-center align-center"
      >
        <v-card class="text-center">
          <v-card-title>Already Installed!</v-card-title>
          <v-card-text class="d-flex align-center">
            The device already has the application installed! Check your apps
            for an app called "IQP Tools", with this icon:
            <v-img src="@/assets/icon.png" :width="80" />
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="error" @click="alreadyInstalledOverlay = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay
        v-model="unknownInstallOverlay"
        class="d-flex flex-col ma-2 justify-center align-center"
      >
        <v-card class="text-center">
          <v-card-title>Device Unknown</v-card-title>
          <v-card-text>
            The current device type is not known. Please look up directions for
            how to install a PWA for your particular platform (i.e. firefox on
            windows, opera on mac, etc.)
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="error" @click="unknownInstallOverlay = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { mdiDownload } from "@mdi/js";
import { ref } from "vue";
import { useDisplay } from "vuetify";
const { platform } = useDisplay();

const iosInstallOverlay = ref(false);
const alreadyInstalledOverlay = ref(false);
const unknownInstallOverlay = ref(false);
let installPromptEvent: BeforeInstallPromptEvent | null = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPromptEvent = e;
});
const isInStandaloneMode = window.matchMedia(
  "(display-mode: standalone)",
).matches;
async function installPWA() {
  let installed = false;
  //check if browser version supports the api
  if ("getInstalledRelatedApps" in window.navigator) {
    const relatedApps = await navigator.getInstalledRelatedApps();
    installed = relatedApps.length > 0;
  }
  if (installed) {
    alreadyInstalledOverlay.value = true;
  } else if (platform.value.ios) {
    iosInstallOverlay.value = true;
  } else if (installPromptEvent) {
    installPromptEvent.prompt();
  } else {
    unknownInstallOverlay.value = true;
  }
}
</script>
