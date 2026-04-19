export default function Hero() {
  const stack = [
    "TypeScript",
    "Python",
    "Node.js",
    "LangGraph",
    "PostgreSQL",
    "Docker",
    "React",
    "Rust",
  ];

  return (
    <section style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <span
          style={{
            color: "var(--gold)",
            fontSize: "0.85rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Backend Engineer · AI/LLM · Full-Stack
        </span>
      </div>

      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "1.5rem",
        }}
      >
        Abdul Basit
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "var(--text-muted)",
          maxWidth: "560px",
          lineHeight: 1.7,
          marginBottom: "2rem",
        }}
      >
        Jr. Backend Engineer at VillaEx Technologies, Lahore. I build voice
        agents, agentic AI systems, and full-stack products. BS Software
        Engineering from COMSATS 2025 — focused on making AI systems that
        actually ship.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {stack.map((s) => (
          <span
            key={s}
            className="chip"
            style={{ borderColor: "var(--purple-dim)", color: "var(--purple)" }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          {
            label: "GitHub",
            href: "https://github.com/sheikhBasit",
            hoverColor: "var(--purple)",
          },
          {
            label: "LinkedIn",
            href: "https://linkedin.com/in/abdul-basit-2ba4a4194",
            hoverColor: "var(--gold)",
          },
          {
            label: "Email",
            href: "mailto:fredericklee88765@gmail.com",
            hoverColor: "var(--emerald)",
          },
        ].map(({ label, href, hoverColor }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text)",
              fontSize: "0.875rem",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = hoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
