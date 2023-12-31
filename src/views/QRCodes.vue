<template>
  <v-container class="fill-height flex-column" fluid>
    <v-row class="w-100 flex-column">
      <div class="flex-grow-1">
        <GoogleMap
          ref="mapRef"
          class="w-100 h-100"
          api-key="AIzaSyAsF0Boo8OBXxW2l9gCYduvF8nusQvHPls"
          :center="center"
          :zoom="12"
          :libraries="['geometry']"
          :styles="[
            ...(darkMode ? gmapsDark : []),
            ...[
              {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                stylers: [{ visibility: 'off' }],
              },
            ],
          ]"
        >
          <CustomControl position="LEFT_BOTTOM">
            <div class="d-flex flex-column">
              <v-btn
                class="v-btn-gmaps"
                variant="flat"
                icon
                theme="light"
                @click="viewAllCodes"
              >
                <v-icon size="large" :icon="mdiCircleExpand" />
              </v-btn>
              <v-btn
                class="v-btn-gmaps"
                variant="flat"
                icon
                theme="light"
                @click="cluster = !cluster"
              >
                <v-expand-transition>
                  <v-icon
                    v-if="cluster"
                    class="position-absolute"
                    size="large"
                    :icon="mdiCircleMultipleOutline"
                  />
                  <v-icon
                    v-else
                    class="position-absolute"
                    size="large"
                    :icon="mdiNumeric9Circle"
                  />
                </v-expand-transition>
              </v-btn>
              <v-btn
                class="v-btn-gmaps"
                variant="flat"
                icon
                theme="light"
                @click="dots = !dots"
              >
                <v-expand-transition>
                  <v-icon
                    v-if="dots"
                    class="position-absolute"
                    size="large"
                    :icon="mdiQrcode"
                    color="secondary"
                  />
                  <v-icon
                    v-else
                    class="position-absolute"
                    size="x-small"
                    :icon="mdiCircleOutline"
                    color="secondary"
                  />
                </v-expand-transition>
              </v-btn>
              <v-btn
                class="v-btn-gmaps"
                variant="flat"
                icon
                theme="light"
                @click="
                  centering = true;
                  updateCenter(coords);
                "
              >
                <v-expand-transition>
                  <v-icon
                    v-if="centering"
                    class="position-absolute"
                    size="large"
                    :icon="mdiCrosshairsGps"
                    color="#5384ed"
                  />
                  <v-icon
                    v-else
                    class="position-absolute"
                    size="large"
                    :icon="mdiCrosshairs"
                  />
                </v-expand-transition>
              </v-btn>
            </div>
          </CustomControl>
          <Marker
            :options="{
              position: {
                lat: coords.latitude,
                lng: coords.longitude,
              },
              icon: {
                path: 0,
                scale: 10,
                fillOpacity: 1,
                strokeWeight: 3,
                fillColor: '#5384ED',
                strokeColor: '#ffffff',
              },
              draggable: false,
              clickable: false,
              zIndex: 1,
            }"
          />
          <Circle
            :options="{
              center: {
                lat: coords.latitude,
                lng: coords.longitude,
              },
              radius: coords.accuracy,
              fillOpacity: 0.1,
              strokeWeight: 0.5,
              strokeOpacity: 1,
              fillColor: '#5384ED',
              strokeColor: '#5384ED',
              draggable: false,
              clickable: false,
              editable: false,
              zIndex: 0,
            }"
          />
          <component
            :is="cluster ? MarkerCluster : 'div'"
            :options="{
              algorithm: superCluster,
            }"
          >
            <Marker
              v-for="point of qrcodeList"
              :key="point.id"
              :options="{
                position: {
                  lat: point.latitude,
                  lng: point.longitude,
                },
                icon: {
                  path: dots ? mdiCircleSmall : mdiQrcode,
                  strokeColor: theme.current.value.colors.secondary,
                  fillColor: theme.current.value.colors.secondary,
                  fillOpacity: dots ? 0.7 : 0,
                  anchor: {
                    x: 12,
                    y: 12,
                  } as google.maps.Point,
                  scale: dots ? 2 : 1.5,
                },
                zIndex: 5,
                draggable: false,
                clickable: true,
              }"
            >
              <InfoWindow ref="infoWindows">
                <v-btn
                  :append-icon="mdiTrashCan"
                  color="error"
                  variant="text"
                  @click="deleteQRCode(point)"
                >
                  Delete
                </v-btn>
              </InfoWindow>
            </Marker>
          </component>
        </GoogleMap>
      </div>
      <div class="flex-grow-0 d-flex flex-wrap justify-center align-center">
        <v-chip class="ma-1">
          Total Codes: {{ qrcodeList.length }}
        </v-chip>
        <v-chip class="ma-1">
          Accuracy: {{ coords.accuracy.toFixed(2) }}
        </v-chip>
        <v-chip class="ma-1">
          Latitude: {{ coords.latitude }}
        </v-chip>
        <v-chip class="ma-1">
          Longitude: {{ coords.longitude }}
        </v-chip>
      </div>
    </v-row>
    <v-row class="w-100 flex-grow-0 justify-end pa-1">
      <v-btn
        :prepend-icon="mdiMapMarkerPlus"
        color="secondary"
        variant="tonal"
        class="ma-1"
        @click="addPoint"
      >
        Add QRCode
      </v-btn>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useThemeStore } from "@/store/theme";
import { QRCode } from "@/types/qrcode";
import { SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import {
mdiCircleExpand,
mdiCircleMultipleOutline,
mdiCircleOutline,
mdiCircleSmall,
mdiCrosshairs,
mdiCrosshairsGps,
mdiMapMarkerPlus,
mdiNumeric9Circle,
mdiQrcode,
mdiTrashCan,
} from "@mdi/js";
import { useGeolocation } from "@vueuse/core";
import { push, ref as refDb, remove } from "firebase/database";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import {
Circle,
CustomControl,
GoogleMap,
InfoWindow,
Marker,
MarkerCluster,
} from "vue3-google-map";
import { dark as gmapsDark } from "vue3-google-map/themes";
import { useDatabase, useDatabaseList } from "vuefire";
import { useTheme } from "vuetify/lib/framework.mjs";

// Themeing
const { darkMode } = storeToRefs(useThemeStore());
const theme = useTheme();

// Maps
const superCluster = new SuperClusterAlgorithm({
  maxZoom: 19,
});
const cluster = ref(false);
const dots = ref(false);
const { coords } = useGeolocation();
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null);
const infoWindows = ref<google.maps.InfoWindow[]>([]);
const api = ref<typeof google.maps | null>(null);
const map = ref<google.maps.Map | null>(null);
watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) return;
    api.value = mapRef.value?.api ?? null;
    map.value = mapRef.value?.map ?? null;
    if (!api.value || !map.value) return;
    api.value.event.addListener(map.value, "mousedown", () =>
      infoWindows.value.forEach((infoWindow) => infoWindow.close()),
    );
    api.value.event.addListener(map.value, "drag", () => {
      centering.value = false;
    });
  },
);
const centering = ref(true);
const center = ref<google.maps.LatLngLiteral>({
  lat: 64.14,
  lng: -21.9,
});
function viewAllCodes() {
  if (!api.value || !map.value) return;
  const bound = new api.value.LatLngBounds();
  for (const qrcode of qrcodeList.value)
    bound.extend(new api.value.LatLng(qrcode.latitude, qrcode.longitude));
  map.value.fitBounds(bound);
}

let counter = 0;
function getCycle(): number {
  counter = (counter + 1) % 10;
  return 1e-10 * counter;
}
function updateCenter(coords: GeolocationCoordinates | false) {
  if (!coords) return;
  center.value = {
    lat: coords.latitude + getCycle(),
    lng: coords.longitude,
  };
}
watch(() => centering.value && coords.value, updateCenter);

// Database
const db = useDatabase();
const qrcodes = refDb(db, "qrcodes");
const qrcodeList = useDatabaseList<QRCode>(qrcodes);
function addPoint() {
  if (api.value === null) return;
  let a = api.value;
  for (const qrcode of qrcodeList.value) {
    const distance = a.geometry.spherical.computeDistanceBetween(
      new a.LatLng(qrcode.latitude, qrcode.longitude),
      new a.LatLng(coords.value.latitude, coords.value.longitude),
    );
    if (distance < 1) {
      if (
        confirm(
          "There already appears to be a qrcode at this location, are you sure you would like to add?",
        )
      )
        break;
      else return;
    }
  }
  push(qrcodes, {
    latitude: coords.value.latitude,
    longitude: coords.value.longitude,
  });
}
function deleteQRCode(
  point: QRCode & {
    readonly id: string;
  },
) {
  push(refDb(db, "qrcodes__trash"), point).then(() =>
    remove(refDb(db, "qrcodes/" + point.id)),
  );
}
</script>

<style lang="scss">
.v-btn-gmaps {
  border-radius: 9999px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  margin: 10px;
  min-width: 0px;
}

.mapdiv > div > div > div {
  background-color: rgb(var(--v-theme-background));
}
</style>
