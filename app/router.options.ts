import type { RouterConfig } from "@nuxt/schema";
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (to.hash) {
          resolve({
            el: to.hash,
            behavior: "smooth",
          });
        } else if (savedPosition) {
          resolve({
            ...savedPosition,
            behavior: "smooth",
          });
        } else if (to.path === from.path && from.path === "/furry/gaze") {
          resolve({});
        } else {
          resolve({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      }, 0);
    });
  },
};
