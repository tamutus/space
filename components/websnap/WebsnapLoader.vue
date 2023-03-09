<template>
  <div class="websnap">
    <Transition name="fade">
      <div v-if="!siteLaunched">
        <img
          :src="screenshotURL"
          @click="launchSite"
          title="Click to launch site without leaving"
        />
      </div>
      <BoxIFrame v-else :url="siteURL" class="" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  screenshotURL: {
    type: String,
    required: true,
  },
  siteURL: {
    type: String,
    required: true,
  },
});

const siteLaunched = ref(false);

const launchSite = function () {
  siteLaunched.value = true;
};
</script>

<style scoped>
div.websnap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  max-width: 100%;
  max-height: 100%;
  filter: grayscale(1);
}

.fade-enter-active,
.fade-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
