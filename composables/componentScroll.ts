// Suffix components using this with .client.vue

export function useComponentRect(
  el: Ref<null | HTMLElement>,
  options: AddEventListenerOptions = { passive: true }
) {
  const componentX = ref(0),
    componentY = ref(0),
    componentX2 = ref(0),
    componentY2 = ref(0);

  function update() {
    if (el?.value?.getBoundingClientRect) {
      const offset = el.value.getBoundingClientRect();
      componentX.value = offset.left;
      componentY.value = offset.top;
      componentX2.value = offset.right;
      componentY2.value = offset.bottom;
    }
  }

  useEventListener(window, "scroll", update, options);
  useEventListener(window, "resize", update, options);
  onMounted(async () => {
    await nextTick();
    update();
  });
  return { componentX, componentY, componentX2, componentY2 };
}
