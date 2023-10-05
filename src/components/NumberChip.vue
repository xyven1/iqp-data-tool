<template>
  <div
    class="number-chip"
    :style="{
      height:
        typeof props.height === 'number' ? props.height + 'px' : props.height,
      minWidth:
        typeof props.minWidth === 'number'
          ? props.minWidth + 'px'
          : props.minWidth,
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      maxWidth:
        typeof props.width === 'number' ? props.width + 'px' : props.width,
    }"
  >
    <span class="number-chip-underlay" />
    <v-btn
      v-if="outer != inner"
      size="x-large"
      variant="flat"
      :min-width="0"
      :height="height"
      class="number-chip-btn"
      color="secondary"
      @click="
        () => {
          sub(outer);
          vibrateOn(outer > inner);
        }
      "
    >
      <v-icon :icon="mdiMinus" />{{ outer }}
    </v-btn>
    <v-text-field
      variant="plain"
      type="number"
      class="no-arrows text-h5 mb-2"
      :model-value="modelValue"
      :min="min"
      :max="max"
      hide-details
      density="compact"
      :step="inner"
      @update:model-value="
        (n) => {
          const num = Number(n);
          if (isNaN(num)) return;
          emit('update:modelValue', Math.min(Math.max(num, min), max));
        }
      "
    />
    <v-btn
      variant="tonal"
      size="x-large"
      :min-width="0"
      :height="height"
      class="number-chip-btn"
      color="secondary"
      @click="
        () => {
          add(inner);
          vibrateOn(inner > outer);
        }
      "
    >
      <v-icon :icon="mdiPlus" />{{ inner === 1 ? "" : inner }}
    </v-btn>
    <v-btn
      v-if="outer != inner"
      size="x-large"
      :min-width="0"
      :height="height"
      class="number-chip-btn"
      variant="flat"
      color="secondary"
      @click="
        () => {
          add(outer);
          vibrateOn(outer > inner);
        }
      "
    >
      <v-icon :icon="mdiPlus" /> {{ outer }}
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
  vibrate?: boolean;
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
  vibrate: false,
});

function vibrateOn(long: boolean) {
  if (props.vibrate) navigator.vibrate(long ? 200 : 50);
}

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
  touch-action: none;
}

.number-chip:focus-within {
  outline: 2px solid rgb(var(--v-theme-secondary));
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
