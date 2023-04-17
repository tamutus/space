<template>
  <div id="annotated-picture">
    <section id="focused-picture-section">
      <slot name="image"></slot>
      <div v-if="backable" class="left-button">
        <a @click="$emit('prior')"
          ><ButtonStandard color="rgba(61, 4, 87, .2)">←</ButtonStandard></a
        >
      </div>
      <div v-if="nextable" class="right-button">
        <a @click="$emit('next')"
          ><ButtonStandard color="rgba(61, 4, 87, .2)">→</ButtonStandard></a
        >
      </div>
      <div class="down-button">
        <a @click="toAnnotation"
          ><ButtonStandard color="rgba(61, 4, 87, .2)">↓</ButtonStandard></a
        >
      </div>
    </section>
    <section id="focused-annotation-section">
      <div class="up-button">
        <a @click="toPicture"
          ><ButtonStandard color="rgba(61, 4, 87, .2)">↑</ButtonStandard></a
        >
      </div>
      <slot name="info"></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  nextable: {
    type: Boolean,
    default: false,
  },
  backable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["prior", "next"]);

function toPicture() {
  const picSection = document.getElementById(
    "focused-picture-section"
  ) as HTMLElement;
  picSection.scrollIntoView({ behavior: "smooth" });
}
function toAnnotation() {
  const noteSection = document.getElementById(
    "focused-annotation-section"
  ) as HTMLElement;
  noteSection.scrollIntoView({ behavior: "smooth" });
}
</script>

<style scoped>
#annotated-picture {
  height: 100%;
  width: 100%;

  /* position: fixed; */
  /* top: 0;
  left: 0; */
  z-index: 0;
}
#focused-picture-section,
#focused-annotation-section {
  /* height: 100vh; */
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
#focused-picture-section {
  padding-top: 0;
}
#focused-annotation-section {
  padding-top: 1rem;
}
.up-button,
.down-button {
  position: sticky;
  z-index: 2;
}
.left-button,
.right-button {
  position: fixed;
  z-index: 2;
}
.up-button a,
.down-button a,
.right-button a,
.left-button a {
  text-decoration: none;
}
.up-button button,
.down-button button,
.right-button button,
.left-button button {
  font-size: 2.5rem;
  padding: 5px 5px 10px 5px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease, background-color 0.4s ease, opacity 0.3s ease;
}
.up-button button,
.down-button button {
  width: 4rem;
}
.right-button button,
.left-button button {
  width: 10rem;
  height: 4.5rem;
}
.fullscreen .down-button button:not(:hover) {
  opacity: 0.2;
}
button:hover,
button:focus {
  color: rgba(228, 195, 255, 1) !important;
  background-color: rgba(61, 4, 87, 0.6) !important;
}
.down-button {
  align-self: flex-end;
  bottom: 5.7rem;
  margin-top: 0;
  margin-right: 6.5rem;
}
.up-button {
  align-self: flex-start;
  top: 0;
  margin-top: -4.75rem;
  margin-bottom: 1rem;
  margin-left: 5vw;
}
.left-button {
  bottom: 0.5rem;
  left: 30%;
  opacity: 1;
}
.right-button {
  bottom: 0.5rem;
  right: 30%;
  opacity: 1;
}
.fullscreen .right-button:not(:hover),
.fullscreen .left-button:not(:hover) {
  opacity: 0.15;
}
@media screen and (max-width: 1500px) {
  .left-button button,
  .right-button button {
    width: 5rem;
  }
}
@media screen and (max-width: 1150px) {
  #crud-buttons {
    flex-flow: row nowrap;
  }
}

@media screen and (max-height: 600px) {
  .down-button {
    bottom: 0.5rem;
    margin-right: 5rem;
  }
}
@media screen and (max-width: 600px) {
  .left-button button,
  .right-button button {
    scale: 0.8;
    font-size: 1rem;
  }
  .left-button {
    translate: -15% 0;
  }
  .right-button {
    translate: 15% 0;
  }
}
</style>
