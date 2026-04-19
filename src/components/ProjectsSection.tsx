import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import ManualCard from "./ManualCard";
import type { ProjectMeta, ManualProject, ProjectCategory } from "../types";

const CATEGORY_ORDER: ProjectCategory[] = [
  "personal",
  "professional",
  "paid",
  "fyp",
];
const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  personal: "Personal Projects",
  professional: "Professional — VillaEx Technologies",
  paid: "Paid Client Work",
  fyp: "Final Year Project",
};

export default function ProjectsSection() {
  const [analyzed, setAnalyzed] = useState<ProjectMeta[]>([]);
  const [manual, setManual] = useState<ManualProject[]>([]);

  useEffect(() => {
    fetch("/data/index.json")
      .then((r) => r.json())
      .then(setAnalyzed);
    fetch("/data/manual-projects.json")
      .then((r) => r.json())
      .then(setManual);
  }, []);

  return (
    <section>
      <div className="section-title">Projects</div>
      {CATEGORY_ORDER.map((cat) => {
        const analyzedInCat = analyzed.filter(
          (p) => p.category === cat && p.hasGraph,
        );
        const manualInCat = manual.filter((p) => p.category === cat);
        if (analyzedInCat.length === 0 && manualInCat.length === 0) return null;

        return (
          <div key={cat} style={{ marginBottom: "3.5rem" }}>
            <h3
              style={{
                fontSize: "0.8rem",
                color: "var(--text-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
                fontWeight: 500,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1rem",
              }}
            >
              {analyzedInCat.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
              {manualInCat.map((p) => (
                <ManualCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
