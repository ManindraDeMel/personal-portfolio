// Static portfolio data. Dynamic data (timeline, GitHub repos, spotlight project)
// lives in Firestore / GitHub and is fetched at runtime — see src/service/.
const PORTFOLIO = {
  name: "Manindra de Mel",
  location: "Canberra, ACT",
  email: "manindrademel@yahoo.com.au",
  phone: "+61 498 842 763",
  address: "Canberra ACT, AUSTRALIA",
  socials: {
    github: "https://github.com/ManindraDeMel",
    linkedin: "https://www.linkedin.com/in/manindra-de-mel/",
    instagram: "https://www.instagram.com/de_manindra_mel/",
  },
  // The home page is a four-part story index: products → robotics/CV →
  // research → systems. Order is a deliberate reading order.
  story: [
    {
      part: "Production products",
      title: "Plan4Me",
      desc:
        "AI travel planner on iOS & Android — itineraries grounded in live place data, streaming generation with schedule repair, payments and subscriptions. Designed and built independently.",
      metaLines: ["Sole engineer", "Flutter · Python · OpenAI"],
      linkLabel: "plan4me.ai ↗",
      href: "https://plan4me.ai",
      external: true,
    },
    {
      part: "Robotics & computer vision",
      title: "ARM-Wision",
      desc:
        "A vision-guided robotic arm — detection, pose estimation and control, from camera to actuator. Where the software meets the physical world.",
      metaLines: ["Builder", "PyTorch · Embedded"],
      linkLabel: "arm-wision.github.io ↗",
      href: "https://arm-wision.github.io",
      external: true,
    },
    {
      part: "Machine learning research",
      title: "PlantCLEF 2026",
      desc:
        "Accepted to CLEF 2026 — multi-species plant identification in vegetation quadrats. Method, evaluation and results in the full write-up.",
      metaLines: ["Author", "PyTorch · ViT"],
      linkLabel: "Case study →",
      href: "/research/plantclef-2026",
      external: false,
    },
    {
      part: "Systems engineering",
      title: "Client platforms",
      desc:
        "Payments data pipelines, ordering platforms and analytics for fintech and hospitality clients — scoped, shipped and operated in production.",
      metaLines: ["Engineer · Operator", "AWS · React · SQL"],
      linkLabel: "All work →",
      href: "/work",
      external: false,
    },
  ],
  notes: [
    { title: "Lessons building an AI travel planner", state: "In progress" },
    { title: "A perception stack for a vision-guided arm", state: "In progress" },
  ],
  testimonials: [
    {
      name: "John Sarkis",
      role: "CEO, Stomble",
      quote:
        "As team leader for our backend team, Manindra demonstrated an exemplary level of technical proficiency and leadership. His understanding and application of AWS services was instrumental, and his ability to articulate complex technical concepts greatly facilitated our decision-making. Highly recommend.",
    },
    {
      name: "Josh Garretson",
      role: "Extension Astrophysics, ANU",
      quote:
        "Manindra has consistently demonstrated a strong work ethic and highly developed organisational skills. His analytical and problem-solving capability — particularly for problems mixing physical and computational thinking — has developed rapidly. His communication, cooperative nature and enthusiasm motivate his peers.",
    },
    {
      name: "Tom Cook",
      role: "Founder, Our Tutor",
      quote:
        "Manindra took the time to understand the business and the audience, and translated that into a visually stunning, user-friendly interface that truly represents the brand. The website has received numerous positive responses from our customers and significantly boosted our online presence.",
    },
    {
      name: "Quintet Automotive",
      role: "Client",
      quote:
        "Excellent service in data analysis and web scraping for our automotive business. Deep understanding of analytics, ability to extract and process the relevant information, and clear communication throughout. Strongly recommend.",
    },
    {
      name: "Canberra Cloud Kitchen",
      role: "Client",
      quote:
        "Manindra delivered a clean, reliable ordering platform that fit the way our kitchen actually works. He scoped the brief carefully, kept us in the loop through every iteration, and shipped on time. Order flow has been smooth since launch and the back-of-house team picked it up immediately.",
    },
    {
      name: "Rocket Remit",
      role: "Client",
      quote:
        "Strong technical work on our data pipeline and reporting. Manindra understood the regulatory context quickly, asked the right questions, and produced output we could hand straight to the team. Considered, dependable, and easy to work with.",
    },
  ],
};

export default PORTFOLIO;
