<template>
  <div>
    <BackgroundImage
      attachment="fixed"
      image-file-name="assets/photos/city_portal.jpg"
    >
      <NavHeader>Log In</NavHeader>
      <BoxFocus>
        <div class="padded">
          <BoxNeon>
            <template #default>Verify with Auth0</template>
            <template #paragraph>
              <button @click="login">Log in</button>
            </template>
          </BoxNeon>
        </div>
      </BoxFocus>
    </BackgroundImage>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
const auth0 = useAuth0();

useHead({
  title: `Log into LavraT.space`,
});

const login = function () {
  auth0.loginWithRedirect();
};
</script>

<style scoped></style>
