export default function Contact() {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/sheikhBasit",
      color: "var(--purple)",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/abdul-basit-2ba4a4194",
      color: "var(--gold)",
    },
    {
      label: "Email",
      href: "mailto:fredericklee88765@gmail.com",
      color: "var(--emerald)",
    },
  ];

  return (
    <section style={{ textAlign: "center", paddingBottom: "6rem" }}>
      <div className="section-title" style={{ textAlign: "center" }}>
        Get in Touch
      </div>
      <p
        style={{
          color: "var(--text-muted)",
          marginBottom: "2rem",
          fontSize: "0.95rem",
        }}
      >
        Open to backend, AI/LLM, and full-stack roles. Let's build something.
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {links.map(({ label, href, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "0.7rem 1.8rem",
              border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
              borderRadius: "8px",
              color,
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background 0.2s",
              background: `color-mix(in srgb, ${color} 8%, transparent)`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `color-mix(in srgb, ${color} 16%, transparent)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `color-mix(in srgb, ${color} 8%, transparent)`)
            }
          >
            {label}
          </a>
        ))}
      </div>
      <p
        style={{
          marginTop: "4rem",
          color: "var(--text-faint)",
          fontSize: "0.75rem",
        }}
      >
        Built with React + D3.js · Auto-analyzed by Python + Groq · Deployed on
        Vercel
      </p>
    </section>
  );
}
