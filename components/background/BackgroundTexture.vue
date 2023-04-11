<template>
  <div :class="`${texture} bg`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  texture: {
    type: String,
    default: "velvet",
  },
});
</script>

<style scoped>
.bg {
  min-height: 100vh;
  padding-top: 30px;
  padding-bottom: 50px;
  border-bottom: 20px solid rgb(27, 27, 27);
  height: 100%;
  background-attachment: fixed;
  background-repeat: none;
  background-size: 100vw 100%;
  position: relative;
}

.velvet.bg {
  background-image: radial-gradient(
      at 60% -60%,
      rgba(255, 255, 255, 0.5) 20%,
      rgba(30, 228, 165, 0.288) 50%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(180deg, rgba(43, 25, 65, 1) 0%, rgb(65, 2, 94) 100%);
}
.fae.bg {
  background-image: radial-gradient(
      at 47% 20%,
      rgba(255, 206, 244, 0.747) 10%,
      rgba(245, 133, 221, 0.488) 50%,
      rgba(137, 95, 253, 0.87) 100%
    ),
    linear-gradient(180deg, rgba(125, 51, 223, 0.76) 0%, rgb(189, 79, 240) 100%);
}
.solarpunk.bg {
  background-image: linear-gradient(
      -40deg,
      rgba(185, 242, 27, 0.8) 0%,
      rgba(255, 251, 167, 0.4) 40%,
      rgba(123, 190, 253, 0.7) 100%
    ),
    linear-gradient(
      20deg,
      rgba(167, 222, 8, 1) 0%,
      rgba(167, 255, 178, 1) 47%,
      rgba(123, 253, 238, 1) 81%
    );
  animation: sunshine 5s infinite alternate ease-out;
}
.sherbet.bg {
  background-color: rgb(242, 27, 136);
  background-image: linear-gradient(
      100deg,
      rgba(242, 27, 136, 0.55) 0%,
      rgba(255, 205, 30, 0.4) 45%,
      rgba(253, 123, 180, 0.9) 100%
    ),
    linear-gradient(
      0deg,
      rgba(167, 27, 242, 1) 0%,
      rgba(214, 130, 255, 1) 37%,
      rgba(254, 164, 155, 1) 67%,
      rgba(253, 223, 123, 1) 100%
    );
}
.wood.bg {
  background-image: url("/assets/photos/wood_surface.jpg");
  border-bottom-color: rgb(90, 7, 55);
}
@keyframes sunshine {
}
</style>
