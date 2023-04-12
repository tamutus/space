<template>
  <div id="tag-page">
    <BackgroundTexture texture="velvet">
      <section>
        <BackgroundHologram v-if="tag">
          <template #default>
            <div>
              <div id="header-row">
                <Transition name="squish">
                  <div v-if="editing" class="title-input">
                    <input v-model="updatedName" type="text" />
                  </div>
                </Transition>

                <h1>
                  {{ liveName }}
                </h1>
                <NavCrud
                  :editing="editing"
                  :editable="lavra"
                  :deleteable="true"
                  @save="save"
                  @promptDelete="promptDelete"
                  @toggleEditing="toggleEditing"
                />
              </div>
              <div class="tag-links">
                <div>
                  <ButtonStandard>
                    <NuxtLink :to="`/blog?tags=${tag.name}`">
                      Tagged blog entries
                    </NuxtLink>
                  </ButtonStandard>
                  <ButtonStandard>
                    <NuxtLink :to="`/furry/gaze?yes=${tag.name}`">
                      Tagged artwork
                    </NuxtLink>
                  </ButtonStandard>
                </div>
                <div>
                  <ButtonStandard class="other-side"
                    ><NuxtLink to="/tag">All tags</NuxtLink></ButtonStandard
                  >
                </div>
              </div>
            </div>
          </template>
          <template #display>
            <div class="info">
              <p v-if="liveInfo && liveInfo.length > 0">{{ liveInfo }}</p>
              <h3 v-else><em>{ No description yet }</em></h3>
              <Transition name="squish">
                <div class="edit-area" v-if="editing">
                  <textarea v-model="updatedInfo"></textarea>
                </div>
              </Transition>
            </div>
          </template>
        </BackgroundHologram>
        <BackgroundHologram v-else> No Such Tag </BackgroundHologram>
      </section>
      <NavError v-show="lavra && fetchError" :error="fetchError"></NavError>
    </BackgroundTexture>
    <TheaterModal v-show="deleting" :isOpen="deleting" @close="resetDeletion">
      <form id="delete-menu" @submit.prevent="deleteTag">
        <h4>
          If you would like to delete this tag, then type its title as shown:
        </h4>
        <label for="tag-to-delete">{{ liveName }}</label>
        <input id="tag-to-delete" type="text" v-model="deleteName" />
        <ButtonStandard>Delete {{ liveName }}</ButtonStandard>
      </form>
    </TheaterModal>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { FetchError } from "ofetch";
import { useAuth0 } from "@auth0/auth0-vue";

import { validateTag } from "@/types/models";
import { authFetchWithId } from "@/composables/auth";

type Tag = {
  id: number;
  name: string;
  info: string | null;
  nsfw: boolean;
};

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

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const tag: Ref<Tag | null> = ref(null);
const loadingTag = ref(true);
const fetchError: Ref<FetchError<any> | null> = ref(null);

const updatedName = ref("");
const updatedInfo = ref("");
const liveName = ref("");
const liveInfo = ref("");

const editing = ref(false);
const nsfw = ref(false);

const reflectTagUpdate = function () {
  updatedInfo.value = tag.value?.info ? tag.value.info : "";
  updatedName.value = tag.value?.name ? tag.value.name : "";
  liveInfo.value = updatedInfo.value;
  liveName.value = updatedName.value;
  nsfw.value = tag.value?.nsfw ? tag.value.nsfw : false;
};
const updateTag = async function () {
  useUpdateSelection(
    tag,
    `/api/tag/view/${encodeURIComponent(
      String(route.params.tagName).replaceAll(/\s/g, "_")
    )}`,
    auth0,
    loadingTag,
    reflectTagUpdate,
    fetchError
  );
};

updateAtAuth(updateTag, auth0);

const toggleEditing = function () {
  editing.value = !editing.value;
};

const save = async function () {
  if (tag.value?.id) {
    const { data: savedTag, error: saveError } = await authFetchWithId(
      tag,
      "/api/tag/",
      auth0,
      lavra,
      "put",
      {
        body: {
          tag: {
            name: updatedName.value,
            info: updatedInfo.value,
            nsfw: nsfw.value,
          },
        },
      }
    );
    fetchError.value = saveError.value;
    if (savedTag.value && !fetchError.value) {
      const t = savedTag.value;
      if (validateTag(t)) {
        tag.value = t;
        reflectTagUpdate();
      }
      toggleEditing();
    }
    // const id = tag.value.id;
    // auth0.getAccessTokenSilently().then(async (token) => {
    //   if (tag.value?.id) {
    //     const { data: tagResponse } = await useFetch(
    //       `/api/tag/${tag.value.id}`,
    //       {
    //         method: "put",
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //         body: {
    //           tag: {
    //             name: updatedName.value,
    //             info: updatedInfo.value,
    //           },
    //         },
    //       }
    //     );
    //     if (tagResponse.value && typeof tagResponse.value !== "string") {
    //       tag.value = tagResponse.value;
    //       reflectTagUpdate();
    //       toggleEditing();
    //     } else {
    //       console.log(tagResponse.value);
    //     }
    //   }
    // });
  }
};
// Delete functionality
const deleting = ref(false);
const deleteName = ref("");

const promptDelete = function () {
  deleting.value = true;
};
const resetDeletion = function () {
  deleting.value = false;
  deleteName.value = "";
};
const deleteTag = async function () {
  const { data: deleteResult, error: deleteError } = await authFetchWithId(
    tag,
    "/api/tag/",
    auth0,
    lavra,
    "delete"
  );
  fetchError.value = deleteError.value;
  if (deleteResult.value && !deleteError.value) {
    console.log(`Deleted ${JSON.stringify(deleteResult.value, null, 2)}`);
  } else {
    navigateTo("/tag");
  }
  // if (deleteName.value === liveName.value && tag.value?.id) {
  //   const id = tag.value.id;
  //   auth0.getAccessTokenSilently().then(async (token) => {
  //     const { data: deleteResult, error: deleteError } = await useFetch(
  //       `/api/pics/homepage-gallery/file/${id}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   });
  // }
  resetDeletion();
};
</script>

<style scoped>
#tag-page {
  min-height: 100vh;
}
#header-row {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}
#header-row h1 {
  align-self: flex-start;
  flex: 50% 0 0;
}
.tag-links {
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.tag-links > div {
  display: flex;
  flex-flow: row wrap;
  justify-items: flex-start;
  margin-bottom: 1.5em;
}
.tag-links button {
  margin-right: 1.5em;
}
.tag-links button.other-side {
  margin-right: 0;
  margin-left: 1.5rem;
  align-self: flex-end;
}
input {
  font-size: inherit;
}
.title-input {
  height: 4.5rem;
  transition: all 0.4s ease-out;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.title-input input {
  font-size: 2rem;
  margin: 1rem 0.2rem 1rem 0.2rem;
  height: 2.5rem;
  padding: 0.2rem 1rem;
  border-style: solid;
  border-color: rgb(253, 189, 243);
  border-width: 0.2rem;
  background-color: rgb(201, 255, 230);
  border-radius: 0.8rem;
  transition: outline 0.2s ease;
  outline: 0 solid rgb(206, 178, 235);
}
.title-input input:focus {
  outline: 0.2rem solid rgb(98, 10, 180);
  transition: outline 0.1s ease;
}
.info {
  width: 100%;
  white-space: pre-wrap;
  max-height: 100%;
  /* color: rgb(130, 85, 217);
  text-shadow: rgb(227, 205, 253) -2px 0 8px, rgb(192, 255, 206) 2px 0 8px; */
  border-radius: 20px;
  z-index: 1;
  padding: 2vh 0;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: flex-start;
  /* background-color: rgba(248, 219, 249, 0.9); */
}
.info p {
  /* white-space: pre-wrap; */
}
.edit-area {
  height: 12rem;
  width: 100%;
  overflow-y: auto;
  overflow-x: visible;
  display: flex;
  flex-flow: column nowrap;
}
.edit-area textarea {
  /* height: 1rem; */
  width: 100%;
  max-width: 100%;
  height: 10rem;

  box-sizing: border-box;
  border-radius: 1.5rem 0 0 1.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}
.squish-enter-move,
.squish-enter-active,
.squish-leave-active,
.squish-leave-active *,
.squish-enter-active * {
  transition: all 0.4s ease-out, outline 0.2s ease;
}
.squish-enter-from,
.squish-leave-to {
  margin: 0;
  border-width: 0;
  padding: 0;
  height: 0;
  border-radius: 0;
  line-height: 0;
}
</style>
