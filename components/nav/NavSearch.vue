<template>
  <form
    @submit.prevent="$emit('search', searchText)"
    ref="searchbar"
    :class="modifiers"
  >
    <input
      type="text"
      id="main-search"
      autofocus
      v-model="searchText"
      placeholder="Search by tag name"
    />
    <button>→</button>
  </form>
</template>

<script setup lang="ts">
import { useActiveElement, useMagicKeys, whenever } from "@vueuse/core";
import { logicAnd } from "@vueuse/math";

const emit = defineEmits(["search", "bottom", "escape"]);

const props = defineProps({
  frozen: {
    type: Boolean,
    default: false,
  },
  query: {
    type: String,
    default: "",
  },
  wide: {
    type: Boolean,
    default: false,
  },
});

const searchbar = ref();
const searchText = ref(props.query);

watchEffect(() => {
  searchText.value = props.query;
});

const { componentY } = useComponentRect(searchbar, { passive: true });
const { winX, winY } = useWindowResize();
const { scrollY } = useWindowScroll();
const activeElement = useActiveElement();
const loadedAt = ref(Date.now());

watchEffect(() => {
  if (
    winY.value + scrollY.value >= document.body.offsetHeight &&
    Date.now() - loadedAt.value > 1500
  ) {
    emit("bottom");
    loadedAt.value = Date.now();
  }
});

watch(scrollY, (verticalScroll) => {
  if (verticalScroll === 0 && !props.frozen) {
    const inputElement = document.querySelector(
      "input#main-search"
    ) as HTMLElement;
    inputElement.focus();
  }
  if (verticalScroll > winY.value * 0.9) {
    activeElement.value?.blur();
  }
});

const shrunk = computed(() => {
  if (
    componentY.value <= 150 ||
    (winX.value <= 1150 && componentY.value <= 280)
  ) {
    return "shrunk";
  }
  return "";
});

const modifiers = computed(() => {
  return {
    shrunk: shrunk?.value,
    wide: props.wide,
  };
});

const { escape } = useMagicKeys();

whenever(logicAnd(escape, activeElement), () => {
  if (activeElement.value?.getAttribute("id") === "main-search") {
    activeElement.value.blur();
  } else {
    emit("escape");
  }
});

onMounted(() => {
  searchbar.value?.focus();
  nextTick();
});
</script>

<style scoped>
form {
  position: sticky;
  top: 10px;
  margin: 45vh 0 0 auto;
  float: right;
  right: 15rem;
  width: calc(100vw - 32rem);
  transition: right 0.2s ease-out, width 0.2s ease-out;
  z-index: 3;
}
input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 1rem;
  margin: 0;
  background-color: rgb(243, 221, 253);
  color: rgb(217, 81, 235);
  font-family: Comfortaa;
  font-weight: 700;
  text-align: center;
  border: 0.15rem solid rgba(233, 28, 233, 0.4);
  font-size: 2rem;
  padding: 1rem 5rem 1rem 1rem;
  outline-color: rgba(84, 10, 145, 0.8);
  outline-style: solid;
  outline-width: 0;
  /* opacity: 0.2; */
  transition: font-size 0.3s ease-in, outline-width 0.3s ease-out,
    opacity 0.3s ease-out;
}
input::placeholder {
  color: rgb(199, 147, 221);
}
input:focus {
  outline-width: 0.6rem;
  opacity: 1;
}
.shrunk {
  width: calc(95vw - 42rem);
  right: 25rem;
}
.shrunk input {
  font-size: 1rem;
}
.wide {
  width: calc(100vw - 28rem);
}
button {
  position: absolute;
  bottom: 0.15rem;
  right: 0.15rem;
  width: 4rem;
  height: calc(100% - 0.3rem);
  padding: 0;
  border-radius: 0.85rem;
  border: 0.15rem solid rgba(233, 28, 233, 0.4);
  background-color: rgba(84, 10, 145, 0.8);
  color: rgb(199, 147, 221);
}
@media screen and (max-height: 800px) {
  .shrunk {
    width: calc(100vw - 28rem);
  }
}
@media screen and (max-width: 1150px) {
  form {
    right: 12rem;
    width: calc(100vw - 18rem);
  }
  .shrunk {
    right: 10rem;
    width: calc(100vw - 12rem);
  }
}
@media screen and (max-width: 700px) {
  form {
    right: 3rem;
    width: calc(100vw - 8rem);
  }
  input {
    font-size: 1.3rem;
  }
  .shrunk {
    right: 10rem;
  }
  .shrunk input {
    font-size: 0.8rem;
  }
}
</style>
