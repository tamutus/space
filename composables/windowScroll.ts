// Suffix components using this with .client.vue
export function useWindowScroll() {
  const scrollX = ref(0),
    scrollY = ref(0);

  function update() {
    scrollX.value = window.scrollX;
    scrollY.value = window.scrollY;
  }

  useEventListener(window, "scroll", update);
  useEventListener(window, "resize", update);

  return { scrollX, scrollY };
}
