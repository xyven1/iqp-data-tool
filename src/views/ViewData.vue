<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="entries" :items-per-page="10" density="compact">
          <template #item.actions="{ item }">
            <v-btn
              :icon="mdiTrashCan" color="error" variant="text"
              @click="() => {
                remove(ref(db, 'entries/' + item.key))
                console.log(item)}"
            />
          </template>  
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { db } from '@/firebase';
import { Data } from '@/types/data';
import { mdiTrashCan } from '@mdi/js';
import { ref, remove } from 'firebase/database';
import { useDatabaseList } from 'vuefire';

const entriesRef = ref(db, 'entries')
const entries = useDatabaseList<Data>(entriesRef)
// entries.value[0].star
const headers = [
  { title: 'Recorder', key: 'recorder' },
  { title: 'Date', key: 'startTime'},
  { title: 'Riding', key: 'numberData.riding.value' },
  { title: 'Fallen', key: 'numberData.parkedFallen.value' },
  { title: 'Upright', key: 'numberData.parkedUpright.value' },
  { title: '', key: 'actions', sortable: false },
];
</script>