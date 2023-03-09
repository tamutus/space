// Suffix components using this with .client.vue

import { Ref } from "vue";

export function useComponentRect(el: Ref<null | HTMLElement>) {
  const componentX = ref(0),
    componentY = ref(0);

  function update() {
    if (el?.value?.getBoundingClientRect) {
      const offset = el.value.getBoundingClientRect();
      componentX.value = offset.left;
      componentY.value = offset.top;
    }
  }

  useEventListener(window, "scroll", update);
  useEventListener(window, "resize", update);
  onMounted(async () => {
    await nextTick();
    update();
  });
  return { componentX, componentY };
}
