<template>
  <div id="crud-buttons">
    <div v-if="editable">
      <TransitionGroup name="list">
        <div
          v-if="editing"
          class="crud-button"
          key="1"
          @click="() => $emit('promptDelete')"
        >
          <ButtonStandard color="rgb(219, 67, 138)">Delete</ButtonStandard>
        </div>

        <div
          v-if="uploadable"
          class="crud-button"
          key="2"
          @click="() => $emit('openUploader')"
        >
          <ButtonStandard> Upload </ButtonStandard>
        </div>

        <div
          v-if="editing"
          class="crud-button"
          key="3"
          @click="() => $emit('save')"
        >
          <ButtonStandard>Save</ButtonStandard>
        </div>

        <div class="crud-button" key="4" @click="() => $emit('toggleEditing')">
          <ButtonStandard>{{ editing ? "Stop" : "Edit" }}</ButtonStandard>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  editing: {
    type: Boolean,
    required: true,
  },
  uploadable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  deleteable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "openUploader",
  "promptDelete",
  "save",
  "toggleEditing",
]);
</script>

<style scoped>
#crud-buttons {
  position: fixed;
  bottom: 6.5rem;
  right: 1rem;
  z-index: 2;
}
.crud-button {
  width: 100%;
  height: 3rem;
  margin-top: 0.5rem;
  overflow: hidden;
}
.crud-button button {
  height: 100%;
  width: 100%;
}
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}
.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  height: 0;
  border-width: 0;
  padding: 0;
}
</style>
