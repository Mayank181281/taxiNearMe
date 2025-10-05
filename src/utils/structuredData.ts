/**
 * Structured data generators for SEO
 * Following Schema.org standards for taxi and local business data
 */

export interface DriverProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city: string;
  state: string;
  rating?: number;
  reviewCount?: number;
  services?: string[];
  image?: string;
  description?: string;
}

/**
 * Generate LocalBusiness structured data for taxi drivers
 */
export function generateDriverStructuredData(driver: DriverProfile): object {
  const baseUrl = window.location.origin;
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/driver/${driver.id}`,
    "name": `${driver.name} - Taxi Service`,
    "alternateName": driver.name,
    "description": driver.description || `Professional taxi driver in ${driver.city}, ${driver.state}. Reliable transportation services.`,
    "url": `${baseUrl}/driver/${driver.id}`,
    "telephone": driver.phone,
    "email": driver.email,
    "image": driver.image ? `${baseUrl}${driver.image}` : `${baseUrl}/images/taxi-logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": driver.city,
      "addressRegion": driver.state,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      // Note: Add actual coordinates if available
    },
    "aggregateRating": driver.rating && driver.reviewCount ? {
      "@type": "AggregateRating",
      "ratingValue": driver.rating,
      "reviewCount": driver.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "serviceArea": {
      "@type": "City",
      "name": driver.city
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Taxi Services",
      "itemListElement": (driver.services || ['Local Taxi', 'Airport Transfer', 'City Tours']).map((service) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "serviceType": "Transportation"
        }
      }))
    },
    "openingHours": "Mo-Su 00:00-23:59", // Assuming 24/7 availability
    "priceRange": "₹₹", // Moderate pricing
    "paymentAccepted": ["Cash", "Credit Card", "Digital Payment"],
    "currenciesAccepted": "INR"
  };
}

/**
 * Generate BreadcrumbList structured data for navigation
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

/**
 * Generate WebSite structured data for the main site
 */
export function generateWebsiteStructuredData(): object {
  const baseUrl = window.location.origin;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TaxiNearMe",
    "alternateName": "Taxi Near Me - Local Driver Directory",
    "url": baseUrl,
    "description": "Find and connect with local taxi drivers in your area. Reliable transportation services across India.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?category={category}&city={city}`
      },
      "query-input": [
        "required name=category",
        "required name=city"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "TaxiNearMe",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/taxi-logo.png`
      }
    }
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(): object {
  const baseUrl = window.location.origin;
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TaxiNearMe",
    "url": baseUrl,
    "logo": `${baseUrl}/images/taxi-logo.png`,
    "description": "India's leading platform for connecting passengers with local taxi drivers.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      // Add social media URLs when available
    ]
  };
}