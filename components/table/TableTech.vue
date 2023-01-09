<template>
  <div class="tech-table">
    <div
      v-for="(slot, slotNumber) of $slots"
      :key="slotNumber"
      :class="`level ${slotNumber}`"
    >
      <slot :name="slotNumber"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
//Usage of this component: <template #1>your content</template> <template #2 etc
</script>

<style scoped>
.tech-table {
  width: calc(100% - 90px);
  margin: 30px 30px 40px 30px;
  padding: 10px;
  border-radius: 10%;
  background-color: rgba(208, 128, 245, 0.8);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  text-shadow: none;
}
.tech-table > div {
  flex: 1 1 300px;
  padding: 30px;
  border-radius: 10%;
  color: rgb(33, 37, 41);
  transition: color 0.2s ease-out;
}
.tech-table:hover > div {
  color: rgb(226, 225, 255);
}
.tech-table > div:hover {
  color: rgb(187, 255, 214);
}
.tech-table > div:nth-child(even) {
  background-color: rgb(250, 178, 127, 0.9);
}
</style>
