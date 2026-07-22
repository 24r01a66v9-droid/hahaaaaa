
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  strokeColor?: string;
}

const Logo: React.FC<LogoProps> = ({ className, size = 24, strokeColor = "currentColor" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="160 60"
        transform="rotate(-20 50 50)"
      />
      {/* Spoon part */}
      <path
        d="M15 35C15 35 25 35 30 45C35 55 35 65 45 65C55 65 55 55 50 45C45 35 35 30 25 45"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fork part */}
      <path
        d="M85 70L65 45M65 45C65 45 62 42 60 45M60 45V35M60 45H65M65 45V35M65 45H70M70 45V35M70 45H75M75 45V35"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Better approximation of the specific logo shape */}
      <path
        d="M10 32C10 32 15 25 22 35C29 45 33 60 43 60C53 60 55 52 52 45C49 38 42 35 38 42L22 65"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90 75L70 55C66 51 60 51 56 55M56 55V42M56 50H62V42M62 50H68V42M68 50H74V42M74 50V55"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
