<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
        <v-chip-group v-model="groupBy" multiple class="align-center">
          <span class="text-body-1 mr-1">
            Group By:
          </span>
          <v-chip v-for="(group, i) of groupBys" :key="i" :value="group" filter variant="tonal" color="primary">
            {{ group.title }}
          </v-chip>
        </v-chip-group>
        <v-data-table
          :headers="headers" :items="entries" :search="search" :group-by="groupBy" :items-per-page="10"
          density="compact"
        >
          <template #item.actions="{ item }">
            <v-btn
              :icon="mdiTrashCan" color="error" variant="text" @click="() => {
                remove(dbRef(db, 'entries/' + item.key))
              }"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { Data, NumberDataTypes } from '@/types/data';
import { mdiTrashCan } from '@mdi/js';
import { ref as dbRef, remove } from 'firebase/database';
import { Ref, ref, watch } from 'vue';
import { useDatabase, useDatabaseList } from 'vuefire';
const db = useDatabase();
const entriesRef = dbRef(db, 'entries')
const entries = useDatabaseList<Data>(entriesRef)

const search = ref('')
const groupBy = ref([])

watch(groupBy, v => {
  console.log(v)
});

const groupBys: DataTableHeader[] = [{
  title: "Recorder",
  key: "recorder",
  sortable: true
}, {
  title: "Location",
  key: "location",
  sortable: true
}];
const headers: Ref<DataTableHeader[]> = ref([{
  title: "Recorder",
  key: "recorder",
  sortable: true
}, {
  title: "Location",
  key: "location",
  sortable: true
}]);
headers.value.push(...Object.entries(NumberDataTypes).map(([name, type]) => ({
  title: name,
  key: type,
  sortable: true,
})))
headers.value.push({
  title: 'Actions',
  key: 'actions',
  sortable: false,
})

type DataTableHeader = {
  title: string;
  key: string;
  sortable: boolean;
}
</script>