import React from "react";

interface TaxiLogoProps {
  className?: string;
}

const TaxiLogo: React.FC<TaxiLogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <svg
      viewBox="0 0 80 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Taxi Car */}
      <g transform="translate(2, 8)">
        {/* Car Body */}
        <path
          d="M4 16h16v6h-2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2h-4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2H0v-6z"
          fill="#4F46E5"
        />
        {/* Car Top/Roof */}
        <path d="M6 10h8l2 6H4l2-6z" fill="#4F46E5" />
        {/* Taxi Light/Sign */}
        <rect x="8" y="6" width="4" height="2" rx="1" fill="#F59E0B" />
        {/* Windows */}
        <path d="M6.5 11h7l1.5 4h-10l1.5-4z" fill="#E5E7EB" />
        {/* Wheels */}
        <circle cx="6" cy="22" r="2.5" fill="#374151" />
        <circle cx="6" cy="22" r="1.5" fill="#6B7280" />
        <circle cx="14" cy="22" r="2.5" fill="#374151" />
        <circle cx="14" cy="22" r="1.5" fill="#6B7280" />
        {/* Headlights */}
        <circle cx="1" cy="18" r="1" fill="#FEF3C7" />
        <circle cx="19" cy="18" r="1" fill="#FEF3C7" />
      </g>

      {/* Bus */}
      <g transform="translate(42, 6)">
        {/* Bus Body */}
        <rect x="2" y="6" width="28" height="14" rx="2" fill="#10B981" />
        {/* Bus Front */}
        <rect x="0" y="8" width="4" height="10" rx="2" fill="#10B981" />
        {/* Windows - Front */}
        <rect x="4" y="8" width="6" height="5" rx="1" fill="#E5E7EB" />
        {/* Windows - Side */}
        <rect x="12" y="8" width="4" height="5" rx="0.5" fill="#E5E7EB" />
        <rect x="17" y="8" width="4" height="5" rx="0.5" fill="#E5E7EB" />
        <rect x="22" y="8" width="4" height="5" rx="0.5" fill="#E5E7EB" />
        {/* Door */}
        <rect x="26" y="10" width="3" height="8" rx="0.5" fill="#047857" />
        <line
          x1="27.5"
          y1="12"
          x2="27.5"
          y2="16"
          stroke="#E5E7EB"
          strokeWidth="0.5"
        />
        {/* Wheels */}
        <circle cx="8" cy="24" r="3" fill="#374151" />
        <circle cx="8" cy="24" r="2" fill="#6B7280" />
        <circle cx="22" cy="24" r="3" fill="#374151" />
        <circle cx="22" cy="24" r="2" fill="#6B7280" />
        {/* Headlights */}
        <circle cx="1" cy="12" r="1.5" fill="#FEF3C7" />
        <circle cx="1" cy="16" r="1.5" fill="#FEF3C7" />
      </g>
    </svg>
  );
};

export default TaxiLogo;
