<template>
  <div class="video-block">
    <video autoplay muted loop>
      <source :src="source" type="video/mp4" />
    </video>
    <div class="over-video">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  source: String,
});
</script>

<style scoped>
/* ================================================ */
/* Background video that fades in on scrolling down */
/* ================================================ */

.video-block {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
}
video {
  position: fixed;
  left: 0;
  bottom: 0;
  min-height: 100vh;
  z-index: -1;
  -webkit-filter: opacity(50%);
  filter: opacity(50%);
  -webkit-transition: -webkit-filter 1s;
  transition: -webkit-filter 1s;
  -o-transition: filter 1s;
  transition: filter 1s;
  transition: filter 1s, -webkit-filter 1s;
}
.filteredVid {
  -webkit-filter: opacity(35%) !important;
  filter: opacity(35%) !important;
}
.over-video {
  margin-top: 200px;
}
</style>
