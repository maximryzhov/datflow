import {
  flowStore,
  translationsStore,
  optionsStore,
  runtimeState,
  dialogueStore,
  counterStore,
} from "@/stores";
import { VERSION } from "@/Constants";

function projectToJSON(withOptions = false) {
  const projectState = {
    data: {
      dialogues: dialogueStore.state,
      flow: flowStore.state,
      translations: translationsStore.state,
      counters: counterStore.state,
    },
    version: VERSION,
  };
  if (withOptions) {
    projectState.data.options = optionsStore.state;
  }
  return JSON.stringify(projectState);
}

function projectFromJSON(loadedStateString, withOptions) {
  if (loadedStateString) {
    const loadedState = JSON.parse(loadedStateString);
    if (loadedState.version !== VERSION) {
      console.warn(
        `Project created with version ${loadedState.version}. It is different from app version ${VERSION}.`
      );
    }
    const { data } = loadedState;
    flowStore.state = data.flow;
    translationsStore.state = data.translations;
    dialogueStore.state = data.dialogues;
    counterStore.state = data.counters;
    if (withOptions && data.options) {
      optionsStore.state = data.options;
    }
    console.log("Loaded");
    runtimeState.loaded = true;
  } else {
    runtimeState.loaded = true;
  }
}

export { projectFromJSON, projectToJSON };
