export type Pronoun = {
  canonicalName: string;
  description: string;
  normative: boolean;
  morphemes: {
    pronoun_subject: string;
    pronoun_object: string;
    possessive_determiner: string;
    possessive_pronoun: string;
    reflexive: string;
  };
  pronunciations: any;
  plural: boolean[];
  pluralHonorific: boolean[];
  aliases: string[];
  history: string;
  pronounceable: boolean;
  thirdForm: string | null;
  smallForm: string | null;
  sourcesInfo: string | null;
  examples: string[];
  name: string;
};

const defaultPronounData = () => ({
  canonicalName: "they",
  description: "Singular “they”",
  normative: true,
  morphemes: {
    pronoun_subject: "they",
    pronoun_object: "them",
    possessive_determiner: "their",
    possessive_pronoun: "theirs",
    reflexive: "themselves",
  },
  pronunciations: {},
  plural: [true],
  pluralHonorific: [true],
  aliases: ["they/them"],
  history:
    "Singular “they” has been used in English to describe an unspecified person {https://www.academicwritingsuccess.com/the-astonishing-history-of-singular-they/=since the late 1300s} (it's even older than singular “you”!). Nowadays, it's the most popular choice among people who prefer gender neutral forms. It starts being {https://www.merriam-webster.com/words-at-play/singular-nonbinary-they=accepted by dictionaries} too.@It is also common to use {/they/them/themself=“themself”} as a reflexive form.",
  pronounceable: true,
  thirdForm: null,
  smallForm: "reflexive",
  sourcesInfo:
    "This list of sources includes both the version with {/they=“themselves”} and {/they/them/themselves=“themself”}, as well as those that don't happen to use reflexive.",
  examples: [
    "I think they are very nice.",
    "I asked them if I can borrow their pencil.",
    "They told me that the house is theirs.",
    "They said they would rather do it themselves.",
  ],
  name: "they/them",
});

export async function usePronouns(subjectPronoun: string) {
  const { data: pronounData } = await useFetch(
    `https://en.pronouns.page/api/pronouns/${subjectPronoun}`
  );
  if (hasPronounData(pronounData)) {
    return pronounData;
  } else return ref(defaultPronounData());
}

function hasPronounData(
  apiResponse: Ref<unknown>
): apiResponse is Ref<Pronoun> {
  return (<Pronoun>apiResponse.value)?.morphemes !== undefined;
}
