import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import ManualCard from "./ManualCard";
import type { ProjectMeta, ManualProject } from "../types";

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {analyzed
          .filter((p) => p.hasGraph)
          .map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        {manual.map((p) => (
          <ManualCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
