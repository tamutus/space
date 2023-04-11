<template>
  <div>
    <BackgroundTexture texture="sherbet">
      <NavHeader>Lavra Tamutus</NavHeader>
      <section>
        <div class="padded">
          <ImageFocused
            image-file-name="assets/photos/Lavra Vibes.jpg"
            alt-text="Headshot of Lavra Tamutus backed by a full bookshelf, purple string lights, and a hanging pink bandana adorned by a fluorescent green goat"
            alignment="right"
          >
            <BoxWaterfall>
              <template #1>
                Freelance Web Developer, Designer, & Activist
              </template>
              <template #2> Creator and Programmer of </template>
              <template #3>
                <a href="https://magnova.space">Magnova</a>
              </template>
            </BoxWaterfall>
          </ImageFocused>
          <TableTech>
            <template #1><h2>Pronouns</h2> </template>
            <template #2>
              <h2>
                <a href="https://en.pronouns.page/@lavratamutus">
                  <UserPronoun pronoun="they" morpheme="subject" /> /
                  <UserPronoun pronoun="they" morpheme="object" />
                </a>
              </h2>
            </template>
          </TableTech>
        </div>
      </section>
      <section id="glass-array">
        <div id="all-art-link" class="glass-link">
          <BoxGlass mode="dark">
            <div class="padded-links">
              <NuxtLink to="/furry/gaze"
                ><span class="glass-text">Furry Art</span></NuxtLink
              >
            </div>
          </BoxGlass>
        </div>
        <div id="blog-splash-link" class="glass-link">
          <BoxGlass mode="dark">
            <div class="padded-links">
              <NuxtLink to="/blog">
                <span class="glass-text"> Writing </span>
              </NuxtLink>
            </div>
          </BoxGlass>
        </div>
        <div id="tag-splash-link" class="glass-link">
          <BoxGlass mode="dark">
            <div class="padded-links">
              <NuxtLink to="/tag"
                ><span class="glass-text">Content By Tag</span></NuxtLink
              >
            </div>
          </BoxGlass>
        </div>
        <div id="photos-link" class="glass-link">
          <BoxGlass mode="dark">
            <div class="padded-links">
              <NuxtLink to="/photos"
                ><span class="glass-text">Plain old photographs</span></NuxtLink
              >
            </div>
          </BoxGlass>
        </div>
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="velvet">
      <section>
        <TheaterProjector />
      </section>
    </BackgroundTexture>
    <BackgroundTexture texture="solarpunk">
      <section>
        <BoxNeon color="orange">
          <template #default> Technologies: </template>
          <template #paragraph>
            <TableTech>
              <template #1>
                <div>
                  <h4>General</h4>
                  <ul>
                    <li>TypeScript</li>
                    <li>JavaScript</li>
                    <li>Git</li>
                    <li>GitHub</li>
                    <li>Automated Testing</li>
                    <li>Corel Painter</li>
                    <li>Inkscape</li>
                    <li>Visual Studio Code</li>
                  </ul>
                </div>
              </template>
              <template #2>
                <div>
                  <h4>Back-End Web</h4>
                  <ul>
                    <li>Node.js</li>
                    <li>Nuxt 3 with hybrid SSR</li>
                    <li>Express</li>
                    <li>MongoDB on Atlas</li>
                    <li>Google Cloud Storage</li>
                    <li>
                      <a href="https://www.digitalocean.com/">Digital Ocean</a>
                      static hosting
                    </li>
                    <li>
                      <a href="https://render.com/">Render</a> Docker image
                      hosting
                    </li>
                    <li>
                      <a href="https://vercel.com">Vercel</a> static hosting
                    </li>
                  </ul>
                </div>
              </template>
              <template #3>
                <div>
                  <h4>Front-End Web</h4>
                  <ul>
                    <li>Responsive development</li>
                    <li>CSS design and animation</li>
                    <li>Vue</li>
                    <li>Auth0</li>
                    <li>d3</li>
                    <li>Leaflet.js</li>
                    <li>Angular</li>
                  </ul>
                </div>
              </template>
            </TableTech>
          </template>
        </BoxNeon>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Lavra Tamutus`,
});
</script>

<style scoped>
section:first-of-type {
  padding-top: 0;
}
#glass-array {
  position: relative;
  height: 30rem;
}
.glass-link {
  position: absolute;
  font-size: 2rem;
}
.padded-links {
  padding: 2rem;
}

.glass-text {
  color: rgb(221, 243, 255);
  transition: color 0.2s ease-out;
}
#all-art-link {
  left: 10vw;
  top: 8rem;
}
#blog-splash-link {
  left: 20vw;
  top: 16rem;
}
#tag-splash-link {
  left: 30vw;
  top: 24rem;
}
#photos-link {
  left: 40vw;
  top: 32rem;
}

section:not(:first-of-type) {
  padding-top: 150px;
  padding-bottom: 150px;
}
</style>
