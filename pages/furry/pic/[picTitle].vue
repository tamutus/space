<template>
  <div id="furry-pic-focus-page">
    <BackgroundTexture texture="fae">
      <div>
        <GalleryAnnotatedPic v-if="art">
          <template #image>
            <div>
              <div id="header-row">
                <NavCrud
                  :editing="editing"
                  :editable="lavra"
                  :uploadable="true"
                  :deleteable="true"
                  @save="save"
                  @promptDelete="promptDelete"
                  @toggleEditing="toggleEditing"
                  @openUploader="openUploader"
                />
              </div>
              <div class="image-container">
                <img class="artwork" :src="art.url" />
              </div>
              <div class="tag-links">
                <NuxtLink
                  v-for="tag of art.tags"
                  :to="`/furry/gaze?yes=${tag}`"
                  class="tag-box"
                >
                  <ButtonStandard>
                    {{ tag }}
                  </ButtonStandard>
                </NuxtLink>
              </div>
            </div>
          </template>
          <template #info v-if="(liveInfo && liveInfo.length > 0) || editing">
            <div class="info">
              <div class="art-title">
                <Transition name="squish">
                  <div v-if="editing" class="title-input">
                    <input v-model="updatedTitle" />
                  </div>
                </Transition>
                <h3>{{ liveTitle }}</h3>
              </div>
              <p>{{ liveInfo }}</p>
              <Transition name="squish">
                <div class="edit-area" v-if="lavra && editing">
                  <textarea v-model="updatedInfo"> </textarea>
                  <input
                    class="art-tags"
                    type="text"
                    placeholder="Comma-separated tags"
                    v-model="tagText"
                  />
                  <input type="checkbox" v-model="publish" />
                </div>
              </Transition>
            </div>
          </template>
        </GalleryAnnotatedPic>
        <BackgroundHologram v-else-if="auth0.isLoading">
          Loading authorization</BackgroundHologram
        >
        <BackgroundHologram v-else> No Such Art </BackgroundHologram>
      </div>
      <NavError v-show="lavra && fetchError" :error="fetchError"></NavError>
    </BackgroundTexture>
    <TheaterModal v-show="deleting" :isOpen="deleting" @close="resetDeletion">
      <form id="delete-menu" @submit.prevent="deleteArt">
        <h4>
          If you would like to delete this blog entry, then type its title as
          shown:
        </h4>
        <label for="title-to-delete">{{ liveTitle }}</label>
        <input id="title-to-delete" type="text" v-model="deleteName" />
        <ButtonStandard>Delete {{ liveTitle }}</ButtonStandard>
      </form>
    </TheaterModal>
    <TheaterModal v-show="uploading" :isOpen="uploading" @close="cancelUpload">
      <form id="upload-menu" @submit.prevent="upload">
        <label id="art-upload-demi-button" for="art-uploader"
          >Add an image file to upload here
        </label>
        <input
          id="art-uploader"
          type="file"
          accept="image/*"
          @change="stageFile"
        />
        <ButtonStandard @click="upload"
          >Upload "{{ activeFile?.name || "[blank]" }}" as
          {{ art?.title }}</ButtonStandard
        >
      </form>
    </TheaterModal>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { logicAnd } from "@vueuse/math";
import { useAuth0 } from "@auth0/auth0-vue";
import { FetchError } from "ofetch";

import {
  type ArtWithTags,
  type ArtWithTagStrings,
  validateArtWithTags,
} from "@/types/models";
import {
  type Bucket,
  type BucketUploadAction,
  validBucket,
  validImageFile,
} from "@/types/googleStorage";

const route = useRoute();

const pageTitle = computed(() => {
  if (route?.params?.picTitle) {
    return `${String(route.params.picTitle).replaceAll(
      "_",
      " "
    )} – Lavra's Art`;
  } else return "[Untitled] in Reconcile's Art Gallery";
});
useHead({
  titleTemplate: pageTitle,
});

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const rawArt: Ref<ArtWithTags | null> = ref(null);
const art: Ref<ArtWithTagStrings | null> = ref(null);

const loadingArt = ref(true);
const fetchError: Ref<FetchError<any> | null> = ref(null);

const updatedTitle = ref("");
const updatedInfo = ref("");
const liveTitle = ref("");
const liveInfo = ref("");
const liveTags: Ref<Array<string>> = ref([]);

const tagText: Ref<string> = ref("");
const computedTags = computed(() => {
  return tagText.value
    .split(",")
    .map((tag) => tag.trim().replaceAll(/\s/g, "_").toLowerCase());
});

const editing = ref(false);
const publish = ref(false);

const activeAction: Ref<BucketUploadAction> = ref("homepage-upload");
const activeBucket: Ref<Bucket> = ref("homepage-gallery");
const uploading = ref(false);
const uploadURL: Ref<string | null> = ref(null);
const activeFile: Ref<File | null> = ref(null);

const reflectArtUpdate = function () {
  if (rawArt.value && typeof rawArt.value !== "string") {
    art.value = {
      ...rawArt.value,
      tags: rawArt.value.tags.map((tag) => tag.tag.name).sort(),
    };
  }
  updatedInfo.value = art.value?.info ? art.value.info : "";
  updatedTitle.value = art.value?.title ? art.value.title : "";
  liveTags.value = art.value?.tags ? art.value.tags : [];
  tagText.value = liveTags.value.join(", ");
  liveInfo.value = updatedInfo.value;
  liveTitle.value = updatedTitle.value;
  publish.value = art.value?.published === true;
  if (art.value && validBucket(art.value.bucket)) {
    if (art.value.bucket === "adult-gallery") {
      activeAction.value = "adult-upload";
    } else {
      activeAction.value = "homepage-upload";
    }
  }
};
const fetchArt = async function () {
  useUpdateSelection(
    rawArt,
    `/api/pics/title/${String(route.params.picTitle)}`,
    auth0,
    loadingArt,
    reflectArtUpdate,
    fetchError
  );
};
updateAtAuth(fetchArt, auth0);

const toggleEditing = function () {
  editing.value = !editing.value;
};

const save = async function () {
  if (lavra.value && art.value?.id) {
    const id = art.value.id;
    auth0.getAccessTokenSilently().then(async (token) => {
      const { data: artResponse, error: saveError } = await useFetch(
        `/api/pics/${activeAction.value}/file/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            art: {
              title: updatedTitle.value,
              info: updatedInfo.value,
              tags: computedTags.value,
              published: publish.value,
            },
          },
        }
      );
      if (artResponse.value) {
        if (!saveError.value && validateArtWithTags(artResponse.value)) {
          rawArt.value = artResponse.value;
          reflectArtUpdate();
          toggleEditing();
        } else {
          fetchError.value = saveError.value;
          console.error(saveError.value?.data);
          console.group();
          console.warn("Art response was not as expected:");
          console.warn(artResponse.value);
          console.groupEnd();
        }
      }
    });
  }
};
const keys = useMagicKeys();

whenever(logicAnd(keys.alt_s, editing), save);

// Picture uploading

const openUploader = async function () {
  if (auth0 && lavra.value === true && art.value?.id) {
    const id = art.value.id;
    auth0.getAccessTokenSilently().then(async (token) => {
      const { data: artUploadURL, error: uploadError } = await useFetch(
        `/api/pics/${activeAction.value}/file/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchError.value = uploadError.value;
      if (
        artUploadURL.value &&
        typeof artUploadURL.value === "string" &&
        !uploadError.value
      ) {
        uploadURL.value = artUploadURL.value;
        uploading.value = true;
      } else {
        fetchError.value = uploadError.value;
        cancelUpload();
      }
    });
  }
};

const cancelUpload = function () {
  uploading.value = false;
};

const stageFile = function ($event: any) {
  const hopefullyOneFile = $event?.target?.files;
  if (hopefullyOneFile.length === 1) {
    activeFile.value = $event.target.files[0];
  }
};

const upload = async function () {
  if (activeFile.value && uploadURL.value) {
    const validated = validImageFile(activeFile.value);
    if (validated) {
      const { error: uploadError } = await useFetch(uploadURL.value, {
        method: "PUT",
        body: activeFile.value,
      });
      if (!uploadError.value) {
        navigateTo(`${art.value?.title.replaceAll(/\s/g, "_")}`);
        fetchArt();
        cancelUpload();
      } else {
        console.error("Error uploading picture to GCS:", uploadError.value);
      }
    }
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
const deleteArt = async function () {
  if (deleteName.value === liveTitle.value && art.value?.id) {
    const id = art.value.id;
    const bucket = art.value.bucket;
    auth0.getAccessTokenSilently().then(async (token) => {
      const { data: deleteResult, error: deleteError } = await useFetch(
        `/api/pics/${bucket.replace("gallery", "upload")}/file/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchError.value = deleteError.value;
      if (deleteResult.value && !deleteError.value) {
        console.log(`Deleted ${JSON.stringify(deleteResult.value, null, 2)}`);
        navigateTo("/furry/gaze");
      } else {
        console.log(deleteResult.value);
      }
    });
  }
  resetDeletion();
};
</script>

<style scoped>
#tag-page {
  min-height: 100vh;
}
#page-title {
  align-self: flex-start;
}
#header-row {
  position: relative;
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
  display: inline-flex;
  flex-flow: row wrap;
}
.tag-box {
  margin: 0 0.5rem;
}
.tag-box button {
  padding: 0.5rem;
}

.art-title h3 {
  margin-bottom: 2rem;
  text-align: left;
  font-style: italic;
  color: rgb(149, 81, 215);
  font-family: "Cinzel Decorative", sans-serif;
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
  margin: 1rem 0 1rem 0;
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
.image-container {
  margin: 5vh 0;
  max-height: 100vh;
}
img.artwork {
  object-fit: contain;
  max-height: 80vh;
  max-width: 80vw;
  margin-bottom: 10vh;
}
.edit-area {
  height: 80vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: visible;
  display: flex;
  flex-flow: column nowrap;
}
.info textarea {
  min-height: 8rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 1.5rem 0 0 1.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
}
div.info {
  white-space: pre-wrap;
  color: rgb(130, 85, 217);
  text-shadow: rgb(227, 205, 253) -2px 0 8px, rgb(192, 255, 206) 2px 0 8px;
  border-radius: 20px;
  z-index: 1;
  padding: 7vh 12.3%;
  max-width: 900px;
  margin: 0 auto;
  background-color: rgba(248, 219, 249, 0.9);
}

#upload-menu,
#delete-menu {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
}
input[type="file"] {
  visibility: hidden;
}
#art-upload-demi-button {
  /* width: 20rem; */
  margin: 0 auto;
  border: none;
  border-radius: 10%;
  font-size: 1em;
  padding: 20px;
  max-height: 100%;
  background-color: rgba(61, 4, 87, 0.85);
  color: rgb(228, 195, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  font-weight: 700;
}
#art-upload-demi-button:hover {
  color: rgb(255, 157, 178);
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
