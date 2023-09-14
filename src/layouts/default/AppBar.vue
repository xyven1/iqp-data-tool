<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-spacer />
    <v-btn v-if="!user" @click="signinRedirect()">
      Sign-in with Google
    </v-btn>
    <template v-else>
      <v-btn @click="signOutA">
        Sign out
      </v-btn>
      <v-avatar>
        <v-img :src="user.photoURL ?? ''">
          <template #placeholder>
            <v-icon :icon="mdiAccount" />
          </template>
        </v-img>
      </v-avatar>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        v-for="(route, i) of useRouter().getRoutes().filter(v => v.meta.nav && (v.meta.auth ? user : true))"
        :key="i" :to="route.path" exact color="secondary" :title="route.name?.toString() ?? ''"
        :prepend-icon="route.meta.icon"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { googleAuthProvider } from '@/firebase';
import { mdiAccount } from '@mdi/js';
import {
getRedirectResult,
signInWithRedirect,
signOut
} from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

const drawer = ref(false);

const user = useCurrentUser()
const auth = useFirebaseAuth()! // only exists on client side
// display errors if any
const error = ref(null)
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}
function signOutA() {
  signOut(auth);
}
// only on client side
onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })
})
</script>