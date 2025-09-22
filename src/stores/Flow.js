import { reactive } from "vue";
import { defaultState } from "@/Defaults";
import { makeOutputId } from "@/utils/MakeID";
import { runtimeState, translationsStore } from ".";
import { deepCopy } from "@/utils";
import NODE_TYPES from "@/NodeTypes";
import { useLayout } from "@/useLayout";
import { counterStore } from ".";

// Stores vueflow data, nodes and edges
const flowStore = reactive({
  state: { id1: defaultState.flow },
  methods: {
    findNode: (nodeId, dialogueId) => {
      return flowStore.state[dialogueId].nodes.find((n) => n.id == nodeId);
    },
    addNode: (newNode, dialogueId) => {
      const command = {
        dialogueId,
        object: "node",
        type: "add",
        do: () => {
          flowStore.state[dialogueId].nodes.push(newNode);
        },
        undo: () => {
          flowStore.state[dialogueId].nodes = flowStore.state[
            dialogueId
          ].nodes.filter((n) => n.id != newNode.id);
          counterStore.state.nodeCounter--;
        },
      };
      runtimeState.commandQueue.push(command);
    },
    moveNodes: (oldPositions, newPositions, dialogueId) => {
      const command = {
        dialogueId,
        object: "node",
        type: "move",
        do: () => {
          newPositions.forEach((item, idx) => {
            const node = flowStore.methods.findNode(item.id, dialogueId);
            try {
              node.position = item.position;
            } catch {
              console.error("Failed to move node during redo");
            }
          });
        },
        undo: () => {
          oldPositions.forEach((item, idx) => {
            const node = flowStore.methods.findNode(item.id, dialogueId);
            try {
              node.position = item.position;
            } catch {
              console.error("Failed to move node during undo");
            }
          });
        },
      };
      runtimeState.commandQueue.push(command);
    },
    removeNode: (nodeId, dialogueId) => {
      const node = deepCopy(flowStore.methods.findNode(nodeId, dialogueId));
      const command = {
        dialogueId,
        object: "node",
        type: "delete",
        do: () => {
          flowStore.state[dialogueId].nodes = flowStore.state[
            dialogueId
          ].nodes.filter((n) => n.id != nodeId);
        },
        undo: () => {
          flowStore.state[dialogueId].nodes.push(node);
        },
      };
      runtimeState.commandQueue.push(command);
      const edgesToRemove = flowStore.state[dialogueId].edges.filter(
        (e) => e.target == nodeId || e.source == nodeId
      );
      flowStore.methods.removeEdge(
        edgesToRemove,
        runtimeState.selectedDialogue
      );
    },
    rearrangeNodes: (dialogueId) => {
      const oldPositions = flowStore.state[dialogueId].nodes.map(
        (n) => n.position
      );
      const command = {
        dialogueId,
        type: "move",
        object: "node",
        do: () => {
          const { layout } = useLayout();
          flowStore.state[dialogueId].nodes = layout(
            flowStore.state[dialogueId].nodes,
            flowStore.state[dialogueId].edges,
            "LR"
          );
        },
        undo: () => {
          flowStore.state[dialogueId].nodes.forEach((n, idx) => {
            n.position = oldPositions[idx];
          });
        },
      };
      runtimeState.commandQueue.push(command);
    },
    addEdge: (newEdges, dialogueId) => {
      if (!Array.isArray(newEdges)) {
        newEdges = [newEdges];
      }
      const command = {
        dialogueId,
        type: "add",
        object: "edge",
        do: () => {
          flowStore.state[dialogueId].edges.push(...newEdges);
        },
        undo: () => {
          flowStore.state[dialogueId].edges = flowStore.state[
            dialogueId
          ].edges.filter((e) => !newEdges.map((ne) => ne.id).includes(e.id));
          counterStore.state.edgeCounter--;
        },
      };
      runtimeState.commandQueue.push(command);
    },
    removeEdge: (edgesToRemove, dialogueId) => {
      if (!Array.isArray(edgesToRemove)) {
        edgesToRemove = [edgesToRemove];
      }
      const edges = deepCopy(edgesToRemove);
      const command = {
        dialogueId,
        object: "edge",
        type: "delete",
        do: () => {
          flowStore.state[dialogueId].edges = flowStore.state[
            dialogueId
          ].edges.filter(
            (e) => !edgesToRemove.map((er) => er.id).includes(e.id)
          );
        },
        undo: () => {
          flowStore.state[dialogueId].edges.push(...edges);
        },
      };
      runtimeState.commandQueue.push(command);
    },
    updateEdge: (edgeId, options, dialogueId) => {
      const edge = flowStore.state[dialogueId].edges.find(
        (e) => e.id == edgeId
      );
      const oldEdge = deepCopy(edge);
      const command = {
        dialogueId,
        type: "update",
        object: "edge",
        do: () => {
          Object.assign(edge, options);
        },
        undo: () => {
          Object.keys(edge).forEach((k) => delete edge[k]);
          Object.assign(edge, oldEdge);
        },
      };
      runtimeState.commandQueue.push(command);
    },
    addOption: (nodeId, handleId, dialogueId) => {
      const node = flowStore.methods.findNode(nodeId, dialogueId);
      if (!node.data.outputs) {
        node.data.outputs = [];
      }
      let translation;
      if (node.type == NODE_TYPES.DIALOGUE.type) {
        translation = translationsStore.methods.newTranslation();
      }
      const outputIdx = node.data.outputs.findIndex((o) => o.id == handleId);
      const command = {
        dialogueId,
        type: "add",
        object: "output",
        do: () => {
          const newOutput = { id: makeOutputId(node), if: null };
          if (translation) {
            newOutput.textString = translation.key;
          }
          node.data.outputs.splice(outputIdx + 1, 0, newOutput);
        },
        undo: () => {
          node.data.outputs.splice(outputIdx, 1);
        },
      };
      runtimeState.commandQueue.push(command);
    },
    removeOption: (nodeId, handleId, dialogueId) => {
      const node = flowStore.methods.findNode(nodeId, dialogueId);
      const optionIdx = node.data.outputs.findIndex((o) => o.id == handleId);
      const option = deepCopy(node.data.outputs[optionIdx]);
      const command = {
        dialogueId,
        type: "delete",
        object: "output",
        do: () => {
          node.data.outputs.splice(optionIdx, 1);
        },
        undo: () => {
          node.data.outputs.splice(optionIdx, 0, option);
        },
      };
      runtimeState.commandQueue.push(command);
      const edgesToRemove = flowStore.state[dialogueId].edges.filter(
        (e) => e.source == nodeId && e.sourceHandle == handleId
      );
      flowStore.methods.removeEdge(
        edgesToRemove,
        runtimeState.selectedDialogue
      );
    },
    moveOption: (nodeId, handleId, direction, dialogueId) => {
      const node = flowStore.methods.findNode(nodeId, dialogueId);
      const outputIdx = node.data.outputs.findIndex((o) => o.id == handleId);
      const newIdx = outputIdx + direction;
      const command = {
        dialogueId,
        type: "move",
        object: "output",
        do: () => {
          if (
            (direction == -1 && outputIdx > 0) ||
            (direction == 1 && outputIdx < node.data.outputs.length - 1)
          ) {
            const [output] = node.data.outputs.splice(outputIdx, 1);
            node.data.outputs.splice(newIdx, 0, output);
          }
        },
        undo: () => {
          const [output] = node.data.outputs.splice(newIdx, 1);
          node.data.outputs.splice(outputIdx, 0, output);
        },
      };
      runtimeState.commandQueue.push(command);
    },
  },
});
export default flowStore;
