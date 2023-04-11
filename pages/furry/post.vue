<template>
  <div id="new-art-page">
    <BackgroundTexture texture="fae">
      <div v-if="lavra" class="container">
        <div class="art-header">
          <h3>
            <input
              class="art-title"
              type="text"
              placeholder="Title of Artwork"
              v-model="art.title.value"
            />
          </h3>
          <ButtonStandard @click="save">Save and get upload URL</ButtonStandard>
        </div>
        <h3 id="description-label">Description:</h3>
        <textarea v-model="artInfo" class="art-info"></textarea>
        <table class="art-meta-section">
          <tr class="art-meta-item">
            <td><label for="art-tags">Tags for this artwork</label></td>
            <td>
              <input
                class="art-tags"
                type="text"
                placeholder="Comma-separated tags"
                v-model="tagText"
              />
            </td>
          </tr>
          <tr class="art-meta-item">
            <td><label for="mark-published">Publish this work</label></td>
            <td>
              <input
                class="mark-published"
                type="checkbox"
                v-model="art.published.value"
                checked
              />
            </td>
          </tr>
          <tr class="art-meta-item">
            <td>Bucket</td>
            <td>
              <span
                v-for="action of bucketActions"
                @click="
                  ($event) => {
                    activeAction = action;
                  }
                "
                class="bucket-action"
              >
                <input
                  type="radio"
                  :id="`${action}-radio`"
                  :value="action"
                  v-model="activeAction"
                />
                <label :for="`${action}-radio`">
                  {{
                    action.charAt(0).toUpperCase() +
                    action.slice(1).replaceAll(/-/g, " ")
                  }}
                </label>
              </span>
            </td>
          </tr>
        </table>
        <ButtonStandard @click="save">Save and get upload URL</ButtonStandard>
        <TheaterModal
          v-show="uploading"
          :isOpen="uploading"
          @close="cancelUpload"
        >
          <div class="container">
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
                {{ art.title.value }}</ButtonStandard
              >
            </form>
          </div>
        </TheaterModal>
      </div>
      <BackgroundImage
        attachment="fixed"
        image-file-name="assets/photos/city_portal.jpg"
        v-else
      >
        <NavHeader>This page is for Lavra</NavHeader>
      </BackgroundImage>
      <NavError v-show="lavra" :error="fetchError"></NavError>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { FetchError } from "ofetch";

import { useMagicKeys, whenever } from "@vueuse/core";

import { BucketUploadAction } from "@/types/googleStorage";

useHead({
  title: "Post Art @ LavraT",
});

const auth0 = useAuth0();
const lavra = useLavra(auth0);

const bucketActions: Array<BucketUploadAction> = [
  "homepage-upload",
  "adult-upload",
];
const activeAction: Ref<BucketUploadAction> = ref("homepage-upload");
const uploading = ref(false);
const uploadURL: Ref<string | null> = ref(null);
const activeFile: Ref<File | null> = ref(null);
const fetchError: Ref<FetchError<any> | null> = ref(null);

const artInfo = ref("");
const tagText: Ref<string> = ref("");
const computedTags = computed(() => {
  return tagText.value
    .split(",")
    .map((tag) => tag.trim().replaceAll(/\s/g, "_").toLowerCase());
});

const art = {
  title: ref(""),
  tags: computedTags,
  info: artInfo,
  published: ref(true),
};

const save = async function () {
  auth0.getAccessTokenSilently().then(async (token) => {
    const { data: artUploadURL, error: saveError } = await useFetch(
      `/api/pics/${activeAction.value}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          art: {
            title: art.title.value,
            tags: art.tags.value,
            info: art.info.value,
            published: art.published.value,
          },
        },
      }
    );
    if (Array.isArray(artUploadURL.value)) {
      uploadURL.value = artUploadURL.value[0];
    } else {
      uploadURL.value = artUploadURL.value;
    }
    fetchError.value = saveError.value;
    if (fetchError.value || !uploadURL.value) {
      cancelUpload();
    } else {
      uploading.value = true;
    }
  });
};

const keys = useMagicKeys();
whenever(keys.alt_s, save);

const cancelUpload = function () {
  uploading.value = false;
};
const stageFile = function ($event: any) {
  const hopefullyOneFile = $event?.target?.files;
  if (hopefullyOneFile.length === 1) {
    activeFile.value = $event.target.files[0];
  }
};

const imageFileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

function validImageFile(file: File): boolean {
  return imageFileTypes.includes(file.type);
}
const upload = async function () {
  if (activeFile.value && uploadURL.value) {
    const validated = validImageFile(activeFile.value);
    if (validated) {
      const { error: uploadError } = await useFetch(uploadURL.value, {
        method: "PUT",
        body: activeFile.value,
      });
      if (!uploadError.value) {
        navigateTo(`${art.title.value.replaceAll(/\s/g, "_")}`);
      } else {
        console.error("Error uploading picture to GCS:", uploadError.value);
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 200px;
  margin-bottom: 50vh;
  margin-left: 10vw;
  margin-right: 10vw;
}
.art-header {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: space-evenly;
}
.art-title {
  font-size: 3rem;
  margin-bottom: 50px;
  flex: 1 0 300px;
}
.art-info {
  width: 100%;
}

h2 {
  font-family: "Odibee Sans", sans-serif;
  font-size: 4em;
}
h3 {
  font-family: "Odibee Sans", sans-serif;
  font-size: 2em;
}
.art-header button {
  margin-left: 30px;
  translate: 0 -0.75em;
}
#description-label {
  text-align: left;
  margin: 0;
}
.art-info {
  position: relative;
  background-color: rgb(255, 208, 255);
  border-radius: 1.5rem 1.5rem 0 1.5rem;
  margin: 1.5rem 2rem;
  padding: 2rem 3rem;
}
@media screen and (max-width: 600px) {
  .art-info {
    margin: 1.5rem 0;
    padding: 2rem 1.3rem;
  }
}
.art-meta-section {
  margin: 2rem 0.5rem 2rem 0.5rem;
  width: calc(100% - 1rem);
  overflow-x: auto;
}
.art-meta-item {
  height: 3em;
  margin: 0.5em auto;
  width: 100%;
}
.art-meta-item td:first-child {
  padding-right: 2em;
  width: 8em;
}
.art-meta-item td:has(input) {
  font-size: 1.5em;
  transform-origin: left;
}
.art-meta-item input[type="text"] {
  width: 100%;
  min-width: 300px;
}
.art-meta-item input[type="checkbox"] {
  transform: scale(3);
}
.art-meta-item input[type="radio"] {
  transform: scale(2);
}
.bucket-action {
  margin-right: 1.5rem;
}
.bucket-action input {
  margin-right: 0.75rem;
}
.bucket-action,
.bucket-action * {
  cursor: pointer;
}
#upload-menu {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
}
input[type="file"] {
  visibility: hidden;
}
#art-upload-demi-button {
  /* width: 20rem; */
  margin: 2rem auto;
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
</style>
