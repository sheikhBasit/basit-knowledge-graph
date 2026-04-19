import { useState } from "react";
import ProjectGrid from "./components/ProjectGrid";
import GraphView from "./components/GraphView";

export default function App() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="app">
      {activeSlug ? (
        <GraphView slug={activeSlug} onBack={() => setActiveSlug(null)} />
      ) : (
        <ProjectGrid onSelect={setActiveSlug} />
      )}
    </div>
  );
}
