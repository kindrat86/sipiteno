export interface Project {
  id: number;
  name: string;
  industry: string;
  technology: string;
  status: "Completed" | "In Progress";
  description: string;
  challenges: string;
  solution: string;
  results: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "FinanceFlow AI",
    industry: "FinTech",
    technology: "React, Node.js, TensorFlow, PostgreSQL",
    status: "Completed",
    description: "AI-powered financial analytics platform for SMEs in Eastern Europe, providing real-time insights and predictive modeling.",
    challenges: "Complex regulatory requirements across multiple jurisdictions and need for real-time data processing.",
    solution: "Built a modular architecture with country-specific compliance modules and implemented efficient data streaming.",
    results: "Successfully launched in 3 countries with 500+ active users and 95% customer satisfaction rate."
  },
  {
    id: 2,
    name: "HealthConnect",
    industry: "HealthTech",
    technology: "React Native, Firebase, Python, ML",
    status: "In Progress",
    description: "Telemedicine platform connecting patients with healthcare providers across rural Eastern European regions.",
    challenges: "Limited internet infrastructure in rural areas and multi-language support requirements.",
    solution: "Optimized for low-bandwidth connections with offline capabilities and integrated 6 local languages.",
    results: "Currently in beta testing with 200+ medical professionals onboarded."
  },
  {
    id: 3,
    name: "RetailOptimize Pro",
    industry: "E-commerce",
    technology: "Vue.js, Django, Redis, AWS",
    status: "Completed",
    description: "Inventory management and pricing optimization tool for e-commerce businesses in emerging markets.",
    challenges: "Volatile market conditions and integration with diverse payment systems.",
    solution: "Dynamic pricing algorithm with real-time market data integration and universal payment gateway.",
    results: "15% average profit increase for clients, processing $2M+ in transactions monthly."
  },
  {
    id: 4,
    name: "EduTrack System",
    industry: "EdTech",
    technology: "Angular, .NET Core, MongoDB",
    status: "Completed",
    description: "Learning management system tailored for vocational training institutions in Kazakhstan and Uzbekistan.",
    challenges: "Outdated existing systems and need for gradual migration without disrupting operations.",
    solution: "Phased migration approach with parallel systems and comprehensive training program.",
    results: "Deployed across 20 institutions, serving 10,000+ students with 40% improved engagement."
  },
  {
    id: 5,
    name: "AgriTech Monitor",
    industry: "AgriTech",
    technology: "React, IoT, Python, TimescaleDB",
    status: "In Progress",
    description: "IoT-enabled crop monitoring and yield prediction platform for agricultural cooperatives.",
    challenges: "Harsh environmental conditions for sensors and limited technical expertise among end users.",
    solution: "Ruggedized IoT devices with intuitive mobile-first interface and automated alerts.",
    results: "Piloting with 50 farms, early data shows 20% reduction in water usage."
  },
  {
    id: 6,
    name: "LogiChain Pro",
    industry: "Logistics",
    technology: "Next.js, GraphQL, PostgreSQL, Docker",
    status: "Completed",
    description: "Supply chain visibility platform for cross-border logistics in Eastern European trade corridors.",
    challenges: "Complex customs procedures and need for real-time tracking across multiple carriers.",
    solution: "API integrations with 15+ carriers and customs systems, blockchain for document verification.",
    results: "Reduced customs clearance time by 30%, handling 5,000+ shipments monthly."
  },
  {
    id: 7,
    name: "TalentMatch AI",
    industry: "HR Tech",
    technology: "React, Python, NLP, PostgreSQL",
    status: "Completed",
    description: "AI-powered recruitment platform matching tech talent with opportunities across the region.",
    challenges: "Diverse skill sets and qualifications across countries, language barriers in assessments.",
    solution: "Multilingual NLP model for resume parsing and standardized skill assessment framework.",
    results: "1,000+ successful placements, 80% candidate-company match satisfaction rate."
  },
  {
    id: 8,
    name: "CyberShield Suite",
    industry: "Cybersecurity",
    technology: "Vue.js, Go, Elasticsearch, Kubernetes",
    status: "In Progress",
    description: "Comprehensive cybersecurity monitoring and threat detection platform for SMEs.",
    challenges: "Limited cybersecurity awareness and budget constraints among target users.",
    solution: "Affordable tiered pricing model with automated threat detection and user-friendly dashboards.",
    results: "Currently protecting 150+ businesses, detected and prevented 500+ threats."
  },
  {
    id: 9,
    name: "PropertyPulse",
    industry: "PropTech",
    technology: "React, Node.js, MongoDB, Mapbox",
    status: "Completed",
    description: "Real estate market analytics and property management platform for emerging markets.",
    challenges: "Fragmented property data sources and varying legal frameworks across regions.",
    solution: "Data aggregation from 20+ sources with country-specific legal compliance modules.",
    results: "Used by 300+ real estate professionals, tracking $100M+ in property values."
  },
  {
    id: 10,
    name: "EventHub Connect",
    industry: "Event Management",
    technology: "React, Firebase, Stripe, WebRTC",
    status: "Completed",
    description: "Hybrid event platform supporting both in-person and virtual attendees with networking features.",
    challenges: "Seamless experience between physical and virtual attendees, multiple payment methods.",
    solution: "Integrated WebRTC for live streaming and breakout rooms, local payment gateway support.",
    results: "Hosted 100+ events with 50,000+ total attendees, 4.8/5 average rating."
  },
  {
    id: 11,
    name: "ContentCreator Studio",
    industry: "Marketing Tech",
    technology: "React, Python, OpenAI API, AWS S3",
    status: "In Progress",
    description: "AI-assisted content creation and social media management tool for regional businesses.",
    challenges: "Need for culturally appropriate content and support for Cyrillic and Latin scripts.",
    solution: "Custom AI models trained on regional content with multi-script text editor.",
    results: "Beta users creating 1,000+ pieces of content monthly with 60% time savings."
  },
  {
    id: 12,
    name: "GreenEnergy Dashboard",
    industry: "CleanTech",
    technology: "Angular, Python, InfluxDB, Grafana",
    status: "Completed",
    description: "Energy consumption monitoring and optimization platform for commercial buildings.",
    challenges: "Legacy building management systems and diverse energy metering standards.",
    solution: "Universal API adapters for legacy systems and predictive analytics for optimization.",
    results: "Deployed in 80 buildings, achieving average 18% energy cost reduction."
  }
];
