<template>
  <div id="gallery-page">
    <BackgroundTexture texture="sherbet">
      <NavHeader>Gallery</NavHeader>
      <ClientOnly>
        <BoxFocus>
          <BoxTube>
            <p>
              On this page is a sampling of some animations I'm proud of, and a
              handful of gimmicky tech demos for libraries I like to use. You
              can hire me to make CSS animations, widgets, or anything else that
              these examples inspire.
            </p>
          </BoxTube>
        </BoxFocus>
      </ClientOnly>
    </BackgroundTexture>
    <BackgroundTexture texture="solarpunk">
      <section>
        <BackgroundHologram :delay="1">
          <ClientOnly>
            <BoxNeon color="green"> Animations </BoxNeon>
            <GalleryViewer category="animations" />
          </ClientOnly>
        </BackgroundHologram>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="solarpunk">
      <section>
        <BackgroundHologram :delay="5">
          <ClientOnly>
            <BoxNeon color="yellow"> Experiments </BoxNeon>
            <GalleryViewer category="widgets" />
          </ClientOnly>
        </BackgroundHologram>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="sherbet">
      <ClientOnly
        ><BoxPop><h2>Personal pages</h2></BoxPop></ClientOnly
      >

      <BoxTube
        ><p>
          I rarely find time these days to create visual art, but if you vibe
          with furries, look forward to my upcoming gallery page. It will be
          here:
        </p>
        <h3>
          <NuxtLink to="/furry">Reconcilography</NuxtLink>
        </h3>
      </BoxTube>
      <BoxTube
        ><p>Who doesn't like to share their photos?</p>
        <h3>
          <NuxtLink to="/photos">Photography</NuxtLink>
        </h3>
      </BoxTube>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Lavra's Gallery`,
});
</script>

<style scoped>
section {
  padding: 50px 7%;
}
#gallery-page {
  position: relative;
  z-index: 0;
}
</style>
