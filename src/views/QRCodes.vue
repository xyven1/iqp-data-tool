<template>
  <v-container class="fill-height flex-column" fluid>
    <v-row class="w-100">
      <GoogleMap class="h-100 w-100" api-key="AIzaSyAsF0Boo8OBXxW2l9gCYduvF8nusQvHPls" :center="center" :zoom="15">
        <Marker :options="youMarkerOpts" />
        <Marker
          v-for="point of qrcodeList" :key="point.id" :ref="point.id" :options="{
            position: {
              lat: point.latitude,
              lng: point.longitude
            },
            draggable: false,
            clickable: true,
          }"
        >
          <InfoWindow>
            <v-btn :append-icon="mdiTrashCan" color="error" variant="text" @click="deleteQRCode(point.id)">
              Delete
            </v-btn>
          </InfoWindow>
        </Marker>
      </GoogleMap>
      <!-- <GMapMap :center="center" :zoom="15" class="h-100 w-100">
          <GMapMarker :position="center" :icon="'https://www.robotwoods.com/dev/misc/bluecircle.png'" />
          <GMapMarker
            v-for="point of qrcodeList" :key="point.id" :position="{
              lat: point.latitude,
              lng: point.longitude
            }"
            v-bind="props"
            @click="clickMarker(point.id)"
          />
        </GMapMap> -->
    </v-row>
    <v-row class="flex-grow-0">
      <v-col>
        <v-chip class="ma-1">
          Accuracy: {{ coords.accuracy }}
        </v-chip>
        <v-chip class="ma-1">
          Latitude: {{ coords.latitude }}
        </v-chip>
        <v-chip class="ma-1">
          Longitude: {{ coords.longitude }}
        </v-chip>
        <v-btn :prepend-icon="mdiMapMarkerPlus" color="primary" variant="tonal" @click="addPoint">
          Add Point
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { QRCode } from '@/types/qrcode';
import { mdiMapMarkerPlus, mdiTrashCan } from '@mdi/js';
import { useGeolocation } from '@vueuse/core';
import { push, ref as refDb, remove } from "firebase/database";
import { computed } from 'vue';
import { GoogleMap, InfoWindow, Marker } from 'vue3-google-map';
import { useDatabase, useDatabaseList } from 'vuefire';

const { coords } = useGeolocation();

const center = computed<google.maps.LatLngLiteral>(() => ({ lat: coords.value.latitude, lng: coords.value.longitude }));

const db = useDatabase();
const qrcodes = refDb(db, 'qrcodes');
const qrcodeList = useDatabaseList<QRCode>(qrcodes);

function addPoint() {
  push(qrcodes, {
    latitude: coords.value.latitude,
    longitude: coords.value.longitude,
  });
}

const youMarkerOpts = computed<google.maps.MarkerOptions>(() => ({
  position: {
    lat: coords.value.latitude,
    lng: coords.value.longitude
  },
  icon: {
    path: 0,
    scale: 10,
    fillOpacity: 1,
    strokeWeight: 2,
    fillColor: '#5384ED',
    strokeColor: '#ffffff',
  },
  draggable: false,
  clickable: false,
  zIndex: 0
}));

function deleteQRCode(id: string) {
  remove(refDb(db, 'qrcodes/' + id))
}

</script>