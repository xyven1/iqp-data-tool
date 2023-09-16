// Utilities
import { Comment, Data } from "@/types/data";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const completedData: Ref<Data[]> = ref([]);
    const currentData = ref(Data());
    const currentComment = ref(Comment());
    const currentRecorder = ref("");

    return {
      currentData,
      currentRecorder,
      currentComment,
      completedData,
    };
  },
  {
    persist: true,
  },
);
