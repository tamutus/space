<template>
  <div class="bg" :style="{ 'background-image': `url('${imageSource}')` }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageFileName: {
    type: String,
    required: true,
  },
});
const imageSource = computed(() => `/${props.imageFileName}`);
</script>

<style scoped>
.bg {
  min-height: 100vh;
  padding-top: 30px;
  padding-bottom: 50px;
  border-bottom: 20px solid rgb(27, 27, 27);
  height: 100%;
  background-size: cover;
  /* background-attachment: fixed; */
}
</style>
