<template>
  <div class="container">
    <svg
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      id="big-intersectional-flag"
      ref="intersectionalFlag"
    >
      <rect :class="`red-stripe ${deanimated}`" height="100" width="1000" />
      <rect
        :class="`orange-stripe ${deanimated}`"
        height="100"
        width="1000"
        y="100"
      />
      <rect
        :class="`yellow-stripe ${deanimated}`"
        height="100"
        width="1000"
        y="200"
      />
      <rect
        :class="`green-stripe ${deanimated}`"
        height="100"
        width="1000"
        y="300"
      />
      <rect
        :class="`blue-stripe ${deanimated}`"
        height="100"
        width="1000"
        y="400"
      />
      <rect
        :class="`violet-stripe ${deanimated}`"
        height="100"
        width="1000"
        y="500"
      />
      <polygon
        :class="`black-triangle ${deanimated}`"
        points="0,-150 450,300 0,750"
      />
      <polygon
        :class="`brown-triangle ${deanimated}`"
        points="0,-75 375,300 0,675"
      />
      <polygon
        :class="`sky-triangle ${deanimated}`"
        points="0,0 300,300 0,600"
      />
      <polygon
        :class="`pink-triangle ${deanimated}`"
        points="0,75 225,300 0,525"
      />
      <polygon
        :class="`white-triangle ${deanimated}`"
        points="0,150 150,300 0,450"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const deanimated: Ref<string> = ref("");

useInterval(resetColors, 3500);
function resetColors() {
  deanimated.value = "deanimated";
  useTimeout(() => {
    deanimated.value = "";
  }, 500);
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
svg {
  overflow: hidden;
}
polygon,
rect {
  animation-name: colorize;
  animation-duration: 0.7s;
  animation-fill-mode: backwards;
  transition: fill 0.5s ease-in, filter 0.5s ease-in;
}
.deanimated {
  animation: none;
  filter: grayscale(0.8);
}
.red-stripe {
  fill: rgba(254, 30, 37, 1);
  animation-delay: 2s;
}
.orange-stripe {
  fill: rgba(254, 148, 29, 1);
  animation-delay: 1.8s;
}
.yellow-stripe {
  fill: rgba(255, 255, 0, 1);
  animation-delay: 1.6s;
}
.green-stripe {
  fill: rgba(6, 189, 2, 1);
  animation-delay: 1.4s;
}
.blue-stripe {
  fill: rgba(0, 25, 150, 1);
  animation-delay: 1.2s;
}
.violet-stripe {
  fill: rgba(117, 0, 135, 1);
  animation-delay: 1s;
}
.black-triangle {
  fill: rgba(1, 1, 1, 1);
  animation-delay: 0.8s;
}
.brown-triangle {
  fill: rgba(96, 56, 20, 1);
  animation-delay: 0.6s;
}
.sky-triangle {
  fill: rgba(116, 213, 235, 1);
  animation-delay: 0.4s;
}
.pink-triangle {
  fill: rgba(254, 175, 197, 1);
  animation-delay: 0.2s;
}
.white-triangle {
  fill: rgba(255, 255, 255, 1);
}
@keyframes colorize {
  0% {
    filter: grayscale(1);
  }
  50% {
    filter: brightness(1.5);
  }
  100% {
    filter: none;
  }
}
</style>
