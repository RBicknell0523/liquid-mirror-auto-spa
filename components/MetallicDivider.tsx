export function MetallicDivider() {
  return (
    <svg
      viewBox="0 0 1200 130"
      preserveAspectRatio="none"
      className="block w-full relative"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="metalBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#08090b" />
          <stop offset="18%" stopColor="#1c7fce" />
          <stop offset="38%" stopColor="#aeb4bb" />
          <stop offset="50%" stopColor="#f3f5f7" />
          <stop offset="62%" stopColor="#aeb4bb" />
          <stop offset="82%" stopColor="#2fa9ff" />
          <stop offset="100%" stopColor="#08090b" />
        </linearGradient>
        <linearGradient id="shineSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bubble" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#bfe8ff" />
          <stop offset="100%" stopColor="#2fa9ff" />
        </radialGradient>
      </defs>

      {/* Bottom edge is the top curve shifted down by a constant 40px, so the band reads as one even-thickness wave rather than pinching/bulging. */}
      <path
        d="M0,35 C300,65 400,5 600,25 C800,45 900,5 1200,30 L1200,70 C900,45 800,85 600,65 C400,45 300,105 0,75 Z"
        fill="url(#metalBase)"
        opacity="0.85"
      />
      <path
        d="M0,35 C300,65 400,5 600,25 C800,45 900,5 1200,30 L1200,70 C900,45 800,85 600,65 C400,45 300,105 0,75 Z"
        fill="url(#shineSweep)"
        opacity="0.8"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Splash droplets above the wave */}
      <circle cx="150" cy="18" r="5" fill="url(#bubble)" />
      <circle cx="205" cy="10" r="2.5" fill="url(#bubble)" />
      <circle cx="620" cy="14" r="4" fill="url(#bubble)" />
      <circle cx="1040" cy="16" r="5.5" fill="url(#bubble)" />
      <circle cx="1080" cy="8" r="2.5" fill="url(#bubble)" />

      {/* Mirrored splash droplets below the wave */}
      <circle cx="150" cy="112" r="5" fill="url(#bubble)" />
      <circle cx="205" cy="120" r="2.5" fill="url(#bubble)" />
      <circle cx="620" cy="116" r="4" fill="url(#bubble)" />
      <circle cx="1040" cy="114" r="5.5" fill="url(#bubble)" />
      <circle cx="1080" cy="122" r="2.5" fill="url(#bubble)" />
    </svg>
  )
}
