<template>
  <div class="frame" ref="frame">
    <div :class="`${mode} glass`" :style="rotation">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const frame = ref(null);

const props = defineProps({
  mode: {
    type: String,
    default: "light",
    validator: (maybeMode: string) => {
      return ["light", "dark", "hot"].includes(maybeMode);
    },
  },
});

const { componentX, componentY, componentX2, componentY2 } = useComponentRect(
  frame,
  { passive: true }
);
const { vh, vw } = useVProperties();

const rotation = computed(() => {
  const xRotation = Math.max(
    Math.min(
      ((componentY.value + componentY2.value) / 2 / vh.value / 100 - 0.5) * 60,
      30
    ),
    -30
  );

  const yRotation = Math.max(
    Math.min(
      (0.5 - (componentX.value + componentX2.value) / 2 / vw.value / 100) * 60,
      30
    ),
    -30
  );

  return {
    transform: `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`,
  };
});
</script>

<style scoped>
.frame {
  perspective: 500px;
  transition: scale 0.4s ease-out;
}
.frame:hover {
  scale: 1.05;
}
.glass {
  border-radius: 3px;
  box-shadow: 3px -2px 10px rgba(29, 3, 63, 0.7),
    3px 4px 10px rgba(29, 3, 63, 0.9), -1px 4px 10px rgba(187, 247, 255, 0.6),
    -1px -4px 10px rgba(187, 247, 255, 0.6);
  transition: transform 0.35s 0.02s ease-out, box-shadow 0.7s ease-in-out,
    color 0.5s ease, translate 0.4s ease-out;
  transform-style: preserve-3d;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}
.light {
  color: rgb(221, 243, 255);
  background-image: radial-gradient(
      ellipse at 80% 5%,
      rgba(131, 131, 214, 0.2),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 30% 90%,
      rgba(187, 247, 255, 0.15),
      rgba(84, 175, 255, 0.1) 50%
    );
}
.dark {
  color: rgb(221, 243, 255);
  background-image: radial-gradient(
      ellipse at 80% 5%,
      rgba(251, 251, 255, 0.25),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 30% 90%,
      rgba(8, 65, 131, 0.411),
      rgba(7, 99, 180, 0.37) 50%
    );
}
.hot {
  color: rgb(255, 221, 242);
  background-image: radial-gradient(
      ellipse at 80% 5%,
      rgba(255, 72, 179, 0.671),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 30% 90%,
      rgba(255, 49, 111, 0.623),
      rgba(142, 1, 177, 0.541) 50%
    );
}
@media screen and (max-width: 650px) {
  .pop {
    transform: translateX(15px);
  }
  .pop.active {
    transform: translateX(-15px);
  }
}
</style>
