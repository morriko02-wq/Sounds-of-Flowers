import React, { useState, useEffect, useRef } from 'react';
import { GATE_PASSWORD } from '../data';
import { gardenAudio } from '../utils/ambientSound';

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === GATE_PASSWORD) {
      setError(false);
      setIsUnlocked(true);
      gardenAudio.playGardenChimeChord();
      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      setError(true);
      setShaking(true);
      setCode('');
      gardenAudio.playChime(196, 0.4, 0.05); // low soft alert
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isUnlocked
          ? 'opacity-0 pointer-events-none scale-105'
          : 'opacity-100'
      }`}
      style={{ backgroundColor: 'var(--olive)' }}
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className={`w-full max-w-[390px] rounded-xl p-8 sm:p-10 text-center transition-transform ${
          shaking ? 'shake' : ''
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.22)',
          border: '1px solid var(--mustard)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45), inset 0 0 30px rgba(255,206,27,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="text-4xl mb-3 select-none filter drop-shadow animate-pulse" aria-hidden="true">
          ✉️
        </div>

        <h2
          className="font-cursive text-3xl sm:text-4xl mb-2 font-bold tracking-wide"
          style={{ color: 'var(--mustard)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          Enter the Garden
        </h2>

        <p className="text-neutral-200 text-sm sm:text-base italic mb-6">
          my code, numbers of the letters A &amp; Y
        </p>

        <div className="relative mb-5">
          <input
            ref={inputRef}
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            inputMode="numeric"
            placeholder="••••••"
            aria-label="Enter garden password"
            className="w-full text-center text-2xl sm:text-3xl font-serif tracking-[0.55rem] py-3 px-4 rounded border transition-all duration-300 outline-none"
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderColor: error ? '#ff9999' : 'rgba(255, 206, 27, 0.55)',
              color: 'var(--mustard)',
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 font-cursive text-xl font-bold rounded cursor-pointer transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
          style={{
            background: 'var(--mustard)',
            color: 'var(--olive-dark)',
            boxShadow: '0 4px 15px rgba(255, 206, 27, 0.35)',
          }}
        >
          Open the letter
        </button>

        {/* Error message */}
        <div className="h-6 mt-3">
          {error && (
            <p className="text-[#ff9999] text-sm italic transition-opacity duration-300">
              Not quite. Try again.
            </p>
          )}
        </div>

        {/* Small hint button and download standalone HTML */}
        <div className="mt-4 pt-4 border-t border-yellow-300/15 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHintModal(!showHintModal)}
            className="text-xs text-yellow-200/60 hover:text-yellow-200 underline transition-colors"
          >
            {showHintModal ? 'Hide hint' : 'Password helper'}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="/web-codes.zip"
              download="a-letter-in-the-garden-codes.zip"
              className="text-xs text-yellow-300 font-medium flex items-center gap-1.5 py-1.5 px-3 rounded bg-yellow-950/60 border border-yellow-400/40 hover:bg-yellow-900/80 hover:border-yellow-300 transition-all shadow"
              title="Download full project source code as a ZIP archive (React, TypeScript, CSS, HTML, README)"
            >
              <span>📦</span> Download Codes (.ZIP)
            </a>

            <a
              href="/standalone.html"
              download="a-letter-in-the-garden.html"
              className="text-xs text-yellow-200/90 hover:text-yellow-100 flex items-center gap-1.5 py-1.5 px-3 rounded bg-black/40 border border-yellow-300/20 hover:border-yellow-300/50 transition-all"
              title="Download single-file HTML to open directly in any browser without installing anything"
            >
              <span>📄</span> Standalone HTML
            </a>
          </div>
        </div>

        {showHintModal && (
          <div className="mt-3 p-3 rounded bg-black/40 border border-yellow-400/20 text-xs text-yellow-100/90 text-left space-y-1.5">
            <p>Code: <span className="font-mono font-bold text-yellow-300">404125</span></p>
            <p className="text-[11px] text-neutral-300">Explanation: Error 404 + A (1) + Y (25).</p>
            <button
              type="button"
              onClick={() => {
                setCode('404125');
                setShowHintModal(false);
              }}
              className="mt-1 inline-block text-xs text-yellow-300 underline font-medium hover:text-white"
            >
              Fill code 404125
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
