import { dialogueStore, runtimeState, translationsStore } from "@/stores";

let counter;
const makeStringLabel = () => {
  if (!counter) {
    counter = Object.keys(translationsStore.state.labels).length + 1;
  }
  let newLabel = "";
  do {
    const suffix = String(counter).padStart(4, "0");
    let prefix = dialogueStore.state.dialogues.find(d=>d.id==runtimeState.selectedDialogue).name;
    prefix = prefix.replace(" ", "_");
    newLabel = `${prefix}_${suffix}`;
    counter++;
  } while (Object.values(translationsStore.state.labels).includes(newLabel));
  return newLabel;
};

export { makeStringLabel };
