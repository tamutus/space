<template>
  <div id="app-box">
    <NavBar />
    <NavAuth />
    <NuxtPage />
  </div>
  <footer>
    <ImageLogo logoSize="small" alignment="right">
      <div>
        <p>Website created by Lavra Tamutus.</p>
        <div id="boring-links">
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
          <NuxtLink to="/tos">Terms of Service</NuxtLink>
        </div>
      </div>
    </ImageLogo>
  </footer>
</template>

<script setup lang="ts"></script>

<style>
#app-box {
}
/* animation classes */

#boring-links > * {
  margin-left: 1rem;
  margin-right: 1rem;
}

/* ensure leaving items are taken out of layout flow so that moving
animations can be calculated correctly. */
.page-leave-active {
  transition: opacity 0.3s 0.3s, filter 0.3s 0.3s;
  position: absolute;
  width: 100vw;
  height: 0;
}
.page-leave-active .bg {
  transition: border-bottom 0.2s;
}
.page-leave-active .bg > * {
  transition: opacity 0.2s, filter 0.2s;
}
.page-enter-active {
  width: 100%;
  transition: opacity 0.6s, filter 0.4s;
}
.page-enter-active .bg {
  transition: border-bottom 0.2s 0.4s;
}
.page-enter-active .bg > * {
  transition: opacity 0.3s 0.3s, filter 0.3s 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(35px) grayscale(2);
}
.page-enter-from .bg,
.page-leave-to .bg {
  border-bottom: 20px solid rgba(27, 27, 27, 0);
}
.page-enter-from .bg > *,
.page-leave-to .bg > * {
  opacity: 0;
  filter: blur(35px);
}
</style>
