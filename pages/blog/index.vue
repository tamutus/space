<template>
  <div id="blog">
    <BackgroundTexture texture="fae">
      <section><NavHeader>Lavra's Blog</NavHeader></section>
      <div v-if="backable" class="central">
        <ButtonStandard @click="priorPage">Prior Page</ButtonStandard>
      </div>
      <div v-if="loadingAuth" key="loading" class="central">
        <BoxAlmond>
          <AnimatedWord word="Loading Authentication" />
        </BoxAlmond>
      </div>
      <TransitionGroup name="phase">
        <section
          v-for="post of postsWithTagStrings"
          :key="post.id"
          class="blog-preview"
        >
          <BlogEntry
            :post="post"
            :querying="true"
            @add="(tagName) => addTag(tagName)"
            @subtract="(tagName) => subtractTag(tagName)"
            @load="showLoader"
          >
            <NuxtLink
              v-if="lavra"
              :to="`/blog/edit/${encodeURIComponent(
                String(post.title).replaceAll(/\s/g, '_')
              )}`"
              @click="showLoader"
              ><ButtonStandard>Edit</ButtonStandard></NuxtLink
            >
          </BlogEntry>
        </section></TransitionGroup
      >
      <div class="central" v-if="nextable">
        <ButtonStandard @click="nextPage">Next Page</ButtonStandard>
      </div>
      <div class="central removers">
        <ButtonStandard
          color="rgb(219, 67, 138)"
          v-if="tags.length > 0"
          @click="clearTags"
        >
          Clear Tag Filter
        </ButtonStandard>
      </div>
    </BackgroundTexture>
    <NavLoadingIndicator :loading="loadingBlogs"
      >Loading Blogs</NavLoadingIndicator
    >
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import {
  BlogPostWithTags,
  BlogPostWithTagStrings,
} from "@/server/api/blog/index.get";

useHead({
  title: "Lavra's Writing",
});

const auth0 = useAuth0();
const loadingAuth = computed(() => {
  return auth0 && auth0.isLoading && auth0.isLoading.value;
});
const lavra: Ref<boolean> = useLavra(auth0);

const loadingBlogs = ref(true);

const route = useRoute();

let blogPosts: Ref<BlogPostWithTags[] | string | null> = ref(null);
const earliestBlogId: Ref<number | null> = ref(null);
const latestBlogId: Ref<number | null> = ref(null);
const postsWithTagStrings: ComputedRef<BlogPostWithTagStrings[]> = computed(
  () => {
    if (blogPosts.value && typeof blogPosts.value !== "string") {
      return blogPosts.value.map((post) => {
        return { ...post, tags: post.tags.map((tag) => tag.tag.name) };
      });
    }
    return [];
  }
);
const lastPostInResults: ComputedRef<BlogPostWithTags | null> = computed(() => {
  if (blogPosts.value && typeof blogPosts.value !== "string") {
    return blogPosts.value[blogPosts.value.length - 1];
  } else {
    return null;
  }
});
const firstPostInResults: ComputedRef<BlogPostWithTags | null> = computed(
  () => {
    if (blogPosts.value && typeof blogPosts.value !== "string") {
      return blogPosts.value[0];
    } else {
      return null;
    }
  }
);
const cursor: ComputedRef<number | null> = computed(() => {
  if (lastPostInResults.value) {
    return lastPostInResults.value.id;
  } else return null;
});
const backCursor: ComputedRef<number | null> = computed(() => {
  if (firstPostInResults.value) {
    return firstPostInResults.value.id;
  } else {
    return null;
  }
});
const nextable = computed(() => {
  if (Array.isArray(blogPosts.value) && blogPosts.value.length === 0) {
    return false;
  } else if (earliestBlogId.value && earliestBlogId.value !== cursor.value) {
    return true;
  } else {
    return false;
  }
});
const backable = computed(() => {
  if (Array.isArray(blogPosts.value) && blogPosts.value.length === 0) {
    return false;
  }
  if (latestBlogId.value && latestBlogId.value !== backCursor.value) {
    return true;
  } else {
    return false;
  }
});

const past = ref(route.query.past ? `past=${route.query.past}` : "");
const take = ref(route.query.take ? `take=${route.query.take}` : "");
const tags = ref(route.query.tags ? `tags=${route.query.tags}` : "");
const queryParams: ComputedRef<string[]> = computed(() => {
  let params = [];
  if (past.value) {
    params.push(past.value);
  }
  if (tags.value) {
    params.push(tags.value);
  }
  if (take.value) {
    params.push(take.value);
  }
  return params;
});

const showLoader = () => {
  loadingBlogs.value = true;
};

const updateBlogSelection = async () => {
  useUpdateSelection(
    blogPosts,
    `/api/blog?${queryParams.value.join("&")}`,
    auth0,
    loadingBlogs,
    async (token?: string) => {
      if (Array.isArray(blogPosts.value)) {
        blogPosts.value = blogPosts.value.sort((a, b) => {
          return b.id - a.id;
        });
      }
      const { data: bounds } = await useFetch(
        `/api/blog/bounds?${queryParams.value.join("&")}`,
        token
          ? {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {
              method: "GET",
            }
      );
      if (bounds.value) {
        latestBlogId.value = bounds.value.latest;
        earliestBlogId.value = bounds.value.earliest;
      }
    }
  );
};

updateAtAuth(updateBlogSelection, auth0);

const addTag = function (tagName: string) {
  if (tags.value.length === 0) {
    tags.value = `tags=${tagName}`;
  } else {
    const oldTagString = tags.value.split("=")[1].split(" ");
    if (!oldTagString.includes(tagName)) {
      tags.value += `+${tagName}`;
    }
  }
  past.value = "";
  take.value = "";
  navigateTo(`/blog?${queryParams.value.join("&")}`);
};
const subtractTag = function (tagName: string) {
  if (tags.value.length === 0) {
    return;
  }
  const newTagString = tags.value
    .split("=")[1]
    .split(" ")
    .filter((queryTag) => tagName !== queryTag)
    .join(" ");
  if (newTagString !== tags.value) {
    if (newTagString.length === 0) {
      tags.value = newTagString;
    } else {
      tags.value = `tags=${newTagString}`;
    }
    past.value = "";
    take.value = "";
    navigateTo(`/blog?${queryParams.value.join("&")}`);
  }
};
const clearTags = function () {
  tags.value = "";
  navigateTo(`/blog?${queryParams.value.join("&")}`);
};
const nextPage = function () {
  if (nextable.value) {
    past.value = cursor.value ? `past=${cursor.value}` : "";
    take.value = "";
    navigateTo(`/blog?${queryParams.value.join("&")}`);
  } else {
    console.log("No more posts");
  }
};
const priorPage = function () {
  if (backable.value) {
    past.value = backCursor.value ? `past=${backCursor.value}` : "";
    take.value = `take=-5`;
    navigateTo(`/blog?${queryParams.value.join("&")}`);
  }
};

watch(route, (newRoute) => {
  loadingBlogs.value = true;
  past.value = route.query.past ? `past=${route.query.past}` : "";
  take.value = route.query.take ? `take=${route.query.take}` : "";
  tags.value = route.query.tags ? `tags=${route.query.tags}` : "";
  updateBlogSelection();
});
</script>

<style scoped>
#blog {
  min-height: 100vh;
}
.blog-preview {
  position: relative;
  box-sizing: border-box;
  margin: 5rem 10vw;
  padding-right: 1.5rem;
  overflow-y: auto;
  border-width: 0 2px 0.5rem 0;
  border-style: solid;
  border-color: rgba(255, 206, 244, 0.747);
  background-color: rgba(255, 206, 244, 0.15);
  border-radius: 1rem 0 0.75rem 1rem;
}
@media screen and (max-width: 700px) {
  .blog-preview {
    margin: 4rem 1.5rem 4rem 4rem;
    padding-right: 1rem;
  }
}
@media screen and (max-width: 500px) {
  .blog-preview {
    margin: 3rem 30px;
    margin: 3rem 0.75rem 3rem 3rem;
    padding-right: 0.75rem;
  }
}
.full-article-link {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.central {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.central > * {
  font-size: 2em;
}
.removers {
  margin-top: 2rem;
}

.phase-enter-active,
.phase-leave-active {
  transition: opacity 0.3s, filter 0.3s, max-height 0.5s;
}
.phase-enter-from,
.phase-leave-to {
  max-height: 0;
  opacity: 0;
  filter: blur(35px) grayscale(2);
}
</style>
