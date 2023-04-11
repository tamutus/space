<template>
  <div v-if="error" class="error" ref="errorBlock">
    <h2>Error</h2>
    <code>
      {{ error.statusCode }}
      {{ error.statusMessage }}
      {{ error.data }}
    </code>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";

import { FetchError } from "ofetch";

const props = defineProps({
  error: {
    required: true,
    type: Object as PropType<FetchError | null>,
  },
});

const errorBlock = ref();

function close() {
  errorBlock.value.classList.add("closed");
}

function reopen() {
  errorBlock.value.classList.remove("closed");
  ``;
}

watch(
  () => props.error,
  () => {
    reopen();
  }
);
const { escape } = useMagicKeys();

whenever(escape, close);
</script>

<style scoped>
.error {
  position: fixed;
  bottom: 0;
  left: 50%;
  translate: -50% 0;
  background-color: pink;
  padding: 1rem;
}
.closed {
  display: none;
}
</style>
