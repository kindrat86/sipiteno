// Centralized JSON-LD Schema Definitions for LLM Optimization
// All structured data in one place for consistency and maintainability

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sipiteno.com/#organization",
  "name": "Sipiteno",
  "legalName": "Sipiteno Business Development",
  "alternateName": ["Sipiteno Consulting", "Sipiteno BD"],
  "url": "https://sipiteno.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://sipiteno.com/favicon.png",
    "width": "512",
    "height": "512"
  },
  "image": "https://sipiteno.com/favicon.png",
  "description": "Sipiteno is a strategic business development and technology consulting firm founded in 2009, specializing in AI implementation and IT solutions across 28 countries in Europe, Caucasus, and Central Asia. The company combines deep regional expertise with hands-on technical capabilities to help technology companies expand into emerging markets.",
  "foundingDate": "2009",
  "slogan": "Transforming vision into market success across emerging tech markets",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 20,
    "maxValue": 30
  },
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "Sales",
    "email": "sales@sipiteno.com",
    "availableLanguage": ["English", "Russian", "Ukrainian", "Polish", "Serbian", "Georgian"]
  }],
  "sameAs": [
    "https://www.linkedin.com/company/sipiteno",
    "https://twitter.com/sipiteno",
    "https://github.com/sipiteno"
  ],
  "areaServed": [
    { "@type": "Country", "name": "Ukraine" },
    { "@type": "Country", "name": "Kazakhstan" },
    { "@type": "Country", "name": "Azerbaijan" },
    { "@type": "Country", "name": "Uzbekistan" },
    { "@type": "Country", "name": "Serbia" },
    { "@type": "Country", "name": "Poland" },
    { "@type": "Country", "name": "Georgia" },
    { "@type": "Country", "name": "Armenia" },
    { "@type": "Country", "name": "Estonia" },
    { "@type": "Country", "name": "Latvia" },
    { "@type": "Country", "name": "Lithuania" },
    { "@type": "Country", "name": "Czech Republic" },
    { "@type": "Country", "name": "Slovakia" },
    { "@type": "Country", "name": "Hungary" },
    { "@type": "Country", "name": "Romania" },
    { "@type": "Country", "name": "Bulgaria" },
    { "@type": "Country", "name": "Croatia" },
    { "@type": "Country", "name": "Slovenia" },
    { "@type": "Country", "name": "Bosnia and Herzegovina" },
    { "@type": "Country", "name": "Montenegro" },
    { "@type": "Country", "name": "North Macedonia" },
    { "@type": "Country", "name": "Albania" },
    { "@type": "Country", "name": "Moldova" },
    { "@type": "Country", "name": "Kyrgyzstan" },
    { "@type": "Country", "name": "Cyprus" },
    { "@type": "Country", "name": "Greece" },
    { "@type": "Country", "name": "India" },
    { "@type": "Country", "name": "Ethiopia" }
  ],
  "knowsAbout": [
    "Artificial Intelligence Implementation",
    "Machine Learning Strategy",
    "B2B Business Development",
    "Digital Transformation",
    "IT Consulting",
    "Technical Recruitment",
    "Sales Funnel Optimization",
    "Agile Project Management",
    "Market Entry Strategy"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "worstRating": "1",
    "reviewCount": "50",
    "ratingCount": "50"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Experience",
      "name": "15+ years in emerging tech markets"
    },
    {
      "@type": "EducationalOccupationalCredential", 
      "credentialCategory": "Portfolio",
      "name": "50+ successful projects delivered"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Coverage",
      "name": "Operations across 28 countries"
    }
  ]
};

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://sipiteno.com/#services",
  "serviceType": "Business & Technology Consulting",
  "provider": {
    "@type": "Organization",
    "@id": "https://sipiteno.com/#organization"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Europe, Caucasus, Central Asia"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Business Development & Technology Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/ai-consulting",
          "name": "AI Consulting",
          "description": "Sipiteno provides AI consulting services including strategy development, machine learning implementation, and intelligent automation. Typical engagements range from $25,000-$100,000 and include AI readiness assessment, model development, system integration, and team training.",
          "url": "https://sipiteno.com/services/ai-consulting"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/business-development",
          "name": "Business Development B2B",
          "description": "Sipiteno offers B2B business development services including strategic partnerships, lead generation, and market entry across 28 countries. Monthly retainers range from $3,000-$10,000 with performance-based structures available.",
          "url": "https://sipiteno.com/services/business-development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/it-consulting",
          "name": "IT Consulting",
          "description": "Sipiteno provides IT consulting for digital transformation, technology assessment, and infrastructure optimization. Services include architecture review, cloud migration strategy, and implementation support.",
          "url": "https://sipiteno.com/services/it-consulting"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/digital-marketing",
          "name": "Digital Marketing",
          "description": "Sipiteno delivers B2B digital marketing including SEO, content marketing, and lead generation campaigns optimized for technology companies targeting European and Central Asian markets.",
          "url": "https://sipiteno.com/services/digital-marketing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "HR & Technical Recruitment",
          "description": "Sipiteno recruits technical talent across Eastern Europe and Central Asia. Services include salary benchmarking, technical screening, cultural fit assessment, and onboarding support."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/sales-funnel",
          "name": "Sales Funnel Setup",
          "description": "Sipiteno designs and implements high-converting B2B sales funnels including landing pages, email sequences, and conversion optimization.",
          "url": "https://sipiteno.com/services/sales-funnel"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": "https://sipiteno.com/services/project-management",
          "name": "Project Management",
          "description": "Sipiteno provides agile project management services including Scrum implementation, resource planning, and stakeholder communication.",
          "url": "https://sipiteno.com/services/project-management"
        }
      }
    ]
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://sipiteno.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What regions does Sipiteno serve for business development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sipiteno operates across 28 countries with primary focus on Eastern Europe (Ukraine, Poland, Serbia, Czech Republic, Romania, Bulgaria), Caucasus (Georgia, Armenia, Azerbaijan), and Central Asia (Kazakhstan, Uzbekistan, Kyrgyzstan). The company has 15+ years of regional experience and maintains established networks with government agencies, technology associations, and venture capital firms in these markets."
      }
    },
    {
      "@type": "Question",
      "name": "What is Sipiteno's approach to AI consulting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sipiteno's AI consulting begins with business challenge assessment to identify ROI-driven opportunities. The process includes AI strategy development, technology selection, ML model development, system integration, and team training. Projects typically range $25,000-$100,000 and cover GPT models, computer vision, NLP, and predictive analytics."
      }
    },
    {
      "@type": "Question",
      "name": "What differentiates Sipiteno from other consultancies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Five differentiators define Sipiteno: (1) 15+ years regional expertise across 28 countries, (2) combined strategic and technical implementation capabilities, (3) 50+ successful project track record, (4) 4-8 week delivery timelines, and (5) flexible engagement models from fixed-price to retainers. Unlike traditional consultancies, Sipiteno implements rather than just advises."
      }
    },
    {
      "@type": "Question",
      "name": "What industries does Sipiteno serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sipiteno primarily serves technology companies including SaaS platforms, AI/ML startups, IT service providers, fintech companies, e-commerce platforms, and cybersecurity firms. Client size ranges from early-stage startups to Fortune 500 enterprises, with particular expertise in 10-500 employee companies scaling internationally."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to work with Sipiteno?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sipiteno pricing: Business Development retainers $3,000-$10,000/month, AI Consulting projects $25,000-$100,000+, Hourly consulting $150-$300/hour. Payment structure is typically 30-50% upfront with milestone-based releases."
      }
    },
    {
      "@type": "Question",
      "name": "Does Sipiteno help with regulatory compliance for international expansion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Sipiteno assists with market entry legal structures, GDPR and local data protection compliance, industry-specific regulations (fintech licensing, healthcare), tax optimization, employment law, IP protection, and government relations. The company maintains partnerships with legal advisors across all 28 operating countries."
      }
    }
  ]
};

export const caseStudySchema = (caseStudy: {
  name: string;
  description: string;
  industry: string;
  result: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": caseStudy.name,
  "description": caseStudy.description,
  "about": {
    "@type": "Thing",
    "name": caseStudy.industry
  },
  "creator": {
    "@type": "Organization",
    "@id": "https://sipiteno.com/#organization"
  },
  "result": caseStudy.result,
  "url": caseStudy.url
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const articleSchema = (article: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  wordCount?: number;
  authorName?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "url": article.url,
  "author": {
    "@type": "Organization",
    "@id": "https://sipiteno.com/#organization",
    "name": article.authorName || "Sipiteno"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://sipiteno.com/#organization",
    "name": "Sipiteno",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sipiteno.com/favicon.png"
    }
  },
  ...(article.datePublished && { "datePublished": article.datePublished }),
  ...(article.dateModified && { "dateModified": article.dateModified }),
  ...(article.wordCount && { "wordCount": article.wordCount }),
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export const servicePageSchema = (service: {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "url": service.url,
  "provider": {
    "@type": "Organization",
    "@id": "https://sipiteno.com/#organization"
  },
  ...(service.priceRange && { "priceRange": service.priceRange }),
  ...(service.duration && { 
    "termsOfService": `Typical duration: ${service.duration}`
  }),
  "areaServed": {
    "@type": "Place",
    "name": "Europe, Caucasus, Central Asia"
  }
});
