<template>
  <div class="illustrated-content" :style="layoutStyle">
    <div class="image-container">
      <NuxtLink to="/" title="Home page"
        ><img
          src="/assets/lit_logo_gradient.svg"
          alt="Fuchsia and violet letters in a boxy shape: L I T"
          :class="`logo ${logoSize}`"
        />
      </NuxtLink>
    </div>

    <slot class="content"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  logoSize: {
    type: String,
    default: "small",
  },
  alignment: {
    type: String,
    default: "left",
  },
});
const layoutStyle = computed(() => {
  if (props.alignment === "right") {
    return {
      "flex-flow": "row-reverse wrap-reverse",
    };
  } else if (props.alignment === "bottom") {
    return {
      "flex-flow": "column-reverse nowrap",
    };
  } else if (props.alignment === "top") {
    return {
      "flex-flow": "column nowrap",
    };
  }
});
</script>

<style scoped>
.illustrated-content {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  max-width: 100%;
}
.content {
  flex: 1 1 65%;
}
.image-container {
  flex: 0 0 20%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.logo {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
}
.logo.small {
  max-height: 10vh;
  max-width: 10vh;
}
.logo.medium {
  max-height: 20vh;
  max-width: 20vh;
}
.logo.large {
  max-height: 30vh;
  max-width: 30vh;
  margin-bottom: 50px;
  margin-top: 50px;
}

@media screen and (max-height: 280px) {
  img {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
</style>
