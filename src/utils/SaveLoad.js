import { SAVE_KEY } from "@/Constants";
import { projectFromJSON, projectToJSON } from "./JSON";
import { dialogueToYAML } from "./YAML";
import { runtimeState, historyStore, resetProjectState } from "@/stores";
import { defaultState } from "@/Defaults";
import { vueFlowInstance, dialogueStore } from "@/stores";
import { useModal } from "@/useModal";

function saveToLocalStorage() {
  const currentStateString = projectToJSON(true);
  localStorage.setItem(SAVE_KEY, currentStateString);
}

function loadFromLocalStorage() {
  const loadedStateString = localStorage.getItem(SAVE_KEY);
  projectFromJSON(loadedStateString, true);
}

async function newProject() {
  const modal = useModal();
  const r = await modal.confirm({
    title: "Start new project",
    message: "All unexported data will be lost",
  });
  if (r) {
    resetProjectState();
    vueFlowInstance.value.setViewport(defaultState.flow.defaultViewport);
  }
}

async function saveProject() {
  const jsonString = projectToJSON();
  if (!runtimeState.projectHandle) {
    runtimeState.projectHandle = await window.showSaveFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });
  }
  const writable = await runtimeState.projectHandle.createWritable();
  await writable.write(jsonString);
  await writable.close();
  runtimeState.toasts.push({ text: "Project saved" });
}

async function saveProjectAs() {
  const oldHandle = runtimeState.projectHandle;
  runtimeState.projectHandle = null;
  try {
    await saveProject();
  } catch {
    runtimeState.projectHandle = oldHandle;
  }
}

async function loadProject() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: "JSON Files",
        accept: { "application/json": [".json"] },
      },
    ],
  });
  const file = await fileHandle.getFile();
  if (!file) return;

  runtimeState.projectHandle = fileHandle;

  const reader = new FileReader();
  reader.onload = function (e) {
    const jsonString = e.target.result;
    projectFromJSON(jsonString);
    vueFlowInstance.value.setViewport(defaultState.flow.defaultViewport);
    historyStore.methods.reset();
  };
  reader.readAsText(file);
  runtimeState.toasts.push({ text: "Project loaded" });
}

async function exportYAML() {
  const yamlString = dialogueToYAML();
  const dialogueName = dialogueStore.state.dialogues.find(d=>d.id==runtimeState.selectedDialogue)?.name;
  let fileHandle = await window.showSaveFilePicker({
    suggestedName: dialogueName + '.yaml',
    types: [
      {
        description: "YAML Files",
        accept: { "text/yaml": [".yaml"] },
      },
    ],
  });

  const writable = await fileHandle.createWritable();
  await writable.write(yamlString);
  await writable.close();
  runtimeState.toasts.push({ text: "Exported YAML" });
}

async function importYAML() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: "YAML Files",
        accept: { "application/yaml": [".yaml"] },
      },
    ],
  });
  const file = await fileHandle.getFile();
  if (!file) return;

  const promise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const yamlString = e.target.result;
      const newDialogue = dialogueStore.methods.importDialogue(yamlString);
      resolve(newDialogue);
    };
    reader.readAsText(file);
  });

  const newDialogue = await promise;

  runtimeState.toasts.push({ text: "Imported YAML" });
  return newDialogue;
}

export {
  saveToLocalStorage,
  loadFromLocalStorage,
  newProject,
  saveProject,
  saveProjectAs,
  loadProject,
  exportYAML,
  importYAML,
};
