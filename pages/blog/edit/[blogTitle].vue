<template>
  <div id="blog-editor">
    <BackgroundTexture texture="fae">
      <section>
        <div v-if="lavra && post" class="container">
          <BlogQuill
            :content="post.content"
            mode="write"
            :post-title="post.title"
            :tags="post.tags"
            :published="post.published"
            :postId="String(post.id)"
            :querying="false"
            @save="(contents) => save(contents)"
            @delete="(contents) => deletePost(contents)"
          ></BlogQuill>
        </div>
      </section>
      <NavLoadingIndicator :loading="loadingBlog"
        >Loading Blog</NavLoadingIndicator
      >
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import {
  BlogPostWithTags,
  BlogPostWithTagStrings,
} from "@/server/api/blog/index.get";
import { Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const route = useRoute();
useHead({
  title: `Editing ${String(route.params.blogTitle).replaceAll("_", " ")}`,
});

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const rawPost: Ref<BlogPostWithTags | string | null> = ref(null);
const post: Ref<BlogPostWithTagStrings | null> = ref(null);
const loadingBlog = ref(true);

const fetchBlog = async function () {
  useUpdateSelection(
    rawPost,
    `/api/blog/read/${encodeURIComponent(
      String(route.params.blogTitle).replaceAll(/\s/g, "_")
    )}`,
    auth0,
    loadingBlog,
    () => {
      if (rawPost.value && typeof rawPost.value !== "string") {
        post.value = {
          ...rawPost.value,
          tags: rawPost.value.tags.map((tag) => tag.tag.name),
        };
      }
    }
  );
};
updateAtAuth(fetchBlog, auth0);

const save = async function (contents: BlogPostWithTagStrings) {
  loadingBlog.value = true;
  if (post.value?.id && auth0) {
    auth0
      .getAccessTokenSilently()
      .then(async (token) => {
        if (post.value?.id) {
          await useFetch(`/api/blog/${post.value.id}`, {
            method: "put",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              blogPost: contents,
            },
          });
        }
      })
      .then(() => {
        navigateTo(`/blog/read/${contents.title.replaceAll(/\s/g, "_")}`);
      });
  }
};
const deletePost = async function (id: string) {
  if (/\d/.test(id)) {
    auth0
      .getAccessTokenSilently()
      .then(async (token) => {
        const deleteResult = await useFetch(`/api/blog/${id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        console.log(res);
        navigateTo("/blog");
      });
  }
};

onMounted(() => {
  loadingBlog.value = false;
});
</script>

<style scoped>
section {
  padding: 5rem 100px;
}
</style>
