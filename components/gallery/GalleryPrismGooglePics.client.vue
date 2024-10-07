<template>
  <div class="google-container">
    <div v-if="loading" class="central">
      <BoxAlmond>
        <AnimatedWord />
      </BoxAlmond>
    </div>
    <GalleryPrism
      v-else-if="imageURLs.length > 0"
      :colors="backgroundColors"
      :zoomable="true"
      :max-height="900"
      :max-width="900"
    >
      <template
        v-for="(image, imageNumber) of imageURLs"
        #[String(imageNumber)]
      >
        <div class="image-container">
          <img :src="image" />
        </div>
      </template>
    </GalleryPrism>
    <div v-else-if="authorizing" class="central">
      <BoxAlmond>
        <AnimatedWord word="Authorizing" :cycle-length="1" />
      </BoxAlmond>
    </div>
    <div v-else-if="authenticated" class="central">
      <h3>
        <a :href="`mailto:${adminEmail}`">Ask Lavra</a> for access to this
        gallery.
      </h3>
    </div>
    <BoxTube v-else class="instructions">
      <AuthLink />
      <p>to see my personal artwork.</p>
    </BoxTube>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { adminEmail } from "@/utils/siteInfo";

const props = defineProps({
  bucket: {
    type: String,
    required: true,
  },
});

const auth0 = useAuth0();
const loading = auth0.isLoading;
const authenticated = auth0.isAuthenticated;
const authorizing = ref(false);

const imageURLs: Ref<string[]> = ref([]);
const signedURLs: Ref<string[] | null> = ref(null);

const fetchSignedURLs = function () {
  useUpdateSelection(
    signedURLs,
    `/api/pics/${props.bucket}`,
    auth0,
    authorizing,
    () => {
      if (Array.isArray(signedURLs.value)) {
        imageURLs.value = signedURLs.value;
      }
    }
  );
};
updateAtAuth(fetchSignedURLs, auth0);
const backgroundColors = ["rgba(21, 14, 69, .75)", "rgba(62, 22, 92,.75)"];
</script>

<style scoped>
.google-container {
  margin-top: -100px;
}
.image-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  justify-items: center;
  align-items: center;
  height: 100%;
}
img {
  margin: 0;
  max-height: 95%;
  max-width: 95%;
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
.instructions {
  text-align: center;
}
</style>
