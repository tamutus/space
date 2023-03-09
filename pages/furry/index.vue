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
        <NavHeader>Reconcile's Art</NavHeader>
        <div class="gallery-container">
          <GalleryPrismGooglePics bucket="homepage-gallery" />
        </div>
      </section>
    </BackgroundTexture>
    <BackgroundImage
      image-file-name="assets/photos/Twilight_on_Douglass.jpg"
      attachment="fixed"
    >
      <section class="padded">
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
      </section>
    </BackgroundImage>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Reconcile's Hub`,
});
</script>

<style scoped>
.gallery-container {
  height: 150vh;
  margin-top: 0;
}
.gallery-container > * {
  height: 100%;
}
.nsfw {
  color: white;
}
</style>
