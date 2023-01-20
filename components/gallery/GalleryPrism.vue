<template>
  <div class="container">
    <div class="prismic">
      <div class="prism-holder" ref="prismHolder" :style="prismHolderStyle">
        <div class="prism" :style="prismStyle">
          <GalleryPrismFace
            v-for="(slot, sideNumber) of $slots"
            :key="sideNumber"
            :faceNumber="Number(sideNumber)"
            :rotationQuantum="prismRotationQuantum"
            :color="colorAt(Number(sideNumber))"
            @forward="rotatePrismForward"
            @backward="rotatePrismBackward"
          >
            <slot :name="sideNumber"></slot>
          </GalleryPrismFace>
        </div>
      </div>
    </div>
    <button v-if="zoomable" class="zoomer" @click="toggleZoom">
      {{ magnified ? "Zoom Out" : "Enhance" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref } from "vue";

const props = defineProps({
  perspective: {
    type: Number,
    required: false,
  },
  colors: {
    type: Array<string>,
    default: [],
  },
  colorMode: {
    type: String,
    default: "alternate",
  },
  maxHeight: {
    type: Number,
    default: 500,
  },
  maxWidth: {
    type: Number,
    default: 400,
  },
  zoomable: {
    type: Boolean,
    default: false,
  },
});

const magnification: Ref<number> = ref(1),
  magnified: ComputedRef<boolean> = computed(() => {
    if (magnification.value === 1) {
      return false;
    } else {
      return true;
    }
  });

const slots = ref(useSlots()),
  prismHolder = ref(null),
  prismSides: Ref<number> = ref(1),
  prismRotation: Ref<number> = ref(0),
  prismRotationQuantum: ComputedRef<number> = computed(() => {
    return 360 / prismSides.value;
  }),
  prismTransition: Ref<string> = ref(
    "transform .4s ease, height 0.4s ease, width 0.4s ease"
  ),
  prismViewportHeight = ref(
    Math.min(window.innerHeight - 100, props.maxHeight)
  ),
  prismViewportWidth = ref(Math.min(window.innerWidth - 200, props.maxWidth)),
  prismRadius = computed(() => {
    return (
      (prismViewportWidth.value * magnification.value) /
      (2 * Math.tan(Math.PI / prismSides.value))
    );
  }),
  perspective: ComputedRef<number> = computed(() => {
    return props.perspective ?? prismRadius.value * 3;
  }),
  perspectiveMultiplier = computed(() => {
    return (perspective.value - prismRadius.value) / perspective.value;
  }),
  prismHolderStyle = computed(() => {
    return {
      "--perspectiveDistance": `${perspective.value}px`,
      "--prismViewportHeight": `${
        prismViewportHeight.value * (magnified.value ? 2 : 1)
      }px`,
      "--prismViewportWidth": `${
        prismViewportWidth.value * magnification.value
      }px`,
      "--prismRotationQuantum": `${prismRotationQuantum.value}deg`,
      "--prismRadius": `${prismRadius.value}px`,
      "--perspectiveMultiplier": perspectiveMultiplier.value,
    };
  }),
  prismStyle = computed(() => {
    return {
      transform: `rotateY(${prismRotation.value}deg)`,
      transition: prismTransition.value,
    };
  });

useEventListener(window, "resize", () => {
  prismViewportHeight.value = Math.min(
    window.innerHeight - 100,
    props.maxHeight
  );
  prismViewportWidth.value = Math.min(window.innerWidth - 200, props.maxWidth);
});

// template attribute:
// @click.self="rotatePrism($event)"

// function rotatePrism(e: MouseEvent) {
//   if (!(e?.target instanceof Element)) return;

//   const rect = e.target.getBoundingClientRect();

//   const w = Math.min(
//     prismViewportWidth.value * Math.pow(magnification.value, 4 / 7),
//     window.innerWidth
//   );
//   const x = e.pageX - Math.max(rect.left, 0);
//   // console.log(`w is ${w}, x is ${x}`);
//   // const y = e.pageY - rect.top;
//   if (w - x > (4 * w) / 5) {
//     rotatePrismForward();
//   } else if (w - x < w / 5) {
//     rotatePrismBackward();
//   }
// }
function rotatePrismForward() {
  if (prismRotation.value < 0) {
    prismRotation.value += 360;
    prismTransition.value = "none";

    setTimeout(() => {
      prismTransition.value =
        "transform .4s ease, height 0.4s ease, width 0.4s ease";
      prismRotation.value -= prismRotationQuantum.value;
    }, 1);
  } else {
    prismRotation.value -= prismRotationQuantum.value;
  }
}
function rotatePrismBackward() {
  if (prismRotation.value >= 360) {
    prismRotation.value -= 360;
    prismTransition.value = "none";
    setTimeout(() => {
      prismTransition.value =
        "transform .4s ease, height 0.4s ease, width 0.4s ease";
      prismRotation.value += prismRotationQuantum.value;
    }, 1);
  } else {
    prismRotation.value += prismRotationQuantum.value;
  }
}

function colorAt(index: number): string | undefined {
  if (props.colors.length === 0) {
    return undefined;
  }
  if (props.colorMode === "gradient") {
    return undefined;
  } else {
    return props.colors[index % props.colors.length];
  }
}
function toggleZoom() {
  if (magnified.value) {
    magnification.value = 1;
  } else {
    magnification.value = window.innerWidth / prismViewportWidth.value;
  }
}

onMounted(() => {
  slots.value = useSlots();
  prismSides.value = Math.max(
    typeof slots.value === "object" ? Object.keys(slots.value).length : 1,
    1
  );
});
onBeforeUpdate(() => {
  slots.value = useSlots();
  prismSides.value = Math.max(
    typeof slots.value === "object" ? Object.keys(slots.value).length : 1,
    1
  );
});

watch(prismSides, (newSideCount) => {
  prismRotation.value = 0;
});
</script>

<style scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
}
.prismic {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-x: clip;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.prism-holder {
  --prismViewportHeight: 400px;
  --prismViewportWidth: 400px;
  --perspectiveDistance: 1200px;

  left: max(0px, calc(50% - calc(var(--prismViewportWidth) * 0.5)));
  height: var(--prismViewportHeight);
  width: min(100%, var(--prismViewportWidth));
  min-height: 420px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  perspective: var(--perspectiveDistance);
  transform: scale(var(--perspectiveMultiplier));
  transition: transform 0.4s ease, perspective 0.4s ease, height 0.4s ease,
    width 0.4s ease;
  transform-origin: center;
}
.prism {
  min-height: 300px;
  height: min(100%, var(--prismViewportHeight));
  width: var(--prismViewportWidth);
  transition: transform 0.4s ease, height 0.4s ease, width 0.4s ease;
  transform-style: preserve-3d;
}
.zoomer {
  border: none;
  border-radius: 10%;
  font-size: 1em;
  padding: 20px;
  position: sticky;
  margin-top: 60vh;
  margin-bottom: 17vh;
  top: calc(95vh - 50px);

  left: 3vw;
  z-index: 2;
  background-color: rgba(61, 4, 87, 0.85);
  color: rgb(228, 195, 255);
}
</style>
