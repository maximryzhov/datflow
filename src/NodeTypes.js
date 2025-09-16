import { NODE_ICONS } from "./Icons";

const NODE_TYPES = {
  START: {
    label: "Start",
    type: "start",
    icon: NODE_ICONS.start,
  },
  DIALOGUE: {
    label: "Dialogue",
    type: "dialogue",
    icon: NODE_ICONS.dialogue,
  },
  BRANCH: {
    label: "Branch",
    type: "branch",
    icon: NODE_ICONS.branch,
  },
  SCRIPT: {
    label: "Script",
    type: "script",
    icon: NODE_ICONS.script,
  },
};

export default NODE_TYPES;
