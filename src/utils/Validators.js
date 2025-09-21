import { dialogueStore, flowStore, translationsStore, runtimeState } from "@/stores";

const required = { test: (v) => !!v, errorText: "Required" };

export const nodeLabelValidators = {
  required: required,
  unique: {
    test: (v, el) =>
      !flowStore.state[runtimeState.selectedDialogue].nodes.some(
        (n) =>
          n.id !== el.target.id &&
          n.data.label.toLowerCase() === v.toLowerCase()
      ),
    errorText: "Must be unique",
  },
};

export const stringLabelValidators = {
  required: required,
  unique: {
    test: (v, el) =>
      !Object.keys(translationsStore.state.labels).some(
        (k) =>
          k !== el.target.id &&
          translationsStore.state.labels[k].toLowerCase() == v.toLowerCase()
      ),
    errorText: "Must be unique",
  },
};

export const languageCodeValidators = {
  required: required,
  unique: {
    test: (v) =>
      !translationsStore.state.languages.some(
        (l) => l.toLowerCase() == v.toLowerCase()
      ),
    errorText: "Must be unique",
  },
};

export const dialogueNameValidators = {
  required: required,
  unique: {
    test: (v) =>
      !dialogueStore.state.dialogues.some(
        (d) => d.name.toLowerCase() == v.toLowerCase()
      ),
    errorText: "Must be unique",
  },
};
