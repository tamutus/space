<template>
  <div :id="`quill-container-${postId || 0}`" class="blog-entry">
    <div class="post-header">
      <input
        v-if="mode === 'write'"
        class="post-title"
        type="text"
        placeholder="Title of Blog Entry"
        v-model="blogPost.title.value"
      />
      <h2 v-else-if="postTitle">
        <NuxtLink
            :to="`/blog/read/${postTitle.replaceAll(/\s/g, '_')}`"
            @click="showLoader"
            >
        {{ postTitle }}</NuxtLink>
      </h2>
      <ButtonStandard v-if="mode === 'write'" @click="save"
        >Save</ButtonStandard
      >
      <ButtonStandard v-if="mode === 'write' && postTitle"
              ><NuxtLink :to="`/blog/read/${postTitle.replaceAll(/\s/g, '_')}`">Cancel</NuxtLink></ButtonStandard
            >
      <ButtonStandard color="rgb(219, 67, 138)" v-if="mode === 'write' && postId" @click="promptDelete"
        >Delete</ButtonStandard
      >
      <slot></slot>
    </div>
    <div class="post-content">
      <QuillEditor
        :options="quillOptions"
        :toolbar="mode === 'write' ? 'full' : ''"
        :theme="props.mode === 'write' ? 'snow' : 'bubble'"
        v-model:content="blogPost.content"
        contentType="delta"
        :ref="`editor-${postId || 0}`"
      />
    </div>
    <table v-if="mode === 'write'" class="post-meta-section">
      <tbody>
      <tr class="post-meta-item">
        <td><label for="post-tags">Tags for your post</label></td>
        <td>
          <input
            class="post-tags"
            type="text"
            placeholder="Comma-separated tags"
            v-model="tagText"
          />
        </td>
      </tr>
      <tr class="post-meta-item">
        <td><label for="mark-published">Publish this post</label></td>
        <td>
          <input
            class="mark-published"
            type="checkbox"
            v-model="blogPost.published"
          />
        </td>
      </tr>
    </tbody>
    </table>
    <table v-else class="post-meta-section">
      <tbody>
      <tr class="post-meta-item">
        <td>
          <h3>Tags:</h3>
        </td>
        <td>
          <p>
            <div class="tag-box" v-for="tag of tags">
              <div v-if="querying" class="tag-buttons">
                <button class="tag-adder" title="Add to search filter" @click="addTag(tag)">+</button>
                <button class="tag-subtractor" title="Remove from search filter" @click="subtractTag(tag)">-</button>
              </div>
              <NuxtLink
                :to="`/tag/${tag}`"
                class="tag"
                >{{ tag }}
              </NuxtLink>
            </div>
          </p>
        </td>
        <td v-if="!(published === true)"><h3>Draft</h3></td>
      </tr>
    </tbody>
    </table>
    <ButtonStandard v-if="mode === 'write'" @click="save"
        >Save</ButtonStandard
      >
    
    <TheaterModal v-show="deleting" :isOpen="deleting" @close="resetDeletion">
      <form id="delete-menu" @submit.prevent="deletePost">
        <h4>If you would like to delete this blog entry, then type its title as shown:</h4>
        <label for="title-to-delete">{{ postTitle }}</label>
        <input id="title-to-delete" type="text" v-model="deleteName">
        <ButtonStandard>Delete {{ postTitle }}</ButtonStandard>
      </form>
    </TheaterModal>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";

import { Delta, QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { Prisma } from ".prisma/client";

const props = defineProps({
  content: {
    type: Object as PropType<Prisma.JsonValue>,
    default: { ops: [] },
  },
  postTitle: {
    type: String,
    required: false,
  },
  tags: {
    type: Array<string>,
    default: [],
  },
  published: {
    type: Boolean,
    required: false,
  },
  mode: {
    type: String,
    validator(theMode: string) {
      return ["read", "write"].includes(theMode);
    },
    default: "read",
  },
  postId: {
    type: String,
    required: false,
  },
  querying: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["save", "delete", "add", "subtract", "load"]);
const computedTags = computed(() => {
  return tagText.value
    .split(",")
    .map((tag) => tag.trim().replaceAll(/\s/g, "_").toLowerCase());
});

const addTag = function(tagName: string) {
  emit("add", tagName)
}
const subtractTag = function(tagName: string) {
  emit("subtract", tagName);
}
const showLoader = () => {
  emit("load");
};

const tagText: Ref<string> = ref(props.tags?.join(", "));
const blogPost = {
  title: ref(props.postTitle),
  tags: computedTags,
  content: fitsDelta(props.content) ? new Delta(props.content) : undefined,
  published: props.published,
};

const quillOptions = {
  bounds: `quill-container${props.postId || 0}`,
  scrollingContainer: `quill-container${props.postId || 0}`,
  readOnly: props.mode === "read",
};

const save = function () {
  emit("save", {
    title: blogPost.title.value,
    tags: blogPost.tags.value,
    content: blogPost.content,
    published: blogPost.published,
  });
};

if(props.mode === "write"){

    const keys = useMagicKeys();
    
    whenever(keys.alt_s, save);
  }

const deleting = ref(false);
const deleteName = ref("");
const promptDelete = function(){
  deleting.value = true;
}
const resetDeletion = function(){
  deleting.value = false;
  deleteName.value = "";
}
const deletePost = async function(){
  if(deleteName.value === props.postTitle && props.postId){
    emit("delete", props.postId);
    resetDeletion();
  }
}

function fitsDelta(someJson: any): someJson is Delta {
  return someJson && someJson.ops && Array.isArray(someJson.ops);
}
</script>

<style scoped>
.blog-entry {
  overflow-y: auto;
}
.post-header {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: space-evenly;
}
.post-title {
  font-size: 3em;
  margin-bottom: 50px;
  flex: 1 0 300px;
}
#delete-menu {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
}
#delete-menu label {
  font-size: 1.5em;
}
#delete-menu input {
  line-height: 2em;
  font-size: 1.5em;
}
h2 {
  font-family: "Odibee Sans", sans-serif;
  font-size: 4em;
}
h3 {
  font-family: "Odibee Sans", sans-serif;
  font-size: 2em;
}
.post-header button {
  margin-left: 30px;
  translate: 0 -0.75em;
}
.post-content {
  position: relative;
  background-color: rgb(255, 208, 255);
  border-radius: 30px;
  margin: 1.5rem 2rem;
  padding: 3rem 4rem;
}
@media screen and (max-width: 600px){
  .post-content {
    margin: 1.5rem 0;
    padding: 3rem 2rem;
  }
}
.post-meta-section {
  margin: 2rem .5rem 2rem .5rem;
  width: calc(100% - 1rem);
  overflow-x: auto;
}
.post-meta-item {
  height: 3em;
  margin: 0.5em auto;
  width: 100%;
}
.post-meta-item td:first-child {
  padding-right: 2em;
  width: 8em;
}
.post-meta-item td:has(input) {
  font-size: 1.5em;
  transform-origin: left;
}
.post-meta-item input[type="text"] {
  width: 100%;
  min-width: 300px;
}
.post-meta-item input[type="checkbox"] {
  transform: scale(3);
}
.tag-box {
  display: inline-flex;
  flex-flow: column nowrap;
}
.tag-buttons {
  height: 1rem;
  width: 5rem;
  margin: .8rem auto .4rem auto;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  opacity: 0;
  transition: opacity .2s ease-out;
}
.tag-box:hover .tag-buttons {
  opacity: 1;
}
.tag-buttons button {
  height: 2rem;
  width: 2rem;
  border-radius: .5rem;
  font-size: 1rem;
  padding: 0;
  text-align: center;
  transition: background-color .2s ease-out, color .2s ease-out;
}
.tag-adder {
  flex-basis: 0 0 1rem;
  background-color: rgb(71, 214, 135);
}
.tag-adder:hover {
  background-color: rgb(114, 238, 151);
}
.tag-subtractor {
  background-color: rgb(238, 73, 183);
  flex-basis: 0 1 0;
}
.tag-subtractor:hover {
  background-color: rgb(243, 125, 204);
}
.tag-subtractor.shown {
  flex-basis: 0 0 1rem;
}
.tag {
  margin: 0.25rem;
  padding: 0.35rem 0.7rem;
  text-decoration: none;
  background-color: rgba(45, 19, 116, 0.85);
  border-radius: 0 0.4rem 0.4rem 0.4rem;
}
</style>
