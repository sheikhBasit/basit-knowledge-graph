import Hero from "./components/Hero";
import Skills from "./components/Skills";
import ProjectsSection from "./components/ProjectsSection";
import Contact from "./components/Contact";

export default function App() {
  return (
    <div className="app">
      <Hero />
      <Skills />
      <ProjectsSection />
      <Contact />
    </div>
  );
}
