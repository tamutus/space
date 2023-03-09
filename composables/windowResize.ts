// Suffix components using this with .client.vue
export function useWindowResize() {
  const winX = ref(1920),
    winY = ref(1080);

  function update() {
    winX.value = window.innerWidth;
    winY.value = window.innerHeight;
  }

  useEventListener(window, "resize", update);

  return { winX, winY };
}
