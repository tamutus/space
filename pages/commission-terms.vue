<template>
  <div id="commission-terms">
    <BackgroundTexture texture="velvet">
      <section>
        <NavHeader> Let's Talk! </NavHeader>
        <ClientOnly>
          <BoxFocus
            ><BoxTube>
              <div>
                <h2><em>What to expect when commissioning Lavra</em></h2>
                <p>
                  If you are considering commissioning me, read through the
                  walkthrough of my process below and peruse my prices.
                </p>
              </div>
            </BoxTube></BoxFocus
          >
        </ClientOnly>
      </section>
      <section>
        <ClientOnly>
          <BoxPop> <h2>Walkthrough</h2></BoxPop>
        </ClientOnly>
        <BackgroundHologram>
          <h3>
            <em>From concept to experience</em>
          </h3>
          <template #display>
            <div>
              <p>
                Freelancers all have their own processes for how they work with
                a client to get a website up and running. Corporate services
                offer very powerful buzzwords with hefty lists of add-ons, but
                the process can be confusing and off-putting. As a one-person
                studio, I offer to create you personalized websites that aren’t
                just a place to plant your flag, but are collaborative art
                pieces with technological freedom. Let me guide you through my
                process:
              </p>
              <ol>
                <li>
                  Send me a message outlining what kind of website you want me
                  to build. Let me know some times you would be available for a
                  conversation. Text conversation and calls are both fine.
                </li>
                <li>
                  When we meet, we’ll discuss the scope of the project: design
                  goals, how it will be used, traffic expectation, budget,
                  payment schedule, and a time-frame for completion.
                </li>
                <li>
                  If necessary, I’ll explain how web hosting and domain names
                  work, and help you make an educated choice for what services
                  to choose.
                </li>
                <li>
                  If you haven’t already acquired a domain name and hosting
                  service, I’ll show you how. You’ll then send me your login
                  info for these two accounts so I can upload my work and get it
                  routed correctly.
                </li>
                <li>
                  I’ll spend some time getting creative. I’ll send you
                  screencaps and mockups of what I’m envisioning, and at this
                  point we can make major course corrections or aesthetic
                  changes.
                </li>
                <li>
                  Once I finish the backbone for your desktop site, I’ll run it
                  by you for feedback and iteratively make additions and
                  changes.
                </li>
                <li>
                  Once you’re satisfied with how it generally looks and works, I
                  will fine tune, bug test, make the styles adaptive to multiple
                  screen sizes and mobile usability, etc. until I am comfortable
                  passing it off.
                </li>
                <li>
                  I’ll upload the finished project to your hosting service and
                  hook up the DNS from your namespace provider. We’re done! Your
                  completed commission will come with a fixed rate for work in
                  the next year such as feature requests or style changes.
                </li>
                <li>
                  For one month after we’ve decided the website is finished,
                  I’ll fix any errors with what I programmed for free. Note that
                  this only includes bugs, typos, and unexpected behavior.
                </li>
                <li>
                  After some amount of time, I will follow up with a post-mortem
                  to ensure everything is working correctly. I’ll ask some
                  questions about how your commission experience was to make
                  sure I’m offering you the best possible service.
                </li>
              </ol>
            </div>
          </template>
        </BackgroundHologram>
      </section>
      <section>
        <div class="padded">
          <BackgroundHologram :delay="10">
            <template #default><h3>My default stack</h3> </template>
            <template #display>
              <p>
                If you'd like to use a different set of technologies, or a
                different host, that's perfectly okay. The following setup is
                what I have found to be most enjoyable to work with, and the
                hosts I've listed have the most generous free tiers that are
                compatible out of the box.
              </p>
              <TableTech>
                <template #1>
                  <div>
                    <h4>Web framework</h4>
                  </div></template
                ><template #2>
                  <div>
                    <h4>Nuxt 3</h4>
                    <h4>Vue</h4>
                  </div>
                </template> </TableTech
              ><TableTech>
                <template #1>
                  <div>
                    <h4>Hosting</h4>
                  </div></template
                ><template #2>
                  <div>
                    <h4>Vercel.com</h4>
                    <h4>Railway.app</h4>
                  </div>
                </template>
              </TableTech>
              <TableTech>
                <template #1>
                  <div>
                    <h4>Database</h4>
                  </div></template
                ><template #2>
                  <div>
                    <h4>MongoDB</h4>
                    <h4>PostgreSQL <em>(soon)</em></h4>
                  </div>
                </template>
              </TableTech>
            </template>
          </BackgroundHologram>
        </div>
      </section>
      <section id="pricing">
        <ClientOnly>
          <BoxPop><h2>Prices</h2> </BoxPop>
        </ClientOnly>
        <BackgroundHologram>
          <template #display>
            <TableTech>
              <template #1>
                <h4>
                  Turning your idea into a basic, static website. Including
                  styling, animation, and getting it online:
                </h4>
              </template>
              <template #2>
                <div>
                  <h4>$1200</h4>
                  <em
                    >(Hosting costs not included. Those are handled by client
                    directly)</em
                  >
                </div>
              </template></TableTech
            >
            <TableTech>
              <template #1>
                <div>
                  <h4>Adding custom, simple content management</h4>
                  <em
                    >(e.g. users, articles, comments, hyperlinks, other text
                    data)</em
                  >
                </div>
              </template>
              <template #2>
                <div>
                  <h4>$400</h4>
                  <p><em>or</em></p>
                  <h4>$300 when packaged with website creation</h4>
                </div>
              </template>
            </TableTech>
            <TableTech>
              <template #1>
                <div>
                  <h4>Adding complex content management</h4>
                  <em
                    >(e.g. highly interconnected data, advanced search, media
                    storage)</em
                  >
                </div>
              </template>
              <template #2>
                <div>
                  <h4>$500 and up, depending on complexity</h4>
                </div>
              </template></TableTech
            >
            <TableTech>
              <template #1>
                <div>
                  <h4>Work on an existing site</h4>
                  <h4>Content Writing</h4>
                </div></template
              ><template #2>
                <div>
                  <h4>$40 / hour</h4>
                </div>
              </template></TableTech
            >
            <TableTech>
              <template #1>
                <div>
                  <h4>Visualizations and graphs</h4>
                </div></template
              ><template #2>
                <div>
                  <h4>$50 / item</h4>
                </div>
              </template></TableTech
            >
          </template>
        </BackgroundHologram>
      </section>
      <section>
        <ClientOnly
          ><BoxPop
            ><h2><span title="Disc">💽</span>ounts</h2></BoxPop
          ></ClientOnly
        >
        <BackgroundHologram>
          <template #display>
            <ol>
              <li>
                I am actively looking to build up my client base. If you refer
                people to me who follow through on commissions, I’ll give you a
                10% discount on your own commission. If you’ve already paid me,
                I will rebate you for your last commission once the person
                you’ve referred has submitted their final payment.
              </li>
              <li>
                If I have finished a commission to make you a website, for the
                next year I will give a 10% discount for work on that website
                and a 5% discount on other commissions.
              </li>
            </ol>
          </template>
        </BackgroundHologram>
      </section>
      <section>
        <ClientOnly>
          <BoxPop
            ><h2><span title="Disc">💽</span>laimers</h2>
          </BoxPop></ClientOnly
        >
        <BackgroundHologram>
          <template #display>
            <ul>
              <li>
                I can be flexible with payment for people who demonstrate great
                need, such as those starting nonprofits or creating works of
                activism. Such flexibility is up to my discretion, as I have my
                own political agenda and living needs.
              </li>
              <li>
                A great deal of my work involves the creative work leading up to
                the initial demos. If at any point you decide to cancel your
                commission contract with me, you still walk away with any design
                ideas I’ve come up with for you. Therefore, payments are
                non-refundable.
              </li>
              <li>
                Unexpected bugs do occur, and I cannot offer refunds for
                glitches or other surprising behavior, but I do include a month
                of free bug-fixing for work I have done. As long as you point it
                out within the month, it is covered, even if I don’t fix it
                within that timeframe.
              </li>
              <li>
                Clients will be served in the order in which they made their
                payments.
              </li>
            </ul></template
          ></BackgroundHologram
        >
      </section>
      <section id="contact-info">
        <ClientOnly>
          <BoxNeon color="green">
            Lavra is open for business!
            <template #paragraph>
              <div>
                <h3>
                  Email
                  <a href="mailto:them@lavrat.space">them</a> for a consultation
                  + quote.
                </h3>

                <h4>
                  Or <a href="/commission">Go Back to Commission Information</a>
                </h4>
              </div>
            </template>
          </BoxNeon>
        </ClientOnly>
      </section>
    </BackgroundTexture>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `Terms of Commissioning Lavra Tamutus`,
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
