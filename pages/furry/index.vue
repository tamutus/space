<template>
  <div>
    <BackgroundImage imageFileName="assets/photos/misty.jpg">
      <NavHeader> Reconcilography </NavHeader>
      <div class="padded">
        <ImageFocused
          image-file-name="assets/photos/Transparent Wreck.png"
          alt-text="Goat person in jeans and "
          alignment="right"
        >
          <BoxWaterfall>
            <template #1> Look! </template>
            <template #5> I'm a </template>
            <template #7> goat! </template>
          </BoxWaterfall>
        </ImageFocused>
      </div>
    </BackgroundImage>
    <BackgroundTexture texture="velvet">
      <section>
        <div class="gallery-container">
          <ClientOnly>
            <GalleryPrism
              :colors="backgroundColors"
              :zoomable="true"
              :max-height="900"
              :max-width="900"
            >
              <template
                v-for="(image, imageNumber) of signedURLs"
                #[imageNumber]
              >
                <div class="image-container">
                  <img :src="image" class="" />
                </div>
              </template>
            </GalleryPrism>
          </ClientOnly>
        </div>
      </section>
    </BackgroundTexture>
    <BackgroundImage
      image-file-name="assets/photos/Twilight_on_Douglass.jpg"
      attachment="fixed"
    >
      <section class="padded">
        <ClientOnly>
          <!-- <BoxPop> <h2>External Links</h2> </BoxPop> -->
          <BoxNeon color="purple">
            <template #default> External links </template>
            <template #paragraph>
              <div>
                <ul>
                  <li>
                    <h3>
                      <a href="https://weasyl.com/~reconcile">
                        <ImageLogo
                          alignment="right"
                          logo-size="small"
                          logo-source="https://www.weasyl.com/img/logo-vJTcsUua06.png"
                        >
                        </ImageLogo>
                      </a>
                    </h3>
                  </li>
                  <li>
                    <h3>
                      <a href="https://twitter.com/reconcilography">Twitter</a>
                    </h3>
                  </li>
                </ul>
              </div>
            </template>
          </BoxNeon>
        </ClientOnly>
      </section>
    </BackgroundImage>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Reconcile's Hub`,
});

const { data: signedURLs } = await useFetch("/api/art");
console.log(signedURLs);

const images = [
  "https://storage.cloud.google.com/homepage-gallery/wreck.jpg",
  "/assets/photos/city_portal.jpg",
  "/assets/photos/Hiking_with_the_guys.jpg",
  "/assets/photos/misty.jpg",
  "/assets/photos/Twilight_on_Douglass.jpg",
  "/assets/photos/henry_rav.JPG",
];
const backgroundColors = ["rgba(21, 14, 69, .75)", "rgba(62, 22, 92,.75)"];
</script>

<style scoped>
.gallery-container {
  height: 150vh;
  margin-top: 0;
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
</style>
