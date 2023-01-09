<template>
  <div class="animation-gallery">
    <button
      v-if="animations.length > 1"
      @click="previousAnimation()"
      class="previous"
      data-test="previous-button"
    >
      ◀ Previous
    </button>
    <div class="animation-container">
      <Transition :name="direction">
        <component :is="activeAnimation"></component>
      </Transition>
    </div>
    <button
      @click="nextAnimation()"
      class="next"
      data-test="next-button"
      v-if="animations.length > 1"
    >
      Next ▶
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue";

// unplugin's auto-import feature doesn't seem to work with the configurations on the internet for vitest. To unbreak tests, imports are explicit here.

// import AnimatedFlag from "@/components/animated/AnimatedFlag.vue";
// import AnimatedSunrise from "@/components/animated/AnimatedSunrise.vue";
// import AnimatedLoader from "@/components/animated/AnimatedLoader.vue";

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});

const animations = computed(() => {
  if (props.category === "widgets") {
    return [
      resolveComponent("AnimatedSpaceGalaxyAnimation"),
      resolveComponent("WidgetPrism"),
      resolveComponent("WidgetShinyPokemon"),
    ];
  } else {
    return [
      resolveComponent("AnimatedSunrise"),
      resolveComponent("AnimatedIntersectionality"),
      resolveComponent("AnimatedFlag"),
      resolveComponent("AnimatedLoader"),
    ];
  }
});

const animationIndex: Ref<number> = ref(0);
const activeAnimation = computed(() => {
  return animations.value[animationIndex.value];
});
const direction: Ref<"forward" | "backward"> = ref("forward");

function previousAnimation(): void {
  direction.value = "backward";
  if (animationIndex.value === 0) {
    animationIndex.value = animations.value.length - 1;
  } else {
    animationIndex.value = animationIndex.value - 1;
  }
}
function nextAnimation(): void {
  direction.value = "forward";
  if (animationIndex.value + 1 === animations.value.length) {
    animationIndex.value = 0;
  } else {
    animationIndex.value = animationIndex.value + 1;
  }
}
</script>

<style scoped>
.animation-gallery {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-evenly;
}
.animation-container {
  position: relative;
  height: 80vh;
  width: 75%;
  /* border: 4px solid black; */
  /* border: 2px solid rgba(3, 41, 21, 0.3); */
  box-shadow: -1px -1px 4px 5px rgba(3, 41, 21, 0.38),
    1px 1px 4px 5px rgba(3, 41, 21, 0.38);
  background-color: rgba(3, 41, 21, 0.55);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 3;
}
@media screen and (max-width: 750px) {
  .animation-container {
    width: 100%;
    height: 69vh;
  }
}
button {
  margin: 15px;
  border: none;
  background-color: rgba(24, 72, 228, 0.664);
  border: 2px solid rgba(24, 72, 228, 0.911);
  color: rgba(221, 255, 253, 0.911);
  font-family: Comfortaa, sans-serif;
  font-size: 1em;
  padding: 20px;
  z-index: 4;
  transition: background-color 0.5s cubic-bezier(0.2, 0.8, 0.3, 0.82),
    box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.3, 0.82),
    border-color 0.5s cubic-bezier(0.2, 0.8, 0.3, 0.82),
    color 0.5s cubic-bezier(0.2, 0.8, 0.3, 0.82);
}
button:hover {
  background-color: rgba(0, 161, 190, 0.911);
  border-color: rgba(47, 218, 218, 0.55);
  color: rgba(255, 252, 244, 0.911);
  box-shadow: -1px -1px 4px 5px rgba(47, 218, 218, 0.55),
    1px 1px 4px 5px rgba(47, 218, 218, 0.55);
}
button:active {
  background-color: rgba(3, 202, 36, 0.911);
  border-color: rgba(47, 218, 218, 0.55);
  box-shadow: -1px -1px 4px 5px rgba(47, 218, 218, 0.55),
    1px 1px 4px 5px rgba(47, 218, 218, 0.55);
}
button.previous {
  border-radius: 20% 0 0 20%;
}
button.next {
  border-radius: 0 20% 20% 0;
}

.forward-enter-active,
.forward-leave-active,
.backward-enter-active,
.backward-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease, opacity 0.7s ease;
}

.forward-enter-from,
.backward-leave-to {
  transform: translate(100%, 0);
  opacity: 0;
}
.forward-leave-to,
.backward-enter-from {
  transform: translate(-100%, 0);
  opacity: 0;
}
</style>
