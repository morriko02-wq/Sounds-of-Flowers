import React from 'react';

interface FlowerProps {
  className?: string;
  size?: number | string;
}

/**
 * Realistic Botanical Tulip
 * Natural cup-shaped petals with delicate veining, multi-layered petals,
 * warm amber & golden-yellow gradients, and organic botanical curvature.
 */
export const RealisticTulip: React.FC<FlowerProps> = ({ className = '', size = '100%' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`filter drop-shadow-md select-none ${className}`}
    style={{ overflow: 'visible' }}
    aria-label="Botanical Golden Tulip"
  >
    <defs>
      {/* Outer petal gradient */}
      <linearGradient id="tulipOuter" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#C98B00" />
        <stop offset="25%" stopColor="#E6A800" />
        <stop offset="65%" stopColor="#FFCE1B" />
        <stop offset="100%" stopColor="#FFF275" />
      </linearGradient>

      {/* Center inner petal gradient */}
      <linearGradient id="tulipCenter" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#B37400" />
        <stop offset="40%" stopColor="#E09F00" />
        <stop offset="85%" stopColor="#FFD83D" />
        <stop offset="100%" stopColor="#FFF8A6" />
      </linearGradient>

      {/* Back petal shadow */}
      <linearGradient id="tulipBack" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#8F5900" />
        <stop offset="70%" stopColor="#C98B00" />
        <stop offset="100%" stopColor="#E6A800" />
      </linearGradient>

      {/* Stem & Sepal */}
      <linearGradient id="tulipStem" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4A6E24" />
        <stop offset="50%" stopColor="#6C8F38" />
        <stop offset="100%" stopColor="#3C5C1C" />
      </linearGradient>

      {/* Soft petal highlight */}
      <linearGradient id="petalSheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    {/* Stem at bottom */}
    <path
      d="M 50 82 Q 51 92 49 100"
      stroke="url(#tulipStem)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M 46 80 Q 50 85 54 80 Z" fill="url(#tulipStem)" />

    {/* Back Petals (Inner depth) */}
    <path
      d="M 42 35 C 42 22 47 16 50 16 C 53 16 58 22 58 35 C 58 55 52 68 50 72 C 48 68 42 55 42 35 Z"
      fill="url(#tulipBack)"
    />

    {/* Left Inner Petal */}
    <path
      d="M 33 42 C 28 30 36 20 44 24 C 48 34 50 56 46 75 C 38 71 30 58 33 42 Z"
      fill="url(#tulipOuter)"
      opacity="0.95"
    />

    {/* Right Inner Petal */}
    <path
      d="M 67 42 C 72 30 64 20 56 24 C 52 34 50 56 54 75 C 62 71 70 58 67 42 Z"
      fill="url(#tulipOuter)"
      opacity="0.95"
    />

    {/* Center Dominant Petal */}
    <path
      d="M 34 50 C 33 32 42 20 50 20 C 58 20 67 32 66 50 C 65 68 56 80 50 82 C 44 80 35 68 34 50 Z"
      fill="url(#tulipCenter)"
    />

    {/* Left Outer Guard Petal */}
    <path
      d="M 28 54 C 25 38 34 26 42 28 C 45 42 46 68 49 80 C 40 78 30 68 28 54 Z"
      fill="url(#tulipOuter)"
    />

    {/* Right Outer Guard Petal */}
    <path
      d="M 72 54 C 75 38 66 26 58 28 C 55 42 54 68 51 80 C 60 78 70 68 72 54 Z"
      fill="url(#tulipOuter)"
    />

    {/* Petal Veining & Highlights */}
    <path
      d="M 50 24 Q 49 52 50 78"
      stroke="#FFDE59"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.65"
      fill="none"
    />
    <path
      d="M 44 32 Q 43 54 47 74"
      stroke="#FFE57F"
      strokeWidth="0.8"
      opacity="0.45"
      fill="none"
    />
    <path
      d="M 56 32 Q 57 54 53 74"
      stroke="#FFE57F"
      strokeWidth="0.8"
      opacity="0.45"
      fill="none"
    />

    {/* Petal Rim Highlight */}
    <path
      d="M 40 24 C 45 21 55 21 60 24"
      stroke="url(#petalSheen)"
      strokeWidth="1.8"
      fill="none"
    />
  </svg>
);

/**
 * Realistic Botanical Carnation
 * Fluffy, intricate, multi-tiered serrated ruffles with crinkled edges,
 * blush pink layers, and crimson feathered depth.
 */
export const RealisticCarnation: React.FC<FlowerProps> = ({ className = '', size = '100%' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`filter drop-shadow-md select-none ${className}`}
    style={{ overflow: 'visible' }}
    aria-label="Botanical Blush Carnation"
  >
    <defs>
      <radialGradient id="carnationCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#B32448" />
        <stop offset="35%" stopColor="#D94168" />
        <stop offset="70%" stopColor="#FF85A2" />
        <stop offset="100%" stopColor="#FFC2D1" />
      </radialGradient>

      <linearGradient id="petalPinkDeep" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFAEC0" />
        <stop offset="60%" stopColor="#E65578" />
        <stop offset="100%" stopColor="#A81C3F" />
      </linearGradient>

      <linearGradient id="calyxGreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5E8232" />
        <stop offset="100%" stopColor="#3C5C1C" />
      </linearGradient>
    </defs>

    {/* Stem & Calyx (base) */}
    <path
      d="M 50 82 Q 51 92 49 100"
      stroke="url(#calyxGreen)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 44 76 C 44 86 56 86 56 76 C 56 73 44 73 44 76 Z"
      fill="url(#calyxGreen)"
    />

    {/* Tier 1: Large outer ruffled petals (Bottom & Sides) */}
    <path
      d="M 22 55 C 16 46 22 36 29 39 C 32 30 42 26 48 31 C 54 25 65 28 68 36 C 76 33 84 42 80 52 C 86 60 78 72 70 72 C 65 79 54 82 48 78 C 38 82 28 78 26 69 C 18 67 18 58 22 55 Z"
      fill="url(#petalPinkDeep)"
      opacity="0.92"
    />

    {/* Serrated crinkle edge details on outer tier */}
    <path
      d="M 20 54 Q 23 50 26 53 Q 29 48 33 51 Q 38 46 42 49 Q 47 44 52 47 Q 58 43 62 48 Q 68 45 72 50 Q 77 47 79 53"
      stroke="#FFCCD7"
      strokeWidth="1.2"
      fill="none"
      opacity="0.75"
    />

    {/* Tier 2: Mid-layer folded ruffles */}
    <path
      d="M 27 52 C 24 43 31 36 38 39 C 42 32 50 31 55 35 C 62 31 71 36 71 44 C 77 50 73 61 66 63 C 65 71 54 73 49 69 C 41 73 32 68 31 60 C 24 58 24 53 27 52 Z"
      fill="url(#carnationCenter)"
    />

    {/* Tier 3: Fluffy nested petal cluster */}
    <path
      d="M 34 48 C 32 41 38 36 43 39 C 47 34 54 34 57 38 C 63 36 67 42 65 47 C 69 53 64 61 58 60 C 55 65 46 65 43 61 C 36 62 32 56 34 48 Z"
      fill="#FF85A2"
    />

    {/* Tier 4: Delicate innermost ruffled core with crimson depth */}
    <path
      d="M 40 46 C 39 41 44 38 48 40 C 52 38 56 40 57 43 C 60 46 58 52 54 52 C 53 56 47 56 45 53 C 41 53 39 49 40 46 Z"
      fill="#D92855"
    />

    <path
      d="M 45 44 C 44 41 48 39 50 41 C 53 40 55 42 54 45 C 52 48 47 48 45 44 Z"
      fill="#9E1339"
    />

    {/* Delicate fine crinkled highlights on petal tips */}
    <path
      d="M 33 40 Q 36 38 38 42 Q 43 37 46 41 Q 50 37 54 41 Q 59 38 61 43"
      stroke="#FFF0F3"
      strokeWidth="1.2"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M 30 60 Q 34 64 38 61 Q 44 66 49 62 Q 55 66 60 62 Q 65 64 68 59"
      stroke="#FFD6E0"
      strokeWidth="1.0"
      fill="none"
      opacity="0.75"
    />
  </svg>
);

/**
 * Realistic Botanical Garden Rose
 * Spiraling multi-layered petals unfolding from a tight central core bud
 * out to broad, velvety overlapping petals with natural petal curls.
 */
export const RealisticRose: React.FC<FlowerProps> = ({ className = '', size = '100%' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`filter drop-shadow-md select-none ${className}`}
    style={{ overflow: 'visible' }}
    aria-label="Botanical Garden Rose"
  >
    <defs>
      {/* Velvety Ivory / Soft Cream Rose Gradient */}
      <linearGradient id="roseIvory" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#FAF6EB" />
        <stop offset="85%" stopColor="#E8DFCD" />
        <stop offset="100%" stopColor="#D4C5A9" />
      </linearGradient>

      {/* Inner Petal Warm Glow */}
      <radialGradient id="roseInnerWarm" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF4D1" />
        <stop offset="50%" stopColor="#F5E4B8" />
        <stop offset="85%" stopColor="#E3CA94" />
        <stop offset="100%" stopColor="#C4AA72" />
      </radialGradient>

      {/* Stem & Sepals */}
      <linearGradient id="roseGreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#557530" />
        <stop offset="100%" stopColor="#354D1B" />
      </linearGradient>
    </defs>

    {/* Green Sepals behind petals */}
    <path d="M 49 80 Q 42 88 32 90 Q 40 82 46 76" fill="url(#roseGreen)" />
    <path d="M 51 80 Q 58 88 68 90 Q 60 82 54 76" fill="url(#roseGreen)" />
    <path d="M 50 80 Q 50 94 49 100" stroke="url(#roseGreen)" strokeWidth="3.5" fill="none" />

    {/* Layer 1: Broad Outermost Guard Petals */}
    <path
      d="M 50 14 C 68 14 82 24 84 40 C 86 58 74 76 50 82 C 26 76 14 58 16 40 C 18 24 32 14 50 14 Z"
      fill="url(#roseIvory)"
      stroke="#D6C7AA"
      strokeWidth="0.8"
    />

    {/* Layer 2: Overlapping Left & Right Outer Petals */}
    <path
      d="M 18 42 C 16 26 34 18 48 20 C 36 28 28 44 32 64 C 22 58 18 50 18 42 Z"
      fill="#F5EFE1"
      stroke="#D4C5A9"
      strokeWidth="0.6"
    />
    <path
      d="M 82 42 C 84 26 66 18 52 20 C 64 28 72 44 68 64 C 78 58 82 50 82 42 Z"
      fill="#F5EFE1"
      stroke="#D4C5A9"
      strokeWidth="0.6"
    />

    {/* Bottom Curled Petal */}
    <path
      d="M 28 62 C 36 76 64 76 72 62 C 66 70 34 70 28 62 Z"
      fill="#EFE7D5"
      stroke="#C8B898"
      strokeWidth="0.8"
    />

    {/* Layer 3: Mid-layer cupped petals */}
    <path
      d="M 28 46 C 26 32 40 24 50 26 C 42 34 38 48 42 62 C 32 58 28 52 28 46 Z"
      fill="url(#roseInnerWarm)"
      opacity="0.9"
    />
    <path
      d="M 72 46 C 74 32 60 24 50 26 C 58 34 62 48 58 62 C 68 58 72 52 72 46 Z"
      fill="url(#roseInnerWarm)"
      opacity="0.9"
    />

    {/* Layer 4: Spiraling inner rose bud folds */}
    <path
      d="M 34 48 C 34 36 44 30 50 32 C 45 38 44 50 48 56 C 40 54 34 52 34 48 Z"
      fill="#E8D4A2"
    />
    <path
      d="M 66 48 C 66 36 56 30 50 32 C 55 38 56 50 52 56 C 60 54 66 52 66 48 Z"
      fill="#E8D4A2"
    />

    {/* Central Rose Spiral Core */}
    <path
      d="M 44 42 C 44 36 50 34 54 37 C 57 40 56 46 52 48 C 47 50 46 45 48 42 C 50 40 52 41 51 43"
      fill="#D4BA7D"
      stroke="#B89B59"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Dewy Petal Edge Highlights */}
    <path
      d="M 28 28 Q 50 16 72 28"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M 22 45 Q 32 66 50 78"
      stroke="#FFFFFF"
      strokeWidth="1.0"
      fill="none"
      opacity="0.65"
    />
    <path
      d="M 78 45 Q 68 66 50 78"
      stroke="#FFFFFF"
      strokeWidth="1.0"
      fill="none"
      opacity="0.65"
    />
  </svg>
);

/**
 * Realistic Botanical Camellia (from the DigiBouquet!)
 */
export const RealisticCamellia: React.FC<FlowerProps> = ({ className = '', size = '100%' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`filter drop-shadow-md select-none ${className}`}
    style={{ overflow: 'visible' }}
    aria-label="Botanical Crimson Camellia"
  >
    <defs>
      <radialGradient id="camelliaGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7E0C24" />
        <stop offset="45%" stopColor="#C41E3A" />
        <stop offset="85%" stopColor="#E63956" />
        <stop offset="100%" stopColor="#FF6B81" />
      </radialGradient>
      <radialGradient id="camelliaGoldCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE873" />
        <stop offset="70%" stopColor="#FFCE1B" />
        <stop offset="100%" stopColor="#C99400" />
      </radialGradient>
    </defs>

    {/* Calyx / Leaves under petals */}
    <g transform="translate(50, 50)">
      <path d="M 0 0 C -25 25 -38 18 -42 35 C -35 40 -15 28 0 0 Z" fill="#436021" />
      <path d="M 0 0 C 25 25 38 18 42 35 C 35 40 15 28 0 0 Z" fill="#364e1a" />
    </g>

    {/* Outer Petals */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <g key={`outer-${i}`} transform={`rotate(${angle} 50 50)`}>
        <path
          d="M 50 50 C 35 25 38 12 50 12 C 62 12 65 25 50 50 Z"
          fill="url(#camelliaGrad)"
          stroke="#A0152F"
          strokeWidth="0.8"
        />
      </g>
    ))}

    {/* Mid Petals */}
    {[30, 90, 150, 210, 270, 330].map((angle, i) => (
      <g key={`mid-${i}`} transform={`rotate(${angle} 50 50)`}>
        <path
          d="M 50 50 C 38 30 40 18 50 18 C 60 18 62 30 50 50 Z"
          fill="url(#camelliaGrad)"
          stroke="#90112A"
          strokeWidth="0.6"
          opacity="0.95"
        />
      </g>
    ))}

    {/* Inner Petals */}
    {[15, 75, 135, 195, 255, 315].map((angle, i) => (
      <g key={`inner-${i}`} transform={`rotate(${angle} 50 50)`}>
        <path
          d="M 50 50 C 42 36 43 24 50 24 C 57 24 58 36 50 50 Z"
          fill="#E63956"
          stroke="#A0152F"
          strokeWidth="0.5"
        />
      </g>
    ))}

    {/* Golden Center Stamens */}
    <circle cx="50" cy="50" r="9" fill="url(#camelliaGoldCenter)" stroke="#B38000" strokeWidth="0.8" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <circle
        key={`stamen-${i}`}
        cx={50 + Math.cos((a * Math.PI) / 180) * 5.8}
        cy={50 + Math.sin((a * Math.PI) / 180) * 5.8}
        r="1.4"
        fill="#FFF4B8"
        stroke="#B38000"
        strokeWidth="0.4"
      />
    ))}
  </svg>
);

/**
 * Realistic Botanical White Lily (from the DigiBouquet!)
 */
export const RealisticLily: React.FC<FlowerProps> = ({ className = '', size = '100%' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`filter drop-shadow-md select-none ${className}`}
    style={{ overflow: 'visible' }}
    aria-label="Botanical White Lily"
  >
    <defs>
      <linearGradient id="lilyPetal" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#A3B87A" />
        <stop offset="25%" stopColor="#E2EAD2" />
        <stop offset="65%" stopColor="#FCFDF9" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>

    {/* 6 Elegant Star Petals of a Lily */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <g key={`lily-petal-${i}`} transform={`rotate(${angle} 50 50)`}>
        <path
          d="M 50 50 Q 40 25 50 8 Q 60 25 50 50 Z"
          fill="url(#lilyPetal)"
          stroke="#C8D4B4"
          strokeWidth="0.8"
        />
        {/* Central rib */}
        <line x1="50" y1="50" x2="50" y2="18" stroke="#8AAB50" strokeWidth="0.8" opacity="0.6" />
      </g>
    ))}

    {/* Central delicate green throat and red-brown anthers */}
    <circle cx="50" cy="50" r="5" fill="#5F801E" />
    {[30, 90, 150, 210, 270, 330].map((a, i) => (
      <g key={`anther-${i}`} transform={`rotate(${a} 50 50)`}>
        <line x1="50" y1="50" x2="50" y2="34" stroke="#88A348" strokeWidth="1.2" />
        <ellipse cx="50" cy="33" rx="2.5" ry="1.2" fill="#8B4513" stroke="#5E2605" strokeWidth="0.4" />
      </g>
    ))}
  </svg>
);

