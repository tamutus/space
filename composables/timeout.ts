export function useTimeout(callback: Function, delay: number) {
  const timeoutId = setTimeout(callback, delay);

  // Clear timeout on unmount to prevent memory leaks
  onUnmounted(() => clearTimeout(timeoutId));

  return {
    timeoutId,
    cancel: () => clearTimeout(timeoutId),
  };
}
