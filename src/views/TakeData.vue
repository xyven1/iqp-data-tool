<template>
  <v-form class="fill-height" @submit.prevent="saveSession">
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
            <v-chip>
              Sessions Not Synced: {{ completedData.length }}
              <div class="pr-2" />
              <v-btn
                v-show="completedData.length > 0" id="oldDataEdit" variant="text" color="secondary" :min-width="0"
                class="px-2"
              >
                Edit
                <v-menu activator="parent">
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in completedData" :key="index"
                      @click="currentData = completedData.splice(index, 1)[0]"
                    >
                      <v-list-item-title>{{ item.location }}: {{ item.recorder }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ new Date(item.start!).toLocaleTimeString() }} on {{ new
                          Date(item.start!).toLocaleDateString() }}
                      </v-list-item-subtitle>
                      <template #append>
                        <v-btn
                          variant="text" color="error" :icon="mdiTrashCan"
                          @click.stop="completedData.splice(index, 1)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
              <v-btn
                variant="text" color="secondary" :disabled="completedData.length === 0 || syncing" :loading="syncing"
                :min-width="0" class="px-2" @click="sync"
              >
                Sync
              </v-btn>
            </v-chip>
            <v-chip v-if="activeSession && currentData.start" class="text-center">
              Current Session: {{ new Date(currentData.start).toLocaleDateString() }} {{
                new Date(currentData.start).toLocaleTimeString() }}
            </v-chip>
            <v-chip
              v-if="coords.latitude === Infinity || !isSupported" class="text-center text-red"
              :prepend-icon="mdiMapMarkerOff"
            >
              {{ coords.latitude === Infinity ? "Could not get location!" : "Make sure geolocation is supported" }}
            </v-chip>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn v-if="!activeSession" color="secondary" variant="flat" class="ma-1" @click="start">
              Start New Session
            </v-btn>
            <template v-else>
              <v-btn color="secondary" variant="flat" class="ma-1" @click="reset">
                Reset Session
              </v-btn>
              <v-btn v-if="activeSession" color="secondary" variant="flat" class="ma-1" type="submit">
                Save Session
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row />
      <v-row class="w-100 align-center justify-center flex-grow-0" no-gutters>
        <v-card :elevation="12" :max-width="600" class="w-100 h-100" density="compact">
          <v-card-text>
            <v-textarea v-model="comment.comment" hide-details density="compact" no-resize :rows="6" />
          </v-card-text>
          <v-card-actions>
            <v-chip>
              Comments: {{ currentData.comments.length }}
              <div class="pr-2" />
              <v-btn variant="text" color="secondary" :min-width="0" class="px-2">
                Edit
                <v-menu v-if="currentData.comments.length > 0" activator="parent">
                  <v-list>
                    <v-list-item
                      v-for="(c, index) in currentData.comments" :key="index"
                      @click="comment = currentData.comments[index]"
                    >
                      <v-list-item-title>
                        <use-time-ago
                          v-slot="{ timeAgo }" :time="new Date(c.time)" :show-second="true"
                          :update-interval="1"
                        >
                          {{ timeAgo }}
                        </use-time-ago>
                      </v-list-item-title>
                      <v-list-item-subtitle style="max-width: 200px;">
                        {{ c.comment }}
                      </v-list-item-subtitle>
                      <template #append>
                        <v-btn
                          variant="text" color="error" :icon="mdiTrashCan"
                          @click.stop="currentData.comments.splice(index, 1)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </v-chip>
            <v-spacer />
            <v-btn variant="flat" color="secondary" :disabled="comment.comment.length < 1" @click="saveComment">
              {{ comment.index === undefined ? 'Save Comment' : 'Save Changes' }}
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
import { Comment, Data, Locations, Members, NumberDataTypes } from '@/types/data';
import { mdiMapMarkerOff, mdiTrashCan } from '@mdi/js';
import { UseTimeAgo } from '@vueuse/components';
import { useGeolocation } from '@vueuse/core';
import { ref as dbRef, push } from "firebase/database";
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useDatabase } from 'vuefire';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';

const db = useDatabase();
const { currentData, currentUser, completedData } = storeToRefs(useAppStore());

const activeSession = computed(() => !!currentData.value?.start);

const { coords, isSupported } = useGeolocation();

const CommentDefault = (): Comment => ({
  comment: "",
  time: "",
  latitude: Infinity,
  longitude: Infinity,
})
const comment = ref<Comment>(CommentDefault());
function saveComment() {
  if (!activeSession.value || comment.value.comment.length < 1) return;
  if (comment.value.index === undefined) {
    comment.value.latitude = coords.value.latitude;
    comment.value.longitude = coords.value.longitude;
    comment.value.time = new Date().toISOString();
    comment.value.index = currentData.value.comments.length;
  }
  currentData.value.comments[comment.value.index] = comment.value;
  comment.value = CommentDefault();
}

function start() {
  currentData.value = Data();
  currentData.value.start = new Date().toISOString();
  console.log(JSON.stringify(currentData.value));
}
function reset() {
  if (!confirm("Are you sure you want to reset the current session? All data will be lost.")) return;
  currentData.value = Data();
}

console.log(completedData.value);
const submitting = ref(false);

const syncing = ref(false);
async function sync(): Promise<number> {
  if (syncing.value) return 0;
  syncing.value = true;
  const startingNum = completedData.value.length;
  const res = await Promise.allSettled(completedData.value.map(async (data) => {
    try {
      await push(dbRef(db, "entries"), data);
      return null;
    } catch (e) {
      return data;
    }
  }));
  completedData.value = res.filter((p): p is PromiseFulfilledResult<Data> => p.status === 'fulfilled' && p.value !== null).map((p) => p.value);
  const endingNum = completedData.value.length;
  syncing.value = false;
  return startingNum - endingNum;
}

async function saveSession(e: SubmitEventPromise) {
  if (!activeSession.value) {
    alert("Please start a session")
    return;
  }
  if (!(await e).valid) return;
  submitting.value = true;
  currentData.value.end = new Date().toISOString();
  currentData.value.recorder = currentUser.value;
  completedData.value.push(currentData.value)
  currentData.value = Data();
  if (await sync() === 0) alert("Failed to sync");
  submitting.value = false;
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

.no-gutters-spaced> {
  .v-row+.v-row {
    margin-top: 12px !important;
  }
}
</style>