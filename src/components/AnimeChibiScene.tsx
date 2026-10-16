import React, { useState, useEffect } from 'react';

interface AnimeChibiSceneProps {
  onAnimationComplete?: () => void;
  replayTrigger?: number;
}

export const AnimeChibiScene: React.FC<AnimeChibiSceneProps> = ({
  onAnimationComplete,
  replayTrigger = 0,
}) => {
  const [stage, setStage] = useState<'approaching' | 'offered' | 'celebrating'>('approaching');

  useEffect(() => {
    setStage('approaching');

    const timer1 = setTimeout(() => {
      setStage('offered');
    }, 800);

    const timer2 = setTimeout(() => {
      setStage('celebrating');
      if (onAnimationComplete) onAnimationComplete();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [replayTrigger]);

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center select-none py-2 px-4">
      {/* Decorative Floating Sparkles & Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-4 left-[15%] text-xl animate-bounce text-pink-300 drop-shadow">
          💘
        </span>
        <span className="absolute top-2 right-[18%] text-xl animate-pulse text-yellow-300 drop-shadow">
          ✨
        </span>
        <span className="absolute bottom-6 right-[12%] text-lg animate-ping opacity-75 text-yellow-200">
          ⭐
        </span>
      </div>

      {/* Main Anime Chibi SVG Illustration */}
      <div className="w-full h-[320px] sm:h-[370px] relative flex items-center justify-center">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full filter drop-shadow-xl overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Skin Shadows calibrated to requested #EAD8C4 skin tone */}
            <radialGradient id="animeSkinShade" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#EAD8C4" />
              <stop offset="85%" stopColor="#EAD8C4" />
              <stop offset="100%" stopColor="#DEC9B3" />
            </radialGradient>

            {/* Blush Gradient */}
            <radialGradient id="animeBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B8B" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#FF8DA6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFA6BA" stopOpacity="0" />
            </radialGradient>

            {/* Ayi Eye Gradient (Dark Charcoal to Soft Indigo/Purple-slate) */}
            <linearGradient id="ayiEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#12131A" />
              <stop offset="50%" stopColor="#252736" />
              <stop offset="85%" stopColor="#4E536E" />
              <stop offset="100%" stopColor="#6C7294" />
            </linearGradient>

            {/* Nji Eye Gradient (Dark to Warm Amber-Brown) */}
            <linearGradient id="njiEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A120B" />
              <stop offset="50%" stopColor="#3D2817" />
              <stop offset="85%" stopColor="#6E4829" />
              <stop offset="100%" stopColor="#9C6B3E" />
            </linearGradient>

            {/* Hair Highlights */}
            <linearGradient id="blackHairShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D3042" />
              <stop offset="50%" stopColor="#191B24" />
              <stop offset="100%" stopColor="#111218" />
            </linearGradient>

            <linearGradient id="brownHairShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6E4933" />
              <stop offset="50%" stopColor="#4F3322" />
              <stop offset="100%" stopColor="#382317" />
            </linearGradient>

            {/* Gold Clip Gradient */}
            <linearGradient id="goldClip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="50%" stopColor="#FFCE1B" />
              <stop offset="100%" stopColor="#D4A000" />
            </linearGradient>
          </defs>

          {/* Pedestal / Ground Shadow */}
          <ellipse cx="300" cy="355" rx="210" ry="22" fill="#000000" opacity="0.18" />

          {/* =================================================== */}
          {/* LEFT CHIBI: AYI (Black Comma Hair, Moon Clip)      */}
          {/* =================================================== */}
          <g
            id="chibi-ayi"
            className="transition-transform duration-700 ease-out"
            style={{
              transform: stage === 'celebrating' ? 'translateY(-6px)' : 'translateY(0)',
            }}
          >
            {/* Wavy Emotion Lines above Ayi's head (from reference drawing) */}
            <g opacity="0.9">
              <path
                d="M 175 65 Q 168 45 178 30 Q 186 15 178 0"
                stroke="#FFCE1B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 210 60 Q 202 40 212 25 Q 220 10 212 -5"
                stroke="#FFCE1B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 245 70 Q 240 50 250 35 Q 256 20 250 5"
                stroke="#FFCE1B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Ayi Body (Cute Compact Plushie Sweater) */}
            <path
              d="M 165 245 C 150 245 135 270 142 320 C 150 345 250 345 258 320 C 265 270 250 245 235 245 Z"
              fill="#2E3440"
              stroke="#17181F"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* White Collar & Trim */}
            <path
              d="M 180 245 Q 200 262 220 245"
              stroke="#F4EFE6"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Cute Stubby Left Arm */}
            <path
              d="M 150 255 C 130 258 115 285 135 300 C 145 305 160 290 156 270 Z"
              fill="#2E3440"
              stroke="#17181F"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Stubby hand */}
            <ellipse cx="132" cy="292" rx="12" ry="12" fill="url(#animeSkinShade)" stroke="#17181F" strokeWidth="4" />

            {/* Stubby Right Arm (Resting shyly) */}
            <path
              d="M 245 258 C 265 265 268 290 252 302 C 242 308 232 295 236 275 Z"
              fill="#2E3440"
              stroke="#17181F"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <ellipse cx="255" cy="295" rx="11" ry="11" fill="url(#animeSkinShade)" stroke="#17181F" strokeWidth="4" />

            {/* Back Hair (Black) */}
            <path
              d="M 125 180 C 105 130 135 70 205 70 C 275 70 305 130 285 180 C 295 210 270 245 245 245 C 165 245 135 210 125 180 Z"
              fill="url(#blackHairShine)"
              stroke="#12131A"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Left Ear with Piercing Stud */}
            <ellipse cx="122" cy="180" rx="16" ry="18" fill="url(#animeSkinShade)" stroke="#17181F" strokeWidth="4.5" />
            <circle cx="114" cy="185" r="3.5" fill="#E5E5E5" stroke="#17181F" strokeWidth="2" />

            {/* Ayi Face (Chubby Cute Baby Cheeks) */}
            <path
              d="M 128 175 C 122 225 155 248 200 248 C 245 248 278 225 272 175 C 270 125 130 125 128 175 Z"
              fill="url(#animeSkinShade)"
              stroke="#17181F"
              strokeWidth="5"
            />

            {/* Blush Circles on Cheeks */}
            <ellipse cx="148" cy="200" rx="24" ry="16" fill="url(#animeBlush)" />
            <ellipse cx="252" cy="200" rx="24" ry="16" fill="url(#animeBlush)" />

            {/* Cute Hatching Blush Lines /// (matching user sketch) */}
            <g stroke="#E03A60" strokeWidth="2.2" strokeLinecap="round" opacity="0.8">
              <line x1="140" y1="205" x2="146" y2="194" />
              <line x1="147" y1="206" x2="153" y2="195" />
              <line x1="154" y1="205" x2="160" y2="194" />

              <line x1="242" y1="205" x2="248" y2="194" />
              <line x1="249" y1="206" x2="255" y2="195" />
              <line x1="256" y1="205" x2="262" y2="194" />
            </g>

            {/* Ayi Big Anime Eyes (Reference Photo Style: large rounded vertical oval, glossy shine) */}
            {/* Left Eye */}
            <g>
              <ellipse cx="162" cy="172" rx="19" ry="25" fill="url(#ayiEyeGrad)" stroke="#17181F" strokeWidth="4" />
              {/* Eyelid curve */}
              <path d="M 143 155 Q 162 144 182 154" stroke="#17181F" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              {/* Big Bottom-Inner Highlight (The signature look from reference photo!) */}
              <ellipse cx="166" cy="184" rx="10" ry="11" fill="#FFFFFF" />
              {/* Small top specular dot */}
              <circle cx="155" cy="164" r="4.5" fill="#FFFFFF" />
            </g>

            {/* Right Eye */}
            <g>
              <ellipse cx="238" cy="172" rx="19" ry="25" fill="url(#ayiEyeGrad)" stroke="#17181F" strokeWidth="4" />
              {/* Eyelid curve */}
              <path d="M 219 154 Q 238 144 257 155" stroke="#17181F" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              {/* Big Bottom-Inner Highlight */}
              <ellipse cx="234" cy="184" rx="10" ry="11" fill="#FFFFFF" />
              {/* Small top specular dot */}
              <circle cx="245" cy="164" r="4.5" fill="#FFFFFF" />
            </g>

            {/* Tiny Cute Open Surprised/Touched Mouth ("o" from drawing) */}
            <ellipse cx="200" cy="216" rx="5.5" ry="6.5" fill="#C23652" stroke="#17181F" strokeWidth="3" />
            {/* Little tongue dot */}
            <ellipse cx="200" cy="219" rx="3.5" ry="2.5" fill="#FFAEC0" />

            {/* Front Comma Hair Bangs (Parted C-curve comma fringe framing forehead) */}
            <path
              d="M 115 145 C 120 110 150 90 200 90 C 250 90 280 110 285 145 C 275 145 265 130 250 148 C 242 165 220 168 212 145 C 205 132 195 132 188 145 C 180 168 158 165 150 148 C 135 130 125 145 115 145 Z"
              fill="url(#blackHairShine)"
              stroke="#12131A"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Distinct Comma Curl Lock (Inward curved heart-gap comma bangs) */}
            <path
              d="M 188 115 Q 170 140 185 160 Q 195 170 200 155 Q 202 135 192 118 Z"
              fill="url(#blackHairShine)"
              stroke="#12131A"
              strokeWidth="4.5"
            />

            {/* Golden Crescent Moon Clip (on Ayi's left hair) */}
            <path
              d="M 156 102 C 144 112 144 130 158 138 C 148 132 148 115 156 102 Z"
              fill="url(#goldClip)"
              stroke="#9E7400"
              strokeWidth="2.5"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            />

            {/* Ayi Name Tag Badge */}
            <g transform="translate(160, 370)">
              <rect x="-10" y="-18" width="90" height="26" rx="13" fill="#000000" opacity="0.35" />
              <text x="35" y="0" textAnchor="middle" fill="#FFCE1B" fontSize="18" fontWeight="bold" fontFamily="'Dancing Script', cursive">
                🌙 Ayi
              </text>
            </g>
          </g>

          {/* =================================================== */}
          {/* RIGHT CHIBI: NJI (Brown Comma Hair, Star Clip)     */}
          {/* =================================================== */}
          <g
            id="chibi-nji"
            className="transition-transform duration-700 ease-out"
            style={{
              transform: stage === 'celebrating' ? 'translateY(-6px)' : 'translateY(0)',
            }}
          >
            {/* Sparkles ✨ near Nji (from reference drawing) */}
            <g transform="translate(470, 140)" fill="#FFD700" stroke="#C49B00" strokeWidth="1.5">
              <path d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z" />
              <path d="M 22 18 Q 22 26 30 26 Q 22 26 22 34 Q 22 26 14 26 Q 22 26 22 18 Z" />
            </g>

            {/* Nji Body (Cute Compact Plushie Sweater) */}
            <path
              d="M 365 245 C 350 245 335 270 342 320 C 350 345 450 345 458 320 C 465 270 450 245 435 245 Z"
              fill="#435B32"
              stroke="#1C2615"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* White Collar & Trim */}
            <path
              d="M 380 245 Q 400 262 420 245"
              stroke="#F4EFE6"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Stubby Right Arm (Resting happily) */}
            <path
              d="M 445 258 C 468 265 472 292 454 305 C 444 310 432 295 436 275 Z"
              fill="#435B32"
              stroke="#1C2615"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <ellipse cx="460" cy="296" rx="12" ry="12" fill="url(#animeSkinShade)" stroke="#1C2615" strokeWidth="4" />

            {/* Back Hair (Warm Brown) */}
            <path
              d="M 325 180 C 305 130 335 70 405 70 C 475 70 505 130 485 180 C 495 210 470 245 445 245 C 365 245 335 210 325 180 Z"
              fill="url(#brownHairShine)"
              stroke="#2B1A10"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Right Ear with Piercing Stud */}
            <ellipse cx="478" cy="180" rx="16" ry="18" fill="url(#animeSkinShade)" stroke="#2B1A10" strokeWidth="4.5" />
            <circle cx="486" cy="185" r="3.5" fill="#E5E5E5" stroke="#2B1A10" strokeWidth="2" />

            {/* Nji Face (Chubby Cute Baby Cheeks) */}
            <path
              d="M 328 175 C 322 225 355 248 400 248 C 445 248 478 225 472 175 C 470 125 330 125 328 175 Z"
              fill="url(#animeSkinShade)"
              stroke="#2B1A10"
              strokeWidth="5"
            />

            {/* Blush Circles on Cheeks */}
            <ellipse cx="348" cy="200" rx="24" ry="16" fill="url(#animeBlush)" />
            <ellipse cx="452" cy="200" rx="24" ry="16" fill="url(#animeBlush)" />

            {/* Nji Big Anime Eyes (Sweet Affectionate Gaze from Reference Photo) */}
            {/* Left Eye */}
            <g>
              <ellipse cx="362" cy="172" rx="19" ry="25" fill="url(#njiEyeGrad)" stroke="#2B1A10" strokeWidth="4" />
              <path d="M 343 155 Q 362 144 382 154" stroke="#2B1A10" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <ellipse cx="366" cy="184" rx="10" ry="11" fill="#FFFFFF" />
              <circle cx="355" cy="164" r="4.5" fill="#FFFFFF" />
            </g>

            {/* Right Eye (Playful sweet squint/curve matching sketch) */}
            <g>
              <ellipse cx="438" cy="172" rx="19" ry="25" fill="url(#njiEyeGrad)" stroke="#2B1A10" strokeWidth="4" />
              <path d="M 419 154 Q 438 144 457 155" stroke="#2B1A10" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <ellipse cx="434" cy="184" rx="10" ry="11" fill="#FFFFFF" />
              <circle cx="445" cy="164" r="4.5" fill="#FFFFFF" />
            </g>

            {/* Sweet Cat-like Smile / Curved Mouth (‿ from reference drawing) */}
            <path
              d="M 390 214 Q 400 224 410 214"
              stroke="#2B1A10"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Front Comma Hair Bangs (Parted C-curve comma fringe in rich brown) */}
            <path
              d="M 315 145 C 320 110 350 90 400 90 C 450 90 480 110 485 145 C 475 145 465 130 450 148 C 442 165 420 168 412 145 C 405 132 395 132 388 145 C 380 168 358 165 350 148 C 335 130 325 145 315 145 Z"
              fill="url(#brownHairShine)"
              stroke="#2B1A10"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Inward Sweeping Comma Bang Lock */}
            <path
              d="M 412 115 Q 430 140 415 160 Q 405 170 400 155 Q 398 135 408 118 Z"
              fill="url(#brownHairShine)"
              stroke="#2B1A10"
              strokeWidth="4.5"
            />

            {/* Golden 5-point Star Clip (on Nji's right hair) */}
            <path
              d="M 440 98 L 444 110 L 456 110 L 446 117 L 450 128 L 440 121 L 430 128 L 434 117 L 424 110 L 436 110 Z"
              fill="url(#goldClip)"
              stroke="#9E7400"
              strokeWidth="2.5"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            />

            {/* Nji Name Tag Badge */}
            <g transform="translate(360, 370)">
              <rect x="-10" y="-18" width="90" height="26" rx="13" fill="#000000" opacity="0.35" />
              <text x="35" y="0" textAnchor="middle" fill="#FFCE1B" fontSize="18" fontWeight="bold" fontFamily="'Dancing Script', cursive">
                Nji ⭐
              </text>
            </g>

            {/* =================================================== */}
            {/* ONE HAND REACHING OUT FROM NJI TO AYI WITH FLOWER   */}
            {/* =================================================== */}
            <g
              id="nji-reaching-arm"
              className="transition-all duration-700 ease-out"
              style={{
                transformOrigin: '350px 260px',
                transform:
                  stage === 'approaching'
                    ? 'rotate(12deg)'
                    : stage === 'offered'
                    ? 'rotate(-8deg) translateX(-12px)'
                    : 'rotate(-4deg) translateX(-8px)',
              }}
            >
              {/* Reaching Arm Sleeve */}
              <path
                d="M 352 258 C 325 258 290 270 268 280 C 265 295 285 305 305 292 C 325 280 345 275 356 272 Z"
                fill="#435B32"
                stroke="#1C2615"
                strokeWidth="5"
                strokeLinejoin="round"
              />

              {/* Reaching Hand */}
              <ellipse cx="264" cy="286" rx="14" ry="14" fill="url(#animeSkinShade)" stroke="#1C2615" strokeWidth="4" />
              {/* Thumb */}
              <ellipse cx="270" cy="278" rx="6" ry="6" fill="url(#animeSkinShade)" stroke="#1C2615" strokeWidth="3.5" />

              {/* Hand-Drawn Blooming Daisy Blossom offered to Ayi! */}
              <g id="flower-in-hand" transform="translate(250, 245)">
                {/* Stem */}
                <path d="M 14 42 Q 10 20 14 0" stroke="#3E7D30" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Leaves */}
                <path d="M 12 25 Q 0 20 6 32 Z" fill="#4B943A" stroke="#2D5E23" strokeWidth="2" />

                {/* Daisy Blossom Petals */}
                <g transform="translate(14, 0)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-14"
                      rx="6.5"
                      ry="12"
                      fill="#FFFFFF"
                      stroke="#E5DAC2"
                      strokeWidth="1.5"
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  {/* Golden Center */}
                  <circle cx="0" cy="0" r="9" fill="#FFCE1B" stroke="#D4A000" strokeWidth="2" />
                  <circle cx="-2" cy="-2" r="3" fill="#FFF275" opacity="0.8" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <p className="text-yellow-200/80 font-serif italic text-xs sm:text-sm mt-1 text-center">
        “Nji reaches out to offer the bloom to Ayi, right by his side.”
      </p>
    </div>
  );
};
