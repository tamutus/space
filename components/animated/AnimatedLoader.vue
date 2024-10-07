<template>
  <div id="sample-loading-animation">
    <div id="loader">
      <div class="squares">
        <div :class="squareClass">
          <h3 v-if="status === 'loading'">Loading</h3>
          <h3 v-else-if="status === 'unloading'">O:</h3>
          <span v-else-if="status === 'complete'">
            <h3>C</h3>
            <h3>O</h3>
          </span>
          <h3 v-else>Here</h3>
        </div>
        <div :class="squareClass">
          <span v-if="status === 'complete'">
            <h3>M</h3>
            <h3>P</h3>
          </span>
          <h3 v-else-if="status === 'reloading'">we</h3>
        </div>
        <div :class="squareClass">
          <span v-if="status === 'complete'">
            <h3>L</h3>
            <h3>E</h3>
          </span>
          <h3 v-else-if="status === 'reloading'">go</h3>
        </div>
        <div :class="squareClass">
          <span v-if="status === 'complete'">
            <h3>T</h3>
            <h3>E</h3>
          </span>
          <h3 v-else-if="status === 'reloading'">again...</h3>
        </div>
      </div>
      <div class="button-box">
        <button id="completeButton" @click="toggleLoading">
          {{
            status === "loading" || status === "unloading"
              ? "Finish Loading"
              : "Reload"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const status = ref<string>("loading");
const squareClass = computed(() => ({
  loading: status.value === "loading" || status.value === "unloading",
  unloading: status.value === "unloading",
  complete: status.value === "complete" || status.value === "reloading",
  reloading: status.value === "reloading",
  square: true,
}));

function toggleLoading() {
  switch (status.value) {
    case "unloading":
    case "reloading":
      break;
    case "loading":
      status.value = "unloading";
      useTimeout(() => {
        status.value = "complete";
      }, 1500);
      break;
    case "complete":
      status.value = "reloading";
      useTimeout(() => {
        status.value = "loading";
      }, 1500);
      break;
  }
}
</script>

<style scoped>
#sample-loading-animation {
  height: 100%;
  width: 100%;
}
#loader {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  transition: height 0.5s, width 0.5s;
}
.squares {
  position: relative;
  flex: 0 0 0;
  width: 26vw;
  margin: 75px auto;
  left: 11%;
}
.square {
  position: absolute;
  opacity: 1;
  width: 50%;
  height: 50%;
  padding-top: 25%;
  padding-bottom: 25%;
  transform-origin: center;
  text-align: center;
  animation-fill-mode: forwards;
  transition-duration: 1s;
}
.square > * {
  position: absolute;
  width: 100%;
  transform: rotate(-90deg);
  translate: 0 -50%;
}
.square h3 {
  margin: auto;
  text-align: center;
  font-family: "Comfortaa", cursive;
  font-size: 1rem;
  transition-duration: 1s;
  margin: 0;
  word-break: break-word;
}
@media screen and (max-width: 800px) {
  .square h3 {
    font-size: 14px;
  }
}
.button-box {
  align-self: flex-start;
  padding-left: 50px;
}
#completeButton {
  position: relative;
  left: 10%;
  bottom: 20px;
  padding: 10px;
  width: 200px;
  font-size: 27px;
  font-family: "Cabin", sans-serif;
  text-align: center;
  color: white;
  background-color: #c098d4;
  border: 3px outset #9567ab;
  border-radius: 13px;
  outline: none !important;
  box-shadow: 0px 5px #31183d;
  transition: transform 0.2s cubic-bezier(0.275, 1.64, 0.545, 1.65),
    box-shadow 0.2s cubic-bezier(0.275, 1.64, 0.545, 1.65);
}
#completeButton:hover {
  box-shadow: 0px 3px #25132e;
  transform: translateY(2px);
}
#completeButton:active {
  box-shadow: none;
  transform: translateY(5px);
}
@media screen and (max-width: 1200px) {
  #completeButton {
    height: 70px;
    width: 140px;
    font-size: 19px;
  }
}
@media screen and (max-width: 620px) {
  #completeButton {
    height: 60px;
    width: 120px;
    font-size: 16px;
  }
}
#loader .square:nth-child(1) {
  z-index: 4;
}
#loader .square:nth-child(2) {
  z-index: 3;
}
#loader .square:nth-child(3) {
  z-index: 2;
}
#loader .square:nth-child(4) {
  z-index: 1;
}
#loader .square span {
  display: flex;
  justify-content: space-around;
}
.loading.square {
  background-color: #ad82cf;
  animation-duration: 7s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
}
.loading.square:nth-child(1) {
  top: 0;
  left: 0;
  animation-name: square1;
}
.loading.square:nth-child(2) {
  top: 0%;
  left: 0%;
  animation-name: square2;
}
.loading.square:nth-child(3) {
  top: 0%;
  left: 0;
  animation-name: square3;
}
.loading.square:nth-child(4) {
  top: 0%;
  left: 0%;
  animation-name: square4;
}
@keyframes square1 {
  0% {
    transform: translate(0, 0);
  }
  5% {
    transform: rotate(45deg);
    box-shadow: 0px 0px 20px 20px rgba(224, 249, 255, 0.3);
  }
  10% {
    box-shadow: none;
  }
  15% {
    transform: rotate(45deg) translate(99%, 0%);
    box-shadow: 0px 0px 10px 5px rgba(224, 249, 255, 0.3);
  }
  20% {
    box-shadow: none;
  }
  25% {
    transform: rotate(45deg) translate(99%, 99%);
    box-shadow: 0px 0px 10px 5px rgba(224, 249, 255, 0.3);
  }
  30% {
    box-shadow: none;
  }
  35% {
    transform: rotate(45deg) translate(0%, 99%);
    box-shadow: 0px 0px 10px 5px rgba(224, 249, 255, 0.3);
  }
  40% {
    box-shadow: none;
  }
  45%,
  75% {
    transform: rotate(45deg) translate(0, 0);
    box-shadow: 0px 0px 20px 20px rgba(224, 249, 255, 0.3);
  }
  50%,
  60%,
  70% {
    box-shadow: none;
  }
  55%,
  65%,
  75% {
    box-shadow: 0px 0px 10px 5px rgba(224, 249, 255, 0.3);
  }
  80% {
    transform: rotate(90deg);
    background-color: #ad82cf;
    border-radius: 0;
    box-shadow: none;
  }
  90% {
    transform: rotate(90deg) translateY(-50%);
    background-color: #84dba7;
    animation-timing-function: linear;
    border-radius: 30%;
    box-shadow: 0px 0px 20px 20px rgba(224, 249, 255, 0.3);
  }
  96% {
    background-color: #ad82cf;
    transform: rotate(0) translateY(0);
    border-radius: 0;
    box-shadow: none;
  }
}
@keyframes square2 {
  0% {
    transform: translate(0, 0);
  }
  5%,
  15% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(45deg) translate(99%, 0%);
  }
  35% {
    transform: rotate(45deg) translate(99%, 99%);
  }
  45% {
    transform: rotate(45deg) translate(0%, 99%);
  }
  55%,
  75% {
    transform: rotate(45deg) translate(0, 0);
  }
  80% {
    transform: rotate(90deg);
    background-color: #ad82cf;
    border-radius: 0%;
  }
  90% {
    transform: rotate(90deg) translateX(-50%);
    background-color: #a0dafa;
    animation-timing-function: linear;
    border-radius: 30%;
  }
  96% {
    background-color: #ad82cf;
    transform: rotate(0) translateX(0);
    border-radius: 0%;
  }
}
@keyframes square3 {
  0% {
    transform: translate(0, 0);
  }
  5%,
  25% {
    transform: rotate(45deg);
  }
  35% {
    transform: rotate(45deg) translate(99%, 0%);
  }
  45% {
    transform: rotate(45deg) translate(99%, 99%);
  }
  55% {
    transform: rotate(45deg) translate(0%, 99%);
  }
  65%,
  75% {
    transform: rotate(45deg) translate(0, 0);
  }
  80% {
    transform: rotate(90deg);
    background-color: #ad82cf;
    border-radius: 0;
  }
  90% {
    transform: rotate(90deg) translateY(50%);
    background-color: #e0bbfc;
    animation-timing-function: linear;
    border-radius: 30%;
  }
  96% {
    background-color: #ad82cf;
    transform: rotate(0) translateY(0);
    border-radius: 0;
  }
}
@keyframes square4 {
  0% {
    transform: translate(0, 0);
  }
  5%,
  35% {
    transform: rotate(45deg);
  }
  45% {
    transform: rotate(45deg) translate(99%, 0%);
  }
  55% {
    transform: rotate(45deg) translate(99%, 99%);
  }
  65% {
    transform: rotate(45deg) translate(0%, 99%);
  }
  75% {
    transform: rotate(45deg) translate(0, 0);
  }
  80% {
    transform: rotate(90deg);
    background-color: #ad82cf;
    border-radius: 0;
  }
  90% {
    transform: rotate(90deg) translateX(50%);
    background-color: #fbccff;
    animation-timing-function: linear;
    border-radius: 30%;
  }
  96% {
    background-color: #ad82cf;
    transform: rotate(0) translateX(0);
    border-radius: 0;
  }
}

.unloading.square {
  animation-play-state: paused !important;
  opacity: 0 !important;
  transition: 1s all !important;
  transition-delay: 0.5s !important;
}

.complete.square {
  opacity: 1;
  transition: 1s !important;
  animation-duration: 2s;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
  transform: translate(0, 0);
  background-color: #65db80;
  /* animation-delay: 1s; */
}
.complete.square:nth-child(1) {
  animation-name: load-complete-1;
}
.complete.square:nth-child(2) {
  animation-name: load-complete-2;
}
.complete.square:nth-child(3) {
  animation-name: load-complete-3;
}
.complete.square:nth-child(4) {
  animation-name: load-complete-4;
}
@keyframes load-complete-1 {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-170%, 0);
  }
  55% {
    transform: rotate(45deg) translate(-120%, 120%);
  }
  85% {
    transform: rotate(90deg) translate(0, 170%);
  }
  100% {
    transform: rotate(90deg) translate(30%, 170%);
  }
}
@keyframes load-complete-2 {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: rotate(0) translate(-57%, 0);
  }
  55% {
    transform: rotate(45deg) translate(-40.1%, 40.1%);
  }
  85% {
    transform: rotate(90deg) translate(0, 57%);
  }
  100% {
    transform: rotate(90deg) translate(30%, 57%);
  }
}
@keyframes load-complete-3 {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: rotate(0) translate(57%, 0);
  }
  55% {
    transform: rotate(45deg) translate(40.1%, -40.1%);
  }
  85% {
    transform: rotate(90deg) translate(0, -57%);
  }
  100% {
    transform: rotate(90deg) translate(30%, -57%);
  }
}
@keyframes load-complete-4 {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: rotate(0) translate(170%, 0);
  }
  55% {
    transform: rotate(45deg) translate(120%, -120%);
  }
  85% {
    transform: rotate(90deg) translate(0, -170%);
  }
  100% {
    transform: rotate(90deg) translate(30%, -170%);
  }
}
.reloading.square {
  animation-play-state: paused !important;
  opacity: 0 !important;
  transition: all 1s !important;
  transition-delay: 0.5s !important;
}
</style>
