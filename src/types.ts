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

export type ProjectCategory = "personal" | "professional" | "paid" | "fyp";

export interface ProjectMeta {
  slug: string;
  project: string;
  description: string;
  category: ProjectCategory;
  hasGraph: boolean;
}

export interface ManualProject {
  slug: string;
  project: string;
  category: ProjectCategory;
  description: string;
  tech: string[];
  repo: string;
  role: string;
}
