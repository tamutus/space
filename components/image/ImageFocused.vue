<template>
  <div class="illustrated-content" :style="layoutStyle">
    <div class="image-container">
      <img :src="imageSource" :alt="altText" />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageFileName: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: "Tell me to add alt text to this image!",
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
const imageSource = computed(() => `/${props.imageFileName}`);
</script>

<style scoped>
.illustrated-content {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  max-width: 100%;
}
.content {
  flex: 1 1 65%;
}
.image-container {
  flex: 1 1 20%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
img {
  max-height: 80vh;
  max-width: 100%;
  min-height: 20vh;
  min-width: 20vh;
  object-fit: contain;
  border-radius: 20%;
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
