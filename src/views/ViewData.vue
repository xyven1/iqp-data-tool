<template>
  <v-container fluid>
    <!-- class="h-100 d-flex flex-column" -->
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-title> Table </v-expansion-panel-title>
        <v-expansion-panel-text class="pt-2">
          <v-row class="flex-grow-0 justify-center align-center">
            <v-col style="min-width: min(400px, 100%)">
              <v-text-field
                v-model="search"
                label="Search"
                single-line
                hide-details
              />
            </v-col>
            <v-col class="v-col-auto">
              <v-switch
                v-model="colors"
                label="Toggle Colors"
                hide-details
                density="compact"
              />
            </v-col>
            <v-col class="v-col-auto">
              <v-btn
                hide-details
                :prepend-icon="mdiSortVariantRemove"
                :disabled="sortBy.length === 0"
                color="primary"
                variant="text"
                @click="sortBy.length = 0"
              >
                Reset Sort
              </v-btn>
            </v-col>
            <v-col class="v-col-auto">
              <v-chip-group
                v-model="groupBy"
                multiple
                class="align-center justify-center"
              >
                <span class="text-body-1 mr-1"> Group By: </span>
                <v-chip
                  v-for="(group, i) of groupBys"
                  :key="i"
                  :value="group"
                  filter
                  variant="tonal"
                  color="secondary"
                >
                  {{ group.title }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col class="v-col-auto">
              <v-btn
                hide-details
                :prepend-icon="mdiExport"
                color="primary"
                variant="text"
                @click="exportData"
              >
                Export
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="flex-grow-1 overflow-auto">
            <v-col ref="tableCol">
              <v-data-table
                v-model:sort-by="sortBy"
                :headers="headers"
                :items="entries"
                :search="search"
                :group-by="groupBy"
                :items-per-page="-1"
                :custom-key-sort="{
                  start: (a, b) =>
                    new Date(a).getTime() - new Date(b).getTime(),
                }"
                multi-sort
                density="compact"
              >
                <!-- <template #group-header="{ item, toggleGroup, columns, isGroupOpen }">
          <v-hover>
            <template #default="{ isHovering }">
              <tr
                class="v-data-table-group-header-row"
                style="cursor: pointer"
                @click="() => toggleGroup(item)"
              >
                <td
                  class="v-data-table__td v-data-table-column--align-start v-data-table-group-header-row__column v-data-table-group-header-row__column"
                  :style="{
                    '--v-data-table-group-header-row-depth': item.depth,
                    backgroundColor: isHovering ? 'red' : '',
                  }"
                >
                  <div class="d-flex">
                    <v-icon
                      :icon="
                        isGroupOpen(item) ? mdiChevronDown : mdiChevronRight
                      "
                    />
                    {{ isHovering ? "test" : "" }}
                    {{ item.value }} ({{ item.items.length }})
                  </div>
                </td>
                <td :colspan="columns.length" />
              </tr>
            </template>
          </v-hover>
        </template> -->
                <template #data-table-group="{ item, count, props }">
                  <td
                    class="v-data-table__td v-data-table-column--align-start v-data-table-group-header-row__column v-data-table-group-header-row__column"
                  >
                    <v-btn
                      :prepend-icon="props.icon as string"
                      variant="text"
                      density="default"
                      class="h-100 rounded-0"
                      style="
                        font-weight: inherit;
                        text-transform: none;
                        letter-spacing: normal;
                      "
                      @click="props.onClick as Function"
                    >
                      {{ item.value }} ({{ count }})
                    </v-btn>
                  </td>
                </template>
                <template
                  v-for="(e, i) of Object.values(NumberDataTypes).map((t) => ({
                    slot: `item.${t}` as `item.${string}`,
                    type: t,
                  }))"
                  #[e.slot]="{ item }"
                  :key="i"
                >
                  <div
                    :style="{
                      background: colors
                        ? `${proportionToColor(item.raw, e.type, 1, 0.6)}`
                        : 'transparent',
                    }"
                    style="transition: background-color 0.5s"
                    class="h-100 w-100 d-flex align-center justify-center"
                  >
                    <span>{{ item.raw[e.type] }}</span>
                    <span
                      style="transition: flex 0.5s"
                      :style="{ flex: colors ? 0 : 'auto' }"
                    />
                  </div>
                </template>
                <template #expanded-row="{ item, columns }">
                  <tr>
                    <td :colspan="columns.length">
                      <div class="w-100 d-flex justify-center">
                        <v-chip
                          v-for="(comment, i) of item.raw.comments"
                          :key="i"
                          class="ma-1"
                        >
                          {{ comment.comment }}
                        </v-chip>
                      </div>
                    </td>
                  </tr>
                </template>
                <template #[`item.start`]="{ item }">
                  <span class="text-no-wrap">
                    {{
                      ((item) => {
                        const date = new Date(item.raw.start);
                        return `${date.toLocaleString("default", {
                          weekday: "short",
                        })} ${date.toLocaleString("default", {
                          month: "short",
                          day: "numeric",
                        })}`;
                      })(item)
                    }}
                  </span>
                </template>
                <template #[`item.end`]="{ item }">
                  {{
                    new Date(
                      new Date(item.raw.end).getTime() -
                        new Date(item.raw.start).getTime(),
                    )
                      .toISOString()
                      .substring(11, 19)
                  }}
                </template>
                <template #[`item.time`]="{ item }">
                  <span class="text-no-wrap">
                    {{
                      new Date(item.raw.start).toLocaleString("default", {
                        hour: "numeric",
                      })
                    }}
                  </span>
                </template>
                <template
                  #[`item.comments`]="{ item, toggleExpand, isExpanded }"
                >
                  <div class="d-flex w-100 h-100 align-center">
                    <span class="mr-4 flex-grow-1 text-center">{{
                      item.raw.comments?.length ?? 0
                    }}</span>
                    <v-btn
                      class="rounded-0 h-100"
                      variant="text"
                      icon
                      :disabled="(item.raw.comments?.length ?? 0) === 0"
                      @click="() => toggleExpand(item)"
                    >
                      <v-icon
                        :icon="
                          isExpanded(item) ? mdiChevronDown : mdiChevronRight
                        "
                      />
                    </v-btn>
                  </div>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    color="error"
                    variant="text"
                    height="100%"
                    class="rounded-0"
                    @click="
                      () => {
                        console.log(item);
                        push(dbRef(db, 'entries__trash/'), item.raw).then(
                          (a) => {
                            remove(dbRef(db, 'entries/' + item.raw.id));
                          },
                        );
                      }
                    "
                  >
                    <v-icon :icon="mdiTrashCan" :size="24" />
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title> Analysis </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p>
            Scooters per Bike (Riding):
            {{ (averages.all.riding / averages.all.bikeRiding).toFixed(2) }}
          </p>
          <div
            v-for="([location, avgs], i) of Object.entries(averages)"
            :key="i"
          >
            <br>
            <h3>{{ location }}:</h3>
            <v-divider />
            <p
              v-for="([name, type], j) of Object.entries(NumberDataTypes)"
              :key="j"
            >
              {{ name }}: {{ avgs[type].toFixed(2) }}
            </p>
            <p>
              Total Scooters:
              {{ avgs.totalScooters }}
            </p>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script setup lang="ts">
import { Data, Locations, NumberDataSet, NumberDataTypes } from "@/types/data";
import {
mdiChevronDown,
mdiChevronRight,
mdiExport,
mdiSortVariantRemove,
mdiTrashCan,
} from "@mdi/js";
import { saveAs } from "file-saver";
import {
ref as dbRef,
orderByChild,
push,
query,
remove,
} from "firebase/database";
import { Ref, computed, ref } from "vue";
import { useDatabase, useDatabaseList } from "vuefire";

const db = useDatabase();

//Analysis
function getAverages(entries: Data[]) {
  const stats: {
    [location: string]: NumberDataSet & {
      totalScooters: number;
      count: number;
    };
    all: NumberDataSet & {
      totalScooters: number;
      count: number;
    };
  } = {
    all: { ...NumberDataSet(), totalScooters: 0, count: 0 },
  };
  for (const l of Locations)
    stats[l] = { ...NumberDataSet(), totalScooters: 0, count: 0 };

  for (const entry of entries) {
    for (const stat of [stats.all, stats[entry.location]]) {
      for (const type of Object.values(NumberDataTypes))
        stat[type] += entry[type];
      stat.totalScooters +=
        entry.parkedFallen + entry.parkedUpright + entry.riding;
      stat.count++;
    }
  }
  for (const l of [...Locations, "all"]) {
    const stat = stats[l];
    for (const type of Object.values(NumberDataTypes)) {
      stat[type] /= stat.count;
    }
    stat.totalScooters /= stat.count;
  }
  return stats;
}
const averages = computed(() => getAverages(entries.value));

// Data Table
const entries = useDatabaseList<Data>(
  query(dbRef(db, "entries"), orderByChild("start")),
);
const search = ref("");
const groupBy = ref<readonly SortItem[]>([]);
const sortBy = ref<SortItem[]>([]);
function exportData() {
  if (entries.value.length === 0) return;
  const objHeaders = Object.keys(entries.value[0]);
  const header = headers.value
    .map((v) => v.key)
    .filter((v) => v !== "comments" && objHeaders.includes(v));
  console.log(header);
  const replacer = (key: string, value: any) => (value === null ? "" : value);
  const csv = [
    header.join(","),
    ...entries.value.map((row) =>
      header
        .map((key) =>
          JSON.stringify(row[key as "start"], replacer).replace(/\\"/g, '""'),
        )
        .join(","),
    ),
  ].join("\r\n");
  saveAs(new Blob([csv]), "observation-data.csv");
}
const groupBys: DataTableHeader[] = [
  {
    title: "Recorder",
    key: "recorder",
    sortable: true,
  },
  {
    title: "Location",
    key: "location",
    sortable: true,
  },
];
const headers: Ref<DataTableHeader[]> = ref([
  {
    title: "Date",
    key: "start",
    sortable: true,
  },
  {
    title: "Time",
    key: "time",
    sortable: false,
  },
  {
    title: "Duration",
    key: "end",
    align: "end",
    sortable: false,
  },
  {
    title: "Recorder",
    key: "recorder",
    sortable: true,
  },
  {
    title: "Location",
    key: "location",
    sortable: true,
  },
]);
headers.value.push(
  ...Object.entries(NumberDataTypes).map(([name, type]) => ({
    title: name,
    key: type,
    sortable: true,
  })),
);
headers.value.push(
  ...[
    {
      title: "Comments",
      key: "comments",
      sortable: false,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
);

// Data table cell coloring
const colors = ref(false);
type StatisticsData = {
  averages: NumberDataSet;
  min: NumberDataSet;
  max: NumberDataSet;
  stdDev: NumberDataSet;
  length: number;
};
type StatisticsGroup = {
  groups: {
    [groupBy: string]: Statistics;
  };
  key: string;
};
type Statistics =
  | (StatisticsGroup & {
      type: "group";
    })
  | (StatisticsData & {
      type: "data";
    });
function getStatisticData(
  stats: Statistics,
  groups: readonly SortItem[],
  entry: any,
  create = false,
): StatisticsData | null {
  try {
    const stat = groups.reduce((acc, cur, i, arr) => {
      const value = entry[cur.key];
      if (acc.type === "data") throw new Error();
      if (acc.groups[value] == null)
        if (create)
          acc.groups[value] =
            i === arr.length - 1
              ? {
                  type: "data",
                  averages: NumberDataSet(),
                  min: NumberDataSet(),
                  max: NumberDataSet(),
                  stdDev: NumberDataSet(),
                  length: 0,
                }
              : {
                  type: "group",
                  groups: {},
                  key: arr[i + 1].key,
                };
        else throw new Error();
      return acc.groups[value];
    }, stats);
    return stat.type === "data" ? stat : null;
  } catch (e) {
    return null;
  }
}
function calculateAverages(stat: Statistics) {
  if (stat.type === "data") {
    for (const type of Object.values(NumberDataTypes)) {
      stat.averages[type] /= stat.length;
      stat.stdDev[type] = Math.sqrt(
        stat.stdDev[type] / stat.length - stat.averages[type] ** 2,
      );
    }
  } else
    for (const group of Object.values(stat.groups)) calculateAverages(group);
}
const statistics = computed(() => {
  const e = entries.value;
  const groups = groupBy.value;
  const stats: Statistics =
    groups.length === 0
      ? {
          type: "data",
          averages: NumberDataSet(),
          min: NumberDataSet(),
          max: NumberDataSet(),
          stdDev: NumberDataSet(),
          length: 0,
        }
      : {
          type: "group",
          groups: {},
          key: groups[0].key,
        };
  for (const entry of e) {
    const stat = getStatisticData(stats, groups, entry, true);
    if (stat == null) continue;
    for (const type of Object.values(NumberDataTypes)) {
      stat.averages[type] += entry[type];
      stat.stdDev[type] += entry[type] ** 2;
      if (entry[type] < stat.min[type]) stat.min[type] = entry[type];
      if (entry[type] > stat.max[type]) stat.max[type] = entry[type];
    }
    stat.length++;
  }
  calculateAverages(stats);
  return stats;
});
function proportionToColor(
  item: NumberDataSet,
  type: NumberDataTypes,
  maxStdDevs: number,
  maxOpacity: number,
): string {
  const clampOpacity = (v: number) => Math.max(Math.min(maxOpacity, v), 0);
  const stat = getStatisticData(statistics.value, groupBy.value, item);
  if (stat == null) return "transparent";
  const min = stat.min[type];
  const max = stat.max[type];
  const average = stat.averages[type];
  // if (Math.abs(item[type] - average) < .1)
  //   return 'transparent'
  if (item[type] < average)
    // return `hsla(0, 100%, 50%, ${(average - item[type]) / (average - min) * mo})`
    return `hsla(0, 100%, 50%, ${clampOpacity(
      ((average - item[type]) / (stat.stdDev[type] * 2)) * maxStdDevs,
    )})`;
  // return `hsla(120, 100%, 50%, ${(item[type] - average) / (max - average) * mo})`
  else
    return `hsla(120, 100%, 50%, ${clampOpacity(
      ((item[type] - average) / (stat.stdDev[type] * 2)) * maxStdDevs,
    )})`;
}

// Types
type DataTableHeader = {
  title: string;
  key: string;
  sortable: boolean;
};
type SortItem = {
  key: string;
  order?: boolean | "asc" | "desc";
};
</script>

<style scoped lang="scss">
.v-col {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
