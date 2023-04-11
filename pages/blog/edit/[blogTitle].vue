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
          <NavError v-if="lavra && fetchError" :error="fetchError" />
        </div>
      </section>
      <NavLoadingIndicator :loading="loadingBlog"
        >Loading Blog</NavLoadingIndicator
      >
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import { BlogPostWithTags, BlogPostWithTagStrings } from "@/types/models";
import { Ref } from "vue";
import { FetchError } from "ofetch";
import { useAuth0 } from "@auth0/auth0-vue";

const route = useRoute();

const pageTitle = computed(() => {
  if (route?.params?.blogTitle) {
    return `Editing ${String(route.params.blogTitle).replaceAll("_", " ")}`;
  } else return "Editing [Untitled] @ L's Blog";
});
useHead({
  titleTemplate: pageTitle,
});

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const rawPost: Ref<BlogPostWithTags | null> = ref(null);
const post: Ref<BlogPostWithTagStrings | null> = ref(null);
const fetchError: Ref<FetchError<any> | null> = ref(null);

const loadingBlog = ref(true);

const reflectBlogUpdate = function () {
  if (rawPost.value) {
    post.value = {
      ...rawPost.value,
      tags: rawPost.value.tags.map((tag) => tag.tag.name),
    };
  }
};
const fetchBlog = async function () {
  useUpdateSelection(
    rawPost,
    `/api/blog/read/${encodeURIComponent(
      String(route.params.blogTitle).replaceAll(/\s/g, "_")
    )}`,
    auth0,
    loadingBlog,
    reflectBlogUpdate
  );
};
updateAtAuth(fetchBlog, auth0);

const save = async function (contents: BlogPostWithTagStrings) {
  loadingBlog.value = true;
  if (post.value?.id && auth0) {
    const id = post.value.id;
    auth0.getAccessTokenSilently().then(async (token) => {
      const { data: saveResult, error: saveError } = await useFetch(
        `/api/blog/${id}`,
        {
          method: "put",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            blogPost: contents,
          },
        }
      );
      if (saveResult.value === "success") {
        navigateTo(`/blog/read/${contents.title.replaceAll(/\s/g, "_")}`);
      } else {
        fetchError.value = saveError.value;
      }
    });
  }
};
const deletePost = async function (id: string) {
  if (/\d/.test(id)) {
    auth0.getAccessTokenSilently().then(async (token) => {
      const { data: deleteResult, error: deleteError } = await useFetch(
        `/api/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchError.value = deleteError.value;
      if (deleteResult.value) {
        navigateTo("/blog");
      } else {
        fetchError.value = deleteError.value;
      }
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
