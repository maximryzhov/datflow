import { reactive } from "vue";

// Stores app options
const optionsStore = reactive({
  state: {
    leftPanelWidth: 300,
    rightPanelWidth: 300,
    theme: "dark",
  },
});
export default optionsStore;
