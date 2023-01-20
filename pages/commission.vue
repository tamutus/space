<template>
  <div id="commission-page">
    <BackgroundTexture texture="velvet">
      <section>
        <NavHeader>Your New Website</NavHeader>
        <ClientOnly>
          <BoxFocus>
            <BoxNeon color="orange">
              Commissions are open!
              <template #paragraph>
                <div>
                  <p>
                    Hit me up to design your new website! I work with small
                    business, startups, creatives, service providers, activists,
                    or whomever else is looking to develop infrastructure that
                    handles your needs with an energizing flair.
                  </p>
                  <p>
                    Want to skip the pitch?
                    <NuxtLink
                      :to="{ path: '/commission-terms', hash: '#pricing' }"
                      >Head straight to prices</NuxtLink
                    >
                  </p>
                </div>
              </template>
            </BoxNeon>
          </BoxFocus>
        </ClientOnly>
      </section>
      <section>
        <ClientOnly>
          <BoxPop>
            <h2>Website Design, Construction, and Deployment</h2></BoxPop
          >
        </ClientOnly>
        <div class="padded">
          <BackgroundHologram :delay="2">
            <h3>
              <em>From concept to experience</em>
            </h3>
            <template #display>
              <p>
                I make websites from start to finish. Building on your aesthetic
                vision, I will design, code, style, and deploy a full-stack
                solution. Do you want custom content management? Authentication
                and authorization of users? I have you covered.
              </p>
            </template>
          </BackgroundHologram>
        </div>
      </section>
      <section>
        <ClientOnly>
          <BoxPop><h2>Impress Your Audience</h2> </BoxPop>
        </ClientOnly>
        <div class="padded">
          <BackgroundHologram :delay="4">
            <template #default>
              <h3><em>Now using Nuxt 3</em></h3>
            </template>
            <template #display
              ><p>
                On today's Internet, seamless animation is no longer optional if
                you want to woo your viewers. A website that doesn't move and
                doesn't adapt to different browser windows is seen as antiquated
                and low-effort. Breathe life into the time that your audience
                spends with your creations by adding CSS animations.
              </p>
              <p>
                My recommended technology for new websites is Nuxt 3, based on
                the Vue frontend framework. This allows for custom transitions
                between pages, dynamic loading of content, hot module
                replacement, and all sorts of other fun things that amount to an
                enjoyably performant and customizable website. Perhaps the
                winning reason to use this technology is its server engine,
                Nitro, which can compile your website into either a classic
                server or even serverless functions that can be hosted for free
                on a site like <a href="https://vercel.com">Vercel</a>.
              </p></template
            ></BackgroundHologram
          >
        </div>
      </section>
      <section>
        <ClientOnly>
          <BoxPop>
            <h2>Define your enterprise</h2>
          </BoxPop>
        </ClientOnly>
        <div class="padded">
          <BackgroundHologram :delay="6">
            <template #display>
              <p>
                Getting a site of your own gives you the chance to highlight
                exactly what you want to highlight, in a style that matches your
                personal aesthetic or brand. Interface design can influence how
                people feel or interact, as do the paths your audience can take
                from page to page, paragraph to paragraph. Captivating attention
                requires thinking outside the box.
              </p>
              <p>
                I leverage a background in neuroscience, psychology, and art
                theory to help you make confident decisions about user flow and
                visual identity. It remains important to keep up to date on
                industry standards, so I am continually paying attention to
                public discourse on tools and strategies I use, as well as their
                alternatives.
              </p>
            </template></BackgroundHologram
          >
        </div>
      </section>
      <section>
        <ClientOnly
          ><BoxPop><h2>Showcase Your Work Elegantly</h2></BoxPop></ClientOnly
        >
        <div class="padded">
          <BackgroundHologram :delay="8">
            <template #display
              ><p>
                Your work deserves to shine, and hosting your content on a
                website with thousands or millions of other creators can make
                this challenging. While hubs like deviantArt, Weasyl, or Archive
                of Our Own can certainly draw customers to your content, these
                common galleries do nothing to highlight your aesthetic
                strengths.
              </p>
              <p>
                Having a custom-built site means you can add interactivity to
                your creations that is only limited by your imagination. Maybe
                you want to write a choose-your-own-adventure, or you are
                envisioning a user interface that resonates with visual themes
                in your art. Anything is possible when you hire a tech-savy
                artist like Lavra.
              </p>
            </template>
          </BackgroundHologram>
        </div>
      </section>

      <!-- <section>
        <ClientOnly>
          <BoxPop><h2>Monetize Your Creations</h2> </BoxPop></ClientOnly
        >
        <div class="padded">
          <BackgroundHologram :delay="10">
            <template #display
              ><p>
                Monetizing your art is one of the more difficult challenges
                faced by content-creators. Despite the millions of users on the typical
                gallery site, it is highly unusual for people to make a
                significant amount of money without their own paid content.
              </p>
              <p>Take ownership over your content delivery! </p>
            </template></BackgroundHologram
          >
        </div> -->
      <!-- <p>
			Art markets vary. Selling your art through a publishing house, whether print or digital, puts you into a box. Don't 
		</p>
		<p>
			RainToday's research has shown that 97% of customers base their purchase decisions on the product's website.
		</p>
		<p>
			If you create multiple kinds of content, such as visual art, stories, films, have a  
		</p> -->
      <!-- </section> -->
      <BoxFocus>
        <ClientOnly>
          <BoxNeon color="green">
            Lavra is open for business!
            <template #paragraph>
              Click the button below for general prices. Email
              <a href="mailto:them@lavrat.space">them</a> for more detailed
              quotes.
            </template>
          </BoxNeon>
        </ClientOnly>
      </BoxFocus>
      <section>
        ><ButtonRowdy to="commission-terms">I'M INTRIGUED</ButtonRowdy>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Commissioning Lavra`,
});
</script>

<style scoped>
h3 {
  font-family: Ubuntu, sans-serif;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-left: 0;
}
</style>
