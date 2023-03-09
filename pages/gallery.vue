<template>
  <div id="gallery-page">
    <BackgroundTexture texture="sherbet">
      <NavHeader>Gallery</NavHeader>

      <BoxFocus>
        <BoxTube>
          <ul class="separated">
            <li><NuxtLink to="#animations">Animations</NuxtLink></li>
            <li><NuxtLink to="#experiments">Experiments</NuxtLink></li>
            <li><NuxtLink to="#websites">Websites</NuxtLink></li>
            <li><NuxtLink to="#pictures">Pictures</NuxtLink></li>
            <!-- <li><NuxtLink to="#"></NuxtLink></li> -->
          </ul>
        </BoxTube>
      </BoxFocus>
    </BackgroundTexture>
    <BackgroundTexture texture="solarpunk">
      <section>
        <BackgroundHologram :delay="1" id="animations">
          <BoxNeon color="green">
            Animations
            <template #paragraph>
              <p>
                You can hire me to make CSS animations, widgets, or anything
                else that these examples inspire.
              </p>
            </template>
          </BoxNeon>
          <GalleryViewer category="animations" />
        </BackgroundHologram>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="solarpunk">
      <section>
        <BackgroundHologram :delay="5" id="experiments">
          <BoxNeon color="yellow">
            Experiments
            <template #paragraph>
              <p>
                These fun little projects had me practice a variety of
                web/JavaScript tools. The galaxy uses d3, the shiny Pokémon
                generator uses async data methods on an API, and the prism was
                an exploration of 3D rendering with CSS (and I use that Vue
                component elsewhere on my site).
              </p>
            </template>
          </BoxNeon>
          <GalleryViewer category="widgets" />
        </BackgroundHologram>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="velvet" id="websites">
      <section>
        <BackgroundHologram :delay="9" id="experiments">
          <BoxNeon color="white">
            Websites
            <template #paragraph>
              <p>
                Screenshots of websites that I've programmed. Click one to
                launch it within this gallery.
              </p>
            </template>
          </BoxNeon>
          <GalleryViewer category="websites" />
        </BackgroundHologram>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="fae" id="pictures">
      <BoxPop><h2>Personal pages</h2></BoxPop>

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
ul.separated {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-evenly;
}
ul.separated li {
  text-align: center;
  font-size: 1.5em;
}

section {
  padding: 50px 7%;
}
#gallery-page {
  position: relative;
  z-index: 0;
}
</style>
