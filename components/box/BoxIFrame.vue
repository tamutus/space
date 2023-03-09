<template>
  <div class="embedded-page">
    <iframe :src="url" width="100%" height="100%" frameborder="0"> </iframe>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  url: String,
});
</script>

<style scoped>
.embedded-page {
  height: 100%;
  width: 100%;
}
</style>
