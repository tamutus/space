<template>
  <div class="entry-container">
    <BlogQuill
      :content="post.content"
      mode="read"
      :post-title="post.title"
      :tags="post.tags"
      :published="post.published"
      :postId="String(post.id)"
      :querying="querying"
      @add="(tagName) => addTag(tagName)"
      @subtract="(tagName) => subtractTag(tagName)"
      ><slot><template></template></slot
    ></BlogQuill>
  </div>
</template>

<script setup lang="ts">
import type { BlogPostWithTagStrings as BlogPost } from "@/types/models";

const props = defineProps({
  post: {
    required: true,
    type: Object as PropType<BlogPost>,
  },
  querying: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["add", "subtract"]);
const addTag = function (tagName: string) {
  emit("add", tagName);
};
const subtractTag = function (tagName: string) {
  emit("subtract", tagName);
};
</script>

<style scoped>
.entry-container {
  height: calc(100% - 200px);
}
</style>
