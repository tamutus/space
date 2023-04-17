<template>
  <div id="active-tags-nav">
    <TransitionGroup name="list">
      <div class="tag-box" v-for="tag of yesList" :key="`yes-${tag}`">
        <NuxtLink
          v-if="!tag.split('').includes(':')"
          :to="`/tag/${tag}`"
          class="yes tag"
          >{{ tag }}
        </NuxtLink>
        <div v-else class="yes tag">{{ tag }}</div>
        <div class="tag-buttons">
          <button
            v-if="!tag.split('').includes(':')"
            class="tag-loosener"
            :title="`Include ${tag} artwork optionally`"
            @click="loosenTag(tag)"
          >
            ~
          </button>
          <button
            class="tag-blocker"
            :title="`Block ${tag} pictures from search`"
            @click="blockTag(tag)"
          >
            🚫
          </button>
          <button
            class="tag-subtractor"
            :title="`Remove ${tag} from search filter`"
            @click="removeTag(tag)"
          >
            –
          </button>
        </div>
      </div>

      <div class="tag-box" v-for="tag of maybeList" :key="`maybe-${tag}`">
        <NuxtLink :to="`/tag/${tag}`" class="maybe tag">{{ tag }} </NuxtLink>
        <div class="tag-buttons">
          <button
            class="tag-adder"
            :title="`Require artwork to be tagged ${tag}`"
            @click="addTag(tag)"
          >
            +
          </button>
          <button
            class="tag-blocker"
            title="Block from search filter"
            @click="blockTag(tag)"
          >
            🚫
          </button>
          <button
            class="tag-subtractor"
            title="Remove from search filter"
            @click="removeTag(tag)"
          >
            –
          </button>
        </div>
      </div>

      <div class="tag-box" v-for="tag of noList" :key="`no-${tag}`">
        <NuxtLink :to="`/tag/${tag}`" class="no tag">{{ tag }} </NuxtLink>
        <div class="tag-buttons">
          <button
            class="tag-adder"
            :title="`Require artwork to be tagged ${tag}`"
            @click="addTag(tag)"
          >
            +
          </button>
          <button
            v-if="!tag.split('').includes(':')"
            class="tag-loosener"
            :title="`Include ${tag} artwork optionally`"
            @click="loosenTag(tag)"
          >
            ~
          </button>
          <button
            class="tag-subtractor"
            title="Remove from search filter"
            @click="removeTag(tag)"
          >
            –
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  yesList: {
    type: Set<string>,
    default: new Set(),
  },
  maybeList: {
    type: Set<string>,
    default: new Set(),
  },
  noList: {
    type: Set<string>,
    default: new Set(),
  },
});

const emit = defineEmits(["add", "loosen", "remove", "block"]);

const addTag = function (tag: string) {
  emit("add", tag);
};
const removeTag = function (tag: string) {
  emit("remove", tag);
};
const loosenTag = function (tag: string) {
  emit("loosen", tag);
};
const blockTag = function (tag: string) {
  emit("block", tag);
};
</script>

<style scoped>
#active-tags-nav {
  position: fixed;
  bottom: 0.25rem;
  left: 0.25rem;
  width: 11rem;
  z-index: 2;
}
.tag-box {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}
.tag-buttons {
  height: 1rem;
  width: 5rem;
  margin: 0.8rem 0 0.4rem auto;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}
.tag-box:hover .tag-buttons {
  opacity: 1;
}
.tag-buttons button {
  height: 2rem;
  width: 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0;
  text-align: center;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;
}
.tag-adder,
.yes.tag {
  background-color: rgb(71, 214, 135);
}
.tag-adder:hover,
.yes.tag:hover {
  background-color: rgb(114, 238, 151);
}
.tag-loosener,
.maybe.tag {
  background-color: rgb(110, 202, 255);
}
.tag-loosener:hover,
.maybe.tag:hover {
  background-color: rgb(111, 229, 250);
}

.tag-subtractor {
  background-color: rgb(241, 191, 145);
}
.tag-subtractor:hover {
  background-color: rgb(247, 163, 85);
}
.tag-subtractor.shown {
  flex-basis: 0 0 1rem;
}
.tag-blocker,
.no.tag {
  background-color: rgb(243, 125, 204);
}
.tag-blocker:hover,
.no.tag:hover {
  background-color: rgb(238, 73, 183);
}

.tag {
  color: black;
  margin: 0.25rem;
  padding: 0.35rem 0.7rem;
  text-decoration: none;
  background-color: rgba(45, 19, 116, 0.85);
  border-radius: 0 0.4rem 0.4rem 0.4rem;
  transition: color 0.3s ease-out, background-color 0.3s ease-out;
}
</style>
