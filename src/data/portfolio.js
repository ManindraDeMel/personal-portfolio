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
        "AI travel planner on iOS & Android. Itineraries grounded in live place data, streaming generation with schedule repair, payments and subscriptions. Designed and built independently.",
      metaLines: ["Sole engineer", "Flutter · Python · OpenAI"],
      linkLabel: "plan4me.ai ↗",
      href: "https://plan4me.ai",
      external: true,
    },
    {
      part: "Machine learning research",
      title: "PlantCLEF 2026",
      desc:
        "ANU's submission to PlantCLEF 2026. A partial fine-tune of BioCLIP 2.5 ViT-H/14 with auxiliary taxonomic heads, predicting every species in a vegetation-quadrat image across ~7,800 candidates. Best public Macro F1 of 0.418.",
      metaLines: ["Co-author, corresponding", "BioCLIP · ViT-H/14"],
      linkLabel: "Case study →",
      href: "/research/plantclef-2026",
      external: false,
    },
    {
      part: "Systems engineering",
      title: "Client platforms",
      desc:
        "Payments data pipelines, ordering platforms and analytics for fintech and hospitality clients. Scoped, shipped and operated in production.",
      metaLines: ["Engineer · Operator", "AWS · React · SQL"],
      linkLabel: "All work →",
      href: "/work",
      external: false,
    },
  ],
  notes: [
    { title: "Lessons building an AI travel planner", state: "In progress" },
    { title: "Fine-tuning BioCLIP 2.5 for PlantCLEF 2026", state: "In progress" },
  ],
  // Live sites for the /sites tab. `embed: false` renders a link card for
  // sites that send X-Frame-Options / frame-ancestors and refuse to iframe.
  sites: [
    {
      name: "Plan4Me",
      url: "https://plan4me.ai",
      year: "2026",
      role: "Founder / Engineer",
      desc: "Product site for the Plan4Me AI travel planner on iOS & Android.",
      embed: true,
    },
    {
      name: "Harin's Teas",
      url: "https://www.harinsteas.com.au/",
      year: "2024",
      role: "Founder / Engineer",
      desc: "Custom Next.js e-commerce storefront for a premium Sri Lankan tea brand spanning Sri Lanka, the US, and Australia.",
      embed: true,
    },
    {
      name: "Canberra Cloud Kitchen",
      url: "https://canberracloudkitchen.com.au/",
      year: "2023",
      role: "Founder / Engineer",
      desc: "Direct-to-customer ordering platform for a delivery-only kitchen, replacing third-party marketplace fees.",
      embed: true,
    },
    {
      name: "PlantCLEF 2026",
      url: "https://arm-wision.github.io/",
      year: "2026",
      role: "Co-author",
      desc: "Project site for ANU's PlantCLEF 2026 submission.",
      embed: true,
    },
    {
      name: "Rocket Remit",
      url: "https://www.rocketremit.com/",
      year: "2023 · present",
      role: "Frontend Developer / Data Analyst",
      desc: "International remittance to 70+ countries. The site declines embedding, so open it directly.",
      embed: false,
    },
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
