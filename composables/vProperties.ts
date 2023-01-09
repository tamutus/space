// Surround components using this in ClientOnly (best Nuxt practice?)
export function useVProperties() {
  const vw = ref(window.innerWidth * 0.01),
    vh = ref(window.innerHeight * 0.01),
    vmax = ref(vw.value > vh.value ? vw.value : vh.value);

  function update() {
    vw.value = window.innerWidth * 0.01;
    vh.value = window.innerHeight * 0.01;
    vmax.value = vw.value > vh.value ? vw.value : vh.value;
  }

  useEventListener(window, "resize", update);

  return { vw, vh, vmax };
}
