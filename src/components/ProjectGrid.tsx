import { useEffect, useState } from "react";

interface ProjectMeta {
  slug: string;
  project: string;
  description: string;
}

interface Props {
  onSelect: (slug: string) => void;
}

export default function ProjectGrid({ onSelect }: Props) {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then(setProjects);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "1.8rem" }}>
        Basit's Projects
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {projects.map((p) => (
          <div
            key={p.slug}
            onClick={() => onSelect(p.slug)}
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "1.2rem",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#58a6ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#30363d")
            }
          >
            <h2
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "#58a6ff",
              }}
            >
              {p.project}
            </h2>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#8b949e",
                lineHeight: "1.5",
              }}
            >
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
