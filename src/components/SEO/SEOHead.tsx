import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  structuredData?: object;
}

/**
 * SEO component for managing document head meta tags
 * React 19 compatible alternative to react-helmet
 */
export function SEOHead({
  title = 'TaxiNearMe - Find Local Taxi Drivers',
  description = 'Connect with local taxi drivers in your area. Find reliable transportation services near you.',
  keywords = 'taxi, driver, local transport, ride, booking',
  image = '/images/taxi-logo.png',
  url = window.location.href,
  type = 'website',
  siteName = 'TaxiNearMe',
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Structured data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to remove dynamically added tags
    return () => {
      // Note: We don't remove meta tags on cleanup as they should persist
      // until replaced by new ones to maintain SEO benefits
    };
  }, [title, description, keywords, image, url, type, siteName, structuredData]);

  return null; // This component doesn't render anything
}

export default SEOHead;