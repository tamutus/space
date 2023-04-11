<template>
  <h1 :class="modifiers">
    <slot></slot>
  </h1>
</template>

<script setup lang="ts">
const props = defineProps({
  unintrusive: {
    type: Boolean,
    required: false,
    default: false,
  },
});
let shrunk: any;
if (props.unintrusive) {
  const { scrollY } = useWindowScroll();
  shrunk = computed(() => {
    if (scrollY.value > 10) {
      return "shrunk";
    } else return "";
  });
}
const modifiers = computed(() => {
  return {
    unintrusive: props.unintrusive,
    shrunk: shrunk?.value,
  };
});
</script>

<style scoped>
h1 {
  position: sticky;
  display: inline-block;
  top: 10px;
  left: 0;
  max-width: calc(100vw - 8rem - 27px);
  border-radius: 0 15px 15px 0;
  box-sizing: border-box;
  margin: 15vh 0 0 0;
  padding: 15px 20px 13px 5vw;
  z-index: 10;
  transform-origin: top left;
  background-color: rgba(61, 4, 87, 0.651);
  color: rgb(228, 195, 255);
  overflow-wrap: break-word;
  transition: margin-left 1.5s, background-color 1.5s;
}
.unintrusive {
  margin-top: 0;

  transition: scale 0.3s ease-out, opacity 0.3s ease-out;
  z-index: 2;
}

.unintrusive {
  margin-top: 0;
}
.shrunk {
  scale: 0.7;
  opacity: 0.5;
}
.shrunk:hover {
  opacity: 0.8;
}
@media screen and (max-width: 990px), screen and (max-height: 800px) {
  h1 {
    font-size: 2rem;
  }
}
@media screen and (max-width: 500px) {
  h1 {
    margin-right: auto;
    padding: 12px 10px 10px 2.5vw;
    max-width: calc(100vw - 5rem - 27px);
    font-size: 1.5rem;
  }
}
</style>
