// Surround components using this in ClientOnly (best Nuxt practice?)
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
