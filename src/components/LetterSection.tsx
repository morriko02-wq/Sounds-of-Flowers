import React, { useState, useEffect, useRef } from 'react';
import { LETTER_PARAGRAPHS } from '../data';
import { gardenAudio } from '../utils/ambientSound';

interface LetterSectionProps {
  onBack: () => void;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ onBack }) => {
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset on mount
    setRevealedCount(0);
    setIsSkipped(false);

    let current = 0;
    const revealNext = () => {
      current++;
      setRevealedCount(current);
      gardenAudio.playChime(440 + (current % 5) * 60, 1.2, 0.02);

      if (current < LETTER_PARAGRAPHS.length) {
        // Read pacing per paragraph length
        const charLength = LETTER_PARAGRAPHS[current].length;
        const delay = Math.max(900, Math.min(2600, charLength * 12));
        timeoutRef.current = window.setTimeout(revealNext, delay);
      }
    };

    // Begin after brief entrance
    timeoutRef.current = window.setTimeout(revealNext, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSkip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSkipped(true);
    setRevealedCount(LETTER_PARAGRAPHS.length);
    gardenAudio.playChime(587.33, 1.5, 0.04);
  };

  const handleCopy = () => {
    const fullText = LETTER_PARAGRAPHS.join('\n\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative z-10 min-h-screen py-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto flex flex-col justify-between animate-fadeIn">
      <div>
        {/* Title */}
        <h1
          className="font-cursive text-3xl sm:text-4xl md:text-5xl text-center mb-6 font-bold"
          style={{
            color: 'var(--mustard)',
            textShadow: '0 3px 12px rgba(0,0,0,0.35)',
          }}
        >
          I owe you an apology
        </h1>

        {/* Action toolbar for reader comfort */}
        <div className="flex items-center justify-between max-w-[820px] mx-auto mb-3 px-2 text-xs sm:text-sm text-yellow-200/80">
          <div className="flex items-center gap-2">
            <span>Paragraph {Math.min(revealedCount, LETTER_PARAGRAPHS.length)} / {LETTER_PARAGRAPHS.length}</span>
            {!isSkipped && revealedCount < LETTER_PARAGRAPHS.length && (
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSizeOffset((prev) => Math.max(-2, prev - 1))}
              className="px-2 py-0.5 rounded border border-yellow-300/30 hover:border-yellow-300 transition-colors"
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeOffset((prev) => Math.min(4, prev + 1))}
              className="px-2 py-0.5 rounded border border-yellow-300/30 hover:border-yellow-300 transition-colors"
              title="Increase font size"
            >
              A+
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-0.5 rounded border border-yellow-300/30 hover:border-yellow-300 transition-colors text-yellow-300 hover:text-white"
            >
              {copied ? 'Copied' : 'Copy letter'}
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="max-w-[820px] mx-auto">
          <article
            className="paper-texture p-6 sm:p-10 md:p-14 text-neutral-900 transition-all duration-300 leading-relaxed font-serif"
            style={{
              fontSize: `${1.1 + fontSizeOffset * 0.08}rem`,
              lineHeight: 1.85,
            }}
          >
            {LETTER_PARAGRAPHS.map((paragraph, idx) => {
              const isVisible = isSkipped || idx < revealedCount;
              return (
                <p
                  key={idx}
                  className={`mb-6 transition-all duration-700 text-justify ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 pointer-events-none'
                  } ${idx === LETTER_PARAGRAPHS.length - 1 ? 'mb-0 font-medium' : ''}`}
                >
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Skip button while typing */}
          {!isSkipped && revealedCount < LETTER_PARAGRAPHS.length && (
            <div className="text-center mt-5">
              <button
                onClick={handleSkip}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-serif font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  background: 'var(--mustard)',
                  color: 'var(--olive-dark)',
                }}
              >
                <span>Read full letter</span>
                <span>↓</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-10 mb-4 text-center">
        <button
          onClick={onBack}
          className="text-yellow-300 hover:text-white font-serif text-base pb-1 border-b border-transparent hover:border-yellow-300 transition-all duration-300 cursor-pointer"
        >
          ← Back to Main Menu
        </button>
      </div>
    </div>
  );
};
