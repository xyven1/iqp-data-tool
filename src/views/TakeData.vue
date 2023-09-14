<template>
  <v-form class="fill-height" :disabled="submitting" @submit.prevent="end">
    <v-container class="fill-height flex-column no-gutters-spaced">
      <v-row class="w-100 flex-grow-0 align-center justify-center" no-gutters>
        <v-card :elevation="12" :max-width="400" class="w-100" density="compact">
          <v-card-text align="center">
            <v-select
              v-model="currentUser" :items="Members" label="Current User" outlined dense clearable
              validate-on="input" :rules="[v => !activeSession || !!v || 'Item is required']" density="compact"
              hide-details="auto"
            />
            <v-select
              v-model="currentData.location" :items="Locations" label="Location" outlined dense clearable
              :disabled="!activeSession" validate-on="input" :rules="[v => !!v || 'Item is required']" density="compact"
              hide-details="auto"
            />
            <p v-if="activeSession && currentData.start" class="text-center">
              Current Session: {{ new Date(currentData.start).toLocaleDateString() }} {{
                new Date(currentData.start).toLocaleTimeString() }}
            </p>
            <v-chip
              v-if="coords.latitude === Infinity || !isSupported" class="text-center text-red"
              :prepend-icon="mdiMapMarkerOff"
            >
              {{ coords.latitude === Infinity ? "Could not get location!" : "Make sure geolocation is supported" }}
            </v-chip>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="secondary" variant="flat" class="ma-1" @click="start">
              Start {{ activeSession ? 'New' : '' }} Session
            </v-btn>
            <v-btn v-if="activeSession" color="secondary" variant="flat" class="ma-1" type="submit">
              End Session
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row />
      <v-row class="w-100 align-center justify-center flex-grow-0" no-gutters>
        <v-card :elevation="12" :max-width="600" class="w-100 h-100" density="compact">
          <v-card-text>
            <v-textarea v-model="comment" hide-details density="compact" no-resize :rows="6" />
          </v-card-text>
          <v-card-actions>
            <v-chip>
              Comments: {{ currentData.comments.length }}
            </v-chip>
            <v-spacer />
            <v-btn variant="flat" color="secondary" @click="addComment">
              Add Comment
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row class="w-100 align-center justify-center flex-grow-0" no-gutters>
        <v-card :elevation="12" density="compact">
          <v-card-text>
            <v-row v-for="([name, type], i) of Object.entries(NumberDataTypes)" :key="i" no-gutters>
              <v-col class="d-flex py-1 align-center">
                <div class="text-body-1 mr-2">
                  {{ name }}
                </div>
                <v-spacer />
                <number-chip
                  v-model="currentData[type]" :inner="5" :outer="1" :min="0" :max="500"
                  style="height: 35px; min-width: 240px; max-width: 240px; width: 240px"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </v-form>
  <v-overlay :model-value="submitting" class="align-center justify-center" persistent>
    <v-progress-circular indeterminate :size="70" />
  </v-overlay>
</template>

<script lang="ts" setup>
import NumberChip from '@/components/NumberChip.vue';
import { useAppStore } from '@/store/app';
import { Data, Locations, Members, NumberDataTypes } from '@/types/data';
import { mdiMapMarkerOff } from '@mdi/js';
import { useGeolocation } from '@vueuse/core';
import { ref as dbRef, push } from "firebase/database";
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useDatabase } from 'vuefire';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';

const db = useDatabase();
const { currentData, currentUser } = storeToRefs(useAppStore());

const activeSession = computed(() => !!currentData.value?.start);

const { coords, isSupported } = useGeolocation();
const comment = ref('');
function addComment() {
  if (!activeSession.value || comment.value.length < 1) return;
  currentData.value.comments.push({
    comment: comment.value,
    time: new Date(),
    latitude: coords.value.latitude,
    longitude: coords.value.longitude,
  });
  comment.value = '';
}

function start() {
  currentData.value = Data();
  currentData.value.start = new Date().toISOString();
  console.log(JSON.stringify(currentData.value));
}
const submitting = ref(false);

async function end(e: SubmitEventPromise) {
  if (!activeSession.value) {
    alert("Please start a session")
    return;
  }
  if (!(await e).valid) return;
  try {
    submitting.value = true;
    currentData.value.end = new Date().toISOString();
    currentData.value.recorder = currentUser.value;
    await push(dbRef(db, "entries"), currentData.value);
    currentData.value = Data();
  } catch (e) {
    alert("Please sign in")
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.v-card--density-compact {
  .v-card-text+.v-card-actions {
    margin-top: -1rem !important;
  }
}

.v-card-text>*+* {
  margin-top: 0.25rem;
}

.no-gutters-spaced > {
  .v-row+.v-row {
    margin-top: 12px !important;
  }
}
</style>