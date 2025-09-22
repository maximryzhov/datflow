import NODE_TYPES from "@/NodeTypes";
import { runtimeState, flowStore, translationsStore } from "@/stores";
import { makeNodeId, makeOutputId } from "./MakeID";

const makeNodeLabel = (nodeType) => {
  let counter = 1;
  let newLabel = "";
  const nodeLabels = flowStore.state[runtimeState.selectedDialogue].nodes.map(
    (n) => n.data.label
  );

  do {
    const labelIdx = Object.keys(
      flowStore.state[runtimeState.selectedDialogue].nodes.filter(
        (n) => n.type == nodeType
      )
    ).length;
    newLabel = `${nodeType} ${labelIdx + counter}`;
    newLabel = newLabel[0].toUpperCase() + newLabel.slice(1);
    counter++;
  } while (nodeLabels.includes(newLabel));

  return newLabel;
};

function makeNode(nodeType, position, label = null) {
  const nodeTypes = Object.values(NODE_TYPES).map((n) => n.type);
  if (!nodeTypes.includes(nodeType)) {
    throw new Error(`${nodeType} is not a valid node type`);
  }
  const nodeLabel = label ?? makeNodeLabel(nodeType);
  if (!position) {
    position = {
      x: 100,
      y: 100,
    };
    flowStore.state[runtimeState.selectedDialogue].nodes.forEach((n) => {
      if (n.position.x == position.x && n.position.y == position.y) {
        position.x += 20;
        position.y += 20;
      }
    });
  }

  let newNode = {
    id: makeNodeId(nodeType),
    type: nodeType,
    position: {
      x: position.x,
      y: position.y,
    },
    data: {
      label: nodeLabel,
      outputs: [],
    },
  };
  if (nodeType == NODE_TYPES.SCRIPT.type || nodeType == NODE_TYPES.START.type) {
    newNode.data.outputs.push({
      id: "out",
      order: 0,
    });
  }
  if (nodeType == NODE_TYPES.BRANCH.type) {
    newNode.data.outputs.push({
      id: makeOutputId(newNode),
      order: 0,
    });
  }
  if (nodeType == NODE_TYPES.DIALOGUE.type) {
    const translation = translationsStore.methods.newTranslation();
    newNode.data.textString = translation.key;
  }
  return newNode;
}

export { makeNode, makeNodeLabel };
