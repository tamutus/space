<template>
  <div class="hologram" :style="dropletDelay">
    <div v-if="$slots.default" class="header">
      <slot name="default"> </slot>
    </div>

    <div v-if="$slots.display" class="display">
      <slot name="display"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  delay: {
    type: Number,
    default: 0,
  },
  pad: {
    type: String,
    default: "l",
    validator(p: string) {
      return ["l", "m", "s"].includes(p);
    },
  },
});
const dropletDelay = computed(() => {
  return {
    "--delay": `${props.delay}s`,
  };
});
</script>

<style scoped>
.hologram {
  border-radius: 5px;
  position: relative;
  box-shadow: -1px -1px 8px 10px rgba(47, 218, 218, 0.55),
    1px 1px 8px 10px rgba(47, 218, 218, 0.55);
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 15px 5%;
  overflow: hidden;
  animation: pizzazz 1s;
  animation-timing-function: ease-out;
  --delay: 0s;
  z-index: 0;
}
@keyframes pizzazz {
  0% {
    filter: opacity(0.5) brightness(0.4) blur(10px);
  }
  100% {
    filter: opacity(1) brightness(1) blur(0);
  }
}
.hologram::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(47, 218, 218, 0.8);
  background-image: url("/assets/HexagonGrid.svg");
  background-size: 4em;
  background-repeat: repeat;
  z-index: -1;
}
.hologram::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle closest-side,
    rgba(230, 253, 255, 0) 32%,
    rgba(116, 223, 241, 0.4) 74%,
    /* rgba(241, 254, 255, 0.2) 74%, */ rgba(255, 255, 255, 0) 85%
  );
  mix-blend-mode: hard-light;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
  animation: slideFlash 8s infinite;
  animation-delay: var(--delay);
}
@keyframes slideFlash {
  0% {
    opacity: 0;
    scale: 0;
  }
  25% {
    opacity: 0.8;
  }
  90% {
    scale: 12;
    opacity: 1;
  }
  100% {
    opacity: 0;
    scale: 12;
  }
}
.header {
  color: white;
  transition: font-size 0.2s 0s ease-out;
  text-shadow: rgb(114, 8, 163) -1px 0 4px, rgb(61, 5, 192) 1px 0 4px;
}
.header h1,
.header h2,
.header h3 {
  text-shadow: rgb(114, 8, 163) -2px 0 2px, rgb(61, 5, 192) 2px 0 2px;
}
.display {
  color: rgb(76, 1, 168);
  text-shadow: rgb(227, 205, 253) -2px 0 8px, rgb(153, 255, 224) 2px 0 8px;
  border-radius: 20px;
  z-index: 1;
  padding: 7vh 12.3%;
  max-width: 900px;
  margin: 0 auto;
  background-color: rgba(193, 214, 253, 0.9);
}
@media screen and (max-width: 500px) {
  .hologram {
    padding: 15px 5px;
  }
}
</style>
