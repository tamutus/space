<template>
  <div
    class="bg"
    :style="{
      'background-image': `url('${imageSource}')`,
      'background-attachment': attachment,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageFileName: {
    type: String,
    required: true,
  },
  attachment: {
    default: "scroll",
    type: String,
    validator(input: string) {
      return ["fixed", "scroll"].includes(input);
    },
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
}
</style>
