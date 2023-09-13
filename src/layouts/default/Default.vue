<template>
  <v-app>
    <bottom-nav />
    <default-view />
    <app-bar />
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from './AppBar.vue';
import BottomNav from './BottomNav.vue';
import DefaultView from './View.vue';
</script>
