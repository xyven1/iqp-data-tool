<template>
  <v-container class="fill-height flex-column" fluid>
    <v-row class="w-100 flex-column">
      <div class="flex-grow-1">
        <GoogleMap
          ref="mapRef" class="w-100 h-100" api-key="AIzaSyAsF0Boo8OBXxW2l9gCYduvF8nusQvHPls" :center="center"
          :zoom="12" :libraries="[
            'geometry'
          ]" :styles="[...(darkMode ? gmapsDark : []), ...[
            {
              featureType: 'poi',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'transit',
              stylers: [
                { visibility: 'off' }
              ]
            },
          ]]"
        >
          <CustomControl position="LEFT_BOTTOM">
            <v-btn class="v-btn-gmaps" variant="flat" icon theme="light" @click="centering = true; updateCenter(coords)">
              <v-expand-transition>
                <v-icon
                  v-if="centering" style="position:absolute;" size="large" :icon="mdiCrosshairsGps"
                  color="#5384ed"
                />
                <v-icon v-else style="position:absolute;" size="large" :icon="mdiCrosshairs" />
              </v-expand-transition>
            </v-btn>
          </CustomControl>
          <Marker
            :options="{
              position: {
                lat: coords.latitude,
                lng: coords.longitude
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
              zIndex: 1
            }"
          />
          <Circle
            :options="{
              center: {
                lat: coords.latitude,
                lng: coords.longitude
              },
              radius: coords.accuracy,
              fillOpacity: .1,
              strokeWeight: .5,
              strokeOpacity: 1,
              fillColor: '#5384ED',
              strokeColor: '#5384ED',
              draggable: false,
              clickable: false,
              editable: false,
              zIndex: 0
            }"
          />
          <Marker
            v-for="point of qrcodeList" :key="point.id" :options="{
              position: {
                lat: point.latitude,
                lng: point.longitude
              },
              icon: {
                path: mdiQrcode,
                fillColor: 'white',
                strokeColor: theme.current.value.colors.primary,
                anchor: {
                  x: 12,
                  y: 12,
                } as google.maps.Point,
                scale: 1.5,
              },
              zIndex: 5,
              draggable: false,
              clickable: true,
            }"
          >
            <InfoWindow ref="infoWindows">
              <v-btn :append-icon="mdiTrashCan" color="error" variant="text" @click="deleteQRCode(point.id)">
                Delete
              </v-btn>
            </InfoWindow>
          </Marker>
        </GoogleMap>
      </div>
      <div class="flex-grow-0 d-flex flex-wrap justify-center align-center">
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
      <v-btn :prepend-icon="mdiMapMarkerPlus" color="primary" variant="tonal" class="ma-1" @click="addPoint">
        Add QRCode
      </v-btn>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store/theme';
import { QRCode } from '@/types/qrcode';
import { mdiCrosshairs, mdiCrosshairsGps, mdiMapMarkerPlus, mdiQrcode, mdiTrashCan } from '@mdi/js';
import { useGeolocation } from '@vueuse/core';
import { push, ref as refDb, remove } from "firebase/database";
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { Circle, CustomControl, GoogleMap, InfoWindow, Marker } from 'vue3-google-map';
import { dark as gmapsDark } from 'vue3-google-map/themes';
import { useDatabase, useDatabaseList } from 'vuefire';
import { useTheme } from 'vuetify/lib/framework.mjs';

// Themeing
const { darkMode } = storeToRefs(useThemeStore());
const theme = useTheme();

// Maps
const { coords } = useGeolocation();
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null);
const infoWindows = ref<google.maps.InfoWindow[]>([]);
const api = ref<typeof google.maps | null>(null);
watch(() => mapRef.value?.ready, (ready) => {
  if (!ready) return;
  api.value = mapRef.value?.api ?? null;
  const map = mapRef.value?.map;
  if (!api.value || !map) return;
  api.value.event.addListener(map, 'mousedown', () => infoWindows.value.forEach((infoWindow) => infoWindow.close()));
  api.value.event.addListener(map, 'drag', () => centering.value = false);
});
const centering = ref(true);
const center = ref<google.maps.LatLngLiteral>({
  lat: 0,
  lng: 0
});

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
const qrcodes = refDb(db, 'qrcodes');
const qrcodeList = useDatabaseList<QRCode>(qrcodes);
function addPoint() {
  if (api.value === null) return;
  let a = api.value;
  for (const qrcode of qrcodeList.value) {
    const distance = a.geometry.spherical.computeDistanceBetween(
      new a.LatLng(qrcode.latitude, qrcode.longitude),
      new a.LatLng(coords.value.latitude, coords.value.longitude)
    );
    if (distance < 1) {
      if (confirm("There already appears to be a qrcode at this location, are you sure you would like to add?"))
        break;
      else
        return;
    }
  }
  push(qrcodes, {
    latitude: coords.value.latitude,
    longitude: coords.value.longitude,
  });
}
function deleteQRCode(id: string) {
  remove(refDb(db, 'qrcodes/' + id))
}
</script>

<style lang="scss">
.v-btn-gmaps {
  border-radius: 9999px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  margin: 10px;
  min-width: 0px;
}

.mapdiv>div>div>div {
  background-color: rgb(var(--v-theme-background));
}
</style>
