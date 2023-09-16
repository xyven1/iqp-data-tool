<template>
  <div
    class="number-chip" :style="{
      height: typeof props.height === 'number' ? props.height + 'px' : props.height,
      minWidth: typeof props.minWidth === 'number' ? props.minWidth + 'px' : props.minWidth,
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      maxWidth: typeof props.width === 'number' ? props.width + 'px' : props.width,
    }"
  >
    <span class="number-chip-underlay" />
    <v-btn
      v-if="outer != inner" size="x-large" variant="flat" :min-width="0" :height="height" class="number-chip-btn"
      color="secondary" @click="sub(outer)"
    >
      <v-icon :icon="mdiMinus" />{{ outer === 1 ? "" : outer }}
    </v-btn>
    <v-btn
      variant="tonal" size="x-large" color="secondary" :min-width="0" :height="height" class="number-chip-btn"
      @click="sub(inner)"
    >
      <v-icon :icon="mdiMinus" />{{ inner === 1 ? "" : inner }}
    </v-btn>
    <v-text-field
      variant="plain" type="number" class="no-arrows text-h5 mb-2" :model-value="modelValue" :min="min"
      :max="max" hide-details density="compact" :step="inner" @update:model-value="(n) => {
        const num = Number(n)
        if (isNaN(num)) return;
        emit('update:modelValue', Math.min(Math.max(num, min), max))
      }"
    />
    <v-btn
      variant="tonal" size="x-large" :min-width="0" :height="height" class="number-chip-btn" color="secondary"
      @click="add(inner)"
    >
      <v-icon :icon="mdiPlus" />{{ inner === 1 ? "" : inner }}
    </v-btn>
    <v-btn
      v-if="outer != inner" size="x-large" :min-width="0" :height="height" class="number-chip-btn" variant="flat"
      color="secondary" @click="add(outer)"
    >
      <v-icon :icon="mdiPlus" /> {{ outer === 1 ? "" : outer }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { mdiMinus, mdiPlus } from "@mdi/js";
export interface Props {
  modelValue?: number;
  inner?: number;
  outer?: number;
  min?: number;
  max?: number;
  height?: number | string;
  minWidth?: number | string;
  width?: number | string;
}
const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  inner: 1,
  outer: 5,
  min: -Infinity,
  max: Infinity,
  height: 50,
  minWidth: 0,
  width: Infinity,
});

function sub(value: number) {
  emit("update:modelValue", Math.max(props.modelValue - value, props.min));
}

function add(value: number) {
  emit("update:modelValue", Math.min(props.modelValue + value, props.max));
}
</script>

<style lang="scss">
.number-chip {
  align-items: center;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  display: inline-flex;
  height: 50px;
  min-width: 0;
  max-width: 100%;
}

.number-chip-underlay {
  background: currentColor;
  opacity: var(--v-activated-opacity);
  border-radius: inherit;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.number-chip-btn {
  border-radius: 0 !important;
  padding-right: 8px !important;
  padding-left: 8px !important;
}

.no-arrows {

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input:focus {
    outline: none;
  }

  input {
    text-align: center;
    font-size: larger;
  }
}
</style>