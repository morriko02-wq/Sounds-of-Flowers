import React, { useState, useEffect, useRef } from 'react';
import { FINAL_MESSAGE } from '../data';
import { AnimeChibiScene } from './AnimeChibiScene';
import { gardenAudio } from '../utils/ambientSound';

interface FinalSlideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinalSlide: React.FC<FinalSlideProps> = ({ isOpen, onClose }) => {
  const [replayCount, setReplayCount] = useState<number>(0);
  const [isLoadingTransition, setIsLoadingTransition] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showText, setShowText] = useState<boolean>(false);
  const loadingTimerRef = useRef<number | null>(null);

  const startSceneWithLoadingTransition = () => {
    setIsLoadingTransition(true);
    setLoadingProgress(0);
    setShowText(false);

    if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);

    // Give a brief delay so the slide completes its entry transition
    const startDelay = setTimeout(() => {
      const startTime = Date.now();
      const duration = 2800; // Smooth 2.8s left-to-right blossom journey

      loadingTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / duration) * 100));
        setLoadingProgress(progress);

        if (progress >= 100) {
          if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
          setTimeout(() => {
            setIsLoadingTransition(false);
            gardenAudio.playChime(587.33, 1.2, 0.03);
            setTimeout(() => {
              setShowText(true);
              gardenAudio.playGardenChimeChord();
            }, 1800);
          }, 350);
        }
      }, 25);
    }, 150);

    return () => clearTimeout(startDelay);
  };

  useEffect(() => {
    if (isOpen) {
      startSceneWithLoadingTransition();
    } else {
      setIsLoadingTransition(true);
      setShowText(false);
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    }

    return () => {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, [isOpen, replayCount]);

  const handleReplay = () => {
    setReplayCount((prev) => prev + 1);
    gardenAudio.playChime(392, 1.2, 0.02);
  };

  const handleReplayLoadingAnimation = () => {
    startSceneWithLoadingTransition();
    gardenAudio.playChime(523.25, 1.2, 0.03);
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out overflow-hidden ${
        isOpen
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full opacity-0 pointer-events-none'
      }`}
      style={{ backgroundColor: 'var(--olive)' }}
    >
      {/* ======================================================== */}
      {/* FLOWER LOADING ANIMATION WITH TEXT "Nji > Ayi"          */}
      {/* ======================================================== */}
      {isLoadingTransition && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-500 ease-out"
          style={{
            backgroundColor: 'var(--olive)',
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 75%)',
          }}
        >
          <div className="w-full max-w-lg mx-auto text-center px-4">
            {/* Header Title */}
            <h2
              className="font-cursive text-3xl sm:text-4xl text-center mb-6 font-bold"
              style={{
                color: 'var(--mustard)',
                textShadow: '0 3px 12px rgba(0,0,0,0.4)',
              }}
            >
              The Garden Clearing
            </h2>

            {/* Left to Right Flower Transit Track */}
            <div className="relative w-full h-20 mb-3 overflow-visible">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
                style={{
                  left: `${loadingProgress}%`,
                }}
              >
                {/* Blooming Botanical Flower Icon with sparkle */}
                <div className="relative flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl animate-bounce filter drop-shadow-[0_4px_10px_rgba(255,206,27,0.5)]">
                    🌸
                  </span>
                  <span className="absolute -top-1 -right-2 text-sm animate-ping text-yellow-300">
                    ✨
                  </span>
                </div>

                {/* Explicit Text: "Nji > Ayi" */}
                <div className="mt-1 px-3 py-0.5 rounded-full bg-black/60 border border-yellow-300/50 shadow-md">
                  <span className="text-sm sm:text-base text-yellow-300 font-cursive font-bold whitespace-nowrap tracking-wider">
                    Nji &gt; Ayi
                  </span>
                </div>
              </div>
            </div>

            {/* Left to Right Progress Track Bar */}
            <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden p-0.5 border border-yellow-300/50 shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-amber-200 rounded-full transition-all duration-75 relative overflow-hidden"
                style={{
                  width: `${loadingProgress}%`,
                  boxShadow: '0 0 16px rgba(255, 206, 27, 0.8)',
                }}
              >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-white/40 skew-x-12 animate-[pulse_1s_infinite]" />
              </div>
            </div>

            {/* Subtitle and Percentage */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-serif text-yellow-200/90 mt-3 px-1">
              <span className="italic flex items-center gap-1.5">
                <span>🍃</span>
                <span>Nji offering the flower to Ayi...</span>
              </span>
              <span className="font-mono font-bold text-yellow-300 text-sm">
                {loadingProgress}%
              </span>
            </div>

            {/* Skip button if user wants immediate view */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
                  setIsLoadingTransition(false);
                  setShowText(true);
                }}
                className="text-[11px] text-yellow-200/60 hover:text-yellow-200 font-serif underline cursor-pointer"
              >
                Skip transition →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHIBI CLEARING STAGE                                    */}
      {/* ======================================================== */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Top persistent badge acknowledging "Nji > Ayi" and loading replay */}
        {!isLoadingTransition && (
          <div className="mb-2 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/30 border border-yellow-300/40 text-yellow-300 font-cursive text-sm font-bold shadow-sm">
              🌸 Nji &gt; Ayi
            </span>
            <button
              onClick={handleReplayLoadingAnimation}
              type="button"
              title="Watch the flower-loading animation again"
              className="text-xs text-yellow-200/80 hover:text-yellow-200 underline font-serif cursor-pointer ml-1"
            >
              (Watch flower loading)
            </button>
          </div>
        )}

        {isOpen && !isLoadingTransition && (
          <div className="w-full animate-fadeIn">
            <AnimeChibiScene
              replayTrigger={replayCount}
              onAnimationComplete={() => {
                setShowText(true);
              }}
            />
          </div>
        )}

        {/* Final Poetic Text */}
        <div
          className={`transition-all duration-1000 text-center max-w-lg mt-2 ${
            showText && !isLoadingTransition
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <p
            className="font-cursive text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{
              color: 'var(--mustard)',
              textShadow: '0 4px 16px rgba(0,0,0,0.45)',
            }}
          >
            {FINAL_MESSAGE}
          </p>
          <p className="text-yellow-100/70 font-serif italic text-xs sm:text-sm mt-1">
            (For you, in every season of the garden)
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex flex-col items-center gap-3">
          {showText && !isLoadingTransition && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReplay}
                className="px-6 py-2 rounded-full border border-yellow-300 text-yellow-300 font-serif text-sm transition-all duration-300 hover:bg-yellow-300/20 active:scale-95 cursor-pointer shadow-md"
              >
                ↻ Replay Scene
              </button>

              <button
                onClick={handleReplayLoadingAnimation}
                className="px-5 py-2 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-300 text-yellow-200 font-serif text-sm transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
              >
                🌸 Replay Flower Loading
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-yellow-300 hover:text-white font-serif text-sm border-b border-transparent hover:border-yellow-300 transition-colors pt-2 cursor-pointer"
          >
            ← Return to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
