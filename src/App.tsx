/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Section } from './types';
import { PasswordGate } from './components/PasswordGate';
import { FlowerSpiral } from './components/FlowerSpiral';
import { MainMenu } from './components/MainMenu';
import { LetterSection } from './components/LetterSection';
import { MusicSection } from './components/MusicSection';
import { SpokenWordsSection } from './components/SpokenWordsSection';
import { FinalSlide } from './components/FinalSlide';
import { AmbientAudioToggle } from './components/AmbientAudioToggle';
import { gardenAudio } from './utils/ambientSound';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('menu');
  const [isFinalOpen, setIsFinalOpen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isUnlocked) return;

      if (e.key === 'ArrowRight' && currentSection === 'menu' && !isFinalOpen) {
        setIsFinalOpen(true);
      } else if (e.key === 'ArrowLeft' && isFinalOpen) {
        setIsFinalOpen(false);
      } else if (e.key === 'Escape') {
        if (isFinalOpen) {
          setIsFinalOpen(false);
        } else if (currentSection !== 'menu') {
          setCurrentSection('menu');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, currentSection, isFinalOpen]);

  // Touch Swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null || !isUnlocked) return;
      const diff = touchStartXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 65) {
        if (diff > 0 && currentSection === 'menu' && !isFinalOpen) {
          // Swipe left -> open final
          setIsFinalOpen(true);
        } else if (diff < 0 && isFinalOpen) {
          // Swipe right -> close final
          setIsFinalOpen(false);
        }
      }
      touchStartXRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isUnlocked, currentSection, isFinalOpen]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleOpenFinal = () => {
    setIsFinalOpen(true);
  };

  const handleCloseFinal = () => {
    setIsFinalOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-neutral-900 selection:bg-yellow-300 selection:text-neutral-900">
      {/* Global Ambient Garden & Forest Audio Controller */}
      <div className="fixed top-3.5 sm:top-4 right-3.5 sm:right-6 z-[60]">
        <AmbientAudioToggle />
      </div>

      {/* Password Gate */}
      {!isUnlocked && <PasswordGate onUnlock={handleUnlock} />}

      {/* Flower Spiral Background ONLY on the Main Menu */}
      {isUnlocked && currentSection === 'menu' && !isFinalOpen && <FlowerSpiral />}

      {/* Sections Content */}
      {isUnlocked && (
        <main className="relative z-10">
          {currentSection === 'menu' && (
            <MainMenu
              onSelectSection={(section) => setCurrentSection(section)}
              onOpenFinal={handleOpenFinal}
            />
          )}

          {currentSection === 'letter' && (
            <LetterSection onBack={() => setCurrentSection('menu')} />
          )}

          {currentSection === 'music' && (
            <MusicSection onBack={() => setCurrentSection('menu')} />
          )}

          {currentSection === 'spoken' && (
            <SpokenWordsSection onBack={() => setCurrentSection('menu')} />
          )}
        </main>
      )}

      {/* Final Chibi Scene Slide-in */}
      <FinalSlide isOpen={isFinalOpen} onClose={handleCloseFinal} />

      {/* Floating Arrow Controls */}
      {isUnlocked && currentSection === 'menu' && !isFinalOpen && (
        <button
          onClick={() => {
            gardenAudio.playChime(523.25, 1.2, 0.03);
            handleOpenFinal();
          }}
          className="fixed top-1/2 -translate-y-1/2 right-4 sm:right-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl text-yellow-300 border border-yellow-300/40 bg-black/30 hover:bg-yellow-300/20 hover:border-yellow-300 transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-110 active:scale-95"
          aria-label="Next slide: Chibi clearing"
          title="Go to clearing"
        >
          →
        </button>
      )}

      {isFinalOpen && (
        <button
          onClick={() => {
            gardenAudio.playChime(440, 1.2, 0.03);
            handleCloseFinal();
          }}
          className="fixed top-1/2 -translate-y-1/2 left-4 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl text-yellow-300 border border-yellow-300/40 bg-black/30 hover:bg-yellow-300/20 hover:border-yellow-300 transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-110 active:scale-95"
          aria-label="Previous slide: Return to garden"
          title="Return to garden"
        >
          ←
        </button>
      )}
    </div>
  );
}
