import { reactive } from "vue";
import { dialogueStore, flowStore, runtimeState } from ".";

const historyStore = reactive({
  state: {
    past: [],
    future: [],
  },
  methods: {
    executeCommand: (transaction) => {
      transaction.forEach((command) => {
        command.do();
      });
      historyStore.state.past.push(transaction);
      historyStore.state.future = [];
    },

    undo: () => {
      const transaction = historyStore.state.past.pop();
      if (!transaction) return;
      transaction.forEach((command) => {
        // console.log(command.dialogueId, command.object, command.type);
        // Switch to dialogue if it exists
        if (command.dialogueId) {
          if (flowStore.state[command.dialogueId]) {
            runtimeState.selectedDialogue = command.dialogueId;
          } else {
            runtimeState.selectedDialogue =
              dialogueStore.state.dialogues[0]?.id;
          }
        }
        command.undo();
      });
      historyStore.state.future.push(transaction);
    },

    redo: () => {
      const transaction = historyStore.state.future.pop();
      if (!transaction) return;
      transaction.forEach((command) => {
        // Switch to dialogue if it exists
        if (command.dialogueId) {
          if (flowStore.state[command.dialogueId]) {
            runtimeState.selectedDialogue = command.dialogueId;
          } else {
            runtimeState.selectedDialogue =
              dialogueStore.state.dialogues[0]?.id;
          }
        }
        command.do();
      });
      historyStore.state.past.push(transaction);
    },
    reset: () => {
      historyStore.state.past = [];
      historyStore.state.future = [];
    },
  },
});

export default historyStore;
