<template>
  <div>
    <div :class="`pop ${active ? 'active' : ''}`" ref="popper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const popper = ref(null);

const { componentY } = useComponentRect(popper);
const { scrollY } = useWindowScroll();
const { vh } = useVProperties();

const active = computed(() => {
  if (componentY.value < 35 * vh.value && scrollY.value > 100) {
    return true;
  } else return false;
});
</script>

<style scoped>
.pop {
  --pop-margin: 5vw;
  position: sticky;
  top: 20px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 15px 10px purple, 0px -15px 10px rgb(200, 124, 232);
  background-color: rgba(199, 77, 255, 0.3);
  margin: 50px var(--pop-margin) 200px var(--pop-margin);
  transition: background-color 0.5s ease-in-out, box-shadow 0.7s ease-in-out,
    color 0.5s ease, transform 0.4s ease-in, translate 0.2s ease-out;
  font-family: Ubuntu, sans-serif;
  color: rgb(78, 8, 95);
}
.pop.active {
  background-color: rgba(255, 163, 84, 0.8);
  box-shadow: 0px 15px 10px rgb(255, 84, 127), 0px -15px 10px rgb(229, 255, 84);
  color: rgb(246, 246, 252);
  transform: translateX(-50px);
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
