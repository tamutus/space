// Suffix components using this with .client.vue
export function useVProperties() {
  const vw = ref(19),
    vh = ref(10),
    vmax = ref(vw.value > vh.value ? vw.value : vh.value);

  function update() {
    vw.value = window.innerWidth * 0.01;
    vh.value = window.innerHeight * 0.01;
    vmax.value = vw.value > vh.value ? vw.value : vh.value;
  }

  useEventListener(window, "resize", update);
  onMounted(() => {
    update();
  });
  return { vw, vh, vmax };
}
