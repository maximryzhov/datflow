export const defaultState = {
  dialogues: {
    dialogues: [{ id: "id1", name: "Dialogue 1" }],
  },
  flow: {
    nodes: [
      {
        id: "1",
        type: "start",
        position: { x: 100, y: 100 },
        data: {
          label: "Start",
          outputs: [{ id: "out", order: 0 }],
        },
      },
      {
        id: "2",
        position: { x: 500, y: 100 },
        type: "dialogue",
        data: {
          label: "Dialogue 1",
          textString: "id1",
          outputs: [
            {
              id: "1",
              order: 0,
              textString: "id2",
            },
          ],
        },
      },
    ],
    edges: [
      {
        id: "1",
        source: "1",
        sourceHandle: "out",
        target: "2",
        targetHandle: "in",
      },
    ],
    defaultViewport: { zoom: 1, x: 0, y: 0 },
    nodesOutputsCollapsed: [],
    nodesTextCollapsed: [],
  },
  translations: {
    languages: ["English(en)"],
    labels: {
      "id1": "string_0001",
      "id2": "string_0002",
    },
    strings: {
      "id1": { "English(en)": "" },
      "id2": { "English(en)": "" },
    },
    selectedLanguage: "English(en)",
  },
  counters: {
    nodeCounter: 3,
    edgeCounter: 2
  }
};
