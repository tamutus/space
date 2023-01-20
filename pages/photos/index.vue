<template>
  <div id="photography-page">
    <BackgroundTexture texture="velvet">
      <NavHeader> Photography </NavHeader>

      <p>Peruse pictures portrayed prismically</p>
      <section>
        <div class="gallery-container">
          <ClientOnly>
            <GalleryPrism
              :colors="backgroundColors"
              :zoomable="true"
              :max-height="900"
              :max-width="900"
            >
              <template v-for="(image, imageNumber) of images" #[imageNumber]>
                <div class="image-container">
                  <img :src="image" class="" />
                </div>
              </template>
            </GalleryPrism>
          </ClientOnly>
        </div>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Lavra's Photography`,
});

const images = [
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
p {
  margin: 30vh 50% 5vmin 5vmin;
  padding: 15px 20px 13px 5vw;
  background-color: rgba(61, 4, 87, 0.651);
  color: rgb(228, 195, 255);
  border-radius: 0 15px 15px 0;
}
</style>
