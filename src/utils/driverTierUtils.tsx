import {
  VIPPrimeBadge,
  VIPBadge,
  FreeBadge,
} from "../components/DriverTierTags";

// Utility function to get the appropriate tag based on driver properties
export const getDriverTierTag = (
  isPrime?: boolean,
  isVIP?: boolean,
  size: "sm" | "md" | "lg" = "md",
  className?: string
) => {
  if (isPrime) {
    return <VIPPrimeBadge size={size} className={className} />;
  }
  if (isVIP) {
    return <VIPBadge size={size} className={className} />;
  }
  return <FreeBadge size={size} className={className} />;
};

// Utility to get tier string from driver properties
export const getDriverTierString = (
  isPrime?: boolean,
  isVIP?: boolean
): string => {
  if (isPrime) return "VIP Prime";
  if (isVIP) return "VIP";
  return "Free";
};

// Utility to get tier type from driver properties
export const getDriverTierType = (
  isPrime?: boolean,
  isVIP?: boolean
): "vip-prime" | "vip" | "free" => {
  if (isPrime) return "vip-prime";
  if (isVIP) return "vip";
  return "free";
};
    