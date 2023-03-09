<template>
  <div>
    <span
      v-for="(letter, letterNumber) of letters"
      :style="{
        'animation-delay': `${
          (percentOfWord(letterNumber) * cycleLength) / 3
        }s`,
        'animation-duration': `${cycleLength}s`,
      }"
      class="letter"
      >{{ letter }}</span
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  word: {
    type: String,
    default: "Loading",
    validator(w: string) {
      return w.length > 1;
    },
  },
  cycleLength: {
    type: Number,
    default: 3,
  },
});
const letters = computed(() => {
  return props.word.split("");
});
const percentOfWord = function (letterNumber: number) {
  return letterNumber / letters.value.length;
};
</script>

<style scoped>
.letter {
  animation-name: piston;
  animation-iteration-count: infinite;
  overflow: hidden;
  display: inline-block;
}
@keyframes piston {
  0%,
  100% {
    scale: 1 0;
  }
  33%,
  66% {
    scale: 1 1;
  }
}
</style>
