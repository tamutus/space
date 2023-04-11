<template>
  <div id="new-post-page">
    <BackgroundTexture texture="fae">
      <div v-if="lavra" class="container">
        <BlogQuill @save="(contents) => save(contents)" mode="write" />
      </div>
      <BackgroundImage
        attachment="fixed"
        image-file-name="assets/photos/city_portal.jpg"
        v-else
      >
        <NavHeader>This page is for Lavra</NavHeader>
      </BackgroundImage>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { NewBlogPost } from "@/types/models";

useHead({
  title: "Write @ LavraT",
});

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const save = async function (contents: NewBlogPost) {
  auth0.getAccessTokenSilently().then(async (token) => {
    const { data, error } = await useFetch("/api/blog", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        blogPost: contents,
      },
    });
    if (data.value === "Success") {
      navigateTo(`/blog/read/${contents.title.replaceAll(/\s/g, "_")}`);
    } else if (error.value) {
      console.error(error.value);
    }
  });
};
</script>

<style scoped>
.container {
  margin-top: 200px;
  margin-bottom: 50vh;
  margin-left: 10vw;
  margin-right: 10vw;
}
</style>
