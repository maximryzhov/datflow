import { reactive } from "vue";
import { defaultState } from "@/Defaults";
import { runtimeState, flowStore, translationsStore, counterStore } from ".";
import { makeDialogueId } from "@/utils/MakeID";
import {
  deepCopy,
  makeDialogueName,
  makeNode,
  dialogueFromYAML,
} from "@/utils";
import { useLayout } from "@/useLayout";
import { vueFlowInstance } from ".";

import NODE_TYPES from "@/NodeTypes";

// Stores dialogues - separate graphs of the project
const dialogueStore = reactive({
  state: defaultState.dialogues,
  methods: {
    newDialogue: () => {
      const newDialogue = {
        id: makeDialogueId(),
        name: makeDialogueName(),
      };
      const oldState = {
        counters: deepCopy(counterStore.state),
      };
      const command = {
        dialogueId: newDialogue.id,
        type: "new",
        object: "dialogue",
        do: () => {
          dialogueStore.state.dialogues.push(newDialogue);
          flowStore.state[newDialogue.id] = {
            nodes: [],
            edges: [],
            nodesOutputsCollapsed: [],
            nodesTextCollapsed: [],
            defaultViewport: { x: 0, y: 0, zoom: 1 },
          };
          flowStore.state[newDialogue.id].nodes.push(
            makeNode(NODE_TYPES.START.type, null, "Start")
          );
        },
        undo: () => {
          dialogueStore.state.dialogues = dialogueStore.state.dialogues.filter(
            (d) => d.id != newDialogue.id
          );
          delete flowStore.state[newDialogue.id];
          Object.assign(counterStore.state, oldState.counters);
        },
      };
      runtimeState.commandQueue.push(command);
      return newDialogue;
    },
    removeDialogue: (dialogueId) => {
      const oldDialogue = deepCopy(
        dialogueStore.state.dialogues.find((d) => d.id == dialogueId)
      );
      const oldFlow = deepCopy(flowStore.state[dialogueId]);
      const command = {
        dialogueId: dialogueId,
        type: "delete",
        object: "dialogue",
        do: () => {
          dialogueStore.state.dialogues = dialogueStore.state.dialogues.filter(
            (d) => d.id != dialogueId
          );
          delete flowStore.state[dialogueId];
        },
        undo: () => {
          flowStore.state[dialogueId] = oldFlow;
          dialogueStore.state.dialogues.push(oldDialogue);
        },
      };
      runtimeState.commandQueue.push(command);
    },
    importDialogue: (YAMLString) => {
      const newDialogue = {
        id: makeDialogueId(),
        name: makeDialogueName(),
      };
      const oldState = {
        labels: deepCopy(translationsStore.state.labels),
        counters: deepCopy(counterStore.state),
      };
      const command = {
        dialogueId: newDialogue.id,
        type: "import",
        object: "dialogue",
        do: () => {
          dialogueStore.state.dialogues.push(newDialogue);
          // Nodes and edges are imported to a new dialogue, the string labels are imported additively
          const { nodes, edges, nodesOutputsCollapsed, nodesTextCollapsed } =
            dialogueFromYAML(YAMLString);
          flowStore.state[newDialogue.id] = {
            nodes,
            edges,
            nodesOutputsCollapsed,
            nodesTextCollapsed,
            defaultViewport: defaultState.flow.defaultViewport,
          };
          const { layout } = useLayout();
          const { fitView } = vueFlowInstance.value;
          setTimeout(() => {
            flowStore.state[runtimeState.selectedDialogue].nodes = layout(
              flowStore.state[runtimeState.selectedDialogue].nodes,
              flowStore.state[runtimeState.selectedDialogue].edges,
              "LR"
            );
            setTimeout(() => fitView(), 1);
          }, 1);
        },
        undo: () => {
          dialogueStore.state.dialogues = dialogueStore.state.dialogues.filter(
            (d) => d.id != newDialogue.id
          );
          delete flowStore.state[newDialogue.id];
          // restructure object
          Object.keys(translationsStore.state.labels).forEach(
            (key) => delete translationsStore.state.labels[key]
          );
          Object.assign(translationsStore.state.labels, oldState.labels);
          Object.assign(counterStore.state, oldState.counters);
        },
      };
      runtimeState.commandQueue.push(command);
      return newDialogue;
    },
  },
});

export default dialogueStore;
