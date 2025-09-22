import { reactive, ref } from "vue";
import flowStore from "./Flow";
import translationsStore from "./Translations";
import optionsStore from "./Options";
import historyStore from "./History";
import dialogueStore from "./Dialogues";
import counterStore from "./Counters";
import { defaultState } from "@/Defaults";
import { deepCopy, dialogueFromYAML } from "@/utils";

const vueFlowInstance = ref(null);

// Stores runtime data that resets on load
const runtimeState = reactive({
  loaded: false,
  projectHandle: null,
  activeTabLeft: "Dialogues",
  activeTabRight: "Nodes",
  selectedDialogue: "id1",
  selectedNode: null,
  selectedEdge: null,
  showMenu: false,
  menuPosition: null,
  endPosition: null,
  pendingConnection: null,
  commandQueue: [],
  toasts: []
});

const resetProjectState = () => {
  runtimeState.projectHandle = null;
  runtimeState.selectedDialogue = "id1";
  dialogueStore.state = deepCopy(defaultState.dialogues);
  flowStore.state = { id1: deepCopy(defaultState.flow) };
  translationsStore.state = deepCopy(defaultState.translations);
  counterStore.state = deepCopy(defaultState.counters);
  historyStore.methods.reset();
};

export {
  vueFlowInstance,
  dialogueStore,
  flowStore,
  translationsStore,
  optionsStore,
  historyStore,
  counterStore,
  runtimeState,
  resetProjectState,
};
