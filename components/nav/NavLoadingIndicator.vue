<template>
  <div>
    <Transition name="nav-phase" mode="in-out">
      <div v-if="loading" id="loading-indicator" key="loader">
        <h2>
          <AnimatedWord><slot>Loading</slot></AnimatedWord>
        </h2>
      </div></Transition
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style>
#loading-indicator {
  max-height: 5rem;
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  padding: 0 2rem;
  background-color: rgb(150, 238, 255);
  overflow: hidden;
  transform: skew(-5deg);
  transform-origin: bottom left;
  border-radius: 1rem 0;
}
.nav-phase-enter-active,
.nav-phase-leave-active {
  transition: opacity 0.3s, filter 0.3s, max-height 0.5s, bottom 0.5s;
  position: fixed;
  left: 2rem;
  bottom: 2rem;
}
.nav-phase-enter-from,
.nav-phase-leave-to {
  max-height: 0;
  opacity: 0;
  filter: blur(35px) grayscale(2);
}
</style>
