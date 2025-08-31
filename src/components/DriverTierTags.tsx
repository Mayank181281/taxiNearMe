import React from "react";
import { Crown, Shield, User } from "lucide-react";

export type DriverTier = "vip-prime" | "vip" | "free";

interface DriverTierTagProps {
  tier: DriverTier;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DriverTierTag: React.FC<DriverTierTagProps> = ({
  tier,
  size = "md",
  className = "",
}) => {
  // `sizeConfig` is now in the main component scope
  const sizeConfig = {
    sm: {
      container: "px-3 py-1",
      icon: "h-4 w-4",
      text: "text-xs",
      iconGap: "gap-2",
    },
    md: {
      container: "px-4 py-1.5",
      icon: "h-5 w-5",
      text: "text-sm",
      iconGap: "gap-2.5",
    },
    lg: {
      container: "px-5 py-2",
      icon: "h-6 w-6",
      text: "text-base",
      iconGap: "gap-3",
    },
  };

  const getTagConfig = () => {
    // This function can now correctly access sizeConfig from the parent scope
    switch (tier) {
      case "vip-prime":
        return {
          containerClass: `flex items-center ${sizeConfig[size].iconGap} text-amber-900 font-bold tracking-wider transition-all duration-300 transform group-hover:scale-105 ${sizeConfig[size].container} rounded-full`,
          icon: (
            <Crown
              className={`${sizeConfig[size].icon} text-amber-800 transition-transform duration-300 group-hover:rotate-[-10deg]`}
              strokeWidth={2.5}
            />
          ),
          text: "VIP PRIME",
          stars: null,
        };
      case "vip":
        return {
          containerClass: `flex items-center ${sizeConfig[size].iconGap} text-purple-900 font-bold tracking-wider transition-all duration-300 transform group-hover:scale-105 ${sizeConfig[size].container} rounded-full`,
          icon: (
            <Shield
              className={`${sizeConfig[size].icon} text-purple-700 transition-transform duration-300 group-hover:translate-x-[-2px]`}
              strokeWidth={2.5}
            />
          ),
          text: "VIP",
          stars: null,
        };
      case "free":
        return {
          containerClass: `flex items-center ${sizeConfig[size].iconGap} text-blue-900 font-bold tracking-wider transition-all duration-300 transform group-hover:scale-105 ${sizeConfig[size].container} rounded-full`,
          icon: (
            <User
              className={`${sizeConfig[size].icon} text-blue-700 transition-transform duration-300 group-hover:scale-95`}
              strokeWidth={2.5}
            />
          ),
          text: "FREE",
          stars: null,
        };
      default:
        return {
          containerClass: `flex items-center ${sizeConfig[size].iconGap} bg-gray-400 text-white font-medium rounded-full ${sizeConfig[size].container}`,
          icon: null,
          text: "UNKNOWN",
          stars: null,
        };
    }
  };

  const config = getTagConfig();

  return (
    <div className={`group ${className}`}>
      <div
        className={config.containerClass}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
      >
        {config.icon}
        {/* This now correctly accesses sizeConfig */}
        <span className={`${sizeConfig[size].text} uppercase`}>
          {config.text}
        </span>
        {config.stars}
      </div>
    </div>
  );
};

// Simplified badge versions for floating/absolute positioning
export const VIPPrimeBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => (
  <DriverTierTag tier="vip-prime" size={size} className={className} />
);

export const VIPBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => (
  <DriverTierTag tier="vip" size={size} className={className} />
);

export const FreeBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => (
  <DriverTierTag tier="free" size={size} className={className} />
);

export default DriverTierTag;
