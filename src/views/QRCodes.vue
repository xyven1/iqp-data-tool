<template>
  <v-container class="fill-height flex-column" fluid>
    <v-row class="w-100 flex-column">
      <div class="flex-grow-1">
        <GoogleMap
          ref="mapRef" class="w-100 h-100" api-key="AIzaSyAsF0Boo8OBXxW2l9gCYduvF8nusQvHPls" :center="center"
          :zoom="15" :libraries="[
            'geometry'
          ]" :styles="[
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
          ]"
        >
          <CustomControl position="LEFT_BOTTOM">
            <v-btn class="v-btn-gmaps" variant="flat" icon @click="centering = true">
              <v-expand-transition>
                <v-icon
                  v-if="centering" style="position:absolute;" size="large" :icon="mdiCrosshairsGps"
                  color="#5384ed"
                />
                <v-icon v-else style="position:absolute;" size="large" :icon="mdiCrosshairs" color="black" />
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
import { QRCode } from '@/types/qrcode';
import { mdiCrosshairs, mdiCrosshairsGps, mdiMapMarkerPlus, mdiQrcode, mdiTrashCan } from '@mdi/js';
import { useGeolocation } from '@vueuse/core';
import { push, ref as refDb, remove } from "firebase/database";
import { computed, ref, watch } from 'vue';
import { Circle, CustomControl, GoogleMap, InfoWindow, Marker } from 'vue3-google-map';
import { useDatabase, useDatabaseList } from 'vuefire';
import { useTheme } from 'vuetify/lib/framework.mjs';

const theme = useTheme();
const { coords } = useGeolocation();
const infoWindows = ref<google.maps.InfoWindow[]>([]);

const centering = ref(true);

const center = computed<google.maps.LatLngLiteral>(() =>
  centering.value ?
    {
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }
    : {
      lat: 0,
      lng: 0
    });

const db = useDatabase();
const qrcodes = refDb(db, 'qrcodes');
const qrcodeList = useDatabaseList<QRCode>(qrcodes);

const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null);
let api: typeof google.maps | null = null;
watch(() => mapRef.value?.ready, (ready) => {
  if (!ready) return;
  api = mapRef.value?.api ?? null;
  const map = mapRef.value?.map;
  if (!api || !map) return;
  api.event.addListener(map, 'click', () => {
    infoWindows.value.forEach((infoWindow) => infoWindow.close());
  });

  api.event.addListener(map, 'dragstart', () => {
    centering.value = false;
    infoWindows.value.forEach((infoWindow) => infoWindow.close());
  });
});

function addPoint() {
  if (api === null) return;
  let a = api;
  for (const qrcode of qrcodeList.value) {
    const distance = a.geometry.spherical.computeDistanceBetween(
      new a.LatLng(qrcode.latitude, qrcode.longitude),
      new a.LatLng(coords.value.latitude, coords.value.longitude)
    );
    if (distance < 1) {
      alert("There already appears to be a qrcode at this location");
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
</style>
