<template>
  <div>
    <BackgroundImage imageFileName="assets/photos/misty.jpg">
      <NavHeader>Reconcilography</NavHeader>
      <div class="padded">
        <ImageFocused
          image-file-name="assets/photos/Transparent Wreck.png"
          alt-text="Goat person in jeans and "
          alignment="left"
        >
          <BoxWaterfall>
            <template #1> <h1 class="soft">Furries!</h1> </template>
            <template #4> <h1 class="soft">Queers!</h1> </template>
            <template #7> <h1 class="soft">Anarchy!</h1> </template>
          </BoxWaterfall>
        </ImageFocused>
      </div>
    </BackgroundImage>
    <BackgroundTexture texture="velvet">
      <section id="art-links">
        <NavHeader>Reconcile's Art</NavHeader>
        <div id="all-art-link" class="glass-link">
          <BoxGlass>
            <div class="padded-links">
              <NuxtLink to="/furry/gaze">Browse art</NuxtLink>
            </div>
          </BoxGlass>
        </div>
        <div id="tag-splash-link" class="glass-link">
          <BoxGlass>
            <div class="padded-links">
              <NuxtLink to="/tag">Explore Tags</NuxtLink>
            </div>
          </BoxGlass>
        </div>
        <div id="photos-link" class="glass-link">
          <BoxGlass>
            <div class="padded-links">
              <NuxtLink to="/photos">Plain old photographs</NuxtLink>
            </div>
          </BoxGlass>
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
h1.soft {
  /* font-family: "Comfortaa"; */
  font-size: 3rem;
  color: #e1f87d;
}
.glass-link {
  position: absolute;
  font-size: 2rem;
}
#all-art-link {
  right: 20vw;
  top: calc(8rem);
}
#tag-splash-link {
  right: 30vw;
  top: calc(18rem);
}

#photos-link {
  right: 40vw;
  top: calc(28rem);
}
.padded-links {
  padding: 2rem;
  color: rgb(221, 243, 255);
}
.padding-links:hover {
  color: rgb(113, 255, 212);
}

@media screen and (max-width: 1200px) {
  .glass-link {
    translate: 10vw 35vh;
  }
  #art-links {
    min-height: 120vh;
  }
}
</style>
