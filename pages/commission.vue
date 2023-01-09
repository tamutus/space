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
            <template #display
              ><p>
                On today's Internet, seamless and performant animation is no
                longer optional if you want to woo your viewers. A website that
                doesn't move and doesn't adapt to different browser windows is
                seen as antiquated and low-effort. Breathe life into the time
                that your audience spends with your creations by adding CSS
                animations.
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
              <p></p> </template
          ></BackgroundHologram>
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

<script setup lang="ts"></script>

<style scoped>
h3 {
  font-family: Ubuntu, sans-serif;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-left: 0;
}
</style>
