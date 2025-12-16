import { useEffect } from 'react';
import { organizationSchema, servicesSchema, faqSchema, breadcrumbSchema } from '@/lib/seo/schemas';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  schemas?: object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * SEOHead Component
 * Injects JSON-LD structured data for LLM crawlers
 * All schemas are centralized for consistency
 */
const SEOHead = ({ 
  title, 
  description, 
  canonicalUrl,
  schemas = [],
  breadcrumbs
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Inject additional schemas
    const existingSchemas = document.querySelectorAll('script[data-seo-schema]');
    existingSchemas.forEach(el => el.remove());

    const allSchemas = [
      ...schemas,
      ...(breadcrumbs ? [breadcrumbSchema(breadcrumbs)] : [])
    ];

    allSchemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-schema', `dynamic-${index}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const dynamicSchemas = document.querySelectorAll('script[data-seo-schema]');
      dynamicSchemas.forEach(el => el.remove());
    };
  }, [title, description, canonicalUrl, schemas, breadcrumbs]);

  return null;
};

export default SEOHead;
