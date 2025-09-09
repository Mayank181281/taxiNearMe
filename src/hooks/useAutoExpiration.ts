import { useEffect } from "react";
import { checkAndProcessExpiredAds } from "../services/autoExpirationService";

/**
 * React hook to automatically handle expired ads
 * This should be used in main components to ensure expired ads are processed
 */
export const useAutoExpiration = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const processExpiration = async () => {
      if (isMounted) {
        try {
          await checkAndProcessExpiredAds();
        } catch (error) {
          console.error("Error in auto expiration:", error);
        }
      }
    };

    // Process on mount
    processExpiration();

    return () => {
      isMounted = false;
    };
  }, [enabled]);
};

/**
 * Hook specifically for pages that display ads
 * Ensures expired ads are processed before showing results
 */
export const useAdDisplayExpiration = () => {
  useEffect(() => {
    checkAndProcessExpiredAds().catch(console.error);
  }, []);
};

/**
 * Hook for admin panels to ensure real-time data
 */
export const useAdminExpiration = () => {
  useEffect(() => {
    const processExpiration = async () => {
      try {
        await checkAndProcessExpiredAds();
      } catch (error) {
        console.error("Admin expiration check failed:", error);
      }
    };

    processExpiration();

    // Check more frequently in admin panels
    const interval = setInterval(processExpiration, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);
};
