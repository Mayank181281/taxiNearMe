import { useEffect } from 'react';
import { 
  generateDriverStructuredData, 
  generateBreadcrumbStructuredData, 
  generateWebsiteStructuredData,
  type DriverProfile 
} from '../utils/structuredData';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
  breadcrumbs?: Array<{name: string, url: string}>;
}

/**
 * Custom hook for managing SEO metadata
 * React 19 compatible hook for document head manipulation
 */
export function useSEO(config: SEOConfig) {
  const {
    title = 'TaxiNearMe - Find Local Taxi Drivers',
    description = 'Connect with local taxi drivers in your area. Find reliable transportation services near you.',
    keywords = 'taxi, driver, local transport, ride, booking',
    image = '/images/taxi-logo.png',
    url = window.location.href,
    type = 'website',
    structuredData,
    breadcrumbs
  } = config;

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

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index,follow');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'TaxiNearMe', true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Handle structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    
    if (structuredData || breadcrumbs) {
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }

      const dataArray = [];
      
      if (structuredData) {
        dataArray.push(structuredData);
      }
      
      if (breadcrumbs) {
        dataArray.push(generateBreadcrumbStructuredData(breadcrumbs));
      }

      // Always include website structured data on pages
      if (window.location.pathname === '/') {
        dataArray.push(generateWebsiteStructuredData());
      }

      structuredDataScript.textContent = JSON.stringify(dataArray.length === 1 ? dataArray[0] : dataArray);
    }

  }, [title, description, keywords, image, url, type, structuredData, breadcrumbs]);
}

/**
 * Hook specifically for driver profile pages
 */
export function useDriverSEO(driver: DriverProfile) {
  const seoConfig: SEOConfig = {
    title: `${driver.name} - Taxi Driver in ${driver.city}, ${driver.state} | TaxiNearMe`,
    description: driver.description || `Book a ride with ${driver.name}, a professional taxi driver in ${driver.city}, ${driver.state}. Reliable and safe transportation services.`,
    keywords: `${driver.name}, taxi driver, ${driver.city}, ${driver.state}, taxi booking, local transport`,
    image: driver.image || '/images/taxi-logo.png',
    url: `${window.location.origin}/driver/${driver.id}`,
    type: 'profile',
    structuredData: generateDriverStructuredData(driver),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: driver.city, url: `/${driver.city}` },
      { name: 'Taxi Drivers', url: `/taxi/${driver.city}` },
      { name: driver.name, url: `/driver/${driver.id}` }
    ]
  };

  useSEO(seoConfig);
}

/**
 * Hook for home page SEO
 */
export function useHomeSEO() {
  const seoConfig: SEOConfig = {
    title: 'TaxiNearMe - Find Local Taxi Drivers Near You',
    description: 'Connect with verified taxi drivers in your city. Safe, reliable, and affordable transportation services across India. Book your ride today!',
    keywords: 'taxi near me, local taxi drivers, taxi booking, ride sharing, transportation India',
    type: 'website',
    structuredData: generateWebsiteStructuredData()
  };

  useSEO(seoConfig);
}

/**
 * Hook for search results pages
 */
export function useSearchSEO(category: string, city: string, resultCount?: number) {
  const seoConfig: SEOConfig = {
    title: `${category} Drivers in ${city} | TaxiNearMe`,
    description: `Find the best ${category.toLowerCase()} drivers in ${city}. ${resultCount ? `${resultCount} verified drivers` : 'Verified drivers'} available for booking.`,
    keywords: `${category}, ${city}, taxi drivers, local transport, ${category.toLowerCase()} booking`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: city, url: `/${city}` },
      { name: category, url: `/${category}/${city}` }
    ]
  };

  useSEO(seoConfig);
}