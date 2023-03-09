<template>
  <div class="subtle-table">
    <div
      v-for="(slot, slotNumber) of $slots"
      :key="slotNumber"
      :class="`cell ${slotNumber}`"
    >
      <slot :name="slotNumber"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.subtle-table {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: baseline;
}
.cell {
  flex: 0 0 500px;
  margin: 20px 2%;
}
@media screen and (max-width: 700px) {
  .cell {
    flex: 0 0 300px;
  }
}
</style>
