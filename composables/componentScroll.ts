import { Ref } from "nuxt/dist/app/compat/capi";

// Surround components using this in ClientOnly (best Nuxt practice?)
export function useComponentRect(el: Ref) {
  const componentX = ref(0),
    componentY = ref(0);

  function update() {
    const offset = el.value.getBoundingClientRect();
    componentX.value = offset.left;
    componentY.value = offset.top;
  }

  useEventListener(window, "scroll", update);
  useEventListener(window, "resize", update);

  return { componentX, componentY };
}
