<template>
  <div class="spacer">
    <NuxtLink v-if="$props.to" :to="to">
      <div class="intriguer">
        <button>
          <slot></slot>
        </button>
      </div>
    </NuxtLink>
    <div v-else class="intriguer">
      <button>
        <slot></slot>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
.spacer {
  margin: 10px auto;
  display: flex;
  justify-content: center;
}

button {
  /* background-color: rgba(255, 77, 208, .4); */
  border-radius: 15% / 50%;
  background-color: rgb(211, 117, 255);
  color: white;
  text-decoration: none;
  transition: background-color 0.5s linear, transform 0.5s linear,
    box-shadow 0.5s linear;
}
.intriguer:hover button {
  animation: eager 1.5s infinite;
  background-color: rgb(245, 182, 65);
  box-shadow: -1px -1px 12px 15px rgba(245, 182, 65, 0.55),
    1px 1px 12px 15px rgba(245, 182, 65, 0.55);
}
@keyframes eager {
  0%,
  25%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  7%,
  32% {
    transform: translate(0, 5px) scale(1.1, 0.9);
  }
  13%,
  38% {
    transform: translate(0, -30px) scale(0.8, 1.2);
  }
}
</style>
