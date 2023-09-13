<template>
  <v-container class="fill-height flex-column">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <h1>Take Data</h1>
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="currentUser"
              v-card-text
              :items="Members"
              label="Current User"
              outlined
              dense
              clearable
            />  
            <v-card-actions>
              <v-btn color="primary" @click="start">
                Start Session
              </v-btn>
              <v-btn color="primary" @click="end">
                End Session
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-spacer />
    <div>
      <v-row v-for="(number, i) of currentData?.numberData" :key="i" no-gutters>
        <v-col align="center">
          <div class="text-h5 text-center">
            {{ number.name }}
          </div>
          <NumberChip v-model="number.value" :min="0" :max="500" style="height: 35px;" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import NumberChip from '@/components/NumberChip.vue';
import { useAppStore } from '@/store/app';
import { Data, Members } from '@/types/data';
import { storeToRefs } from 'pinia';

const { currentData, currentUser } = storeToRefs(useAppStore());

function start() {
  currentData.value = Data();
}
function end() {

}
</script>
