<template>
  <div :style="faceStyle" class="face">
    <button class="left rotator" @click="$emit('backward')">Prior</button>
    <button class="right rotator" @click="$emit('forward')">Next</button>
    <div class="content">
      <slot> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    required: false,
  },
  faceNumber: {
    type: Number,
    required: true,
  },
  rotationQuantum: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["forward", "backward"]);
const backgroundColor = props.color ?? randomColor();
const faceStyle = computed(() => {
  return {
    "background-color": backgroundColor,
    transform: `rotateY(${
      props.faceNumber * props.rotationQuantum
    }deg) translateZ(calc(var(--prismRadius) + 15px))`,
  };
});

function randomColor(): string {
  let channelArray = [];
  let colorString = "rgba(";
  for (let i = 0; i < 3; i++) {
    channelArray.push(Math.floor(Math.random() * 257));
  }
  colorString += channelArray.join(",");
  colorString += ",.75)";
  return colorString;
}
</script>

<style scoped>
.face {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 2vmin;
  border-radius: 15px;
  transition: transform 0.5s ease;
  /* opacity: 0.75; */
}
.content {
  height: 100%;
  width: 100%;
  /* pointer-events: none; */
}
.content * {
  pointer-events: auto;
}
.rotator {
  position: absolute;
  top: 0;
  height: 100%;
  width: 20%;
  border: none;
  font-size: 1.5em;
  padding: 20px;
  z-index: 2;
  background-color: rgba(61, 4, 87, 0);
  color: rgba(228, 195, 255, 0.1);
  transition: color 0.3s ease, background-color 0.2s ease;
}
@media screen and (max-width: 600px) {
  .rotator {
    font-size: 1em;
    padding: 5px;
  }
}
.left.rotator {
  left: 0;
  text-align: center;
  border-radius: 15px 10% 10% 15px;
}
.right.rotator {
  right: 0;
  text-align: center;
  border-radius: 10% 15px 15px 10%;
}
.rotator:active,
.rotator:hover {
  background-color: rgba(61, 4, 87, 0.6);
  color: rgba(228, 195, 255, 1);
}
</style>
