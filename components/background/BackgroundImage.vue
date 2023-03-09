<template>
  <div
    class="bg"
    :style="{
      'background-image': `url('${imageSource}')`,
      'background-attachment': attachment,
    }"
  >
    <slot></slot>
    <div class="note">
      <p v-if="note !== undefined">{{ note }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageFileName: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    default: "scroll",
    validator(input: string) {
      return ["fixed", "scroll"].includes(input);
    },
  },
  note: {
    type: String,
    required: false,
  },
});

const imageSource = computed(() => `/${props.imageFileName}`);
</script>

<style scoped>
.bg {
  position: relative;
  min-height: 100vh;
  padding-top: 30px;
  border-bottom: 20px solid rgb(27, 27, 27);
  height: 100%;
  background-size: cover;
}
.note {
  height: 50px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  justify-content: flex-end;
}
.note p {
  margin: 0;
  padding: 0 15px;
  display: inline-block;
  margin-left: auto;
  text-align: right;
  background-color: rgba(61, 4, 87, 0.85);
  color: rgb(228, 195, 255);
  border-radius: 10% 0 0 0;
}
</style>
