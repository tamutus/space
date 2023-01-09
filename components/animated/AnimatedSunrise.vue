<template>
  <div id="sunrise">
    <div id="sky">
      <div id="cloud1" class="cloud">
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
      </div>
      <div id="cloud2" class="cloud">
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
      </div>
      <div id="cloud3" class="cloud">
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
        <div class="fluff"></div>
      </div>
      <div class="sun horizontal">
        <div class="sun vertical"></div>
      </div>
    </div>
    <div id="ground"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#sunrise {
  min-width: 50vw;
  flex-grow: 1;
  height: 55vh;
  position: static;
  overflow: hidden;
  margin: auto;
}
#sky {
  width: 100%;
  height: 67%;
  margin: none;
  padding: none;
  background-color: skyblue;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation-name: day-cycle;
  animation-duration: 10s;
  animation-iteration-count: infinite;
}
#ground {
  width: 100%;
  height: 33%;
  background-color: green;
  position: relative;
  z-index: 3;
  animation: ground-cycle 10s infinite;
}
.sun {
  animation-iteration-count: infinite;
  position: absolute;
  z-index: 2;
  overflow-x: hidden;
}
.sun.horizontal {
  position: absolute;
  bottom: -30%;
  width: 20%;
  height: 130%;
  left: 0;
  animation-name: sun-lateral;
  animation-duration: 10s;
}
.sun.vertical {
  background-color: #fff8c4;
  width: 20%;
  padding-top: 20%;
  bottom: 0;
  border-radius: 50%;
  animation-name: sun-rising;
  animation-duration: 5s;
  animation-direction: alternate;
  /* overflow-y: visible; */
}
.cloud {
  width: 10%;
  padding-top: 5%;
  position: absolute;
  animation: float-scroll 15s linear infinite 0s;
  z-index: 4;
}
.fluff {
  width: 67%;
  padding-top: 67%;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  animation: fluffy 4s linear 0s infinite;
}
.fluff:nth-child(1) {
  left: 0px;
  bottom: 0;
  /* border: 2px solid #ccfffd; */
}
.fluff:nth-child(2) {
  left: 25%;
  bottom: -20%;
  border: 2px solid #ccfffd;
  animation: fluffy 4s linear 0.5s infinite, cloud-border-cycle 10s infinite 0s;
}
.fluff:nth-child(3) {
  width: 90%;
  padding-top: 100%;
  left: 40%;
  bottom: -20%;
  animation-delay: 2s;
}
.fluff:nth-child(4) {
  left: 75%;
  width: 100%;
  bottom: 0;
  animation-delay: 1s;
}
#cloud1 {
  top: 20%;
}
#cloud2 {
  top: 35%;
  animation-delay: 5s;
  animation-fill-mode: backwards;
}
#cloud3 {
  top: 28%;
  animation-delay: 9s;
  animation-fill-mode: backwards;
}
@keyframes sun-lateral {
  0% {
    transform: translateX(0);
    animation-timing-function: ease-in;
  }
  50% {
    transform: translateX(250%);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateX(500%);
  }
}
@keyframes sun-rising {
  0%,
  25% {
    background-color: #fa325a;
    transition: background-color;
    transition-timing-function: ease-in;
  }
  40% {
    background-color: #fc9b3a;
    transition: background-color;
    transition-timing-function: ease-in;
  }
  50% {
    background-color: #fcb53a;
    transition: background-color;
    transition-timing-function: ease-out;
  }
  60% {
    background-color: yellow;
    transition: background-color;
    transition-timing-function: ease;
  }
  70% {
    background-color: #fff8c4;
    transition-timing-function: ease;
  }
  100% {
    transform: translateY(-25vh);
  }
}
@keyframes day-cycle {
  0%,
  100% {
    background-color: #3a1982;
  }
  10%,
  90% {
    background-color: #9135b0;
  }
  40%,
  60% {
    background-color: #7dd3f5;
  }
}
@keyframes fluffy {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(0.9);
  }
  40% {
    transform: scale(1.1);
  }
  60% {
    transform: scaleX(0.95);
  }
  70% {
    transform: scale(1.05, 0.95);
  }
  80% {
    transform: scaleX(1);
  }
  90% {
    transform: scaleY(1.05);
  }
}
@keyframes float-scroll {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(1000%);
  }
}
@keyframes ground-cycle {
  0%,
  100% {
    background-color: #073d2b;
  }
  10%,
  90% {
    background-color: #117352;
  }
  40%,
  60% {
    background-color: #02ab3a;
  }
}
@keyframes cloud-border-cycle {
  0%,
  100% {
    border-color: #3a1982;
  }
  10%,
  90% {
    border-color: #9135b0;
  }
  40%,
  60% {
    border-color: #7dd3f5;
  }
}
</style>
