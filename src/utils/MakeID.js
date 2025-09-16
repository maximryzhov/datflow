// In case I need to change how object IDs are generated
import {
  runtimeState,
  flowStore,
  dialogueStore,
  translationsStore,
  counterStore,
} from "@/stores";

let dialogueCounter;
const makeDialogueId = () => {
  if (!dialogueCounter) {
    dialogueCounter = dialogueStore.state.dialogues.length + 1;
  }
  let newId;
  const dialogueIds = dialogueStore.state.dialogues.map((d) => d.id);
  do {
    newId = dialogueCounter.toString(10);
    dialogueCounter++;
  } while (dialogueIds.includes(newId));
  return newId;
};

const makeNodeId = (nodeType) => {
  return counterStore.methods.nodeCounter().toString(10);
};

const makeEdgeId = (source, target, sourceHandle, targetHandle) => {
  return counterStore.methods.edgeCounter().toString(10);
};

const makeOutputId = (node) => {
  let counter = 1;
  let newId = 0;
  const outputIds = node.data.outputs.map((o) => o.id);
  do {
    newId = (node.data.outputs.length + counter).toString(10);
    counter++;
  } while (outputIds.includes(newId));
  return newId;
};

let stringCounter;
const makeStringId = () => {
  if (!stringCounter) {
    stringCounter = Object.keys(translationsStore.state.labels).length;
  }
  let newId;
  do {
    // We need to order string IDs, and JS object numeric keys don't maintain insertion order
    newId = "id" + stringCounter.toString(10);
    stringCounter++;
  } while (Object.keys(translationsStore.state.labels).includes(newId));
  return newId;
};

const makeStringIdForLabel = (stringLabel) => {
  // Create or get
  let stringKey;
  if (Object.values(translationsStore.state.labels).includes(stringLabel)) {
    stringKey = Object.keys(translationsStore.state.labels).find(
      (key) => translationsStore.state.labels[key] == stringLabel
    );
  } else {
    stringKey = makeStringId();
  }
  return stringKey
};

export { makeDialogueId, makeNodeId, makeEdgeId, makeOutputId, makeStringId, makeStringIdForLabel };
