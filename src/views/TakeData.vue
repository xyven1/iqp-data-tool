<template>
  <v-form class="fill-height" :disabled="submitting" @submit.prevent="end">
    <v-container class="fill-height flex-column">
      <v-card :elevation="12" width="100%" :max-width="400">
        <v-card-text align="center">
          <v-select
            v-model="currentUser" :items="Members" label="Current User" outlined dense clearable
            validate-on="input" :rules="[v => !currentData.startTime || !!v || 'Item is required']" density="compact" hide-details="auto"
          />
          <v-select
            v-model="currentData.location" :items="Locations" label="Location" outlined dense clearable
            :disabled="!currentData.startTime"
            validate-on="input" :rules="[v => !!v || 'Item is required']" density="compact" hide-details="auto"
          />
          <span v-if="currentData.startTime" class="text-center">
            Current Session: {{ currentData.startTime?.toLocaleDateString() }} {{ currentData.startTime?.toLocaleTimeString() }}
          </span>
        </v-card-text>
      </v-card>
      <v-spacer class="pa-1" />
      <v-card :elevation="12">
        <v-card-text>
          <v-row v-for="(number, i) of currentData?.numberData" :key="i" no-gutters>
            <v-col align="center">
              <div class="text-h5 text-center">
                {{ number.name }}
              </div>
              <NumberChip v-model="number.value" :inner="5" :outer="1" :min="0" :max="500" style="height: 35px;" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div>
        <v-btn color="secondary" variant="flat" class="ma-1" @click="start">
          Start {{ currentData.startTime ? 'New' : '' }} Session
        </v-btn>
        <v-btn v-if="currentData.startTime" color="secondary" variant="flat" class="ma-1" type="submit">
          End Session
        </v-btn>
      </div>
    </v-container>
  </v-form>
  <v-overlay :model-value="submitting" class="align-center justify-center" persistent>
    <v-progress-circular indeterminate :size="70" />
  </v-overlay>
</template>

<script lang="ts" setup>
import NumberChip from '@/components/NumberChip.vue';
import { db } from '@/firebase';
import { useAppStore } from '@/store/app';
import { Data, Locations, Members } from '@/types/data';
import { ref as dbRef, push } from "firebase/database";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';

const { currentData, currentUser } = storeToRefs(useAppStore());

function start() {
  currentData.value = Data();
  currentData.value.startTime = new Date();
}
const submitting = ref(false);

async function end(e: SubmitEventPromise) {
  if (!currentData.value) {
    alert("Please start a session")
    return;
  }
  if(!(await e).valid) return;
  try {
    submitting.value = true;
    currentData.value.endTime = new Date();
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
