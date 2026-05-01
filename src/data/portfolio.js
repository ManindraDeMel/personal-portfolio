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
  marquee: [
    "Python", "Haskell", "C / C++", "Assembly", "TypeScript", "Rust",
    "APL", "React", "Vue", "Svelte", "AWS", "Google Cloud",
    "Firebase", "PyTorch", "NumPy", "Linux",
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
