const SKILLS: Record<string, { items: string[]; color: string }> = {
  Backend: {
    color: "var(--purple)",
    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Drizzle ORM",
      "REST",
      "WebSockets",
    ],
  },
  "AI / LLM": {
    color: "var(--gold)",
    items: [
      "LangGraph",
      "LangChain",
      "Claude API",
      "Groq",
      "Ollama",
      "OpenAI SDK",
      "Pipecat",
      "LiveKit",
    ],
  },
  Frontend: {
    color: "var(--emerald)",
    items: ["React", "TypeScript", "Vite", "D3.js", "Tauri"],
  },
  DevOps: {
    color: "var(--purple)",
    items: ["Docker", "Nginx", "Ubuntu", "Certbot", "GitHub Actions", "Vercel"],
  },
  Mobile: {
    color: "var(--gold)",
    items: ["React Native", "Android (Java/Kotlin)", "Firebase"],
  },
};

export default function Skills() {
  return (
    <section>
      <div className="section-title">Skills</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {Object.entries(SKILLS).map(([domain, { items, color }]) => (
          <div key={domain}>
            <div
              style={{
                fontSize: "0.75rem",
                color,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6rem",
              }}
            >
              {domain}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {items.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
