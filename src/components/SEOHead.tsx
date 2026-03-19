import { useEffect } from 'react';
import { breadcrumbSchema } from '@/lib/seo/schemas';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  schemas?: object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  schemas = [],
  breadcrumbs,
  noindex = false,
  ogImage,
  ogType,
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);

    // Update robots meta
    const robotsContent = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    setMeta('meta[name="robots"]', 'content', robotsContent);

    // Update OG tags
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    if (ogType) setMeta('meta[property="og:type"]', 'content', ogType);
    if (ogImage) setMeta('meta[property="og:image"]', 'content', ogImage);

    // Update Twitter tags
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);
    if (ogImage) setMeta('meta[name="twitter:image"]', 'content', ogImage);

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
  }, [title, description, canonicalUrl, schemas, breadcrumbs, noindex, ogImage, ogType]);

  return null;
};

export default SEOHead;
