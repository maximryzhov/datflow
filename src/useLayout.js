import dagre from "@dagrejs/dagre";
import { Position, useVueFlow } from "@vue-flow/core";
import { ref } from "vue";

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
  const graph = ref(new dagre.graphlib.Graph());

  const previousDirection = ref("LR");

  function layout(nodes, edges, direction) {
    // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
    const dagreGraph = new dagre.graphlib.Graph();

    graph.value = dagreGraph;

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    previousDirection.value = direction;

    const margin = 50;
    for (const node of nodes) {
      dagreGraph.setNode(node.id, {
        width: node.dimensions.width + margin || 150,
        height: node.dimensions.height + margin || 50,
      });
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target);
    }

    dagre.layout(dagreGraph);

    // set nodes with updated positions
    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
      };
    });
  }

  return { graph, layout, previousDirection };
}
