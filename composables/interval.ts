export function useInterval(callback: Function, interval: number) {
  let existingInterval: number = 0;
  onMounted(() => {
    existingInterval = setInterval(callback, interval);
  });
  onUnmounted(() => clearInterval(existingInterval));
}
