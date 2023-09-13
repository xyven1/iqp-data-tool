<template>
  <v-bottom-navigation>
    <v-btn v-for="route in routes" :key="route.name" :to="route.path" exactsssssss>
      {{ route.name }}
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const routes = useRouter().getRoutes().filter(v => v.meta?.bottomNav);
</script>
