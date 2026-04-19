export interface GraphNode {
  id: string;
  label: string;
  depth: 0 | 1 | 2 | 3;
  summary: string;
  children: string[];
  expanded: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface ProjectGraph {
  project: string;
  slug: string;
  description: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
