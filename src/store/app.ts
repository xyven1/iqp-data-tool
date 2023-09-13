// Utilities
import { defineStore } from "pinia";
import { Data } from "@/types/data";
import { Ref, ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const currentData: Ref<Data | null> = ref(Data());
    const currentUser = ref("");
    return {
      currentData,
      currentUser,
    };
  },
  {
    persist: true,
  },
);
