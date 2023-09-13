<template>
  <div class="number-chip">
    <span class="number-chip-underlay" />
    <v-btn
      v-if="large != small" size="x-large" variant="flat" :min-width="0" class="number-chip-btn" color="primary"
      @click="sub(large)"
    >
      <v-icon :icon="mdiMinus" />{{ large === 1 ? "" : large }}
    </v-btn>
    <v-btn variant="tonal" size="x-large" color="primary" :min-width="0" class="number-chip-btn" @click="sub(small)">
      <v-icon :icon="mdiMinus" />{{ small === 1 ? "" : small }}
    </v-btn>
    <v-text-field
      variant="plain" type="number" class="no-arrows text-h5 mb-2" :model-value="modelValue" :min="min"
      :max="max" hide-details density="compact" :step="small" @update:model-value="(n) => {
        const num = Number(n)
        if (isNaN(num)) return;
        emit('update:modelValue', Math.min(Math.max(num, min), max))
      }"
    />
    <v-btn variant="tonal" size="x-large" :min-width="0" class="number-chip-btn" color="primary" @click="add(small)">
      <v-icon :icon="mdiPlus" />{{ small === 1 ? "" : small }}
    </v-btn>
    <v-btn
      v-if="large != small" size="x-large" :min-width="0" class="number-chip-btn" variant="flat" color="primary"
      @click="add(large)"
    >
      <v-icon :icon="mdiPlus" /> {{ large === 1 ? "" : large }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { mdiMinus, mdiPlus } from "@mdi/js";
export interface Props {
  modelValue?: number;
  small?: number;
  large?: number;
  min?: number;
  max?: number;
}
const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  small: 1,
  large: 5,
  min: -Infinity,
  max: Infinity,
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
  height: 9999px !important;
  padding-right: 12px  !important;
  padding-left: 12px  !important;
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