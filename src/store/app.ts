// Utilities
import { defineStore } from "pinia";
import { Data } from "@/types/data";
import { Ref, ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const currentData: Ref<Data> = ref(Data());
    const currentUser = ref("");
    return {
      currentData,
      currentUser,
    };
  },
  {
    persist: {
      afterRestore: (ctx) => {
        const startTime = ctx.store.$state.currentData.startTime;
        ctx.store.$state.currentData.startTime =
          startTime == null
            ? undefined
            : new Date(ctx.store.$state.currentData.startTime);
        const endTime = ctx.store.$state.currentData.endTime;
        ctx.store.$state.currentData.endTime =
          endTime == null
            ? undefined
            : new Date(ctx.store.$state.currentData.endTime);
      },
    },
  },
);
