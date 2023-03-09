<template>
  <div>
    <div class="perspective" ref="container">
      <div class="neon" :style="`transform: rotateX(${neonAngle}deg)`">
        <h2 :class="`header ${color}`">
          <slot></slot>
        </h2>
        <p v-if="$slots.paragraph" :class="`paragraph ${color}`">
          <slot name="paragraph"></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "white",
  },
});

const container = ref(null);
const { componentY } = useComponentRect(container);
const { vh } = useVProperties();

const neonAngle = computed(() => {
  if (!componentY.value || !vh.value) {
    return 0;
  }
  const cy = componentY.value;
  return 0.5 * Math.max(Math.min(60 - cy / vh.value, 31), -15);
});
</script>

<style scoped>
.perspective {
  perspective: 60vh;
  padding-left: 40px;
  padding-right: 100px;
  overflow: hidden;
}
@media screen and (max-width: 750px) {
  .perspective {
    padding-left: 15px;
    padding-right: 30px;
  }
}
.neon {
  margin: 50px 30px 100px 70px;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
  transform-origin: top right;
}
@media screen and (max-width: 750px) {
  .neon {
    margin-left: 0px;
    margin-right: 0px;
  }
}
.header,
.paragraph {
  font-family: Comfortaa;
  padding: 30px 20px 20px 30px;
  display: block;
  border-bottom: 13px solid black;
  background-color: rgba(3, 41, 21, 0.55);
}
.header {
  display: inline-block;
  font-weight: 700;
  /* box-shadow: -1px -1px 4px 5px rgba(3, 41, 21, 0.38), */
  /* 1px 1px 4px 5px rgba(3, 41, 21, 0.38); */
  margin: 50px auto 0px 15px;
  border-radius: 50px 0 0 0;

  transform-origin: bottom left;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}
.paragraph {
  display: block;
  margin: 0 auto 0 15px;
  border-radius: 0 50px 50px 0;
  text-align: left;
  line-height: 2rem;
  transform: rotateX(-15deg);
  transform-style: preserve-3d;
  transform-origin: top left;
  font-weight: 600;
}
@media screen and (max-width: 600px) {
  .paragraph {
    padding: 30px 5px;
  }
}
.white {
  color: white;
  text-shadow: rgb(227 205 253) -2px 0 8px, rgb(153 255 224) 2px 0 8px;
}
.red {
  color: rgb(253, 49, 63);
  text-shadow: rgb(235, 222, 250) -1px 0 2px, rgb(248, 203, 224) 1px 0 2px;
}
.orange {
  color: rgb(253, 200, 80);
  text-shadow: rgb(235, 222, 250) -2px 0 1px, rgb(248, 203, 224) 2px 0 4px;
}
.orange.paragraph {
  text-shadow: rgb(235, 222, 250) -0.5px 0 2px, rgb(248, 203, 224) 0.5px 0 0px;
}
.yellow {
  color: rgb(245, 255, 106);
  text-shadow: rgb(236, 109, 70) -1px 0 2px, rgb(230, 146, 20) 2px 0 4px;
}
.green {
  color: rgb(117, 255, 159);
  text-shadow: rgb(227 205 253) -2px 0 8px, rgb(153 255 224) 2px 0 8px;
}
.blue {
  color: rgb(65, 65, 255);
  text-shadow: rgb(227 205 253) -2px 0 8px, rgb(153 255 224) 2px 0 8px;
}
.purple {
  color: rgb(222, 199, 250);
  text-shadow: rgb(227 205 253) -2px 0 4px, rgb(153 255 224) 2px 0 8px;
}
.purple.paragraph {
  text-shadow: rgb(227 205 253) -0.5px 0 2px, rgb(153 255 224) 0.5px 0 0px;
}
</style>
