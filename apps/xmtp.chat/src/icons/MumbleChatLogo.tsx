export const MumbleChatLogo: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    {...props}>
    <defs>
      <linearGradient id="mumble-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#0afff1", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#9772fb", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer circle with gradient */}
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#mumble-gradient)"
      opacity="0.15"
    />

    {/* Chat bubble */}
    <path
      d="M30 35C30 30.5817 33.5817 27 38 27H62C66.4183 27 70 30.5817 70 35V53C70 57.4183 66.4183 61 62 61H45L35 68V61C32.2386 61 30 58.7614 30 56V35Z"
      fill="url(#mumble-gradient)"
      filter="url(#glow)"
    />

    {/* Sound waves - mumble effect */}
    <g opacity="0.9">
      {/* Left wave */}
      <path
        d="M40 43C40 43 41 40 41 44C41 48 40 45 40 45"
        stroke="#04060f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center wave */}
      <path
        d="M48 38C48 38 50 35 50 45C50 55 48 50 48 50"
        stroke="#04060f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right wave */}
      <path
        d="M58 43C58 43 59 40 59 44C59 48 58 45 58 45"
        stroke="#04060f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Decorative dots */}
    <circle cx="38" cy="33" r="2" fill="#0afff1" opacity="0.7" />
    <circle cx="62" cy="33" r="2" fill="#9772fb" opacity="0.7" />

    {/* Inner highlight */}
    <path
      d="M38 27C33.5817 27 30 30.5817 30 35V38C30 33.5817 33.5817 30 38 30H62C66.4183 30 70 33.5817 70 38V35C70 30.5817 66.4183 27 62 27H38Z"
      fill="white"
      opacity="0.15"
    />
  </svg>
);
