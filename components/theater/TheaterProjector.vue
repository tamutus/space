<template>
  <div class="container">
    <div id="project-ions" class="theater">
      <img src="/assets/BetterCurtains.png" class="overlay" />
      <h2>Project(ion)s</h2>
      <div class="projector">
        <div class="projections" :style="projectionsX">
          <div
            class="projection"
            v-for="projection of projections"
            :data-title="projection.frameTitle"
          >
            <h3 v-if="projection.link">
              <a :href="projection.link">{{ projection.header }} </a>
            </h3>

            <h3 v-else>{{ projection.header }}</h3>

            <div>
              <p v-for="paragraph of projection.description">
                {{ paragraph }}
              </p>
            </div>
            <img v-if="projection.img" :src="projection.img" />
          </div>
        </div>
      </div>
      <div class="film" :style="filmX">
        <div
          v-for="(projection, pIndex) of projections"
          :class="`still ${activeProjectionIndex === pIndex ? 'active' : ''}`"
          data-title="projection.frameTitle"
          @click="activate(pIndex)"
        >
          <h6>{{ projection.frameTitle }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectionWidth = 78; // unit: vmin
const stillWidth = 16.7 + 2 * 0.3 + 0.9;
const activeProjectionIndex = ref(0);
const projectionsX = computed(() => {
  return `translate: ${
    activeProjectionIndex.value * -1 * projectionWidth
  }vmin 0`;
});
const filmX = computed(() => {
  return `translate: ${
    (activeProjectionIndex.value * -1 + 2.98) * stillWidth
  }vmin 0`;
});

const projections = [
  {
    frameTitle: "Veritas Divining",
    header: "Veritas Divining",
    link: "https://veritasdivining.com",
    img: "https://veritasdivining.com/Pendulum.jpg",
    description: [
      "Business website for a diviner. Built as a Single Page Application in Vue, with integrated booking and an interactive galaxy animation.",
    ],
  },
  {
    frameTitle: "BOLD",
    header: "BOLD website creation",
    link: "http://www.theboldprojectpa.org/",
    img: "https://www.theboldprojectpa.org/assets/BOLD%20logo.jpg",
    description: [
      "Directed by Katrina A. Robinson, The BOLD Project (Building On Life's Disenfranchisements) aims to fill gaps in healthcare and support for trans women. I created this website as a Node application running Express, and deployed it to Render, managing DNS and ancillary tech support.",
    ],
  },
  {
    frameTitle: "Magnova",
    header: "Magnova Carta",
    link: "https://magnova.space",
    img: "/assets/Magnova_logo_wip.png",
    description: [
      "In addition to developing the website by myself, I have a number of steps to take towards building a nonprofit around it. This is my life's work!",
    ],
  },
  {
    frameTitle: "Portfolio",
    header: "Portfolio development",
    link: "",
    img: "/assets/flowers portrait.jpg",
    description: [
      "I have many features that I'm excited to add to this website, like streamlining my contracting process, writing in my blog, expanding the simple photo galleries I made into a more full-fledged experience, and creating a shopfront for my services that uses Stripe.",
    ],
  },
  {
    frameTitle: "Moneyless Society",
    header: "Volunteering with Moneyless Society",
    link: "https://moneylesssociety.com/",
    img: "https://moneylesssociety.com/wp-content/uploads/2021/03/80-B-three-psres.png",
    description: [
      "These people run an excellent podcast, host a wealth of resources, and are actively creating sustainable ecosystems. We are developing and practicing ways of doing mutual aid. I've contributed to their WordPress with web design and an article, and they hosted me on their podcast. I am a member of the board of directors.",
    ],
  },
  {
    frameTitle: "Ballots Unleashed",
    header: "Ballots Unleashed",
    link: "",
    img: "",
    description: [
      "Ranked Choice Voting should be easy to do in everyday life. Unbelievably, we don't have a free app for anybody to run and participate in ranked choice elections.",
      "I've decided to change that by creating a web app that lets social circles of different granularity (residential area, friend group, union, etc.) create elections with a variety of parameters and voting algorithms, which will together radically expand the potential applications of RCV.",
    ],
  },
  {
    frameTitle: "Networking",
    header: "Professional Connections",
    link: "",
    img: "",
    description: [
      "My unbridled enthusiasm for so much that the world has to offer has brought me into contact with diverse fields. We are only as strong as the bonds we form. Mutual aid is the strongest way to build them. Groups that I have done mutual aid with include:",
      "• Alliance for Reason and Knowledge",
      "• Qubit Transport",
      "• Structural Monitoring Solutions",
      "Send me an email if you'd like to connect with any of the following groups. I vouch for all of them.",
    ],
  },
];
function activate(projectionIndex: number) {
  activeProjectionIndex.value = projectionIndex;
}
</script>

<style scoped>
.container {
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 150px auto;
}
.theater {
  flex: 0 0 100vmin;
  height: 85.2vmin;
  margin: 0 auto;
  padding-top: 30px;
  background-color: rgb(56, 3, 3);
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  color: rgb(255, 237, 75);
  position: relative;
  transform-origin: center;
  transition: transform 0.5s ease-in-out;
}

.theater h2 {
  margin: 4vmin auto 1vmin auto;
  font-family: "Cinzel Decorative", sans-serif;
  /* font-size: 60px; */
}
.theater h3 {
  /* font-size: 40px; */
}
.theater h6 {
  font-size: 1rem;
}
.theater p {
  font-size: 20px;
}
.theater .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 3;
}
.projector {
  background-color: black;
  width: 78vmin;
  height: 52vmin;
  padding: 2vmin 0;
  border: 1vmin solid black;
  overflow: hidden;
  margin-bottom: 1.056vmin;
  color: rgb(33, 37, 41);
  box-sizing: content-box;
}
.projections {
  margin: 0 auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  height: 100%;
  transition: translate 0.6s cubic-bezier(0.63, 0.37, 0.645, 1.375);
}
.projections .projection {
  flex: 0 0 76vmin;
  margin: 0 1vmin;
  padding-top: 25px;
  height: 100%;
  box-sizing: border-box;
  background-color: rgb(255, 216, 216);
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  border-radius: 3vmin;
}
.projection img {
  max-width: 80%;
  max-height: 33vmin;
  margin: 20px auto 40px auto;
}
.film {
  display: flex;
  flex-flow: row nowrap;
  background-color: rgb(41, 23, 23);
  padding: 0 0 0 8px;
  border-width: 10px 0;
  border-color: rgba(168, 137, 106, 0.719);
  border-style: dashed none;
  transition: translate 0.6s cubic-bezier(0.63, 0.37, 0.645, 1.375);
}
.film::before {
  content: "Click these →";
  position: absolute;
  left: -100px;
  width: 60px;
  height: 100%;
  top: 8px;
}
.film .still {
  width: 16.7vmin;
  height: 11vmin;
  padding: 0.3vmin;
  background-color: rgba(209, 177, 144, 0.719);
  color: rgba(75, 43, 38, 0.788);
  margin-right: 0.9vmin;
  text-align: center;
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: filter 0.3s ease-out;
}
.film .still,
.film .still * {
  cursor: zoom-in;
}
.film .still:hover {
  filter: brightness(1.2);
}
.film .still.active {
  filter: brightness(1.5);
}
@media screen and (max-width: 500px), @media screen and (max-height: 500px) {
  .theater h2 {
    font-size: 2em;
  }
}
</style>
