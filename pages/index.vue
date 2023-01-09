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
        <ClientOnly>
          <BoxNeon color="orange">
            Technologies:
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
                    </ul>
                  </div>
                </template>
                <template #2>
                  <div>
                    <h4>Back-End Web</h4>
                    <ul>
                      <li>Node.js</li>
                      <li>Express</li>
                      <li>MongoDB and MongoDB Atlas</li>
                      <li>Mongoose</li>
                      <li>Mongoose-fuzzy-searching</li>
                      <li>
                        <a href="https://www.digitalocean.com/"
                          >Digital Ocean</a
                        >
                        static hosting
                      </li>
                      <li>
                        <a href="https://render.com/">Render</a> Docker image
                        hosting
                      </li>
                      <li>Nuxt</li>
                      <li>Nitro</li>
                    </ul>
                  </div>
                </template>
                <template #3>
                  <div>
                    <h4>Front-End Web</h4>
                    <ul>
                      <li>Responsive development</li>
                      <li>CSS design and animation</li>
                      <li>d3</li>
                      <li>Leaflet.js</li>
                      <li>Vue</li>
                      <li>Angular</li>
                    </ul>
                  </div>
                </template>
              </TableTech>
            </template>
          </BoxNeon>
        </ClientOnly>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
section:not(:first-of-type) {
  padding-top: 150px;
  padding-bottom: 150px;
}
</style>
