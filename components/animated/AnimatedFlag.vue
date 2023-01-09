<template>
  <div class="flag-holder">
    <div class="flag">
      <div class="top stripe animatedWave"></div>
      <div class="black colored stripe animatedWave"></div>
      <div class="purple colored stripe animatedWave"></div>
      <div class="white colored stripe animatedWave"></div>
      <div class="yellow colored stripe animatedWave"></div>
      <div class="bottom blank"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.flag-holder {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
.flag {
  height: 360px;
  min-height: 360px;
  width: 400px;
  min-width: 400px;
  text-align: center;
  margin: 10% auto 100px auto;
  transform: rotate(-30deg) skewX(20deg) translate(3vw, 1.5vw);
  overflow: hidden;
}
@media screen and (max-width: 950px) {
  .flag {
  }
}
.stripe {
  overflow: visible;
  height: 17%;
  /*   background-color: pink; */
  padding-bottom: 0px;
  padding-top: 0px;
  position: relative;
  /*   z-index: 1; */
}
.top.stripe {
  height: 14%;
  z-index: 5;
}
.top.stripe:before,
.top.stripe:after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -1px;
  height: 100%;
  background: radial-gradient(closest-side, #000, #000 50%, transparent 50%);
  background-size: 33.3333% 100%;
  background-position: 0px 0px;
  background-repeat: repeat-x;
}
.top.stripe:after {
  background: radial-gradient(closest-side, transparent 50%, #000 50%, #000);
  background-size: 33.3333% 100%;
  height: 100%;
  background-position: 100px -25px;
  background-repeat: repeat-x;
  bottom: -26px;
}
.colored.stripe:before,
.colored.stripe:after {
  content: "";
  position: absolute;
  /* left: -200deg; */
  height: 81.699%;
  right: 0;
  bottom: -81%;
  background-image: radial-gradient(
    closest-side,
    var(--stripe-color),
    var(--stripe-color) 50%,
    transparent 50%
  );
  background-size: 33.3333% 100%;
  background-position: 25% 0%;
  background-repeat: repeat-x;
}
.colored.stripe:after {
  background: radial-gradient(
    closest-side,
    transparent 50%,
    var(--stripe-color) 50%,
    var(--stripe-color)
  );
}
.black.stripe {
  height: 4.1667%;
  --stripe-color: #000;
  background-color: var(--stripe-color);
  z-index: 4;
}
.black.stripe:before,
.black.stripe:after {
  bottom: -333%;
  height: 333.3333%;
  background-size: 200px 50px;
  background-position: 100px 0px;
  background-repeat: repeat-x;
}
.black.stripe:after {
  height: 333.3333%;
  background-size: 33.3333% 100%;
  background-position: 0px 25px;
  background-repeat: repeat-x;
  bottom: -24px;
}
.purple.stripe {
  --stripe-color: #9c59d1;
  background-color: var(--stripe-color);
  z-index: 3;
}

.purple.stripe:after {
  background-size: 200px 50px;
  height: 50px;
  background-position: 0px 25px;
  background-repeat: repeat-x;
  bottom: -24px;
}
.white.stripe {
  --stripe-color: white;
  background-color: var(--stripe-color);
  z-index: 2;
}
.white.stripe:after {
  background-size: 200px 50px;
  height: 50px;
  background-position: 0px 25px;
  background-repeat: repeat-x;
  bottom: -24px;
}
.yellow.stripe {
  --stripe-color: #fff430;
  background-color: var(--stripe-color);
  z-index: 1;
}
.yellow.stripe:after {
  background-size: 200px 50px;
  height: 50px;
  background-position: 0px 25px;
  background-repeat: repeat-x;
  bottom: -24px;
}
.animatedWave:before,
.animatedWave:after {
  left: -200px;
  animation: animateWave 2s linear infinite;
}
@keyframes animateWave {
  to {
    transform: translateX(200px);
  }
}
.blank {
  height: 50px;
  background-color: transparent;
}
</style>
