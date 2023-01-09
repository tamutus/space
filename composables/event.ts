import { onMounted, onUnmounted } from "vue";

export function useEventListener(
  target: any,
  event: string,
  callback: Function
) {
  onMounted(() => {
    callback();
    target.addEventListener(event, callback);
  });
  onUnmounted(() => target.removeEventListener(event, callback));
}
