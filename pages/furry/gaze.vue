<template>
  <div id="furry-gaze-page">
    <BackgroundTexture texture="fae">
      <NavHeader :unintrusive="true">Furry Gaze</NavHeader>
      <NavSearch
        @search="($event) => inputQuery($event)"
        @bottom="nextPage"
        @escape="topIfUnfocused"
        :frozen="focusing"
        :query="searchString"
        :wide="wideMode"
      ></NavSearch>
      <NavTags
        :yesList="yesList"
        :noList="noList"
        :maybeList="maybeList"
        @add="addTag"
        @remove="removeTag"
        @loosen="loosenTag"
        @block="blockTag"
      />
      <section id="search-splash"></section>
      <div class="gallery-container">
        <!-- <GalleryPrismGooglePics bucket="homepage-gallery" /> -->
      </div>
      <section id="search-results" ref="viewer">
        <div id="art-viewer" :class="`${wideMode ? 'wide' : ''}`">
          <TransitionGroup name="fizzle">
            <div
              class="art-frame"
              v-for="(artwork, artIndex) in sortedArtworks"
              :key="artwork.id"
              @mouseover="($event) => playVideoOrEnhance(artwork.id)"
              @mouseleave="($event) => pauseVideo(`video-${artwork.id}`)"
            >
              <BoxGlass mode="hot">
                <NuxtLink
                  :to="`/furry/gaze?upon=${artwork.id}&${queryParams.join(
                    '&'
                  )}`"
                >
                  <div class="art-thumbnail">
                    <img
                      v-if="
                        artwork.preview &&
                        imageFileTypes.includes(`image/${artwork.ext}`)
                      "
                      :id="`art-${artwork.id}`"
                      :src="artwork.preview"
                    />
                    <video
                      v-else-if="artwork.url"
                      :id="`video-${artwork.id}`"
                      muted="true"
                    >
                      <source
                        :src="artwork.url"
                        :type="`video/${artwork.ext}`"
                      />
                    </video>
                    <h3 class="art-title">
                      {{
                        !Array.isArray(artwork.artists) ||
                        artwork.artists.length === 0
                          ? artwork.title
                          : artwork.artists.length > 3
                          ? (imageFileTypes.includes(`image/${artwork.ext}`)
                              ? ""
                              : "Video by \n") +
                            artwork.artists.slice(0, 3).sort().join(",\n ")
                          : (imageFileTypes.includes(`image/${artwork.ext}`)
                              ? ""
                              : "Video by \n") +
                            artwork.artists.sort().join(",\n ")
                      }}
                    </h3>
                  </div>
                </NuxtLink>
              </BoxGlass>
            </div>
          </TransitionGroup>
        </div>
      </section>
      <div id="thumb-scaler">
        <label for="thumb-range">{{ thumbScale }}x zoom</label>
        <input
          id="thumb-range"
          type="range"
          min=".2"
          max="3"
          step=".1"
          v-model="thumbScale"
          :title="`Multiplying the size of thumbnails by ${thumbScale}`"
        />
      </div>
    </BackgroundTexture>
    <TheaterModal
      v-show="focusing"
      :isOpen="focusing"
      @close="unfocusNavigate"
      @forward="nextArt"
      @backward="priorArt"
    >
      <GalleryAnnotatedPic
        v-if="focusedArt"
        :nextable="
          focusedArtIndex ? focusedArtIndex + 1 < artworks.length : false
        "
        :backable="focusedArtIndex ? focusedArtIndex > 0 : false"
        @next="nextArt"
        @prior="priorArt"
      >
        <template #image>
          <div ref="focusedContent">
            <button id="widener" @click="toggleWidePicture">
              {{ widePicture ? "Fit" : "Transcend" }}
              [W]
            </button>
            <div
              :class="`image-container ${widePicture ? 'wide' : ''}`"
              :style="{
                '--ratio': `${(winX * focusedArt.height) / focusedArt.width}px`,
              }"
            >
              <img
                v-if="imageFileTypes.includes(`image/${focusedArt.ext}`)"
                class="artwork"
                :src="focusedArt.url"
              />
              <video
                v-else
                :id="`focused-video-${focusedArt.id}`"
                :src="focusedArt.url"
                controls
                autoplay
              >
                <source
                  :src="focusedArt.url"
                  :type="`video/${focusedArt.ext}`"
                />
              </video>
            </div>
          </div>
        </template>
        <template
          #info
          v-if="
            (focusedArt.info && focusedArt.info.length > 0) ||
            focusedArt.tags.length > 0
          "
        >
          <div class="info">
            <div class="art-title">
              <h3>
                {{
                  !Array.isArray(focusedArt.artists) ||
                  focusedArt.artists.length === 0
                    ? focusedArt.title
                    : focusedArt.artists.length > 3
                    ? focusedArt.artists.slice(0, 3).join(", ")
                    : focusedArt.artists.join(", ")
                }}
              </h3>
            </div>
            <p v-if="focusedArt.info" id="focused-art-info">
              {{ focusedArt.info }}
            </p>
            <div id="closeup-buttons">
              <div class="post-links">
                <NuxtLink
                  v-if="sourceGallery === 'lavra'"
                  :to="`/furry/${
                    focusedArt.bucket === 'adult-gallery' ? 'dic' : 'pic'
                  }/${focusedArt.title}`"
                  @click="unfocusNavigate"
                  ><ButtonStandard>See main page</ButtonStandard></NuxtLink
                >
                <a
                  v-else-if="sourceGallery === 'e621'"
                  :href="focusedArt.mainLink"
                  target="_blank"
                  ><ButtonStandard>See main page</ButtonStandard></a
                >
                <a v-for="pool of focusedArt.pools" target="_blank"
                  ><ButtonStandard @click="loadPool(pool)"
                    >Load pool #{{ pool }}</ButtonStandard
                  ></a
                >
              </div>
              <div class="tag-links">
                <div class="tag-box" v-for="tag of focusedArt.tags">
                  <div class="tag-buttons">
                    <button
                      v-if="!maybeList.has(tag)"
                      class="tag-loosener"
                      :title="`Include ${tag} artwork optionally`"
                      @click="loosenTag(tag)"
                    >
                      ~
                    </button>
                    <button
                      v-if="!noList.has(tag)"
                      class="tag-blocker"
                      title="Block from search filter"
                      @click="blockTag(tag)"
                    >
                      🚫
                    </button>
                    <button
                      v-if="!yesList.has(tag)"
                      class="tag-adder"
                      :title="`Require artwork to be tagged ${tag}`"
                      @click="addTag(tag)"
                    >
                      +
                    </button>
                    <button
                      v-if="
                        yesList.has(tag) ||
                        noList.has(tag) ||
                        maybeList.has(tag)
                      "
                      class="tag-subtractor"
                      :title="`Remove ${tag} from search filter`"
                      @click="removeTag(tag)"
                    >
                      –
                    </button>
                  </div>
                  <NuxtLink
                    v-if="sourceGallery === 'lavra'"
                    :to="`/furry/gaze?tags=${tag}`"
                    class="tag-box"
                  >
                    <ButtonStandard>
                      {{ tag }}
                    </ButtonStandard>
                  </NuxtLink>
                  <a
                    v-else-if="sourceGallery === 'e621'"
                    :href="`https://e621.net/wiki_pages/show_or_new?title=${tag}`"
                    class="tag-box"
                    target="_blank"
                  >
                    <ButtonStandard>
                      {{ tag }}
                    </ButtonStandard>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </GalleryAnnotatedPic>
    </TheaterModal>
    <div id="search-settings">
      <fieldset id="score-threshold" v-if="sourceGallery === 'e621'">
        <legend>Min Score</legend>
        <div class="search-section">
          <div>
            <input
              type="number"
              id="score-min"
              v-model="minScore"
              step="1"
              max="17545"
              min="-5539"
            />
          </div>
        </div>
      </fieldset>
      <fieldset id="search-sorter">
        <legend>Order</legend>
        <div class="search-section">
          <div>
            <input type="radio" id="id-desc" value="" v-model="sortOrder" />
            <label for="id-desc">New → Old</label>
          </div>
          <div>
            <input
              type="radio"
              id="id-asc"
              value="order:id"
              v-model="sortOrder"
            />
            <label for="id-asc">Old → New</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="score-desc"
              value="order:score"
              v-model="sortOrder"
            />
            <label for="score-desc">↓ Score</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="score-asc"
              value="order:score_asc"
              v-model="sortOrder"
            />
            <label for="score-asc">↑ Score</label>
          </div>

          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="fav-desc"
              value="order:favcount"
              v-model="sortOrder"
            />
            <label for="fav-desc">↓ Faves</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="fav-asc"
              value="order:favcount_asc"
              v-model="sortOrder"
            />
            <label for="fav-asc">↑ Faves</label>
          </div>

          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="res-desc"
              value="order:mpixels"
              v-model="sortOrder"
            />
            <label for="res-desc">↓ Resolution</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="res-asc"
              value="order:mpixels_asc"
              v-model="sortOrder"
            />
            <label for="res-asc">↑ Resolution</label>
          </div>

          <div>
            <input
              type="radio"
              id="tag-desc"
              value="order:tagcount"
              v-model="sortOrder"
            />
            <label for="tag-desc">↓ Tag Count</label>
          </div>
          <div>
            <input
              type="radio"
              id="tag-asc"
              value="order:tagcount_asc"
              v-model="sortOrder"
            />
            <label for="tag-asc">↑ Tag Count</label>
          </div>

          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="duration-desc"
              value="order:duration"
              v-model="sortOrder"
            />
            <label for="duration-desc">↓ Duration<br />(Video only)</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="duration-asc"
              value="order:duration_asc"
              v-model="sortOrder"
            />
            <label for="duration-asc">↑ Duration<br />(Video only)</label>
          </div>

          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="landscape-sort"
              value="order:landscape"
              v-model="sortOrder"
            />
            <label for="landscape-sort">Wide → Tall</label>
          </div>
          <div v-if="sourceGallery === 'e621'">
            <input
              type="radio"
              id="portrait-sort"
              value="order:portrait"
              v-model="sortOrder"
            />
            <label for="portrait-sort">Tall → Wide</label>
          </div>
        </div>
      </fieldset>

      <fieldset id="allowed-ratings">
        <legend>Ratings allowed:</legend>

        <div class="search-section">
          <div>
            <input
              type="checkbox"
              id="safe-allowed"
              name="safe"
              v-model="safeAllowed"
              checked
            />
            <label for="safe-allowed">Safe</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="questionable-allowed"
              name="questionable"
              v-model="questionableAllowed"
              checked
            />
            <label for="questionable-allowed">Questionable</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="explicit-allowed"
              name="explicit"
              v-model="explicitAllowed"
              checked
            />
            <label for="explicit-allowed">Explicit</label>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { FetchError } from "ofetch";
import { useActiveElement, useMagicKeys, whenever } from "@vueuse/core";
import { logicAnd } from "@vueuse/math";

import { Bucket, imageFileTypes } from "@/types/googleStorage";
import {
  ArtWithTags,
  ArtWithTagStrings,
  validateArtWithTags,
} from "@/types/models";
import { useUpdateSelection } from "@/composables/selections";
import { useWindowResize } from "@/composables/windowResize";
import { sort } from "d3-array";

const searchString: Ref<string> = ref("");

const pageTitle = computed(() => {
  if (searchString.value.length > 0) {
    return `${searchString.value.replaceAll("_", " ")} – ${
      sourceGallery.value === "e621"
        ? "Reconcile's e621 Viewer"
        : "Reconcile's Gallery"
    }`;
  } else return "Reconcile's furry gallery";
});
useHead({
  titleTemplate: pageTitle,
});

const auth0 = useAuth0();
const loadingAuth = computed(() => {
  return auth0 && auth0.isLoading && auth0.isLoading.value;
});

const route = useRoute();

const sourceGallery = ref("e621");

const yesList: Ref<Set<string>> = ref(new Set());
const noList: Ref<Set<string>> = ref(new Set());
const maybeList: Ref<Set<string>> = ref(new Set());

const safeAllowed = ref(true);
const questionableAllowed = ref(true);
const explicitAllowed = ref(true);

const sortOrder: Ref<SortOrder> = ref("");
const minScore: Ref<number> = ref(0);
const pageSize: Ref<number> = ref(30);

const e621ModeActivate = function () {
  sourceGallery.value = "e621";
  searchString.value = "";
  sortOrder.value = "order:score";
  calculateSearchString();
};
const lavraModeActivate = function () {
  sourceGallery.value = "lavra";
  searchString.value = "";
  sortOrder.value = "";
  calculateSearchString();
};
const sampleDbArtworks: Ref<ArtWithTagStrings[]> = ref([
  {
    id: 2,
    bucket: "homepage-gallery",
    title: "Adventure Mouse",
    fileName: "Adventure Mouse",
    info: `I used to do a lot of commuting down the NJ Turnpike and kept having to see billboards with this kind of poisonous message. Every once in a while, a new pro-life billboard will take the place of the old one, so it's clearly a sustained initiative to harass people with vaginas. Since I don't have the wealth to buy them out, I've had certain fantasies about... doing my part to stand against this stone-age, misogynist BS.
      The prompt for this sketch was part of a week-ish-long, low pressure, sketch challenge that I'm doing with a few friends starting today! Today's topic: "Adventure mouse!!"
      (Disclaimer: This piece is not a recommendation for anybody to perform the depicted act and is purely fictional!)`,
    createdAt: new Date("2023-03-27 21:11:05.158"),
    updatedAt: new Date("2023-03-31 22:25:46.507"),
    published: true,
    tags: ["mouse", "vandalism"],
    url: "https://storage.googleapis.com/homepage-gallery/Adventure%20Mouse?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=lavrat-default-viewership%40saucy-toxtricity-84969.iam.gserviceaccount.com%2F20230405%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230405T154058Z&X-Goog-Expires=606&X-Goog-SignedHeaders=host&X-Goog-Signature=22d0ae0a6f2666770295d4659b3dae1d36129792015dbfb7e87728103ca3bcfb66ecdd37f3e55e8028211993666596eb578d662bb4c38562a63bb241c1b10c77d71e605729318fb8e84c3faa0f83aab10434dab56f7062d4e565e9a06765d1fa6f647c65d68070adce8acae88cab1c45b681233a2eb569dc6e6d4e92c87668c36fe25dbb00db0bbccd17108e03ffb82841d932c82a8370e8ce4d13801dde64b12864b3d177f3359939dd460660b55243ecae861857944ea6bfc6906e5247a2a2d8053c55e700c0322897e104ee9029b4a9959d47ba7329aab888a496dd5e7ca352929a3f6f9e3e9775941867f6c5484d1dfe8fcf30232b63587b143221b4d454",
  },
  {
    id: 2,
    bucket: "homepage-gallery",
    title: "Nugs and Snugs",
    fileName: "Nugs and Snugs",
    info: "Made for my partner and myself. Just a calm piece about hanging out at home",
    createdAt: new Date("2023-03-27 21:11:05.158"),
    updatedAt: new Date("2023-03-31 22:25:46.507"),
    published: true,
    tags: ["weed", "dragon", "goat"],
    url: "https://cdn.weasyl.com/~reconcile/submissions/1929435/16f1cbf8b1606102afe35401d14cb848b2ac1c6605dff4df15f2b76163afcd87/reconcile-nugs-and-snugs.jpg",
  },
]);
const artworks: Ref<Array<ArtWithTagStrings & { [key: string]: any }>> = ref(
  []
);
const sortedArtworks = computed(() => {
  if (sortOrder.value === "order:id") {
    return artworks.value.sort((a, b) => {
      return b.id - a.id;
    });
  } else if (sortOrder.value === "order:score") {
    return artworks.value.sort((a, b) => {
      return b.score - a.score;
    });
  } else if (sortOrder.value === "order:score_asc") {
    return artworks.value.sort((a, b) => {
      return a.score - b.score;
    });
  } else if (sortOrder.value === "order:favcount") {
    return artworks.value.sort((a, b) => {
      return a.faves - b.faves;
    });
  } else if (sortOrder.value === "order:favcount_asc") {
    return artworks.value.sort((a, b) => {
      return b.faves - a.faves;
    });
  } else if (sortOrder.value === "order:resolution") {
    return artworks.value.sort((a, b) => {
      return a.resolution - b.resolution;
    });
  } else if (sortOrder.value === "order:resolution_asc") {
    return artworks.value.sort((a, b) => {
      return b.resolution - a.resolution;
    });
  } else if (sortOrder.value === "order:tagcount") {
    return artworks.value.sort((a, b) => {
      return a.tags.length - b.tags.length;
    });
  } else if (sortOrder.value === "order:tagcount_asc") {
    return artworks.value.sort((a, b) => {
      return b.tags.length - a.tags.length;
    });
  } else if (sortOrder.value === "order:duration") {
    return artworks.value.sort((a, b) => {
      return a.duration - b.duration;
    });
  } else if (sortOrder.value === "order:duration_asc") {
    return artworks.value.sort((a, b) => {
      return b.duration - a.duration;
    });
  } else if (sortOrder.value === "order:landscape") {
    return artworks.value.sort((a, b) => {
      return a.height / a.width - b.height / b.width;
    });
  } else if (sortOrder.value === "order:portrait") {
    return artworks.value.sort((a, b) => {
      return a.width / a.height - b.width / b.height;
    });
  } else {
    return artworks.value.sort((a, b) => {
      return a.id - b.id;
    });
  }
});
// For use with my own bounds API, which may or may not be useful.
// const firstArtId: Ref<number | null> = ref(null);
// const lastArtId: Ref<number | null> = ref(null);
const lastArtInResults: ComputedRef<ArtWithTagStrings | null> = computed(() => {
  if (sortedArtworks.value.length > 0) {
    return sortedArtworks.value[sortedArtworks.value.length - 1];
  } else {
    return null;
  }
});
const firstArtInResults: ComputedRef<ArtWithTagStrings | null> = computed(
  () => {
    if (sortedArtworks.value.length > 0) {
      return sortedArtworks.value[0];
    } else {
      return null;
    }
  }
);

const cursor: ComputedRef<number | null> = computed(() => {
  if (lastArtInResults.value) {
    return lastArtInResults.value.id;
  } else return null;
});
// Relevant for order:id searches
const backCursor: ComputedRef<number | null> = computed(() => {
  if (firstArtInResults.value) {
    return firstArtInResults.value.id;
  } else {
    return null;
  }
});
const tempCursor: Ref<number | null> = ref(null);

const pageNumber = ref(1);
const searching = ref(false);
const nextable = ref(true);
const backable = ref(false);
const fetchError: Ref<FetchError<any> | null> = ref(null);

// Param refs. Params are used at route change.
const upon = ref("");
const past = ref("");
const take = ref("");
const yes = ref("");
const no = ref("");
const maybe = ref("");
const ratings = ref("");
const order = ref("");

const captureParams = function () {
  upon.value = route.query.upon
    ? `upon=${String(route.query.upon).replaceAll(" ", "+")}`
    : "";
  take.value = route.query.take
    ? `take=${String(route.query.take).replaceAll(" ", "+")}`
    : "";
  yes.value = route.query.yes
    ? `yes=${String(route.query.yes).replaceAll(" ", "+")}`
    : "";
  no.value = route.query.no
    ? `no=${String(route.query.no).replaceAll(" ", "+")}`
    : "";
  maybe.value = route.query.maybe
    ? `maybe=${String(route.query.maybe).replaceAll(" ", "+")}`
    : "";
  ratings.value = route.query.ratings
    ? `ratings=${String(route.query.ratings).replaceAll(" ", "+")}`
    : "";
  order.value = route.query.order ? `order=${route.query.order}` : "";
};
captureParams();

const setParams = function () {
  upon.value = focusedArt.value ? `upon=${focusedArt.value.id}` : "";
  take.value = pageSize.value !== 30 ? `take=${pageSize.value}` : "";
  yes.value =
    yesList.value.size > 0 ? `yes=${[...yesList.value].join("+")}` : "";
  no.value = noList.value.size > 0 ? `no=${[...noList.value].join("+")}` : "";
  maybe.value =
    maybeList.value.size > 0 ? `maybe=${[...maybeList.value].join("+")}` : "";
  const ratingsToStore = [];
  if (safeAllowed.value) {
    ratingsToStore.push("s");
  }
  if (questionableAllowed.value) {
    ratingsToStore.push("q");
  }
  if (explicitAllowed.value) {
    ratingsToStore.push("e");
  }
  if (ratingsToStore.length > 0) {
    ratings.value = `ratings=${ratingsToStore.join("+")}`;
  } else {
    ratings.value = "";
  }
  if (sortOrder.value) {
    order.value = `order=${sortOrder.value.replace("order:", "")}`;
  } else {
    order.value = "";
  }
};
const applyParams = function () {
  yesList.value =
    yes.value.length > 0
      ? new Set([...yes.value.replace("yes=", "").split("+")])
      : new Set([]);
  noList.value =
    no.value.length > 0
      ? new Set([...no.value.replace("no=", "").split("+")])
      : new Set([]);
  maybeList.value =
    maybe.value.length > 0
      ? new Set([...maybe.value.replace("maybe=", "").split("+")])
      : new Set([]);
  if (ratings.value) {
    safeAllowed.value = ratings.value.replace("ratings=", "").includes("s");
    questionableAllowed.value = ratings.value.includes("q");
    explicitAllowed.value = ratings.value.includes("e");
  }
  if (take.value) {
    const extractedDigits = take.value.replace("take=", "");
    pageSize.value = /\d/.test(extractedDigits) ? Number(extractedDigits) : 30;
  }
  const maybeSortOrder = `${order.value.replace("=", ":")}`;
  if (validateSortOrder(maybeSortOrder)) {
    sortOrder.value = maybeSortOrder;
  }
  calculateSearchString();
};
const queryParams: ComputedRef<string[]> = computed(() => {
  let params = [];
  if (upon.value) {
    params.push(upon.value);
  }
  if (past.value) {
    params.push(past.value);
  }
  if (take.value) {
    params.push(take.value);
  }
  if (yes.value) {
    params.push(yes.value);
  }
  if (no.value) {
    params.push(no.value);
  }
  if (maybe.value) {
    params.push(maybe.value);
  }
  if (ratings.value) {
    params.push(ratings.value);
  }
  if (order.value) {
    params.push(order.value);
  }
  return params;
});

const focusing = ref(false);
const activeElement = useActiveElement();
const unfocused = computed(
  () =>
    !focusing.value &&
    activeElement.value?.tagName !== "INPUT" &&
    activeElement.value?.tagName !== "TEXTAREA"
);
const topIfUnfocused = function () {
  if (unfocused.value) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
};

const wideMode = ref(false);
const widePicture = ref(false);
const toggleWideMode = () => {
  wideMode.value = !wideMode.value;
};
const toggleWidePicture = () => {
  widePicture.value = !widePicture.value;
};
const { winX } = useWindowResize();

const viewer = ref();
const focusedArtIndex: Ref<number | null> = ref(null);
const focusedArt: Ref<(ArtWithTagStrings & { [key: string]: any }) | null> =
  ref(null);
// element ref
const imageContainer = ref();
const focusedContent = ref();

const thumbScale = ref(1);
// element ref
const thumbScaler = ref();

watch(thumbScale, (newValue) => {
  cssVar(viewer, "--scaler", String(newValue));
});

const reflectTagChange = async function () {
  calculateSearchString();
  pageNumber.value = 1;
  unfocusArt();
  setParams();
  search();
  navigateTo(`/furry/gaze?${queryParams.value.join("&")}`);
};

const addTag = function (tagName: string) {
  noList.value.delete(tagName);
  maybeList.value.delete(tagName);
  yesList.value = new Set([...yesList.value, tagName].sort());
  reflectTagChange();
};
const removeTag = function (tagName: string) {
  noList.value.delete(tagName);
  maybeList.value.delete(tagName);
  yesList.value.delete(tagName);
  reflectTagChange();
};
const loosenTag = function (tagName: string) {
  if (tagName.includes(":")) {
    return;
  }
  noList.value.delete(tagName);
  yesList.value.delete(tagName);
  maybeList.value = new Set([...maybeList.value, tagName].sort());
  reflectTagChange();
};
const blockTag = function (tagName: string) {
  noList.value = new Set([...noList.value, tagName].sort());
  maybeList.value.delete(tagName);
  yesList.value.delete(tagName);
  reflectTagChange();
};

type e6Post = {
  id: number;
  created_at: Date;
  updated_at: Date;
  file: {
    width: number;
    height: number;
    url: string;
    ext: "string";
    size: number;
    md5: string;
  };
  tags: {
    general: string[];
    species: string[];
    character: string[];
    artist: string[];
    lore: string[];
  };
  description: string;
  preview: {
    url?: string;
  };
  pools: number[];
  rating: string;
  fav_count: number;
  score: {
    total: number;
  };
  relationships: {
    parent_id: number | null;
    children: number[];
  };
};
const validateE6Res = (
  response: any
): response is { posts: e6Post[]; [key: string]: any } => {
  if (Array.isArray(response?.posts)) {
    if (
      response.posts.every((post: any) => {
        return (
          post.id &&
          post.created_at &&
          post.updated_at &&
          post.file &&
          Object.keys(post.file).includes("url")
        );
      })
    ) {
      return true;
    }
  }
  return false;
};
type SortOrder =
  | ""
  | "order:id"
  | "order:score"
  | "order:score_asc"
  | "order:favcount"
  | "order:favcount_asc"
  | "order:resolution"
  | "order:resolution_asc"
  | "order:tagcount"
  | "order:tagcount_asc"
  | "order:duration"
  | "order:duration_asc"
  | "order:landscape"
  | "order:portrait";
const validateSortOrder = function (maybeOrder: any): maybeOrder is SortOrder {
  return [
    "",
    "order:id",
    "order:score",
    "order:score_asc",
    "order:favcount",
    "order:favcount_asc",
    "order:resolution",
    "order:resolution_asc",
    "order:tagcount",
    "order:tagcount_asc",
    "order:duration",
    "order:duration_asc",
    "order:landscape",
    "order:portrait",
  ].includes(maybeOrder);
};
const oppositeOrder = function (backwards: SortOrder): SortOrder {
  if (!validateSortOrder) {
    return "";
  }
  let rightOrder: SortOrder = "";
  switch (backwards) {
    case "":
      rightOrder = "order:id";
      break;
    case "order:id":
      rightOrder = "";
      break;
    case "order:score":
      rightOrder = "order:score_asc";
      break;
    case "order:score_asc":
      rightOrder = "order:score";
      break;
    case "order:favcount":
      rightOrder = "order:favcount_asc";
      break;
    case "order:favcount_asc":
      rightOrder = "order:favcount";
      break;
    case "order:resolution":
      rightOrder = "order:resolution_asc";
      break;
    case "order:resolution_asc":
      rightOrder = "order:resolution";
      break;
    case "order:tagcount":
      rightOrder = "order:tagcount_asc";
      break;
    case "order:tagcount_asc":
      rightOrder = "order:tagcount";
      break;
    case "order:duration":
      rightOrder = "order:duration_asc";
      break;
    case "order:duration_asc":
      rightOrder = "order:duration";
      break;
    case "order:landscape":
      rightOrder = "order:portrait";
      break;
    case "order:portrait":
      rightOrder = "order:landscape";
      break;
  }
  return rightOrder;
};

const calculateSearchString = function () {
  searchString.value = "";
  yesList.value.forEach((tag) => {
    searchString.value += `${tag} `;
  });
  noList.value.forEach((tag) => {
    searchString.value += ` -${tag}`;
  });
  maybeList.value.forEach((tag) => {
    searchString.value += ` ~${tag}`;
  });
  searchString.value = searchString.value.trim();
};

const processRatingTags = function () {
  if (noList.value.has("rating:safe")) {
    safeAllowed.value = false;
    noList.value.delete("rating:safe");
  }
  if (yesList.value.has("rating:safe")) {
    safeAllowed.value = true;
    yesList.value.delete("rating:safe");
  }
  if (maybeList.value.has("rating:safe")) {
    safeAllowed.value = true;
    maybeList.value.delete("rating:safe");
  }
  if (noList.value.has("rating:questionable")) {
    questionableAllowed.value = false;
    noList.value.delete("rating:questionable");
  }
  if (yesList.value.has("rating:questionable")) {
    questionableAllowed.value = true;
    yesList.value.delete("rating:questionable");
  }
  if (maybeList.value.has("rating:questionable")) {
    questionableAllowed.value = true;
    maybeList.value.delete("rating:questionable");
  }
  if (noList.value.has("rating:explicit")) {
    explicitAllowed.value = false;
    noList.value.delete("rating:explicit");
  }
  if (yesList.value.has("rating:explicit")) {
    explicitAllowed.value = true;
    yesList.value.delete("rating:explicit");
  }
  if (maybeList.value.has("rating:explicit")) {
    explicitAllowed.value = true;
    maybeList.value.delete("rating:explicit");
  }
};

const inputQuery = async function ($event: string) {
  // this spot will be relevant if I want to detect changes
  searchString.value = $event;
  // ↓ Self-deleting queries won't be recognized by internal NavSearch ref without this.
  await nextTick();
  if (sourceGallery.value !== "lavra" && $event === "lavra") {
    lavraModeActivate();
    return;
  }
  if (sourceGallery.value !== "e621" && $event === "e621") {
    e621ModeActivate();
    return;
  }
  const errorList: string[] = [];
  const allList = $event.split(" ").map((w) => w.trim());

  yesList.value.clear();
  noList.value.clear();
  maybeList.value.clear();

  for (const term of allList) {
    if (term.slice(0, 7).includes("order:")) {
      let possibleOrder = term;
      if (possibleOrder.charAt(0) === "-") {
        possibleOrder = oppositeOrder(possibleOrder.slice(1) as SortOrder);
      }
      if (validateSortOrder(possibleOrder)) {
        sortOrder.value = possibleOrder;
      }
    } else if (!/[A-Za-z0-9_\-\:]/.test(term)) {
      errorList.push(term);
      continue;
    } else if (term.charAt(0) === "-") {
      noList.value.add(term.slice(1));
    } else if (term.charAt(0) === "~") {
      maybeList.value.add(term.slice(1));
    } else {
      yesList.value.add(term);
    }
  }
  if (errorList.length > 0) {
    fetchError.value = createError({
      statusMessage: `Couldn't add the following terms to the search: ${errorList
        .slice(0, -1)
        .join(", ")}`,
    });
  }
  processRatingTags();
  calculateSearchString();
  setParams();
  pageNumber.value = 1;
  search();
  navigateTo(`/furry/gaze?${queryParams.value.join("&")}`);
};
const search = async function (singlet?: boolean) {
  console.log("search ran");
  if (searching.value === true || nextable.value === false) {
    return;
  }
  searching.value = true;
  let ratedSearch = searchString.value.replaceAll(" ", "+");
  if (sourceGallery.value === "e621") {
    if (explicitAllowed.value !== true && questionableAllowed.value !== true) {
      ratedSearch += "+rating:safe";
    }
    if (safeAllowed.value !== true && explicitAllowed.value !== true) {
      ratedSearch += "+rating:questionable";
    }
    if (safeAllowed.value !== true && questionableAllowed.value !== true) {
      ratedSearch += "+rating:explicit";
    }
  }

  if (sortOrder.value.length > 0) {
    ratedSearch += `+${sortOrder.value}`;
  }

  let pagePart = "";

  if (sourceGallery.value === "lavra") {
    searching.value = false;
  } else if (sourceGallery.value === "e621") {
    if (pageNumber.value > 1) {
      if (["", "order:id"].includes(sortOrder.value)) {
        const relevantCursor = tempCursor.value
          ? tempCursor.value
          : sortOrder.value === "order:id"
          ? backCursor.value
          : cursor.value;
        if (relevantCursor) {
          pagePart = `&page=b${relevantCursor}`;
        }
      } else {
        pagePart = `&page=${pageNumber.value}`;
      }
    }
  }

  ratedSearch = ratedSearch.replaceAll(":", "%3A");
  if (sourceGallery.value === "lavra") {
  } else if (sourceGallery.value === "e621") {
    const { data: e621Response, error: e621Error } = await useFetch(
      `https://e621.net/posts.json?limit=30&tags=${ratedSearch}${pagePart}`,
      {
        headers: {
          "User-Agent": "lavrat.space/2.2 (by reconcile on e621)",
        },
      }
    );
    tempCursor.value = null;
    if (e621Error.value) {
      fetchError.value = e621Error.value;
    } else if (e621Response.value) {
      const res = e621Response.value;
      if (validateE6Res(res)) {
        if (res.posts.length === 0) {
          nextable.value = false;
          return;
        }
        const artToAdd = res.posts
          .map((post) => {
            return {
              id: post.id,
              createdAt: post.created_at,
              updatedAt: post.updated_at,
              bucket: "e621",
              fileName: post.file.url,
              title: String(post.id),
              artists: post.tags.artist
                .map((artist) => (artist === "sound_warning" ? "🔊⚡" : artist))
                .filter((artist) => artist !== "conditional_dnp"),
              published: true,
              tags:
                [
                  ...post.tags.species,
                  ...post.tags.character,
                  ...post.tags.general,
                  ...post.tags.lore,
                ] || [],
              url: post.file.url,
              info: post.description,
              ext: post.file.ext,
              preview: post.preview.url,
              mainLink: `https://e621.net/posts/${post.id}`,
              pools: post.pools,
              width: post.file.width,
              height: post.file.height,
              rating: post.rating,
              faves: post.fav_count,
              score: post.score.total,
            };
          })
          .filter((ratedArt) => {
            return (
              (safeAllowed.value || ratedArt.rating !== "s") &&
              (questionableAllowed.value || ratedArt.rating !== "q") &&
              (explicitAllowed.value || ratedArt.rating !== "e")
            );
          });
        if (singlet) {
          focusedArt.value = artToAdd[0];
          focusing.value = true;
          await nextTick();
          focusedContent.value.setAttribute("tabindex", 0);
          focusedContent.value.focus();
        } else {
          if (artToAdd.length === 0) {
            tempCursor.value = res.posts[res.posts.length - 1].id;
          }
          if (pageNumber.value === 1) {
            artworks.value = artToAdd;
          } else {
            artworks.value = [...artworks.value, ...artToAdd];
          }
        }
      }
    }
  }
  searching.value = false;
  // useUpdateSelection(
  //   artworks,
  //   "/api/pics",
  //   auth0,
  //   searching,
  //   undefined,
  //   fetchError
  // );
  if (!focusing.value && pageNumber.value === 1) {
    viewer.value.scrollIntoView({
      behavior: "smooth",
      top: 500,
    });
  }
};
const loadPool = async function (poolID: number) {
  artworks.value = [];
  navigateTo(`/furry/gaze?yes=pool:${poolID}&order=id`);
};

const nextPage = () => {
  console.log("nextPage ran");
  if (searchString.value.length === 0) {
    return;
  }
  console.log();
  pageNumber.value = pageNumber.value + 1;
  search();
};

const { w } = useMagicKeys();

whenever(logicAnd(w, focusing), () => {
  toggleWidePicture();
});
whenever(logicAnd(w, unfocused), () => {
  toggleWideMode();
});

const markViewed = function () {
  const videoToPlay = document.getElementById(`video-${focusedArt.value?.id}`);
  if (videoToPlay) {
    videoToPlay.classList.add("viewed");
    return;
  } else {
    const artToEnhance = document.getElementById(`art-${focusedArt.value?.id}`);
    if (artToEnhance) {
      artToEnhance.classList.add("viewed");
    }
  }
};

const focusArt = async function (toFocus: number) {
  console.log("Called focusArt");
  focusedArtIndex.value = toFocus;
  focusedArt.value = artworks.value[focusedArtIndex.value];
  focusing.value = true;
  await nextTick();
  focusedContent.value.setAttribute("tabindex", 0);
  focusedContent.value.focus();
  markViewed();
  if (focusedArtIndex.value + 2 >= artworks.value.length) {
    nextPage();
  }
};

const nextArt = () => {
  if (focusedArtIndex.value !== null) {
    if (focusedArtIndex.value + 2 >= artworks.value.length) {
      nextPage();
    }
    if (artworks.value.length > focusedArtIndex.value + 1) {
      // focusedArt.value = artworks.value[focusedArtIndex.value];
      focusedArtIndex.value = focusedArtIndex.value + 1;
      upon.value = `upon=${artworks.value[focusedArtIndex.value].id}`;
      navigateTo(`/furry/gaze?${queryParams.value.join("&")}`);
    }
  }
};
const priorArt = () => {
  if (focusedArtIndex.value !== null && focusedArtIndex.value > 0) {
    focusedArtIndex.value = focusedArtIndex.value - 1;
    upon.value = `upon=${artworks.value[focusedArtIndex.value].id}`;
    navigateTo(`/furry/gaze?${queryParams.value.join("&")}`);
  }
  markViewed();
};

const unfocusArt = function () {
  focusedContent.value?.removeAttribute("tabindex");
  if (focusedArt.value) {
    pauseVideo(`focused-video-${focusedArt.value.id}`);
  }
  focusing.value = false;
  focusedArtIndex.value = null;
  focusedArt.value = null;
};
const unfocusNavigate = function () {
  console.log("unfocusNavigate called");
  unfocusArt();
  upon.value = "";
  navigateTo(`/furry/gaze?${queryParams.value.join("&")}`);
};
const playVideoOrEnhance = function (ambiguousIndex: number) {
  const videoToPlay = document.getElementById(
    `video-${ambiguousIndex}`
  ) as HTMLMediaElement;
  if (videoToPlay) {
    videoToPlay.play();
    return;
  } else {
    const artToEnhance = document.getElementById(`art-${ambiguousIndex}`);
    if (artToEnhance) {
      const enhanceable = artworks.value.find(
        (piece) => piece.id === ambiguousIndex
      );
      if (enhanceable?.url) {
        artToEnhance.setAttribute("src", enhanceable.url);
      }
    }
  }
};
const pauseVideo = function (videoPlayerID: string) {
  const videoToPause = document.getElementById(
    videoPlayerID
  ) as HTMLMediaElement;
  if (!videoToPause) {
    return;
  }
  videoToPause.pause();
};

// This is where params are parsed into new search queries (not page turns, because it gets complicated) and art-focusing that create new history entries. By sorting entries in sync with the search queries, users should be able to follow a link to a focused art *over* a search query, load just that art, yet access the search that led to that art—preserving a more semantic state. As the user pages forward they'll eventually come to that piece's original spot in the sort order, but before that point it needs to not be added to the artworks. Separate. (it would otherwise be at the end, messing up the paged searching that uses the computed last entry as its cursor).

const loadRoute = async function () {
  const oldParams = queryParams.value.join("&");
  console.log(oldParams);
  captureParams();
  // applyParams();

  if (upon.value?.length > 0) {
    const toFocus = artworks.value.findIndex(
      (piece) => String(piece.id) === upon.value.replace("upon=", "")
    );
    if (toFocus > -1) {
      focusArt(toFocus);
      return;
    } else {
      searchString.value = `id:${upon.value.replace("upon=", "")}`;
      await search(true);
      applyParams();
      return;
    }
  } else if (focusedArtIndex.value) {
    unfocusArt();
    return;
  }

  applyParams();
  console.log(queryParams.value.join("&"));
  if (
    oldParams !== queryParams.value.join("&") ||
    (artworks.value.length === 0 && queryParams.value.length > 0)
    // !(
    //   [...yesList.value].every((tagName) =>
    //     oldYes.split("+").includes(tagName)
    //   ) &&
    //   [...oldYes.split("+")].every((tagName) => yesList.value.has(tagName)) &&
    //   [...noList.value].every((tagName) =>
    //     oldNo.split("+").includes(tagName)
    //   ) &&
    //   [...oldNo.split("+")].every((tagName) => noList.value.has(tagName)) &&
    //   [...maybeList.value].every((tagName) =>
    //     oldMaybe.split("+").includes(tagName)
    //   ) &&
    //   [...oldMaybe.split("+")].every((tagName) =>
    //     maybeList.value.has(tagName)
    //   ) &&
    //   order.value === oldOrder.replace("order:", "") &&
    //   (oldRatings.includes("s") || safeAllowed.value === false) &&
    //   (oldRatings.includes("q") || safeAllowed.value === false) &&
    //   (oldRatings.includes("s") || safeAllowed.value === false)
    // )
  ) {
    pageNumber.value = 1;
    nextable.value = true;
    backable.value = false;
    search();
  }
};
if (queryParams.value.length > 0) {
  loadRoute();
}
watch(route, async (newRoute) => {
  loadRoute();
});
</script>

<style scoped>
#search-splash {
  padding-top: 0;
  height: 80vh;
}
/* .gallery-container {
  height: 130vh;
  margin-top: 100vh;
}
.gallery-container > * {
  height: 100%;
} */
#search-results {
  --scaler: 1;
}
#art-viewer {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: calc(100% - 16rem);
  margin: 0 8rem 30vh 8rem;
  transition: margin 0.2s ease-out;
}
@media screen and (max-width: 1000px) {
  #art-viewer {
    margin: 0 2rem;
  }
}
#art-viewer.wide {
  width: 100%;
  margin: 0;
}
.art-frame {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: calc(12rem * var(--scaler));
  max-width: calc(9rem * var(--scaler));
  margin: calc(0.7rem * var(--scaler)) calc(0.5rem * var(--scaler));
  transition: max-width 0.3s ease-out, margin 0.3s ease-out,
    height 0.3s ease-out, flex-basis 0.3s ease-out;
}

.fizzle-move, /* apply transition to moving elements */
.fizzle-enter-active,
.fizzle-leave-active {
  transition: all 0.7s ease-out;
}
.fizzle-leave-active {
  position: absolute;
}
.fizzle-enter-from,
.fizzle-leave-to {
  opacity: 0;
  max-width: 0;
  margin: 0;
  /* border-width: 0; */
  padding: 0;
}

.art-thumbnail {
  max-width: calc(9rem * var(--scaler));
  height: calc(8rem * var(--scaler));
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.art-thumbnail img,
.art-thumbnail video {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  flex-basis: 96%;
  width: 94%;
  margin: auto;
  z-index: 1;
}
.art-frame:has(.viewed)::after {
  content: "☑";
  color: rgb(250, 209, 255);
  position: absolute;
  left: 50%;
  translate: -50% -100%;
  font-size: 1rem;
  pointer-events: none;
}
.art-thumbnail .art-title {
  padding: 1em;
  font-size: calc(1.1rem * var(--scaler));
  word-wrap: break-word;
  white-space: pre-wrap;
  color: rgb(113, 255, 212);
  text-shadow: 2px 2px 4px rgb(67, 11, 112);
  transition: color 0.3s ease-out, font-size 0.3s ease-out,
    opacity 0.2s ease-out;
  z-index: 2;
  opacity: 0;
  max-height: 100%;
  max-width: 100%;
}
.art-frame:hover .art-title {
  color: rgb(255, 221, 242);
  opacity: 1;
}
.art-frame:has(video) .art-title {
  opacity: 1;
}
.art-frame:has(video):hover .art-title {
  opacity: 0;
}

/* Scaling component (or it should be separated into one at least) */
#thumb-scaler {
  position: sticky;
  bottom: 1rem;
  /* margin-top: 110vh; */
  left: 40vw;
  width: 20vw;
  opacity: 0.3;
  transition: opacity 0.2s ease-in;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-end;
}
@media screen and (max-width: 1150px) {
  #thumb-scaler {
    width: 40vw;
    left: 30vw;
  }
}
@media screen and (max-height: 900px) {
  #thumb-scaler {
    bottom: 0.25rem;
  }
}
@media screen and (max-width: 600px) {
  #thumb-scaler {
    width: 50vw;
    left: 20vw;
    scale: 0.8;
  }
}
#thumb-scaler:hover,
#thumb-scaler:has(:focus) {
  opacity: 1;
}
#thumb-range {
  width: 100%;
}
input[type="range"] {
  height: 42px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background-color: transparent;
}
input[type="range"]:focus {
  outline: 3px solid rgb(217, 137, 234);
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 15px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 2px 2px 4px #5f127a;
  background: #bb9dcf;
  border-radius: 6px;
  border: 1px solid #2621b8;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #a3b6ff;
  border: 1px solid #c654ff;
  height: 34px;
  width: 16px;
  border-radius: 5px;
  background: #e4deff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10.5px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #bb9dcf;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 15px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 2px 2px 4px #5f127a;
  background: #bb9dcf;
  border-radius: 6px;
  border: 1px solid #2621b8;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #a3b6ff;
  border: 1px solid #c654ff;
  height: 34px;
  width: 16px;
  border-radius: 5px;
  background: #e4deff;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 15px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #bb9dcf;
  border: 1px solid #2621b8;
  border-radius: 12px;
  box-shadow: 2px 2px 4px #5f127a;
}
input[type="range"]::-ms-fill-upper {
  background: #bb9dcf;
  border: 1px solid #2621b8;
  border-radius: 12px;
  box-shadow: 2px 2px 4px #5f127a;
}
input[type="range"]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 1px 1px 1px #a3b6ff;
  border: 1px solid #c654ff;
  height: 34px;
  width: 16px;
  border-radius: 5px;
  background: #e4deff;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #bb9dcf;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #bb9dcf;
}

/* modal view styles */
#widener {
  position: absolute;
  right: 12%;
  z-index: 21;
  font-size: 1rem;
  font-family: Cabin;
  line-height: 1rem;
  background-color: rgb(234, 213, 255);
  border-radius: 10px 0 10px 30% / 10px 20px;
  transition: top 0.2s ease-out, right 0.2s ease-out, opacity 0.3s ease-out;
}
#widener {
  top: calc(12% + 7rem);
}
.fullscreen #widener {
  right: 3%;
  opacity: 0.05;
}
.fullscreen #widener {
  top: calc(3% + 7rem);
}
#widener:hover {
  opacity: 1;
}
#header-row {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: space;
}
#header-row h1 {
  align-self: flex-start;
  flex: 50% 0 0;
}
.image-container {
  padding: 0;
  margin-bottom: 10vh;
  height: 80vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  transition: height 0.2s ease-out, width 0.2s ease-out;
}
.fullscreen .image-container {
  height: 100vh;
}
.fullscreen .image-container.wide,
.image-container.wide {
  height: var(--ratio);
  width: 100%;
}
.image-container img.artwork,
.image-container video {
  object-fit: contain;
  flex-basis: 100%;
  height: 100%;
  width: 100%;
}
#annotated-picture {
  height: 100%;
  width: 100%;

  /* position: fixed; */
  /* top: 0;
  left: 0; */
  z-index: 0;
}
#picture,
#annotation {
  /* height: 100vh; */
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
#picture {
  padding-top: 0;
}
#annotation {
  padding-top: 1rem;
}
div.info {
  white-space: pre-wrap;
  color: rgb(66, 22, 187);
  text-shadow: rgb(253, 205, 247) -2px 0 8px, rgb(255, 222, 192) 2px 0 8px;
  border-radius: 20px;
  z-index: 1;
  padding: 7vh 1rem;
  width: 80%;
  margin: 0 auto;
  background-color: rgba(232, 175, 255, 0.788);
}
#focused-art-info {
  margin: 2rem 1rem;
  padding: 2rem 3rem;
  font-size: 1.3rem;
  background-color: rgba(255, 175, 231, 0.35);
  color: white;
  text-shadow: rgb(205, 226, 253) -1px 0 4px, rgb(192, 255, 213) 1px 0 4px;
  border-radius: 2rem;
}
.up-button,
.down-button {
  position: sticky;
  z-index: 2;
}
.up-button a,
.down-button a {
  text-decoration: none;
}
.up-button button,
.down-button button {
  font-size: 2.5rem;
  padding: 5px 5px 10px 5px;
  width: 4rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease, background-color 0.2s ease;
}
.up-button button:hover,
.up-button button:focus,
.down-button button:hover,
.down-button button:focus {
  color: rgba(228, 195, 255, 1) !important;
  background-color: rgba(61, 4, 87, 0.6) !important;
}
.down-button {
  bottom: 0;
  margin-top: 0;
  margin-left: 5rem;
}
.up-button {
  top: 0;
  margin-top: -4.75rem;
  margin-bottom: 1rem;
  margin-right: 5rem;
}
#closeup-buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.post-links {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
}
.tag-links {
  flex: 1 0 70%;
  max-height: 64vh;
  margin-bottom: 2rem;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  overflow: auto;
}
.tag-box {
  margin: 0 0.5rem;
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  /* width: 100%; */
}
.tag-box button {
  padding: 0.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
  transition: background-color 0.3s ease-out;
}
.tag-buttons {
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}
.tag-box:hover .tag-buttons {
  opacity: 1;
}
.tag-buttons button {
  height: 2rem;
  width: 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0;
  text-align: center;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;
}
.tag-adder,
.yes.tag {
  background-color: rgb(71, 214, 135);
}
.tag-adder:hover,
.yes.tag:hover {
  background-color: rgb(114, 238, 151);
}
.tag-loosener,
.maybe.tag {
  background-color: rgb(110, 202, 255);
}
.tag-loosener:hover,
.maybe.tag:hover {
  background-color: rgb(111, 229, 250);
}

.tag-subtractor {
  background-color: rgb(241, 191, 145);
}
.tag-subtractor:hover {
  background-color: rgb(247, 163, 85);
}
.tag-subtractor.shown {
  flex-basis: 0 0 1rem;
}
.tag-blocker,
.no.tag {
  background-color: rgb(243, 125, 204);
}
.tag-blocker:hover,
.no.tag:hover {
  background-color: rgb(238, 73, 183);
}

.tag {
  color: black;
  margin: 0.25rem;
  padding: 0.35rem 0.7rem;
  text-decoration: none;
  background-color: rgba(45, 19, 116, 0.85);
  border-radius: 0 0.4rem 0.4rem 0.4rem;
  transition: color 0.3s ease-out, background-color 0.3s ease-out;
}

#search-settings {
  opacity: 0.2;
  transition: opacity 0.3s ease-out;
}
#search-settings:hover {
  opacity: 1;
}
#search-settings fieldset {
  position: fixed;
  right: 0.25rem;
  max-height: 100%;
  overflow: hidden;
  border: 3px solid rgba(84, 10, 145, 0.8);
  border-radius: 1rem;
  padding: 0;
  background-color: rgb(243, 221, 253);
  transition: translate 0.3s ease-out, height 0.3s ease-out,
    bottom 0.3s ease-out;
}
fieldset#search-sorter {
  bottom: 6.7rem;
  translate: 0.5rem 6.2rem;
  border-bottom-right-radius: 0;
  height: 7.5rem;
}
#allowed-ratings {
  bottom: 0.5rem;
  translate: 0 0rem;
  height: 6rem;
}
#score-threshold {
  bottom: 6.9rem;
  translate: 0 0;
  height: 4rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
#score-threshold:hover {
  height: 8rem;
  bottom: 7.4rem;
}
#score-threshold input {
  text-align: center;
  font-size: 1rem;
  width: 3.5rem;
}
#search-settings:has(#search-sorter:hover) #score-threshold {
  bottom: 11.9rem;
  height: 3.5rem;
}
#search-settings:has(#allowed-ratings:hover) #score-threshold {
  bottom: 10.3rem;
}

#search-settings fieldset:hover,
#search-settings fieldset:has(:focus) {
  translate: 0;
}
#allowed-ratings:hover,
#allowed-ratings:has(:focus) {
  height: 11rem;
}
#search-settings:has(#allowed-ratings:hover) #search-sorter {
  translate: 0.5rem 1.2rem;
}
.search-section {
  max-height: 6rem;
  overflow-y: auto;
}
@media screen and (max-height: 600px) {
  #score-threshold {
    bottom: 7rem;
    height: 4rem;
  }
  #score-threshold:hover {
    height: 8.5rem;
    bottom: 7.5rem;
  }
  #search-settings:has(#allowed-ratings:hover) #score-threshold {
    bottom: 10rem;
  }
  #search-settings:has(#search-sorter:hover) #score-threshold {
    bottom: 10.5rem;
    height: 5rem;
  }
  #allowed-ratings {
    height: 6rem;
  }
  #allowed-ratings:hover,
  #allowed-ratings:has(:focus) {
    height: 10.5rem;
  }
  fieldset#search-sorter {
    bottom: 5rem;
    translate: 0.5rem 4.5rem;
    height: 7.6rem;
  }
  fieldset#search-sorter:hover {
    height: 9.2rem;
  }
  #search-settings:has(#allowed-ratings:hover) #search-sorter {
    translate: 0.5rem 0rem;
  }
  /* .search-section {
    max-height: 6rem;
  } */
}

.search-section div {
  padding: 0 1rem;
}
#search-settings legend {
  border-style: solid;
  border-color: rgba(84, 10, 145, 0.8);
  border-width: 3px 3px 0 3px;
  padding: 0 0.5rem;
  background-color: rgb(243, 221, 253);
  border-radius: 1rem 1rem 0.5rem 0.5rem;
}
</style>
