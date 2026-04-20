import { useState } from "react";
import GraphView from "./GraphView";
import type { ProjectMeta } from "../types";

interface Props {
  project: ProjectMeta;
}

export default function ProjectCard({ project }: Props) {
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${showGraph ? "var(--purple)" : "var(--border)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <h3
            style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}
          >
            {project.project}
          </h3>
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "1rem",
          }}
        >
          {project.description}
        </p>
        <button
          onClick={() => setShowGraph((v) => !v)}
          style={{
            background: showGraph ? "var(--purple-dim)" : "transparent",
            border: `1px solid ${showGraph ? "var(--purple)" : "var(--border)"}`,
            color: showGraph ? "var(--text)" : "var(--text-muted)",
            padding: "0.4rem 0.9rem",
            borderRadius: "6px",
            fontSize: "0.78rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {showGraph ? "Close Graph" : "View Graph"}
        </button>
      </div>

      {showGraph && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <GraphView slug={project.slug} height={380} />
        </div>
      )}
    </div>
  );
}
