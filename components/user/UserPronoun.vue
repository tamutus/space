<template>
  <span :title="pronunciation">{{ chosenMorpheme }}</span>
</template>

<script setup lang="ts">
import { usePronouns } from "@/composables/usePronouns";

const props = defineProps({
  pronoun: {
    type: String,
    default: "they",
  },
  morpheme: {
    default: "subject",
    validator(morph: string) {
      return [
        "subject",
        "object",
        "possessive",
        "possessor",
        "reflexive",
      ].includes(morph);
    },
  },
});
const pronounData = await usePronouns(props.pronoun);

const formalMorpheme = computed(() => {
  if (props.morpheme === "object") {
    return "pronoun_object";
  } else if (props.morpheme === "possessive") {
    return "possessive_determiner";
  } else if (props.morpheme === "possessor") {
    return "possessive_pronoun";
  } else if (props.morpheme === "reflexive") {
    return "reflexive";
  } else {
    return "pronoun_subject";
  }
});

const chosenMorpheme = computed(() => {
  return pronounData.value.morphemes[formalMorpheme.value];
});
const pronunciation = computed<string>(() => {
  return (
    pronounData.value.pronunciations[formalMorpheme.value] ??
    chosenMorpheme.value
  );
});
</script>
