<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-spacer />
    <v-btn v-if="!user" :append-icon="mdiLogin" @click="signinRedirect()">
      Sign In
    </v-btn>
    <template v-else>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar>
              <v-img :src="user.photoURL ?? ''">
                <template #placeholder>
                  <v-icon :icon="mdiAccount" />
                </template>
              </v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="flex-grow-1" />
          <div class="w-100 d-flex justify-center">
            <v-btn variant="text" @click="signOut(auth)">
              Sign Out
            </v-btn>
          </div>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        v-for="(route, i) of useRouter().getRoutes().filter(v => v.meta.nav && (!v.meta.auth ? true : authorized))"
        :key="i" :to="route.path" exact color="secondary" :title="route.name?.toString() ?? ''"
        :prepend-icon="route.meta.icon"
      />
    </v-list>
    <template #append>
      <div class="mx-3 d-flex justify-center">
        <theme-toggle class="flex-grow-0" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue';
import { googleAuthProvider } from '@/utils/firebase';
import { mdiAccount, mdiLogin } from '@mdi/js';
import { computedAsync } from '@vueuse/core';
import {
getRedirectResult,
signInWithRedirect,
signOut
} from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

const drawer = ref(false);

const user = useCurrentUser();
const auth = useFirebaseAuth()!;

const authorized = computedAsync(async () => {
  if (!user.value) return false;
  const token = await user.value.getIdTokenResult();
  return token.claims.authorized as boolean;
});

const error = ref(null);
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}

onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })
})
</script>