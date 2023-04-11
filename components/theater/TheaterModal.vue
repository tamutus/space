<template>
  <transition name="modal-fade">
    <div id="modal-backdrop" @click="close" :aria-hidden="!isOpen">
      <div
        id="focused-content"
        :class="`${fullScreen ? 'fullscreen' : ''}`"
        @click.stop=""
      >
        <button id="closer" @click="close">
          Close <span aria-hidden="true">❌</span> [Esc]
        </button>
        <button id="filler" @click="toggleFullScreen">
          {{ fullScreen ? "Small Screen" : "Full Screen" }}
          <span aria-hidden="true"></span> [F]
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useActiveElement, useMagicKeys, whenever } from "@vueuse/core";
import { logicAnd, logicOr } from "@vueuse/math";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  nextable: {
    type: Boolean,
    default: false,
  },
  backable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close", "forward", "backward"]);

const activeElement = useActiveElement();

const fullScreen = ref(false);
function toggleFullScreen() {
  fullScreen.value = !fullScreen.value;
}
function close(e: MouseEvent) {
  emit("close");
}

watch(
  () => props.isOpen,
  async () => {
    if (props.isOpen) {
      const scrollY = `${window.scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}`;
      document.body.style.width = "100vw";
      const appElement: Element | null = document.getElementById("app-box");
      if (appElement) {
        appElement.classList.add("frozen");
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      const appElement: Element | null = document.getElementById("app-box");
      if (appElement) {
        appElement.classList.remove("frozen");
      }
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }
);

const { escape, arrowLeft, a, arrowRight, d, f } = useMagicKeys();

watch(escape, (k) => {
  if (k) {
    emit("close");
  }
});

const notUsingInput = computed(
  () =>
    activeElement.value?.tagName !== "INPUT" &&
    activeElement.value?.tagName !== "TEXTAREA"
);
whenever(logicAnd(logicOr(arrowLeft, a), notUsingInput), () => {
  emit("backward");
});
whenever(logicAnd(logicOr(arrowRight, d), notUsingInput), () => {
  emit("forward");
});
whenever(logicAnd(f, notUsingInput), () => {
  toggleFullScreen();
});
</script>

<style scoped>
#modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(24, 24, 31, 0.87);
  z-index: 20;
}
#focused-content {
  background-image: radial-gradient(
      at 47% 20%,
      rgba(206, 255, 232, 0.747) 10%,
      rgba(133, 210, 245, 0.488) 50%,
      rgba(221, 95, 253, 0.87) 100%
    ),
    linear-gradient(180deg, rgba(231, 22, 214, 0.76) 0%, rgb(53, 194, 17) 100%);
  box-shadow: 2px 2px 20px 1px rgb(59, 59, 124);
  flex: 0 1 80%;
  height: 80%;
  max-height: 100%;
  overflow-y: auto;
  transition: flex 0.2s ease-out, height 0.2s ease-out;
}
#focused-content.fullscreen {
  flex: 0 1 100%;
  height: 100%;
}
.backdrop {
}
#closer,
#filler {
  position: absolute;
  right: 12%;
  z-index: 21;
  font-size: 1rem;
  font-family: Cabin;
  line-height: 1rem;
  background-color: rgb(234, 213, 255);
  border-radius: 10px 0 10px 30% / 10px 20px;
  transition: top 0.2s ease-out, right 0.2s ease-out, opacity 0.3s ease-out;
}
#closer {
  top: 12%;
}
#filler {
  top: calc(12% + 3.5rem);
}
.fullscreen #closer,
.fullscreen #filler {
  right: 3%;
  opacity: 0.05;
}
.fullscreen #closer {
  top: 3%;
}
.fullscreen #filler {
  top: calc(3% + 3.5rem);
}

#closer:hover,
#filler:hover {
  opacity: 1;
}
/* Fade in and out transitions */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  scale: 1.3;
  filter: blur(10px);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.7s ease, scale 0.7s ease, filter 0.7s ease;
}
</style>
