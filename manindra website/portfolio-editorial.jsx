// Direction A — Editorial layout, Swiss-Grotesk fonts
// Helvetica Neue display + JetBrains Mono metadata
// Strict B&W. Editorial composition (vol/issue chrome, big display type, year-tabbed journey, project index table, pull quotes).

const D = window.PORTFOLIO_DATA;

const ED_DISPLAY = "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Inter', sans-serif";
const ED_BODY    = "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Inter', sans-serif";
const ED_MONO    = "'JetBrains Mono', 'IBM Plex Mono', monospace";

const editorialStyles = {
  root: {
    background: "#0a0a0a",
    color: "#f5f3ee",
    fontFamily: ED_BODY,
    width: "100%",
    minHeight: "100%",
    overflow: "hidden",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────
function EdNav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", padding: "20px 40px",
      borderBottom: "1px solid rgba(245,243,238,0.12)",
      background: "rgba(10,10,10,0.72)", backdropFilter: "blur(14px)",
      fontFamily: ED_MONO, fontSize: 11,
      letterSpacing: "0.14em", textTransform: "uppercase",
    }}>
      <div style={{ display: "flex", gap: 28, color: "rgba(245,243,238,0.55)" }}>
        <span style={{ color: "#f5f3ee" }}>Manindra de Mel</span>
        <span>—</span>
        <span>Portfolio / Vol. 02</span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {["Index", "Journey", "Work", "Resume", "Words", "Contact"].map((x, i) => (
          <a key={x} href={"#" + x.toLowerCase()} style={{ color: i === 0 ? "#f5f3ee" : "rgba(245,243,238,0.55)", textDecoration: "none" }}>
            <span style={{ opacity: 0.4, marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>{x}
          </a>
        ))}
      </div>
      <div style={{ textAlign: "right", color: "rgba(245,243,238,0.55)" }}>
        Canberra, ACT · 35.28°S
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────
function EdHero() {
  return (
    <section style={{ padding: "80px 40px 120px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 60, alignItems: "end",
        marginBottom: 60,
      }}>
        <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid rgba(245,243,238,0.15)" }}>
            <span>Vol. 02</span><span>2026 Edition</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>Issue</span><span>№ 14</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>A portfolio of</span><span>computer-science work</span>
          </div>
        </div>
        <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", textAlign: "right" }}>
          <div>Software · Research · Systems</div>
          <div style={{ marginTop: 6 }}>Available for select work</div>
        </div>
      </div>

      <h1 style={{
        fontFamily: ED_DISPLAY,
        fontWeight: 500,
        fontSize: "clamp(80px, 14vw, 220px)",
        lineHeight: 0.86, letterSpacing: "-0.05em",
        margin: 0, textWrap: "balance", textTransform: "uppercase",
      }}>
        Manindra<br/>
        <span style={{ WebkitTextStroke: "1.5px #f5f3ee", color: "transparent" }}>de Mel</span>
        <span style={{ fontFamily: ED_MONO, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", verticalAlign: "top", marginLeft: 18, color: "rgba(245,243,238,0.45)" }}>
          ★
        </span>
      </h1>

      <div style={{
        display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr",
        gap: 60, marginTop: 80, alignItems: "start",
      }}>
        <div>
          <div style={{ fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", marginBottom: 16 }}>
            ¶ Introduction
          </div>
          <p style={{
            fontFamily: ED_DISPLAY, fontSize: 26, lineHeight: 1.35,
            margin: 0, color: "#f5f3ee", letterSpacing: "-0.005em",
          }}>
            Software engineer based in Canberra. I work across <em style={{ fontStyle: "normal", textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "4px", textDecorationColor: "rgba(245,243,238,0.4)" }}>machine-learning research</em>, <em style={{ fontStyle: "normal", textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "4px", textDecorationColor: "rgba(245,243,238,0.4)" }}>systems programming</em>, and the <em style={{ fontStyle: "normal", textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "4px", textDecorationColor: "rgba(245,243,238,0.4)" }}>web</em> — currently studying CS at ANU, and taking on a small number of outside engagements each year.
          </p>
        </div>

        <div style={{ borderLeft: "1px solid rgba(245,243,238,0.15)", paddingLeft: 32, fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.8, color: "rgba(245,243,238,0.7)" }}>
          <DataRow k="Based in" v="Canberra, AU" />
          <DataRow k="Role" v="Engineer / Researcher" />
          <DataRow k="Studying" v="CS @ ANU" />
          <DataRow k="Experience" v="5+ years" />
          <DataRow k="Status" v="Selectively open" />
        </div>

        <div style={{
          aspectRatio: "3 / 4",
          background: "url('assets/portrait-crop.png') center/cover",
          filter: "grayscale(1) contrast(1.05)",
        }} />
      </div>
    </section>
  );
}

function DataRow({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(245,243,238,0.12)", padding: "4px 0" }}>
      <span style={{ color: "rgba(245,243,238,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MARQUEE / TICKER (subtle kinetic touch)
// ─────────────────────────────────────────────────────────────────────────
function EdMarquee() {
  const items = [
    "Python", "Haskell", "C / C++", "Assembly", "TypeScript", "Rust",
    "APL", "React", "Vue", "Svelte", "AWS", "Google Cloud",
    "Firebase", "PyTorch", "NumPy", "Linux",
  ];
  const loop = [...items, ...items, ...items];
  return (
    <div style={{
      borderBottom: "1px solid rgba(245,243,238,0.12)",
      overflow: "hidden", padding: "28px 0",
      fontFamily: ED_DISPLAY,
    }}>
      <div style={{
        display: "flex", gap: 60, whiteSpace: "nowrap",
        animation: "ed-marquee 60s linear infinite",
        fontFamily: ED_DISPLAY, fontSize: 48, fontWeight: 500,
        letterSpacing: "-0.03em", textTransform: "uppercase",
      }}>
        {loop.map((x, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 60, color: i % 2 === 0 ? "#f5f3ee" : "rgba(245,243,238,0.35)" }}>
            {x}
            <span style={{ fontFamily: ED_MONO, fontSize: 14, color: "rgba(245,243,238,0.3)", letterSpacing: "0.1em" }}>+</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ed-marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// JOURNEY
// ─────────────────────────────────────────────────────────────────────────
function EdJourney() {
  const [active, setActive] = React.useState(0);
  return (
    <section id="journey" style={{ padding: "120px 40px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <SectionHeader number="02" title="Journey" sub="A short index of milestones, in reverse." />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 2fr",
        gap: 80, marginTop: 80,
      }}>
        <div>
          {D.journey.map((j, i) => (
            <button
              key={j.year}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "transparent", border: "none", cursor: "pointer",
                padding: "20px 0", borderBottom: "1px solid rgba(245,243,238,0.12)",
                color: active === i ? "#f5f3ee" : "rgba(245,243,238,0.4)",
                transition: "color 0.3s",
                fontFamily: ED_DISPLAY,
                display: "flex", alignItems: "baseline", gap: 24,
              }}
            >
              <span style={{
                fontSize: active === i ? 84 : 56, lineHeight: 1,
                transition: "all 0.4s cubic-bezier(.2,.8,.2,1)",
                fontWeight: active === i ? 600 : 400,
              }}>
                {j.year}
              </span>
              <span style={{
                fontFamily: ED_MONO,
                fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                opacity: active === i ? 1 : 0,
                transform: active === i ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.3s",
              }}>
                ↳ {j.subtitle}
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
          <div style={{
            fontFamily: ED_MONO,
            fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(245,243,238,0.5)", marginBottom: 20,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>Detail · {D.journey[active].year}</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(D.journey.length).padStart(2, "0")}</span>
          </div>
          <h3 style={{
            fontFamily: ED_DISPLAY,
            fontSize: 38, fontWeight: 500, lineHeight: 1.15,
            margin: "0 0 32px", letterSpacing: "-0.01em",
          }}>
            {D.journey[active].subtitle}
          </h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {D.journey[active].points.map((p, i) => (
              <li key={i} style={{
                display: "grid", gridTemplateColumns: "40px 1fr",
                gap: 16, padding: "20px 0",
                borderTop: "1px solid rgba(245,243,238,0.12)",
              }}>
                <span style={{
                  fontFamily: ED_MONO, fontSize: 11,
                  color: "rgba(245,243,238,0.4)", letterSpacing: "0.1em",
                }}>
                  ¶ {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "rgba(245,243,238,0.85)" }}>{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FEATURED PROJECT (Spotlight on the first project — sits inside Work section)
// ─────────────────────────────────────────────────────────────────────────
function EdFeatured({ p }) {
  const f = p.featured;
  return (
    <div style={{
      marginTop: 32,
      border: "1px solid rgba(245,243,238,0.18)",
      background: "rgba(245,243,238,0.025)",
    }}>
      {/* Top strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        borderBottom: "1px solid rgba(245,243,238,0.12)",
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "rgba(245,243,238,0.55)",
      }}>
        <div style={{ padding: "14px 20px" }}>★ Spotlight</div>
        <div style={{ padding: "14px 20px", borderLeft: "1px solid rgba(245,243,238,0.12)" }}>{f.status}</div>
        <div style={{ padding: "14px 20px", borderLeft: "1px solid rgba(245,243,238,0.12)" }}>{p.year}</div>
        <div style={{ padding: "14px 20px", borderLeft: "1px solid rgba(245,243,238,0.12)", textAlign: "right", color: "#f5f3ee" }}>{p.stars != null ? "★ " + p.stars + " · " : ""}{p.lang}</div>
      </div>

      {/* Title + lede */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
        <div style={{ padding: "48px 40px", borderRight: "1px solid rgba(245,243,238,0.12)" }}>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: "clamp(54px, 7vw, 96px)", lineHeight: 0.92,
            margin: 0, letterSpacing: "-0.04em", textTransform: "uppercase",
            color: "#f5f3ee",
          }}>
            {p.name}
          </h3>
          <p style={{
            margin: "24px 0 0", maxWidth: 640,
            fontSize: 18, lineHeight: 1.5, color: "rgba(245,243,238,0.82)",
            letterSpacing: "-0.005em",
          }}>
            {p.desc}
          </p>
        </div>
        <div style={{ padding: "48px 40px", fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.9 }}>
          <DataRow k="Role" v={f.role} />
          <DataRow k="With" v={f.collaborators} />
          <DataRow k="Stack" v={f.stack.slice(0, 3).join(" · ")} />
          <DataRow k="Year" v={p.year} />
        </div>
      </div>

      {/* Image placeholder strip */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
        <Placeholder label="01 · Telemetry dashboard" aspect="16 / 10" />
        <Placeholder label="02 · Bench rig" aspect="4 / 5" />
        <Placeholder label="03 · Reward surface" aspect="4 / 5" />
      </div>

      {/* Long-form description */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "48px 40px", gap: 40 }}>
        <ProseBlock label="¶ Problem" body={f.problem} />
        <ProseBlock label="¶ Approach" body={f.approach} />
        <ProseBlock label="¶ Outcome" body={f.outcome} />
      </div>

      {/* Footer strip */}
      <div style={{
        borderTop: "1px solid rgba(245,243,238,0.12)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(245,243,238,0.55)",
      }}>
        <span>Full stack — {f.stack.join(" · ")}</span>
        <a href="#" style={{ color: "#f5f3ee", textDecoration: "none" }}>
          → Read case study
        </a>
      </div>
    </div>
  );
}

function Placeholder({ label, aspect }) {
  return (
    <div style={{
      aspectRatio: aspect, position: "relative",
      borderRight: "1px solid rgba(245,243,238,0.12)",
      background: "repeating-linear-gradient(135deg, rgba(245,243,238,0.04) 0 1px, transparent 1px 14px), rgba(245,243,238,0.015)",
      overflow: "hidden",
    }}>
      {/* X */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#f5f3ee" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#f5f3ee" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
      </svg>
      <span style={{
        position: "absolute", left: 16, bottom: 14,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "rgba(245,243,238,0.55)",
      }}>
        {label}
      </span>
      <span style={{
        position: "absolute", right: 16, top: 14,
        fontFamily: ED_MONO, fontSize: 9, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "rgba(245,243,238,0.35)",
      }}>
        IMG
      </span>
    </div>
  );
}

function ProseBlock({ label, body }) {
  return (
    <div>
      <div style={{
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "rgba(245,243,238,0.55)",
        paddingBottom: 12, marginBottom: 16,
        borderBottom: "1px solid rgba(245,243,238,0.18)",
      }}>
        {label}
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "rgba(245,243,238,0.82)" }}>{body}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PROJECTS / WORK
// ─────────────────────────────────────────────────────────────────────────
function EdWork() {
  const featuredP = D.projects.find(x => x.featured);
  const restP = D.projects.filter(x => !x.featured);
  return (
    <section id="work" style={{ padding: "120px 40px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <SectionHeader number="03" title="Selected Work" sub="A curated index. Full archive on GitHub." />

      {featuredP && <EdFeatured p={featuredP} />}

      <div style={{
        marginTop: 60,
        borderTop: "1px solid rgba(245,243,238,0.2)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "60px 2.4fr 1fr 1fr 80px 4fr",
          gap: 24, padding: "12px 0",
          borderBottom: "1px solid rgba(245,243,238,0.2)",
          fontFamily: ED_MONO, fontSize: 10,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "rgba(245,243,238,0.5)",
        }}>
          <span>№</span><span>Project</span><span>Year</span><span>Stack</span><span style={{ textAlign: "right" }}>★</span><span>Description</span>
        </div>

        {restP.map((p, i) => (
          <a key={p.name} href="#" style={{
            display: "grid", gridTemplateColumns: "60px 2.4fr 1fr 1fr 80px 4fr",
            gap: 24, padding: "28px 0",
            borderBottom: "1px solid rgba(245,243,238,0.12)",
            color: "#f5f3ee", textDecoration: "none",
            transition: "background 0.2s, padding 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.background = "rgba(245,243,238,0.03)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0px"; e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontFamily: ED_MONO, fontSize: 12, color: "rgba(245,243,238,0.4)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: ED_DISPLAY, fontSize: 28, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.02em", textTransform: "lowercase" }}>
              {p.name}
            </span>
            <span style={{ fontFamily: ED_MONO, fontSize: 12, color: "rgba(245,243,238,0.65)", letterSpacing: "0.06em" }}>
              {p.year}
            </span>
            <span style={{ fontFamily: ED_MONO, fontSize: 11, color: "rgba(245,243,238,0.65)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {p.lang}
            </span>
            <span style={{ fontFamily: ED_MONO, fontSize: 12, color: "rgba(245,243,238,0.45)", textAlign: "right" }}>
              {p.stars != null ? "★ " + p.stars : "—"}
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(245,243,238,0.7)" }}>
              {p.desc}
            </span>
          </a>
        ))}
      </div>

      <a href={D.socials.github} style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        marginTop: 48, padding: "14px 24px",
        border: "1px solid rgba(245,243,238,0.3)",
        color: "#f5f3ee", textDecoration: "none",
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: "0.16em", textTransform: "uppercase",
      }}>
        See full archive <span style={{ fontSize: 14 }}>→</span>
      </a>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TESTIMONIALS / WORDS
// ─────────────────────────────────────────────────────────────────────────
function EdWords() {
  return (
    <section id="words" style={{ padding: "120px 40px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <SectionHeader number="05" title="Words" sub="From people I've worked with." />

      <div style={{
        marginTop: 80,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 40,
      }}>
        {D.testimonials.map((t, i) => (
          <figure key={i} style={{
            margin: 0, padding: 40,
            border: "1px solid rgba(245,243,238,0.15)",
            background: i % 3 === 0 ? "rgba(245,243,238,0.025)" : "transparent",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: 320,
          }}>
            <div style={{
              fontFamily: ED_DISPLAY, fontSize: 96,
              lineHeight: 0.5, color: "rgba(245,243,238,0.3)", marginBottom: 20,
            }}>“</div>
            <blockquote style={{
              fontFamily: ED_DISPLAY,
              fontSize: 22, lineHeight: 1.35,
              fontWeight: 400, margin: 0, letterSpacing: "-0.012em",
              color: "rgba(245,243,238,0.92)",
            }}>
              {t.quote}
            </blockquote>
            <figcaption style={{
              marginTop: 32, paddingTop: 20,
              borderTop: "1px solid rgba(245,243,238,0.15)",
              display: "flex", justifyContent: "space-between",
              fontFamily: ED_MONO, fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              <span style={{ color: "#f5f3ee" }}>— {t.name}</span>
              <span style={{ color: "rgba(245,243,238,0.5)" }}>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RESUME
// ─────────────────────────────────────────────────────────────────────────
function EdResume() {
  return (
    <section id="resume" style={{ padding: "120px 40px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <SectionHeader number="04" title="Resume" sub="Want the long version?" />
      <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "end" }}>
        <h3 style={{ fontFamily: ED_DISPLAY, fontWeight: 500, fontSize: "clamp(48px, 7vw, 88px)", lineHeight: 0.95, margin: 0, letterSpacing: "-0.035em", textTransform: "uppercase", color: "#f5f3ee" }}>
          Would you like<br/>to know more?
        </h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 24 }}>
          <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", textAlign: "right" }}>
            ¶ Document — PDF
          </div>
          <a href="/assets/ManindradeMelResume.pdf" download style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "20px 32px", border: "1px solid #f5f3ee", color: "#f5f3ee", textDecoration: "none", fontFamily: ED_MONO, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ee"; e.currentTarget.style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f5f3ee"; }}>
            ↓ Download résumé
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────
function EdContact() {
  return (
    <section id="contact" style={{ padding: "160px 40px 80px", borderBottom: "1px solid rgba(245,243,238,0.12)" }}>
      <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", marginBottom: 32 }}>
        ¶ 06 — Let’s work together
      </div>
      <h2 style={{ fontFamily: ED_DISPLAY, fontWeight: 500, fontSize: "clamp(60px, 10vw, 160px)", lineHeight: 0.9, margin: 0, letterSpacing: "-0.045em", textTransform: "uppercase" }}>
        Let’s work<br/>
        <span style={{ WebkitTextStroke: "1.5px #f5f3ee", color: "transparent" }}>together</span>.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginTop: 80 }}>
        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(245,243,238,0.2)" }}>
          <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", marginBottom: 24 }}>¶ Inquire</div>
          <a href={"mailto:" + D.email} style={{ fontFamily: ED_DISPLAY, fontWeight: 500, fontSize: "clamp(28px, 3.6vw, 52px)", letterSpacing: "-0.025em", color: "#f5f3ee", textDecoration: "none", borderBottom: "1px solid rgba(245,243,238,0.4)", paddingBottom: 12, display: "inline-block", wordBreak: "break-all" }}>
            {D.email} →
          </a>
        </div>
        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(245,243,238,0.2)" }}>
          <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", marginBottom: 24 }}>¶ Contact</div>
          <a href={"tel:" + D.phone.replace(/\s/g, "")} style={{ fontFamily: ED_DISPLAY, fontWeight: 500, fontSize: "clamp(28px, 3.6vw, 52px)", letterSpacing: "-0.025em", color: "#f5f3ee", textDecoration: "none", display: "block", marginBottom: 16 }}>
            {D.phone}
          </a>
          <p style={{ fontFamily: ED_MONO, fontSize: 13, lineHeight: 1.7, color: "rgba(245,243,238,0.7)", margin: 0, letterSpacing: "0.02em" }}>
            {D.address}
          </p>
        </div>
      </div>

      <EdContactForm />
      
      <div style={{ marginTop: 80, paddingTop: 24, borderTop: "1px solid rgba(245,243,238,0.2)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", fontFamily: ED_MONO, fontSize: 12, letterSpacing: "0.06em" }}>
        {[
          ["LinkedIn", "/manindra-de-mel", D.socials.linkedin],
          ["GitHub", "@ManindraDeMel", D.socials.github],
          ["Instagram", "@mani.programming", D.socials.instagram],
          ["Local time", null, null],
        ].map(([k, v, href], i) => (
          <div key={k} style={{ paddingRight: 16, paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? "1px solid rgba(245,243,238,0.15)" : "none" }}>
            <div style={{ color: "rgba(245,243,238,0.45)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 10, marginBottom: 8 }}>{k}</div>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#f5f3ee", textDecoration: "none" }}>
                {v} <span style={{ color: "rgba(245,243,238,0.45)" }}>↗</span>
              </a>
            ) : (
              <span style={{ color: "#f5f3ee" }}><LocalTime tz="Australia/Sydney" /></span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
// Contact form — fits the editorial mono aesthetic with hairline underlines.
function EdContactForm() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = React.useState("idle"); // idle | sending | sent
  const [focused, setFocused] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Build a mailto fallback so the form actually does something useful.
    const body = `From: ${form.name} <${form.email}>\n\n${form.message}`;
    const subj = form.subject || "Inquiry from manindra.com.au";
    const href = `mailto:${D.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      window.location.href = href;
      setStatus("sent");
    }, 400);
  };

  const fieldWrap = (key, label, type = "text", multiline = false) => {
    const isFocused = focused === key;
    const hasValue = !!form[key];
    return (
      <label style={{
        display: "block",
        paddingTop: 18,
        paddingBottom: 14,
        borderBottom: `1px solid ${isFocused ? "rgba(245,243,238,0.5)" : "rgba(245,243,238,0.18)"}`,
        transition: "border-color 0.2s",
      }}>
        <div style={{
          fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: isFocused || hasValue ? "rgba(245,243,238,0.85)" : "rgba(245,243,238,0.45)",
          marginBottom: 8,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>{label}</span>
          <span style={{ color: "rgba(245,243,238,0.3)" }}>
            {key === "subject" ? "OPTIONAL" : "REQUIRED"}
          </span>
        </div>
        {multiline ? (
          <textarea
            value={form[key]}
            rows={4}
            onFocus={() => setFocused(key)}
            onBlur={() => setFocused("")}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#f5f3ee",
              fontFamily: ED_DISPLAY, fontSize: 22, lineHeight: 1.4,
              letterSpacing: "-0.01em", resize: "vertical",
              padding: 0,
            }}
            placeholder="Tell me about it…"
          />
        ) : (
          <input
            type={type}
            value={form[key]}
            onFocus={() => setFocused(key)}
            onBlur={() => setFocused("")}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#f5f3ee",
              fontFamily: ED_DISPLAY, fontSize: 28, lineHeight: 1.2,
              letterSpacing: "-0.02em",
              padding: 0,
            }}
            placeholder={
              key === "name" ? "Your full name" :
              key === "email" ? "you@domain.com" :
              key === "subject" ? "What's it about?" : ""
            }
          />
        )}
      </label>
    );
  };

  const ready = form.name && form.email && form.message;

  return (
    <div style={{ marginTop: 100, paddingTop: 48, borderTop: "1px solid rgba(245,243,238,0.2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 60 }}>
        <div>
          <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", marginBottom: 24 }}>¶ Send a brief</div>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: "clamp(36px, 3.6vw, 56px)", lineHeight: 0.95,
            margin: 0, letterSpacing: "-0.035em", color: "#f5f3ee",
            textTransform: "uppercase",
          }}>
            Or fill out<br />the form.
          </h3>
          <p style={{ fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.7, color: "rgba(245,243,238,0.6)", marginTop: 32, maxWidth: 280, letterSpacing: "0.02em" }}>
            Engineering work, research collaborations, or anything in between. Replies typically inside 48 hours.
          </p>
          <div style={{ marginTop: 32, fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,243,238,0.35)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(245,243,238,0.12)" }}>
              <span>Form ID</span><span>FRM·001</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(245,243,238,0.12)" }}>
              <span>Encrypted</span><span>Yes</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span>Routing</span><span>→ {D.email.split("@")[0]}@…</span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {fieldWrap("name", "01 — Name")}
          {fieldWrap("email", "02 — Email", "email")}
          {fieldWrap("subject", "03 — Subject")}
          {fieldWrap("message", "04 — Message", "text", true)}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            <div style={{ fontFamily: ED_MONO, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,243,238,0.45)" }}>
              {status === "sending" ? "→ Opening your mail client…" :
               status === "sent" ? "✓ Sent — thank you." :
               ready ? "→ Ready to send" : "→ Fill in name, email and message to continue"}
            </div>
            <button
              type="submit"
              disabled={!ready || status !== "idle"}
              style={{
                background: ready ? "#f5f3ee" : "transparent",
                color: ready ? "#0a0a0a" : "rgba(245,243,238,0.4)",
                border: "1px solid " + (ready ? "#f5f3ee" : "rgba(245,243,238,0.3)"),
                padding: "16px 32px",
                fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: ready ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {status === "sent" ? "Sent ✓" : "Send Message →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LocalTime({ tz }) {
  const [t, setT] = React.useState("");
  React.useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-AU", { timeZone: tz, hour: "2-digit", minute: "2-digit" }));
    f();
    const id = setInterval(f, 30_000);
    return () => clearInterval(id);
  }, [tz]);
  return <>{t} AEDT</>;
}

// ─────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────
function EdFooter() {
  return (
    <footer style={{
      padding: "40px",
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
      fontFamily: ED_MONO,
      fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
      color: "rgba(245,243,238,0.5)",
    }}>
      <span>© 2026 Manindra de Mel</span>
      <span style={{ textAlign: "center" }}>Set in Helvetica Neue & JetBrains Mono</span>
      <span style={{ textAlign: "right" }}>Vol. 02 / Issue № 14</span>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION HEADER (shared)
// ─────────────────────────────────────────────────────────────────────────
function SectionHeader({ number, title, sub }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 2fr 1fr",
      gap: 40, alignItems: "baseline",
      borderTop: "1px solid rgba(245,243,238,0.2)", paddingTop: 24,
    }}>
      <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)" }}>
        ¶ {number}
      </div>
      <h2 style={{
        fontFamily: ED_DISPLAY, fontWeight: 500,
        fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.92,
        margin: 0, letterSpacing: "-0.035em", textTransform: "uppercase",
      }}>
        {title}
      </h2>
      <div style={{ fontFamily: ED_MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", textAlign: "right" }}>
        {sub}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// FADE-UP — IntersectionObserver-based scroll reveal
// ─────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, distance = 40, duration = 900 }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Find the closest scroll container — handles both the design-canvas focus
    // overlay (which scrolls inside .dc-focus-scroll) and the plain document.
    let scroller = null;
    let p = el.parentElement;
    while (p) {
      const oy = getComputedStyle(p).overflowY;
      if (oy === "auto" || oy === "scroll") { scroller = p; break; }
      p = p.parentElement;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { root: scroller, threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    // Fallback — if it's already in view on mount (top of page), still trigger.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95) {
      setShown(true);
      io.disconnect();
    }
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

function EditorialPortfolio() {
  return (
    <div style={editorialStyles.root}>
      <EdNav />
      <FadeUp><EdHero /></FadeUp>
      <FadeUp delay={80}><EdMarquee /></FadeUp>
      <FadeUp><EdJourney /></FadeUp>
      <FadeUp><EdWork /></FadeUp>
      <FadeUp><EdResume /></FadeUp>
      <FadeUp><EdWords /></FadeUp>
      <FadeUp><EdContact /></FadeUp>
      <FadeUp><EdFooter /></FadeUp>
    </div>
  );
}

window.EditorialPortfolio = EditorialPortfolio;
