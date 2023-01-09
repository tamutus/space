<template>
  <div>
    <div id="space" role="presentation">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        id="galaxy"
        ref="galaxy"
        viewBox="0 0 600 350"
      >
        <g id="stars" :class="twinkling ? 'twinkling' : ''">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="400s"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </div>
    <AnimatedSpaceGalaxyControls
      @reset-animation="toggleExistence"
      @toggle-galaxy-motion="toggleGalaxyMotion"
      @toggle-twinkle="toggleTwinkle"
      :twinkling="twinkling"
      :moving="moving"
      :exists="exists"
    />

    <!--
    <h1>
      Galaxy
    </h1>
    <p>This galaxy animation is procedurally generated with SVG and d3.</p>
    <p>Change the JS variables to change the behavior! The number of stars is starMax. starCycle defines the max milliseconds a star takes to load, although this number decays with each star spawned and is modified with a random number. The colors that stars can be are listed in the pallette array, and were here copied from <a href="http://www.vendian.org/mncharity/dir3/starcolor/">a list of real star surface colors</a> made by Michell Charity.</p>
    <p>Note: I haven't fully obsessed over the math of the spiral. This utilizes the Archimedean Spiral formula, but I had trouble shaping the spirals beyond guess-and-check. What you see as a few spiraling arms is the overlapping of many, very thin spirals with stars at regular angles apart.</p>
  --></div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import type { BaseType } from "d3";
import type { Ref } from "vue";

const starMax = 300,
  starCycle = 130,
  pallette = [
    "#9bb0ff",
    "#aabfff",
    "#cad7ff",
    "#f8f7ff",
    "#fff4ea",
    "#ffd2a1",
    "#ffcc6f",
  ],
  spiralAngle = d3.scaleLinear().domain([0, starMax]).range([0, 1080]);

// Selections
const eventResponder = d3.select("#event-responder"),
  galaxy: Ref<SVGSVGElement | null> = ref<SVGSVGElement | null>(null);
let space: d3.Selection<BaseType, unknown, HTMLElement, any>,
  newStar: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>,
  stars: d3.Selection<BaseType, unknown, HTMLElement, any>;

// Dynamic variables, counters
let starCount: number = 0,
  nebula: NodeJS.Timeout, // tracks timeouts so the animation can be reset
  // Turn off for mobile by default
  exists: Ref<boolean> = ref(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? false
      : true
  ),
  moving: Ref<boolean> = ref(true),
  twinkling: Ref<boolean> = ref(true);

// Generate stars at uneven intervals to sprinkle twinkles organically.
function generateStar(
  birthInterval: number,
  starSelection: d3.Selection<BaseType, unknown, HTMLElement, any>
) {
  if (exists.value !== true) return;
  if (!newStar.empty()) {
    newStar.classed("new", false);
  }
  const coordinates = getSpiralCoordinates(starCount);
  newStar = starSelection
    .append("circle")
    .attr("cx", coordinates.x + Math.random() * 60 - Math.random() * 60)
    .attr("cy", coordinates.y + 200 + Math.random() * 60 - Math.random() * 60)
    .attr("r", 6)
    .attr("class", "new star")
    .style("fill", starColor());
  starCount++;
  if (starCount < starMax) {
    nebula = setTimeout(
      () => generateStar(birthInterval * 0.99, stars),
      Math.floor(Math.random() * birthInterval)
    );
  }
}

function toggleExistence() {
  if (exists.value) {
    clearTimeout(nebula);
    stars.selectAll(".star").remove();
    starCount = 0;
    exists.value = false;
  } else {
    exists.value = true;
    generateStar(starCycle, stars);
  }
  localStorage.setItem("galaxy-exists", String(exists.value));
}

function toggleGalaxyMotion() {
  if (galaxy.value) {
    if (moving.value) {
      // Thank you, https://webplatform.github.io/docs/svg/tutorials/smarter_svg_animation/
      galaxy.value.pauseAnimations();
      // logEventToUser("Motion paused");
      moving.value = false;
    } else {
      galaxy.value.unpauseAnimations();
      // logEventToUser("Moving again");
      moving.value = true;
    }
  }
  localStorage.setItem("galaxy-moving", String(moving.value));
}

function toggleTwinkle() {
  if (twinkling.value) {
    // logEventToUser("They will not twinkle");
    twinkling.value = false;
  } else {
    // logEventToUser("They twinkle again");
    twinkling.value = true;
  }
  localStorage.setItem("galaxy-twinkling", String(twinkling.value));
}

// Helper functions
function getSpiralCoordinates(starNumber: number) {
  const angle =
    spiralAngle(starNumber) * 0.5 + Math.random() * 0.2 - Math.random() * 0.2;
  return {
    x: (8 + angle) * Math.cos(angle),
    y: (8 + angle) * Math.sin(angle),
  };
}
function starColor() {
  return pallette[Math.floor(Math.random() * 7)];
}

// Local storage interfacing
function loadUserPreferences() {
  const existsPref = localStorage.getItem("galaxy-exists"),
    movingPref = localStorage.getItem("galaxy-moving"),
    twinklingPref = localStorage.getItem("galaxy-twinkling");
  if (existsPref && existsPref === "false") {
    exists.value = false;
  }
  if (movingPref && movingPref === "false") {
    moving.value = false;
    if (galaxy.value) {
      galaxy.value.pauseAnimations();
    }
  }
  if (twinklingPref && twinklingPref === "false") {
    twinkling.value = false;
  }
}

onMounted(() => {
  loadUserPreferences();

  (space = d3.select("#space")), (stars = space.select("#stars"));

  newStar = stars.select(".new.star");

  generateStar(starCycle, stars);
});
</script>

<style>
#space {
  width: 100%;
  height: 100%;
  background-color: #131318;
  /* background: linear-gradient(20deg, rgb(31, 4, 28) 0%, rgb(27, 57, 52) 100%); */
  background: linear-gradient(20deg, rgb(65, 6, 58) 0%, rgb(27, 57, 52) 100%);
  position: absolute;
  top: 0;
  left: 0;
  perspective: 1000px;
  z-index: -1;
}

#galaxy {
  transform: rotateX(65deg);
  overflow: visible;
  position: absolute;
  left: 50%;
  top: 15%;
  height: 50vh;
}

.star {
  fill: white;
  opacity: 0.7;
  transition: opacity 2s ease-in;
  filter: blur(3px);
  animation: 4s 2s twinkle infinite ease-out;
  animation-play-state: paused;
}

.twinkling .star {
  animation-play-state: running;
}

.star.new {
  opacity: 0;
}

@keyframes twinkle {
  0%,
  30%,
  100% {
    opacity: 0.6;
    filter: blur(3px);
  }
  10% {
    filter: blur(1px);
    opacity: 0.8;
  }
  ,
  45% {
    filter: blur(1px);
    opacity: 0.9;
  }
}
</style>
