<template>
  <button :style="{ 'background-color': color }">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "rgba(61, 4, 87, 0.85)",
  },
});
</script>

<style scoped>
button {
  border: none;
  border-radius: 10%;
  font-size: 1em;
  padding: 20px;
  max-height: 100%;
  color: rgb(228, 195, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  font-weight: 700;
}
button:hover {
  color: rgb(255, 157, 178);
}
</style>
