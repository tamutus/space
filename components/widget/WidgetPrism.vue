<template>
  <div class="prismic">
    <GalleryPrism :perspective="perspective">
      <template v-for="(face, faceNumber) of prism" #[faceNumber]> </template>
    </GalleryPrism>

    <div id="modifiers">
      <h3>{{ prism.length }} Sides</h3>
      <button @click="addSide()">+ One more side</button>
      <button @click="removeSide()">- One Less side</button>
      <label for="perspective-value"
        >Perspective (distance between screen and field of view);</label
      >
      <input
        type="number"
        id="perspective-value"
        v-model="perspective"
        min="0"
        max="10000"
        step="100"
      />
      <!-- <div>
        <h3>Mouse Mode (not yet implemented)</h3>
        <input type="radio" id="toggle" name="mousemode" value="toggle" />
        <label for="mousemode">Click to Turn</label><br />
        <input type="radio" id="spin" name="mousemode" value="spin" />
        <label for="mousemode">Free spin</label><br />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const perspective: Ref<number> = ref(1500),
  colorMode: Ref<string> = ref("alternate"),
  prism: Ref<Array<Object>> = ref(new Array(3).fill({})),
  mouseMode: Ref<string> = ref("toggle");

function addSide() {
  prism.value.push({});
}
function removeSide() {
  prism.value.pop();
}
</script>

<style scoped>
.prismic {
  position: relative;
  margin: 0 auto;
  height: 100%;
  width: min(96vw, 100%);
  overflow-x: hidden;
  overflow-y: visible;
}

#modifiers {
  position: absolute;
  right: 30px;
  top: 20%;
  display: flex;
  flex-flow: column nowrap;
  align-items: space-evenly;
  pointer-events: none;
}
#modifiers button {
  margin: 10px;
  background-color: black;
  color: orange;
  border-radius: 5px;
  font-size: 20px;
}
#modifiers button,
#modifiers input {
  pointer-events: all;
}
</style>
