import React from 'react';
import { Section } from '../types';
import { gardenAudio } from '../utils/ambientSound';

interface MainMenuProps {
  onSelectSection: (section: Section) => void;
  onOpenFinal: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectSection,
  onOpenFinal,
}) => {
  const navItems: { id: Section; label: string; icon: string; chord: number }[] = [
    { id: 'letter', label: 'Letter', icon: '💌', chord: 523.25 },
    { id: 'music', label: 'Songs', icon: '🎶', chord: 659.25 },
    { id: 'spoken', label: 'Spoken Words', icon: '💭', chord: 783.99 },
  ];

  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between items-center py-12 px-4 select-none animate-fadeIn">
      {/* Spacer for top bar */}
      <div className="h-8" />

      {/* Main Center Area */}
      <div className="flex flex-col items-center justify-center my-auto">
        <h1
          className="font-cursive text-3xl sm:text-5xl md:text-6xl text-center mb-10 sm:mb-14 font-bold max-w-2xl px-2"
          style={{
            color: 'var(--mustard)',
            textShadow: '0 4px 18px rgba(0,0,0,0.4)',
          }}
        >
          For you, in this little garden
        </h1>

        {/* 3 Circular Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 md:gap-20">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center group">
              <button
                onClick={() => {
                  gardenAudio.playChime(item.chord, 1.8, 0.05);
                  onSelectSection(item.id);
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl cursor-pointer transition-all duration-300 transform group-hover:scale-115 active:scale-95 focus:outline-none"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,206,27,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
                aria-label={`Open ${item.label}`}
              >
                <span className="transform transition-transform group-hover:scale-110 drop-shadow">
                  {item.icon}
                </span>
              </button>
              <span
                className="font-cursive text-xl sm:text-2xl mt-3 font-semibold transition-colors duration-300 group-hover:text-yellow-100"
                style={{
                  color: 'var(--mustard)',
                  textShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom hint and quick slide button */}
      <div className="flex flex-col items-center gap-2 mb-2 text-center">
        <button
          onClick={() => {
            gardenAudio.playChime(587.33, 1.5, 0.03);
            onOpenFinal();
          }}
          className="text-xs sm:text-sm font-serif text-yellow-200/80 hover:text-yellow-100 flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-300/25 bg-black/15 hover:bg-black/30 transition-all hover:scale-105"
        >
          <span>Step into the quiet clearing</span>
          <span className="text-base text-yellow-300">→</span>
        </button>
        <p className="text-[11px] text-yellow-200/50 italic">
          Press right arrow → or swipe to open the clearing
        </p>
      </div>
    </div>
  );
};
