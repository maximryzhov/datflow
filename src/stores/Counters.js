// Keeping numerics IDs for the nodes and edges to keep them unique

import { reactive } from "vue";

const counterStore = reactive({
  state: {
    // Starting node ID is 3, since we have 2 default nodes 
    nodeCounter: 3,
    // Starting edge ID is 2, since we have 1 default edge 
    edgeCounter: 2,
  },
  methods: {
    nodeCounter: () => counterStore.state.nodeCounter++,
    edgeCounter: () => counterStore.state.nodeCounter++,
  },
});

export default counterStore;
