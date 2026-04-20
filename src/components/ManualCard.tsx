import type { ManualProject } from "../types";

interface Props {
  project: ManualProject;
}

export default function ManualCard({ project }: Props) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--purple)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
          {project.project}
        </h3>
      </div>

      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "0.8rem",
        }}
      >
        {project.description}
      </p>

      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--text-faint)",
          marginBottom: "0.8rem",
        }}
      >
        Role: <span style={{ color: "var(--text-muted)" }}>{project.role}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem",
          marginBottom: "1rem",
        }}
      >
        {project.tech.map((t) => (
          <span key={t} className="chip" style={{ fontSize: "0.7rem" }}>
            {t}
          </span>
        ))}
      </div>

      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "0.78rem",
            color: "var(--emerald)",
            border:
              "1px solid color-mix(in srgb, var(--emerald) 25%, transparent)",
            padding: "0.35rem 0.8rem",
            borderRadius: "6px",
            display: "inline-block",
            transition: "border-color 0.2s",
          }}
        >
          View Repo →
        </a>
      )}
    </div>
  );
}
