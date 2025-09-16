import { dialogueStore } from "@/stores";

let dialogueCounter;
const makeDialogueName = () => {
  if (!dialogueCounter) {
    dialogueCounter = dialogueStore.state.dialogues.length;
  }
  let newName = 0;
  const dialogueNames = dialogueStore.state.dialogues.map((d) => d.name);
  do {
    newName = "Dialogue " + dialogueCounter.toString(10);
    dialogueCounter++;
  } while (dialogueNames.includes(newName));
  return newName;
};

export { makeDialogueName };
