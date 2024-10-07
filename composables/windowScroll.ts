// Suffix components using this with .client.vue
export function useWindowScroll(
  options: AddEventListenerOptions = { passive: true }
) {
  const scrollX = ref(0),
    scrollY = ref(0);

  function update() {
    scrollX.value = window.scrollX;
    scrollY.value = window.scrollY;
  }

  useEventListener(window, "scroll", update, options);
  useEventListener(window, "resize", update);

  return { scrollX, scrollY };
}
