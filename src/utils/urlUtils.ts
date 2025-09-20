/**
 * URL utilities for generating SEO-friendly slugs for advertisements
 */

import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Convert a string to a URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "")
  ); // Remove leading/trailing hyphens
};

/**
 * Generate a complete SEO-friendly URL path for an advertisement
 */
export const generateAdUrl = (
  city: string,
  category: string,
  title: string
): string => {
  const citySlug = createSlug(city);
  const categorySlug = createSlug(category);
  const titleSlug = createSlug(title);

  return `/${citySlug}/${categorySlug}/${titleSlug}`;
};

/**
 * Parse URL parameters and return the original values
 */
export const parseAdUrl = (
  citySlug: string,
  categorySlug: string,
  titleSlug: string
) => {
  return {
    citySlug,
    categorySlug,
    titleSlug,
  };
};

/**
 * Find an advertisement by URL slugs
 */
export const findAdBySlug = async (
  citySlug: string,
  categorySlug: string,
  titleSlug: string
) => {
  try {
    // First, get all ads and filter by city (we need to match the slug to actual city name)
    const adsSnapshot = await getDocs(collection(db, "adData"));

    const matchingAds: Array<{ id: string; [key: string]: unknown }> = [];

    adsSnapshot.forEach((doc) => {
      const data = doc.data();

      // Check if the ad is published/approved
      if (
        !(
          (data.status === "approved" || data.status === "published") &&
          data.approved
        )
      ) {
        return;
      }

      // Convert stored values to slugs and compare
      const storedCitySlug = createSlug(data.city || "");
      const storedCategorySlug = createSlug(data.category || "");
      const storedTitleSlug = createSlug(data.title || "");

      // Match all three slugs
      if (
        storedCitySlug === citySlug &&
        storedCategorySlug === categorySlug &&
        storedTitleSlug === titleSlug
      ) {
        matchingAds.push({
          id: doc.id,
          ...data,
        });
      }
    });

    // Return the first match (there should typically be only one)
    // If multiple matches exist, prefer the most recently published one
    if (matchingAds.length > 0) {
      // Return the most recent match if multiple exist
      return matchingAds.length > 0 ? matchingAds[0] : null;
    }

    return null;
  } catch (error) {
    console.error("Error finding ad by slug:", error);
    return null;
  }
};

/**
 * Generate a URL for an advertisement object
 */
export const generateAdUrlFromAd = (ad: {
  city: string;
  category: string;
  title: string;
}): string => {
  return generateAdUrl(ad.city, ad.category, ad.title);
};

/**
 * Check if a URL slug matches a given text
 */
export const slugMatches = (text: string, slug: string): boolean => {
  return createSlug(text) === slug;
};
