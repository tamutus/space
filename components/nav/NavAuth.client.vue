<template>
  <div id="nav-user">
    <div class="user-bar">
      <p v-if="isLoading">Loading auth</p>
      <AuthLink
        color="transparent"
        v-else-if="!authenticated"
        style="margin-right: 1rem"
      />
      <div
        v-else
        :class="`user-actions${userActionsRevealed ? ' revealed' : ''}`"
      >
        <div class="user-action">
          <AuthLink color="transparent" />
        </div>
        <div :class="`user-action ${'/desk' === currentPath ? 'focused' : ''}`">
          <NuxtLink v-if="authenticated" to="/desk"
            ><ButtonStandard color="transparent">Desk</ButtonStandard></NuxtLink
          >
        </div>
        <div
          v-if="lavra"
          :class="`user-action ${
            '/blog/write' === currentPath ? 'focused' : ''
          }`"
        >
          <NuxtLink v-if="authenticated" to="/blog/write"
            ><ButtonStandard color="transparent"
              >Write</ButtonStandard
            ></NuxtLink
          >
        </div>
        <div
          v-if="lavra"
          :class="`user-action ${
            '/furry/post' === currentPath ? 'focused' : ''
          }`"
        >
          <NuxtLink v-if="authenticated" to="/furry/post"
            ><ButtonStandard color="transparent">Post</ButtonStandard></NuxtLink
          >
        </div>
      </div>
      <a v-if="authenticated && user?.picture"
        ><img
          class="pfp-icon"
          :src="user.picture"
          alt="Your profile image"
          @click="toggleActions"
      /></a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();
const user = auth0.user;
const authenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;
const userActionsRevealed = ref(true);
const toggleActions = (): void => {
  userActionsRevealed.value = !userActionsRevealed.value;
};

const route = useRoute();
const currentPath = ref(route.path);

const lavra: Ref<boolean> = useLavra(auth0);

watch(
  () => route.path,
  async (newPath) => {
    currentPath.value = newPath;
    if (newPath === "/blog" && authenticated.value) {
    }
  }
);
</script>

<style scoped>
.user-bar {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
  background-color: rgba(61, 4, 87, 0.85);
  opacity: 0.3;
  transition: opacity 0.2s;
}
.user-bar:hover {
  opacity: 1;
}
.user-actions {
  display: flex;
  flex-flow: center;
  padding-left: 0;
}
.user-actions.revealed {
  padding-left: 15px;
}
.user-actions > * {
  width: 0px;
  height: 40px;
  overflow: hidden;
  white-space: nowrap;
  transition: height 0.25s ease, width 0.25s ease, color 0.2s ease-out,
    padding 0.25s ease;
}
.user-actions.revealed > * {
  width: 4.5rem;
}
.pfp-icon {
  border-radius: 10%;
  max-height: 96px;
  max-width: 96px;
  margin: 0 15px;
}
.user-action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-action,
.user-action * {
  color: rgb(228, 195, 255);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  -webkit-text-stroke-width: 0;
}
.user-action:hover,
.user-action:hover * {
  color: rgb(255, 157, 178);
}
.user-action.focused,
.user-action.focused * {
  color: rgb(144, 250, 162);
}
@media screen and (max-width: 800px), screen and (max-height: 600px) {
  .pfp-icon {
    max-height: 64px;
    max-width: 64px;
    margin: 0 10px;
  }
}
@media screen and (max-width: 500px) {
  .pfp-icon {
    max-height: 48px;
    max-width: 48px;
    margin: 0 5px;
  }
}
</style>
