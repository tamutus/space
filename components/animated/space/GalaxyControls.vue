<template>
  <div id="galaxy-control-section" :class="controlsStatus" role="presentation">
    <div class="toggle-container">
      <button
        class="toggler"
        @click="toggleControlsSalience"
        :aria-label="
          !controlsSalient
            ? 'Reveal controls for background galaxy'
            : 'Hide controls for background galaxy'
        "
      >
        {{ toggleIcon }}
      </button>
      <p>Ask the galaxy {{ controlsSalient ? "to:" : "..." }}</p>
    </div>
    <div id="galaxy-controls" :aria-hidden="!controlsSalient">
      <button
        :tabindex="controlsSalient ? '0' : '-1'"
        @click="emit('resetAnimation')"
      >
        {{ existenceTogglerText }}
      </button>
      <button
        id="motion-toggler"
        @click="emit('toggleGalaxyMotion')"
        :tabindex="controlsSalient ? '0' : '-1'"
      >
        {{ motionTogglerText }}
      </button>
      <button
        id="twinkle-toggler"
        @click="emit('toggleTwinkle')"
        :tabindex="controlsSalient ? '0' : '-1'"
      >
        {{ twinkleTogglerText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  exists: Boolean,
  moving: Boolean,
  twinkling: Boolean,
});
const emit = defineEmits([
  "resetAnimation",
  "toggleGalaxyMotion",
  "toggleTwinkle",
]);

const controlsSalient = ref(false);
const controlsStatus = computed(() => {
  if (controlsSalient.value) return "salient";
  else return "";
});
const toggleIcon = computed(() => {
  if (controlsSalient.value) return "❌";
  else return "❓";
});
function toggleControlsSalience() {
  controlsSalient.value = !controlsSalient.value;
}

const twinkleTogglerText = computed(() => {
    return props.twinkling ? "Stop Twinkling" : "Twinkle";
  }),
  motionTogglerText = computed(() => {
    return props.moving ? "Stay still" : "Spin around";
  }),
  existenceTogglerText = computed(() => {
    return props.exists ? "Vanish" : "Exist";
  });
</script>

<style>
#galaxy-control-section {
  position: absolute;
  bottom: 30px;
  left: 20px;
  z-index: 3;
  display: flex;
  flex-flow: row wrap-reverse;
  align-items: flex-start;
}
#galaxy-controls {
  display: flex;
  margin-bottom: 5px;
  flex-flow: row wrap;
  transform-origin: bottom left;
  pointer-events: none;
  transform: translateY(100px);
  transition: transform 0.4s ease-out;
}
.salient #galaxy-controls {
  pointer-events: auto;
  transform: none;
}
.toggle-container {
  position: relative;
}
.toggler {
  position: absolute;
  left: 5px;
  bottom: -3px;
  width: 110px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  padding: 0.25em 1em;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-image: linear-gradient(
    to top,
    rgb(78, 115, 236) 15%,
    rgb(114, 55, 192) 55%,
    rgb(21, 159, 177) 90%
  );
  background-size: 100% 200%;
  font-size: 2em;
}
.toggler:hover,
.toggler:focus {
  opacity: 1;
}
.toggle-container p {
  max-width: 100px;
  margin: 0 15px 0 5px;
  padding: 0 5px;
  text-indent: 0;
  text-align: center;
  font-family: "Comfortaa", cursive;
  background-color: rgba(0, 0, 0, 0.705);
  border-radius: 8px;
}
#galaxy-controls button {
  user-select: none;
  margin: 10px 20px 10px 0;
  padding: 5px 10px;
  font-size: 1.7em;
  font-family: "Odibee Sans", cursive;
  background-color: #ffd2a1;
  border-radius: 10px 0;
  color: rgb(70, 70, 70);
  transition: background-color 0.5s ease, color 0.5s ease;
}
#galaxy-controls button:hover {
  background-color: #fefbb8;
  color: black;
}

@keyframes disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media screen and (max-height: 800px) {
  #galaxy-control-section {
    bottom: 10px;
  }
}
@media screen and (max-width: 1200px) {
  #galaxy-control-section {
    bottom: 10px;
  }
  #galaxy-controls button {
    margin: 10px 10px 10px 0;
    padding: 5px 7px;
  }
}
@media screen and (max-width: 1000px) {
  #galaxy-control-section {
    left: 5px;
  }
}
@media screen and (max-width: 900px) {
  #galaxy-control-section {
    bottom: 0;
  }
  .toggle-container p {
    margin-bottom: 0;
    margin-right: 5px;
    max-width: 85px;
    font-size: 0.8em;
  }
  .toggler {
    width: 95px;
  }
  #galaxy-controls button {
    font-size: 1.5em;
  }
}
@media screen and (max-width: 358px) {
  .toggle-container {
    margin-bottom: 10px;
  }
  #galaxy-control-section {
    flex-flow: column-reverse nowrap;
  }
  #galaxy-controls {
    transform: translateX(-130px);
    flex-flow: column nowrap;
    margin-bottom: 20px;
  }
}
</style>
