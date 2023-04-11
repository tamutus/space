import { Ref } from "vue";

export function cssVar(
  target: Ref | null,
  name: string,
  newValue?: string
): string {
  if (name.substring(0, 2) !== "--") {
    name = "--" + name;
  }

  if (newValue) {
    if (target?.value?.style) {
      target.value.style.setProperty(name, newValue);
    } else {
      document.documentElement.style.setProperty(name, newValue);
    }
  }

  if (target?.value?.style) {
    return getComputedStyle(target.value).getPropertyValue(name);
  } else {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  }
}
