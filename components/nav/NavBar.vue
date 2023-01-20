<template>
  <nav
    id="nav-main"
    :style="navDimensions"
    :class="menuOpen ? '' : 'collapsed'"
  >
    <button id="navToggler" @click="toggleNav()" :style="togglerStyle">
      <img src="https://img.icons8.com/nolan/64/geometric-flowers.png" />
    </button>
    <ul>
      <li v-for="menuItem of menuItems" :style="menuItem.style.value">
        <NuxtLink
          :class="`menu-item ${menuItem.link === currentPath ? 'focused' : ''}`"
          :to="menuItem.link"
          :tabindex="menuOpen ? '0' : '-1'"
          >{{ menuItem.title }}</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { Ref } from "vue";

const route = useRoute();
const currentPath = ref(route.path);
const { winX, winY } = useWindowResize();
const { scrollY } = useWindowScroll();

const menuOpen: Ref<boolean> = ref(true);
const menuOpenedAtScroll: Ref<number | undefined> = ref(undefined);
// const menuOpenedAtWidth: Ref<number | undefined> = ref(undefined);

const menuOrientation = computed(() => {
  if (winX.value < 990) {
    return "vertical";
  } else {
    return "horizontal";
  }
});

const navDimensions = computed(() => {
  if (menuOrientation.value === "horizontal") {
    return {
      height: "4rem",
      width: "20rem",
    };
  } else {
    return {
      height: "8rem",
      width: "calc(80px + 8rem)",
      translate: "0px -8rem",
      rotate: "-90deg",
    };
  }
});
const togglerStyle = computed(() => {
  if (menuOrientation.value === "vertical") {
    return {
      top: "calc(4rem - 32px)",
      right: "10px",
      rotate: "90deg",
    };
  } else {
    return {};
  }
});

const galleryStyle = computed(() => {
  if (menuOrientation.value === "horizontal") {
    return {
      top: "1rem",
      right: "280px",
    };
  } else {
    return {
      top: "3rem",
      right: "calc(40px + 6rem)",
      rotate: "90deg",
    };
  }
});
const hubStyle = computed(() => {
  if (menuOrientation.value === "horizontal") {
    return {
      top: "1rem",
      right: "210px",
    };
  } else {
    return {
      top: "3rem",
      right: "calc(40px + 4.5rem)",
      rotate: "90deg",
    };
  }
});
const commissionStyle = computed(() => {
  if (menuOrientation.value === "horizontal") {
    return {
      top: "1rem",
      right: "60px",
    };
  } else {
    return {
      top: "3rem",
      right: "40px",
      rotate: "90deg",
    };
  }
});
const menuItems = [
  {
    title: "Hub",
    link: "/",
    style: hubStyle,
  },
  {
    title: "Gallery",
    link: "/gallery",
    style: galleryStyle,
  },
  {
    title: "Commission",
    link: "/commission",
    style: commissionStyle,
  },
];

watch(scrollY, (verticalScroll) => {
  if (menuOpen.value === true) {
    if (menuOpenedAtScroll.value) {
      if (
        Math.abs(verticalScroll - menuOpenedAtScroll.value) >
        (winY.value * 3) / 4
      ) {
        toggleNav();
      }
    }
  }
});
watch(
  () => route.path,
  async (newPath) => {
    currentPath.value = newPath;
  }
);

function toggleNav() {
  if (menuOpen.value === true) {
    menuOpen.value = false;
    menuOpenedAtScroll.value = undefined;
  } else {
    menuOpen.value = true;
    menuOpenedAtScroll.value = scrollY.value;
  }
}
</script>

<style scoped>
#nav-main {
  position: fixed;
  border-radius: 10%;
  top: 10px;
  right: 10px;
  z-index: 11;
  justify-content: flex-end;
  align-items: center;
  transform-origin: bottom right;
  transition: translate 0.7s, transform 0.8s, background-color 1.5s, width 0.8s,
    height 0.8s, rotate 0.8s;
  background-color: rgba(61, 4, 87, 0.85);
}
#nav-main li {
  position: absolute;
  margin: auto 20px auto 20px;
  list-style: none;
  opacity: 1;
  transition: top 0.8s, right 0.8s, transform 0.8s, opacity 0.5s, rotate 0.8s;
}
#nav-main li a {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(228, 195, 255);
  -webkit-text-stroke-width: 0;
  transition: color 0.2s ease-out;
  text-decoration: none;
}
#nav-main li a:hover {
  color: rgb(255, 157, 178);
}
#nav-main li a.focused {
  color: rgb(144, 250, 162);
}

#navToggler {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 0;
  background: none;
  border: none;
  transform: translate(0, 0);
  transition: transform 0.3s cubic-bezier(0.275, 1.64, 0.545, 1.65),
    rotate 0.3s cubic-bezier(0.275, 1.64, 0.545, 1.65),
    top 0.3s cubic-bezier(0.275, 1.64, 0.545, 1.65);
  pointer-events: all;
}
#navToggler:active {
  -webkit-transform: translateY(3px);
  -ms-transform: translateY(3px);
  transform: translateY(3px);
}
#navToggler img {
  filter: grayscale(80%) brightness(170%);
  -webkit-transition: -webkit-filter 0.6s;
  transition: -webkit-filter 0.6s;
  -o-transition: filter 0.6s;
  transition: filter 0.6s;
  transition: filter 0.6s, -webkit-filter 0.6s;
  animation: flowerPower 10s 50ms infinite linear paused;
}
#navToggler img:hover,
#navToggler:focus img {
  filter: none;
}
#navToggler img:hover {
  -webkit-animation-play-state: running;
  animation-play-state: running;
}
@-webkit-keyframes flowerPower {
  0% {
    -webkit-transform: rotate(0deg) translate(0px, 0px);
    transform: rotate(0deg) translate(0px, 0px);
  }
  25% {
    -webkit-transform: rotate(90deg) translate(3px, 0px);
    transform: rotate(90deg) translate(3px, 0px);
  }
  50% {
    -webkit-transform: rotate(180deg) translate(0px, 0px);
    transform: rotate(180deg) translate(0px, 0px);
  }
  75% {
    -webkit-transform: rotate(270deg) translate(-3px, 0px);
    transform: rotate(270deg) translate(-3px, 0px);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(0px, 0px);
    transform: rotate(360deg) translate(0px, 0px);
  }
}
@keyframes flowerPower {
  0% {
    -webkit-transform: rotate(0deg) translate(0px, 0px);
    transform: rotate(0deg) translate(0px, 0px);
  }
  25% {
    -webkit-transform: rotate(90deg) translate(3px, 0px);
    transform: rotate(90deg) translate(3px, 0px);
  }
  50% {
    -webkit-transform: rotate(180deg) translate(0px, 0px);
    transform: rotate(180deg) translate(0px, 0px);
  }
  75% {
    -webkit-transform: rotate(270deg) translate(-3px, 0px);
    transform: rotate(270deg) translate(-3px, 0px);
  }
  100% {
    -webkit-transform: rotate(360deg) translate(0px, 0px);
    transform: rotate(360deg) translate(0px, 0px);
  }
}
#nav-main.collapsed {
  background-color: rgba(227, 203, 241, 0);
  pointer-events: none;
}
#nav-main.collapsed li {
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
  opacity: 0;
  -webkit-transition: opacity 1.5s, -webkit-transform 1.5s;
  transition: opacity 1.5s, -webkit-transform 1.5s;
  -o-transition: transform 1.5s, opacity 1.5s;
  transition: transform 1.5s, opacity 1.5s;
  transition: transform 1.5s, opacity 1.5s, -webkit-transform 1.5s;
}
</style>
