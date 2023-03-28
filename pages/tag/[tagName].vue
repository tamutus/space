<template>
  <div id="tag-page">
    <BackgroundTexture texture="velvet">
      <section>
        <BackgroundHologram v-if="tag">
          <template #default>
            <div>
              <div id="header-row">
                <h1>
                  <Transition name="slide" mode="out-in"
                    ><input
                      v-if="lavra && editing"
                      type="text"
                      v-model="updatedName"
                    />
                    <span v-else>
                      {{ liveName }}
                    </span></Transition
                  >
                </h1>
                <div class="header-buttons">
                  <ButtonStandard v-if="lavra" @click="toggleEditing">{{
                    editing ? "Stop" : "Edit"
                  }}</ButtonStandard>
                  <ButtonStandard v-if="lavra && editing" @click="save"
                    >Save</ButtonStandard
                  >
                </div>
              </div>
              <div class="tag-links">
                <ButtonStandard>
                  <NuxtLink :to="`/blog?tags=${tag.name}`">
                    Tagged blog entries
                  </NuxtLink>
                </ButtonStandard>
              </div>
            </div>
          </template>
          <template
            #display
            v-if="(liveInfo && liveInfo.length > 0) || editing"
          >
            <div>
              {{ liveInfo }}
              <div v-if="editing">
                <textarea v-model="updatedInfo" class="info"></textarea>
              </div>
            </div>
          </template>
        </BackgroundHologram>
        <BackgroundHologram v-else> No Such Tag </BackgroundHologram>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import { Tag } from ".prisma/client";
import { Ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const route = useRoute();

const pageTitle = computed(() => {
  if (route?.params?.tagName) {
    return `${String(route.params.tagName).replaceAll(
      "_",
      " "
    )} – Lavra's tags`;
  } else return "[Untitled] in L's Tags";
});
useHead({
  titleTemplate: pageTitle,
});

const tag: Ref<Tag | null> = ref(null);
const loadingTag = ref(true);
const editing = ref(false);

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const updatedName = ref("");
const updatedInfo = ref("");
const liveName = ref("");
const liveInfo = ref("");

const updateTag = async function () {
  useUpdateSelection(
    tag,
    `/api/tag/view/${encodeURIComponent(
      String(route.params.tagName).replaceAll(/\s/g, "_")
    )}`,
    undefined,
    loadingTag,
    reflectTagUpdate
  );
};
function reflectTagUpdate() {
  updatedInfo.value = tag?.value?.info ? tag.value.info : "";
  updatedName.value = tag?.value?.name ? tag.value.name : "";
  liveInfo.value = updatedInfo.value;
  liveName.value = updatedName.value;
}
updateAtAuth(updateTag, auth0);

const toggleEditing = function () {
  editing.value = !editing.value;
};
const save = async function () {
  if (lavra.value && tag.value?.id) {
    auth0.getAccessTokenSilently().then(async (token) => {
      if (tag.value?.id) {
        const { data: tagResponse } = await useFetch(
          `/api/tag/${tag.value.id}`,
          {
            method: "put",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              tag: {
                name: updatedName.value,
                info: updatedInfo.value,
              },
            },
          }
        );
        if (tagResponse.value && typeof tagResponse.value !== "string") {
          tag.value = tagResponse.value;
          reflectTagUpdate();
          toggleEditing();
        } else {
          console.log(tagResponse.value);
        }
      }
    });
  }
};
</script>

<style scoped>
#tag-page {
  min-height: 100vh;
}
#header-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
#header-row h1 {
  align-self: flex-start;
  flex: 50% 0 0;
}
.tag-links {
  margin-bottom: 2rem;
}
input {
  font-size: inherit;
}
.info {
  min-height: 6rem;
  width: 100%;
}
textarea {
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-top: 2rem;
}
.slide-enter-active,
.slide-leave-active {
  transition: width 0.3s 0s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  width: 0;
}
.slide-enter-to,
.slide-leave-from {
  width: 100%;
}
</style>
