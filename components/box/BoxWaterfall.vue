<template>
  <div class="waterfall">
    <div
      v-for="(slot, lineNumber) of $slots"
      :key="lineNumber"
      :class="`level ${lineNumber}`"
      :style="`margin-left: calc((${lineNumber} - 1) * 4%);animation-delay: calc((${lineNumber} - 1) * .2s);`"
    >
      <h2 v-if="slot">
        <slot :name="lineNumber"> </slot>
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
//Usage of this component: <template #1>your content</template> <template #2 etc
</script>

<style scoped>
.waterfall {
  margin: 3vh 5vw 3vh 5vw;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  /* overflow: hidden; */
  max-width: 100%;
}
@media screen and (max-width: 500px) {
  .waterfall {
    margin-left: 5px;
    margin-right: 5px;
  }
}
.level {
  flex-basis: 90%;
  min-width: 280px;
  max-width: 60vw;
  box-sizing: border-box;
  border-radius: 0 40px 5% 3% / 0 40px 30px 80%;
  border-bottom: 15px solid rgba(79, 240, 173, 0.95);
  border-left: 5px solid rgba(38, 238, 238, 0.85);
  animation: 4s infinite pump ease-out;
  background: linear-gradient(
    50deg,
    rgba(83, 242, 200, 0.85) 0%,
    rgba(206, 134, 248, 0.55) 35%,
    rgba(145, 233, 245, 0) 55%
  );
  background-size: 200% 100%;
  background-position: 50% 0;

  padding: 10px 15%;
}
h2 {
  text-align: left;
  margin-right: auto;
}
@keyframes pump {
  0%,
  60%,
  100% {
    translate: 0;
  }
  10% {
    translate: -15px;
    background-position: 15% 0;
  }
  23% {
    translate: 40px;
    background-position: 0 0;
  }
}
</style>
