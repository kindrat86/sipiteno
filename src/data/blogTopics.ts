// 15-day topic rotation schedule for Sipiteno blog content

export interface BlogTopic {
  day: number;
  week: number;
  weekTheme: string;
  topic: string;
  description: string;
}

export const BLOG_TOPICS: BlogTopic[] = [
  // Week 1 – Speed to Market
  {
    day: 1,
    week: 1,
    weekTheme: "Speed to Market",
    topic: "From Napkin Sketch to First Paying Customer in 4 Weeks: The MicroSaaS Blueprint",
    description: "The complete playbook for validating and shipping a product in record time"
  },
  {
    day: 2,
    week: 1,
    weekTheme: "Speed to Market",
    topic: "Why 60 Days Is the Absolute Limit for Your First Product Build",
    description: "The economics and psychology of rapid validation"
  },
  {
    day: 3,
    week: 1,
    weekTheme: "Speed to Market",
    topic: "Stop Hiring Full-Time Devs for Your First Product: The Case for Agency Execution",
    description: "When and why agency partnerships outperform in-house builds"
  },
  {
    day: 4,
    week: 1,
    weekTheme: "Speed to Market",
    topic: "What We Cut Ruthlessly to Ship VoiceLogPro in Under 8 Weeks",
    description: "Real scope decisions from a real product build"
  },
  {
    day: 5,
    week: 1,
    weekTheme: "Speed to Market",
    topic: "The Hidden Cost of \"One More Feature\" in Early-Stage Products",
    description: "How feature creep kills speed and burns capital"
  },
  
  // Week 2 – Vertical & Niche SaaS
  {
    day: 6,
    week: 2,
    weekTheme: "Vertical & Niche SaaS",
    topic: "Case Study: How VoiceLogPro Saves Construction Crews 5 Hours a Week",
    description: "Deep dive into a blue-collar SaaS success story"
  },
  {
    day: 7,
    week: 2,
    weekTheme: "Vertical & Niche SaaS",
    topic: "Why Blue-Collar SaaS Wins Faster Than B2B Dashboards",
    description: "The untapped opportunity in trade and service industries"
  },
  {
    day: 8,
    week: 2,
    weekTheme: "Vertical & Niche SaaS",
    topic: "Automating Consulting: How FunnelFixer Turned Expertise Into Software",
    description: "Productizing knowledge into a scalable MicroSaaS"
  },
  {
    day: 9,
    week: 2,
    weekTheme: "Vertical & Niche SaaS",
    topic: "Why Logistics, Construction, and Agriculture Are MicroSaaS Goldmines",
    description: "Industries desperate for modern tooling"
  },
  {
    day: 10,
    week: 2,
    weekTheme: "Vertical & Niche SaaS",
    topic: "Internal Tools Beat Startups: The Overlooked MicroSaaS Opportunity",
    description: "Building for enterprises instead of competing with them"
  },
  
  // Week 3 – AI Wrappers & Technical Strategy
  {
    day: 11,
    week: 3,
    weekTheme: "AI Wrappers & Technical Strategy",
    topic: "Building an AI Wrapper That Doesn't Die When ChatGPT Updates",
    description: "Architecture patterns for resilient AI products"
  },
  {
    day: 12,
    week: 3,
    weekTheme: "AI Wrappers & Technical Strategy",
    topic: "Why Workflow > AI Model in MicroSaaS Products",
    description: "The real value is in the process, not the API call"
  },
  {
    day: 13,
    week: 3,
    weekTheme: "AI Wrappers & Technical Strategy",
    topic: "How We Scope AI Features to Ship in Weeks, Not Quarters",
    description: "Practical AI integration without analysis paralysis"
  },
  {
    day: 14,
    week: 3,
    weekTheme: "AI Wrappers & Technical Strategy",
    topic: "The React + Supabase Stack: Built for Rapid Shipping, Not Science Projects",
    description: "Why this stack wins for rapid development"
  },
  {
    day: 15,
    week: 3,
    weekTheme: "AI Wrappers & Technical Strategy",
    topic: "When NOT to Use AI in Your First Product",
    description: "Knowing when to skip the hype and ship simpler"
  }
];

export function getTopicByDay(day: number): BlogTopic | undefined {
  return BLOG_TOPICS.find(t => t.day === day);
}

export function getTopicsByWeek(week: number): BlogTopic[] {
  return BLOG_TOPICS.filter(t => t.week === week);
}

export function getCurrentDayInCycle(): number {
  // Calculate current day in 15-day cycle based on start date
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return (diffDays % 15) + 1;
}
