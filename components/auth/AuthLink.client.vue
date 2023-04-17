<template>
  <span>
    <ButtonStandard :color="color" @click="logAction">{{
      logLabel
    }}</ButtonStandard>
  </span>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";

const props = defineProps({
  color: {
    type: String,
    default: "rgba(61, 4, 87, 0.85)",
  },
});

const auth0 = useAuth0();
whenever(logicNot(auth0.isLoading), () => {
  auth0.getAccessTokenSilently();
});

const logLabel = computed(() => {
  return auth0.isAuthenticated.value ? "Log Out" : "Log In";
});
const logAction = computed(() => {
  return auth0.isAuthenticated.value ? logout : login;
});
async function login() {
  auth0.loginWithPopup().catch(console.error);
}
async function logout() {
  return await auth0.logout();
}
</script>

<style scoped>
span {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
