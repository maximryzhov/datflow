import yaml from "js-yaml";
import NODE_TYPES from "@/NodeTypes";
import { runtimeState, flowStore, translationsStore } from "@/stores";
import {
  makeNodeId,
  makeEdgeId,
  makeOutputId,
  makeStringIdForLabel,
} from "./MakeID";

function dialogueToYAML() {
  let dialogue = {};

  const { nodes, edges } = flowStore.state[runtimeState.selectedDialogue];

  nodes.forEach((node) => {
    let newNode = { type: node.type };

    if (node.type == NODE_TYPES.DIALOGUE.type) {
      newNode.text = translationsStore.state.labels[node.data.textString];
    }
    if (node.type == NODE_TYPES.SCRIPT.type) {
      newNode.text = node.data.text;
    }
    if (node.data.outputs) {
      newNode.options = [];
      node.data.outputs
        .toSorted((a, b) => a.order - b.order)
        .forEach((o) => {
          let newOutput = {};
          // Find edge
          edges.forEach((edge) => {
            // Update outputs
            if (edge.source == node.id && edge.sourceHandle == o.id) {
              newOutput.next = edge.targetNode.data.label;
            }
          });
          if (o.textString) {
            newOutput.text = translationsStore.state.labels[o.textString];
          }
          if (o.if) {
            newOutput.if = o.if;
          }
          newNode.options.push(newOutput);
        });
    }

    dialogue[node.data.label] = newNode;
  });
  return yaml.dump(dialogue);
}

function dialogueFromYAML(YAMLString) {
  const parsed = yaml.load(YAMLString);
  let connections = [];
  const addedNodes = [];
  const addedEdges = [];

  Object.keys(parsed).forEach((nodeLabel) => {
    const node = parsed[nodeLabel];
    const nodeId = makeNodeId(node.type);

    let newNode = {
      id: nodeId,
      type: node.type,
      position: { x: 0, y: 0 },
      data: {
        label: nodeLabel,
        outputs: [],
      },
    };

    node.options.forEach((opt, idx) => {
      const newOutput = { order: idx };
      if (
        node.type == NODE_TYPES.DIALOGUE.type ||
        node.type == NODE_TYPES.BRANCH.type
      ) {
        newOutput.id = makeOutputId(newNode);
      } else {
        newOutput.id = "out";
      }
      if (opt.next) {
        connections.push({
          fromNode: nodeId,
          fromHandle: newOutput.id,
          toLabel: opt.next,
        });
      }
      if (opt.if) {
        newOutput.if = opt.if;
      }
      if (opt.text) {
        const stringKey = makeStringIdForLabel(opt.text);
        newOutput.textString = stringKey;
        // Create new label and translation if doesn't exist
        if (!translationsStore.state.labels[stringKey]) {
          translationsStore.state.labels[stringKey] = opt.text;
          const translations = {};
          translationsStore.state.languages.forEach((lang) => {
            translations[lang] = "";
          });
          translationsStore.state.strings[stringKey] = translations;
        }
      }
      newNode.data.outputs.push(newOutput);
    });

    if (node.text) {
      const stringKey = makeStringIdForLabel(node.text);
      newNode.data.textString = stringKey;
      // Create new label and translation if doesn't exist
      if (!translationsStore.state.labels[stringKey]) {
        translationsStore.state.labels[stringKey] = node.text;
        const translations = {};
        translationsStore.state.languages.forEach((lang) => {
          translations[lang] = "";
        });
        translationsStore.state.strings[stringKey] = translations;
      }
    }
    if (node.text) {
      newNode.data.text = node.text;
    }
    addedNodes.push(newNode);
  });

  connections.forEach(({ fromNode, fromHandle, toLabel }) => {
    const source = fromNode;
    const target = addedNodes.find((n) => n.data.label == toLabel)?.id;
    const sourceHandle = fromHandle;
    const targetHandle = "in";
    const newConnection = {
      id: makeEdgeId(source, target, sourceHandle, targetHandle),
      source,
      target,
      sourceHandle,
      targetHandle,
    };
    addedEdges.push(newConnection);
  });
  return {
    nodes: addedNodes,
    edges: addedEdges,
    nodesOutputsCollapsed: [],
    nodesTextCollapsed: [],
  };
}

export { dialogueFromYAML, dialogueToYAML };
