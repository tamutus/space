<template>
  <div id="blog">
    <BackgroundImage
      attachment="fixed"
      image-file-name="assets/photos/city_portal.jpg"
      v-if="unauthorized"
    >
      <BoxFocus>
        <BackgroundHologram>
          <template #default>
            <h1>Unauthorized</h1>
          </template>
          <template #display>
            <p>
              You are not authorized to view this entry. It may have been
              unpublished, or it may be restricted.
            </p>
          </template>
        </BackgroundHologram>
      </BoxFocus>
    </BackgroundImage>
    <BackgroundTexture v-else texture="fae">
      <div v-if="post" class="post">
        <BlogEntry :key="post.id" :post="post" :querying="false">
          <div class="header-links">
            <NuxtLink
              v-if="lavra"
              :to="`/blog/edit/${encodeURIComponent(
                String(post.title).replaceAll(/\s/g, '_')
              )}`"
              ><ButtonStandard>Edit</ButtonStandard></NuxtLink
            >
            <NuxtLink to="/blog" @click="showLoader"
              ><ButtonStandard>Back to Blog</ButtonStandard></NuxtLink
            >
          </div>
        </BlogEntry>
        <div v-if="post.published === true && post.createdAt" class="dates">
          <h3>Posted on:</h3>
          <p>
            {{
              post.createdAt.toLocaleTimeString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}

            <span v-if="post.updatedAt" class="dates"
              >.
              <h3>Edited on</h3>
              {{
                post.updatedAt.toLocaleTimeString("en-us", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}</span
            >
          </p>
        </div>
      </div>

      <NavLoadingIndicator :loading="loadingBlog"
        >Loading Blogs</NavLoadingIndicator
      ></BackgroundTexture
    >
  </div>
</template>

<script setup lang="ts">
import {
  BlogPostWithTags,
  BlogPostWithTagStrings,
} from "@/server/api/blog/index.get";
import { ComputedRef, Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const route = useRoute();

useHead({
  title: `${String(route.params.blogTitle).replaceAll("_", " ")} – Lavra`,
});

const rawPost: Ref<BlogPostWithTags | string | null> = ref(null);
const post: ComputedRef<BlogPostWithTagStrings | null> = computed(() => {
  if (rawPost.value) {
    if (typeof rawPost.value === "string") {
      return null;
    } else {
      return {
        ...rawPost.value,
        tags: rawPost.value.tags.map((tag) => tag.tag.name),
        createdAt: new Date(rawPost.value.createdAt),
        updatedAt: new Date(rawPost.value.updatedAt),
      };
    }
  } else {
    return null;
  }
});
const loadingBlog = ref(true);
const unauthorized = computed(() => {
  return rawPost.value === "Unauthorized";
});
const showLoader = () => {
  loadingBlog.value = true;
};

const auth0 = useAuth0();
const lavra: Ref<boolean> = useLavra(auth0);

const updateBlogSelection = function () {
  useUpdateSelection(
    rawPost,
    `/api/blog/read/${encodeURIComponent(
      String(route.params.blogTitle).replaceAll(/\s/g, "_")
    )}`,
    auth0,
    loadingBlog
  );
};
updateAtAuth(updateBlogSelection, auth0);
</script>

<style scoped>
#blog {
  min-height: 100vh;
}
.header-links {
  height: 100%;
  display: inline-flex;
  flex-flow: row wrap;
  align-items: center;
}
.header-links > * {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.post {
  padding: 5rem 5rem 0 5rem;
  transition: padding 0.3s ease;
}
@media screen and (max-width: 1150px) {
  .post {
    padding: 220px 1.5rem 0 1.5rem;
  }
}
@media screen and (max-width: 600px) {
  .post {
    padding: 220px 0.5rem 0 0.5rem;
  }
}

div.dates {
  width: 100%;
}
.dates {
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}
h3 {
  font-family: "Odibee Sans", sans-serif;
}
span.dates h3 {
  margin: 0 2rem;
}
</style>
