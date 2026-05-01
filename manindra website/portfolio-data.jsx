// Shared data for both portfolio directions
const PORTFOLIO_DATA = {
  name: "Manindra de Mel",
  location: "Canberra, ACT",
  role: "Software Engineer · ML Researcher",
  years: "5+ years",
  intro: "Based in the heart of Canberra, with over 5 years across the IT industry. My work spans data science and deep machine learning in Python, web engineering in React, Vue and Svelte, low-level programming in Assembly, C and C++, and functional programming in Haskell. I've built extensively on Firebase, Android Studio, Google Cloud and AWS. The diversity is the point — I thrive in the challenge of untangling complex computer science problems and weaving innovative, effective solutions.",
  shortBio: "Software engineer based in Canberra. I work across ML research, systems programming, and web — currently undergrad CS at ANU.",
  email: "manindrademel@yahoo.com.au",
  phone: "+61 498 842 763",
  address: "Gungahlin Area, Canberra ACT, 2914 AUSTRALIA",
  socials: {
    github: "https://github.com/ManindraDeMel",
    linkedin: "https://www.linkedin.com/in/manindra-de-mel-413a79160/",
    instagram: "https://www.instagram.com/mani.programming/",
  },
  stack: {
    languages: ["Python", "Haskell", "C / C++", "Assembly", "TypeScript", "Rust", "APL"],
    web: ["React", "Vue", "Svelte", "Next.js", "Tailwind"],
    cloud: ["AWS", "Google Cloud", "Firebase", "Vercel"],
    ml: ["PyTorch", "scikit-learn", "NumPy", "Pandas"],
    other: ["Android Studio", "Git", "Docker", "Linux"],
  },
  journey: [
    {
      year: "2026",
      subtitle: "Continuing CS at ANU · ML Research",
      points: [
        "Currently exploring array-oriented programming languages — APL, J, BQN — as part of a personal study into expressive notation as a tool of thought.",
        "Working on a research direction in real-time engine tuning via reinforcement learning, applied to internal combustion engine parameter optimisation.",
        "Continuing contract work in cloud architecture and full-stack web for small businesses across Canberra.",
      ],
    },
    {
      year: "2024",
      subtitle: "A deep dive into both ML research and finance",
      points: [
        "Competed in the Jane Street Electronic Trading Challenge, applying quantitative trading strategies in a highly competitive simulated electronic market — honed skills in algorithmic trading, financial modelling and real-time decision-making under pressure.",
        "Developed a research proposal — Enhancing Engine Efficiency and Performance through Machine Learning — using ML algorithms for real-time engine tuning, improving performance, efficiency and environmental impact.",
        "Backend lead at Stomble; coordinated AWS architecture and team delivery directly with the CEO.",
      ],
    },
    {
      year: "2023",
      subtitle: "Began undergraduate CS at the Australian National University",
      points: [
        "Started a Bachelor of Advanced Computing at ANU, focusing on theoretical computer science, type theory, and algorithms.",
        "Built and shipped Our Tutor — a custom website and booking platform for a tutoring business, delivered end-to-end from brief to deploy.",
        "Wrote production data-pipeline tooling for Quintet Automotive, scraping and cleaning sourcing data across multiple suppliers.",
      ],
    },
    {
      year: "2022",
      subtitle: "Year 12 · stepping into industry",
      points: [
        "Completed the ACT Certificate of Education with a focus on Specialist Mathematics, Physics and Software Development.",
        "First commercial engagements as a freelance developer — small Firebase + React builds, automation scripts.",
        "Began contributing to open-source repositories around array-oriented language tooling.",
      ],
    },
    {
      year: "2020",
      subtitle: "First lines of production code",
      points: [
        "Started building software seriously — initial focus on Python, web, and the Android stack.",
        "Built and shipped a handful of personal projects ranging from data scrapers to small games.",
      ],
    },
  ],
  projects: [
    { name: "engine-tune-rl", year: "2026", lang: "Python · PyTorch", stars: 14, desc: "Reinforcement learning agent for real-time internal combustion engine parameter tuning. Research project exploring whether RL can outperform classical control under noisy load conditions.",
      featured: {
        status: "In progress · Q2 2026",
        role: "Sole researcher & engineer",
        collaborators: "Self-directed · ANU CECS",
        problem: "Internal combustion engines are tuned in advance for a fixed envelope of operating conditions — load, fuel quality, altitude, temperature. The result is a calibration that is safe everywhere and optimal almost nowhere. Classical adaptive control improves on this, but the gain models still have to be hand-built for each engine.",
        approach: "I'm training a soft-actor-critic agent to act as a closed-loop ECU layer — observing intake pressure, knock sensor, lambda, RPM and load, and emitting trim corrections to ignition timing and fuel. The simulator is a high-fidelity 1D engine model; the agent transfers to a single-cylinder bench rig at the end of the study.",
        outcome: "Early sim results: ~6% BSFC improvement at part-load and a measurable reduction in knock margin overhead vs. a tuned PID baseline. Bench validation begins July 2026.",
        stack: ["PyTorch", "Stable-Baselines3", "GT-Power", "Python", "Linux real-time"],
      }
    },
    { name: "apl-notebook", year: "2026", lang: "APL · Web", stars: 31, desc: "A browser-based notebook for Dyalog APL with a custom keyboard, glyph picker, and live-evaluation cells. Built to scratch a personal itch while learning the language." },
    { name: "jane-street-etc", year: "2024", lang: "Python", stars: 8, desc: "Submission for the Jane Street Electronic Trading Challenge. Market-making and arbitrage agents over a simulated limit-order book." },
    { name: "haskell-typer", year: "2024", lang: "Haskell", stars: 22, desc: "Toy bidirectional type checker for a small dependently-typed lambda calculus. Companion to my type-theory reading group notes." },
    { name: "ourtutor.com.au", year: "2023", lang: "React · Firebase", stars: null, desc: "Full custom website and booking platform for a Canberra tutoring business. Brief, design, build, deploy, handoff." },
    { name: "stomble-backend", year: "2023", lang: "Node · AWS", stars: null, desc: "Led the backend team at Stomble — designed the AWS architecture, ran sprint cadence with the CEO, and owned core API delivery." },
    { name: "quintet-scrape", year: "2023", lang: "Python", stars: 4, desc: "Multi-source scraping + cleaning pipeline for an automotive parts business. Daily refresh into a unified inventory schema." },
    { name: "asm-renderer", year: "2022", lang: "x86-64 ASM", stars: 19, desc: "Software rasteriser written from scratch in x86-64 assembly. Mostly an exercise in patience; teaches you a lot about cache lines." },
  ],
  testimonials: [
    { name: "John Sarkis", role: "CEO, Stomble", quote: "As team leader for our backend team, Manindra demonstrated an exemplary level of technical proficiency and leadership. His understanding and application of AWS services was instrumental, and his ability to articulate complex technical concepts greatly facilitated our decision-making. Highly recommend." },
    { name: "Josh Garretson", role: "Extension Astrophysics, ANU", quote: "Manindra has consistently demonstrated a strong work ethic and highly developed organisational skills. His analytical and problem-solving capability — particularly for problems mixing physical and computational thinking — has developed rapidly. His communication, cooperative nature and enthusiasm motivate his peers." },
    { name: "Tom Cook", role: "Founder, Our Tutor", quote: "Manindra took the time to understand the business and the audience, and translated that into a visually stunning, user-friendly interface that truly represents the brand. The website has received numerous positive responses from our customers and significantly boosted our online presence." },
    { name: "Quintet Automotive", role: "Client", quote: "Excellent service in data analysis and web scraping for our automotive business. Deep understanding of analytics, ability to extract and process the relevant information, and clear communication throughout. Strongly recommend." },
  ],
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
