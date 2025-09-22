// Keeping numerics IDs for the nodes and edges to keep them unique

import { defaultState } from "@/Defaults";
import { reactive } from "vue";

const counterStore = reactive({
  state: defaultState.counters,
  methods: {
    nodeCounter: () => counterStore.state.nodeCounter++,
    edgeCounter: () => counterStore.state.edgeCounter++,
  },
});

export default counterStore;
