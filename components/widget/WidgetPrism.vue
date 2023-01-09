<template>
  <div class="prismic">
    <div id="radical" class="prism-holder" ref="prismHolder">
      <div
        class="prism"
        :style="{
          transform: `rotateY(${prismRotation}deg)`,
          transition: prismTransition,
        }"
      >
        <div
          v-for="(face, sideNumber) of prism"
          :key="sideNumber"
          class="face"
          :style="styleOf(sideNumber)"
          @click.self="rotatePrism($event)"
        ></div>
      </div>
    </div>
    <div id="modifiers">
      <h3>{{ prismSides }} Sides</h3>
      <button @click="addSide()">+ One more side</button>
      <button @click="removeSide()">- One Less side</button>
      <label for="perspective-value"
        >Perspective (distance between screen and field of view);</label
      >
      <input
        type="number"
        id="perspective-value"
        v-model="perspective"
        @change="updatePrism()"
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
import { ComputedRef, Ref } from "vue";

type PrismFace = {
  color: string;
};

const prismHolder = ref(null),
  perspective: Ref<number> = ref(1500),
  prism: Ref<Array<PrismFace>> = ref([]),
  prismSides: Ref<number> = ref(3),
  prismRotation: Ref<number> = ref(0),
  prismRotationQuantum: ComputedRef<number> = computed(() => {
    return 360 / prismSides.value;
  }),
  prismTransition: Ref<string> = ref("transform .3s ease"),
  prismViewportHeight = ref(400),
  prismViewportWidth = ref(400),
  prismRadius = computed(() => {
    return (
      prismViewportWidth.value / (2 * Math.tan(Math.PI / prismSides.value))
    );
  }),
  perspectiveMultiplier = computed(() => {
    return (perspective.value - prismRadius.value) / perspective.value;
  }),
  mouseMode: Ref<string> = ref("toggle");

for (let i = 0; i < prismSides.value; i++) {
  prism.value.push({
    color: randomColor(),
  });
}
updatePrism();

useEventListener(window, "resize", () => {
  prismViewportHeight.value = Math.min(window.innerHeight - 400, 500);
  prismViewportWidth.value = Math.min(window.innerWidth - 200, 400);
  cssVar(
    prismHolder,
    "--prismViewportHeight",
    `${prismViewportHeight.value}px`
  );
  cssVar(prismHolder, "--prismViewportWidth", `${prismViewportWidth.value}px`);
});
function styleOf(prismFace: number) {
  const face = prism.value[prismFace];
  return {
    "background-color": face.color,
    transform: `
      rotateY(${prismFace * prismRotationQuantum.value}deg)
      translateZ(calc(var(--prismRadius) + 15px))`,
  };
}
// createPrism("radical", prismSides);

function updatePrism() {
  cssVar(
    prismHolder,
    "--prismViewportHeight",
    `${prismViewportHeight.value}px`
  );
  cssVar(prismHolder, "--prismViewportWidth", `${prismViewportWidth.value}px`);
  cssVar(
    prismHolder,
    "--prismRotationQuantum",
    `${prismRotationQuantum.value}deg`
  );
  cssVar(
    prismHolder,
    "--perspectiveMultiplier",
    String(perspectiveMultiplier.value)
  );
  cssVar(prismHolder, "--perspectiveDistance", `${perspective.value}px`);
  cssVar(prismHolder, "--prismRadius", `${prismRadius.value}px`);
}

function addSide() {
  prismSides.value++;
  prism.value.push({
    color: randomColor(),
  });
  prismRotation.value = 0;
  updatePrism();
}
function removeSide() {
  prismSides.value--;
  prism.value.pop();
  prismRotation.value = 0;
  updatePrism();
}

function rotatePrism(e: MouseEvent) {
  if (!(e?.target instanceof Element)) return;

  const rect = e.target.getBoundingClientRect();

  const w = prismViewportWidth.value;
  const x = e.pageX - rect.left;
  // const y = e.pageY - rect.top;

  if (w - x > (4 * w) / 5) {
    if (prismRotation.value >= 360) {
      prismRotation.value -= 360;
      prismTransition.value = "none";
      setTimeout(() => {
        prismTransition.value = "transform .3s ease";
        prismRotation.value += prismRotationQuantum.value;
      }, 1);
    } else {
      prismRotation.value += prismRotationQuantum.value;
    }
  } else if (w - x < w / 5) {
    if (prismRotation.value < 0) {
      prismRotation.value += 360;
      prismTransition.value = "none";

      setTimeout(() => {
        prismTransition.value = "transform .3s ease";
        prismRotation.value -= prismRotationQuantum.value;
      }, 1);
    } else {
      prismRotation.value -= prismRotationQuantum.value;
    }
  }
}

function randomColor() {
  let channelArray = [];
  let colorString = "rgb(";
  for (let i = 0; i < 3; i++) {
    channelArray.push(Math.floor(Math.random() * 257));
  }
  colorString += channelArray.join(",");
  colorString += ")";
  return colorString;
}
</script>

<style scoped>
.prismic {
  position: relative;
  margin: 0 auto;
  height: 100%;
  width: min(96vw, 100%);
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
}

.prism-holder {
  --prismViewportHeight: 400px;
  --prismViewportWidth: 400px;
  --perspectiveDistance: 1200px;
  position: absolute;
  top: 100px;
  left: max(0px, calc(50% - calc(var(--prismViewportWidth) * 0.5)));
  height: var(--prismViewportHeight);
  width: min(100%, var(--prismViewportWidth));
  min-height: 420px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  perspective: var(--perspectiveDistance);
  transform: scale(var(--perspectiveMultiplier));
}
.prism {
  margin-top: max(calc(45% - 200px), 0px);
  min-height: 300px;
  height: var(--prismViewportHeight);
  width: var(--prismViewportWidth);
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}
.face {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 15px;
  opacity: 0.75;
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
