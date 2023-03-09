<template>
  <div :class="`almond ${flavor}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  flavor: {
    default: "cool",
    validator(providedFlavor: string) {
      return ["cool", "hot", "wasabi"].includes(providedFlavor);
    },
  },
});
</script>

<style scoped>
.almond {
  padding: 40px;
  border-radius: 25%;
}
.cool.almond {
  background: rgba(160, 220, 255, 0.897);
  color: rgb(116, 83, 160);
}
.hot.almond {
  background: rgba(255, 206, 160, 0.897);
  color: rgb(148, 63, 6);
}
.wasabi.almond {
  background: rgba(190, 255, 160, 0.897);
  color: rgb(6, 148, 82);
}
</style>
