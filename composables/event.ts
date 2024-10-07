function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce(func: Function, delay: number) {
  let timeoutId: number;
  return function () {
    const args = arguments;
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = useTimeout(() => {
      func.apply(context, args);
    }, delay).timeoutId;
  };
}

export function useEventListener(
  target: any,
  event: string,
  callback: Function,
  options?: AddEventListenerOptions,
  mode: "throttle" | "debounce" = "throttle", // Choose mode
  wait: number = 200 // Time in ms
) {
  const wrappedCallback =
    mode === "throttle" ? throttle(callback, wait) : debounce(callback, wait);
  onMounted(() => {
    target.addEventListener(event, wrappedCallback, options);
  });
  onUnmounted(() => target.removeEventListener(event, wrappedCallback));
}
