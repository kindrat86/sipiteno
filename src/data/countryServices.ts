// Service highlights by country for pSEO content generation

export interface ServiceHighlight {
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface CountryServiceInfo {
  serviceName: string;
  subtitle: string;
  serviceSlug: string;
  highlights: ServiceHighlight[];
  approach: string[];
}

export const BUSINESS_SERVICES: Record<string, CountryServiceInfo> = {
  "business-development": {
    serviceName: "Business Development & Partnerships",
    subtitle: "B2B Growth Strategy",
    serviceSlug: "business-development",
    highlights: [
      {
        title: "In-Market Lead Generation",
        description: "Targeted B2B lead generation with local market intelligence and warm introductions from our established network.",
        icon: "Target"
      },
      {
        title: "Strategic Partnership Development",
        description: "Identify, vet, and structure partnerships with local technology companies, distributors, and industry associations.",
        icon: "Handshake"
      },
      {
        title: "Market Entry Strategy",
        description: "Comprehensive go-to-market planning including regulatory navigation, partner identification, and local team setup.",
        icon: "Globe"
      },
      {
        title: "Sales Enablement",
        description: "Local market intelligence, cultural guidance, and in-person meeting facilitation to close deals faster.",
        icon: "TrendingUp"
      }
    ],
    approach: [
      "Week 1-2: Market assessment and opportunity sizing",
      "Week 3-4: Target account identification and outreach strategy",
      "Week 5-8: Pipeline building with warm introductions",
      "Week 9+: Ongoing relationship development and deal support"
    ]
  },
  "ai-consulting": {
    serviceName: "AI Consulting",
    subtitle: "Strategy & Implementation",
    serviceSlug: "ai-consulting",
    highlights: [
      {
        title: "AI Strategy Development",
        description: "Custom AI roadmaps aligned with local business challenges and market opportunities.",
        icon: "Brain"
      },
      {
        title: "Machine Learning Implementation",
        description: "End-to-end ML model development and deployment for business-specific use cases.",
        icon: "Zap"
      },
      {
        title: "Intelligent Automation",
        description: "Process automation solutions that reduce operational costs and improve efficiency.",
        icon: "BarChart3"
      },
      {
        title: "Team Training",
        description: "Knowledge transfer and team upskilling to ensure long-term AI capability building.",
        icon: "Users"
      }
    ],
    approach: [
      "Week 1-2: Business challenge assessment and AI opportunity identification",
      "Week 3-6: Solution architecture and PoC development",
      "Week 7-12: Full implementation and integration",
      "Week 13-16: Team training and handover"
    ]
  },
  "digital-marketing": {
    serviceName: "Digital Marketing",
    subtitle: "Localized Growth",
    serviceSlug: "digital-marketing",
    highlights: [
      {
        title: "Localized SEO",
        description: "Search engine optimization targeted at local language queries and regional search patterns.",
        icon: "Search"
      },
      {
        title: "Content Marketing",
        description: "Multilingual content strategy and creation tailored to local business audiences.",
        icon: "FileText"
      },
      {
        title: "Social Media Management",
        description: "Platform-specific strategies for LinkedIn, local social networks, and business communities.",
        icon: "Share2"
      },
      {
        title: "B2B Email Marketing",
        description: "Targeted email campaigns with localized messaging and culturally-adapted communication.",
        icon: "Mail"
      }
    ],
    approach: [
      "Week 1: Market research and keyword analysis",
      "Week 2-3: Content strategy development and asset creation",
      "Week 4: Campaign launch and initial optimization",
      "Week 5+: Continuous optimization and reporting"
    ]
  },
  "it-consulting": {
    serviceName: "IT Consulting",
    subtitle: "Technology Optimization",
    serviceSlug: "it-consulting",
    highlights: [
      {
        title: "Digital Transformation",
        description: "End-to-end transformation strategy tailored to local market conditions and business maturity.",
        icon: "RefreshCw"
      },
      {
        title: "Technology Assessment",
        description: "Comprehensive evaluation of technology stacks with actionable modernization recommendations.",
        icon: "Settings"
      },
      {
        title: "Cloud Migration",
        description: "Strategic cloud migration planning and execution optimized for regional infrastructure.",
        icon: "Cloud"
      },
      {
        title: "Security & Compliance",
        description: "GDPR compliance, local data protection regulations, and cybersecurity assessment.",
        icon: "Shield"
      }
    ],
    approach: [
      "Week 1-2: Current state assessment and gap analysis",
      "Week 3-4: Architecture design and vendor selection",
      "Week 5-8: Implementation and migration",
      "Week 9-12: Testing, optimization, and knowledge transfer"
    ]
  },
  "project-management": {
    serviceName: "Project Management",
    subtitle: "Agile Delivery",
    serviceSlug: "project-management",
    highlights: [
      {
        title: "Agile & Scrum Implementation",
        description: "Framework setup and coaching for distributed teams across different time zones and cultures.",
        icon: "ClipboardList"
      },
      {
        title: "Cross-Border Team Coordination",
        description: "Manage multicultural, multi-timezone teams with cultural sensitivity and effective communication.",
        icon: "Users"
      },
      {
        title: "Risk Management",
        description: "Proactive risk identification and mitigation specific to regional business environments.",
        icon: "AlertTriangle"
      },
      {
        title: "Stakeholder Communication",
        description: "Multilingual reporting and stakeholder management across different business cultures.",
        icon: "BarChart3"
      }
    ],
    approach: [
      "Month 1: Team setup, methodology definition, and sprint planning",
      "Ongoing: Sprint execution with weekly stakeholder reviews",
      "Monthly: Performance reporting and continuous improvement",
      "Quarterly: Strategic alignment reviews and roadmap updates"
    ]
  },
  "sales-funnel": {
    serviceName: "Sales Funnel Setup",
    subtitle: "Conversion Optimization",
    serviceSlug: "sales-funnel",
    highlights: [
      {
        title: "Localized Landing Pages",
        description: "Conversion-optimized landing pages with culturally adapted copy and design.",
        icon: "Layout"
      },
      {
        title: "Multi-Channel Funnels",
        description: "Funnel design integrating LinkedIn, Google Ads, email, and local business networks.",
        icon: "MousePointerClick"
      },
      {
        title: "Email Automation",
        description: "Automated nurturing sequences with localized content and timing optimization.",
        icon: "Zap"
      },
      {
        title: "Analytics & Attribution",
        description: "Full-funnel analytics with regional attribution models and conversion tracking.",
        icon: "BarChart3"
      }
    ],
    approach: [
      "Week 1-2: Funnel strategy and customer journey mapping",
      "Week 3-4: Landing page design and copywriting",
      "Week 5-6: Automation setup and integration",
      "Week 7-8: Testing, launch, and optimization"
    ]
  }
};

export function getServiceInfo(slug: string): CountryServiceInfo | undefined {
  return BUSINESS_SERVICES[slug];
}

export const ALL_SERVICE_SLUGS = Object.keys(BUSINESS_SERVICES);
