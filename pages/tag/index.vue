<template>
  <div id="tag-splash-page">
    <BackgroundTexture texture="velvet">
      <section>
        <NavHeader>Tags</NavHeader>
        <div id="tag-viewer">
          <div class="tag-frame" v-for="tag of tags">
            <BoxGlass mode="dark">
              <NuxtLink :to="`/tag/${tag.name}`">
                <div class="tag-text">
                  {{ tag.name }}
                </div>
              </NuxtLink>
            </BoxGlass>
          </div>
        </div>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { Tag } from ".prisma/client";

const auth0 = useAuth0();
const tags: Ref<Tag[] | null> = ref(null);
const loadingTags = ref(true);
const fetchError: Ref<any | null> = ref(null);

useUpdateSelection(tags, "/api/tag", auth0, loadingTags, undefined, fetchError);
</script>

<style scoped>
#tag-viewer {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: flex-start;
  width: 90%;
  margin: 5vh 5% 0 5%;
}
.tag-frame {
  flex: 0 0 5em;
  margin: 2rem;
}
.tag-text {
  padding: 1em;
  color: rgb(221, 243, 255);
  transition: color 0.3s ease-out;
}
.tag-frame .tag-text:hover {
  color: rgb(113, 255, 212);
}
</style>
