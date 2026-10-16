import React, { useState, useEffect, useRef } from 'react';
import { gardenAudio, SoundSettings } from '../utils/ambientSound';
import { BACKGROUND_MUSIC_INFO } from '../data';

interface AmbientAudioToggleProps {
  className?: string;
}

export const AmbientAudioToggle: React.FC<AmbientAudioToggleProps> = ({
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(
    gardenAudio.getIsPlaying()
  );
  const [settings, setSettings] = useState<SoundSettings>(
    gardenAudio.getSettings()
  );
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = gardenAudio.subscribe((playing, currentSettings) => {
      setIsPlaying(playing);
      setSettings(currentSettings);
    });
    return unsubscribe;
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    gardenAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    gardenAudio.setVolume(vol);
  };

  return (
    <div ref={panelRef} className={`relative inline-block z-40 ${className}`}>
      {/* Main Floating Toggle Bar */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/45 border border-yellow-300/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-yellow-300/70">
        <button
          onClick={handleToggle}
          type="button"
          aria-label={
            isPlaying
              ? 'Pause Landscape With a Fairy background music'
              : 'Play Landscape With a Fairy background music'
          }
          title={
            isPlaying
              ? 'Pause background music'
              : 'Play background song: Landscape With a Fairy - aspidistrafly'
          }
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-yellow-300/25 text-yellow-200 border border-yellow-300/50 shadow-[0_0_12px_rgba(255,206,27,0.3)]'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          {/* Animated sound wave bars or note */}
          <span className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
            {isPlaying ? (
              <>
                <span className="w-1 bg-yellow-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5" />
                <span className="w-1 bg-yellow-300 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-4.5" />
                <span className="w-1 bg-yellow-300 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2.5" />
              </>
            ) : (
              <span className="text-sm">🎵</span>
            )}
          </span>

          <span className="whitespace-nowrap font-medium tracking-wide">
            {isPlaying ? 'Landscape With a Fairy ON' : 'Background music'}
          </span>
        </button>

        {/* Quick Spotify Track / Settings Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          type="button"
          aria-label="Background music details & Spotify player"
          title="Background music controls & Spotify player"
          className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-300 hover:text-yellow-200 hover:bg-white/10 transition-colors text-xs cursor-pointer"
        >
          ⚙️
        </button>
      </div>

      {/* Atmospheric Settings & Spotify Player Panel */}
      {showPanel && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-88 p-4 rounded-2xl bg-neutral-900/95 border border-yellow-300/40 text-neutral-200 backdrop-blur-xl shadow-2xl animate-fadeIn text-xs"
          style={{
            boxShadow:
              '0 18px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,206,27,0.08)',
          }}
        >
          {/* Header Track Info */}
          <div className="pb-2.5 mb-3 border-b border-yellow-300/20">
            <div className="flex items-center justify-between">
              <span className="font-cursive text-xl text-yellow-300 font-bold leading-tight">
                {BACKGROUND_MUSIC_INFO.title}
              </span>
              <a
                href={BACKGROUND_MUSIC_INFO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-green-400 hover:text-green-300 flex items-center gap-1 font-mono"
                title="View on Spotify"
              >
                <span>↗ Spotify</span>
              </a>
            </div>
            <p className="text-[11px] text-neutral-300 font-serif">
              by <strong className="text-yellow-200">{BACKGROUND_MUSIC_INFO.artist}</strong> ·{' '}
              <span className="italic text-neutral-400">{BACKGROUND_MUSIC_INFO.album}</span>
            </p>
          </div>

          {/* Spotify Master Embed Stream Button / Toggle */}
          <div className="mb-3 p-2.5 rounded-xl bg-black/40 border border-yellow-300/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-yellow-200 flex items-center gap-1.5">
                <span>🎧</span>
                <span>Official Spotify Recording</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSpotifyEmbed(!showSpotifyEmbed)}
                className="text-[10px] text-yellow-300 hover:underline cursor-pointer"
              >
                {showSpotifyEmbed ? 'Hide Player ▲' : 'Open Player ▼'}
              </button>
            </div>

            {showSpotifyEmbed && (
              <div className="mt-2 rounded-lg overflow-hidden border border-yellow-300/30 shadow-inner">
                <iframe
                  title="Landscape With a Fairy - aspidistrafly Spotify Player"
                  src={BACKGROUND_MUSIC_INFO.embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <p className="text-[10px] text-neutral-400 italic mt-1">
              Stream the master track with April Lee’s original vocals &amp; acoustic guitar.
            </p>
          </div>

          {/* Volume Control */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-neutral-300">Ambient Music Volume</span>
              <span className="font-mono text-yellow-300">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={handleVolumeChange}
              className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
              aria-label="Ambient background volume"
            />
          </div>

          {/* Layer toggles */}
          <div className="space-y-1.5 pt-2 border-t border-yellow-300/15">
            <p className="text-[11px] text-yellow-200/80 font-medium mb-1">
              Soundscape Layers:
            </p>

            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-2">
                <span>🎼</span>
                <span>Fairy Acoustic Arpeggios &amp; Bells</span>
              </span>
              <input
                type="checkbox"
                checked={settings.fairyMusic}
                onChange={() => gardenAudio.toggleLayer('fairyMusic')}
                className="accent-yellow-400 cursor-pointer w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-2">
                <span>🍃</span>
                <span>Forest Breeze &amp; Leaves</span>
              </span>
              <input
                type="checkbox"
                checked={settings.wind}
                onChange={() => gardenAudio.toggleLayer('wind')}
                className="accent-yellow-400 cursor-pointer w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-2">
                <span>💧</span>
                <span>Garden Brook &amp; Water</span>
              </span>
              <input
                type="checkbox"
                checked={settings.water}
                onChange={() => gardenAudio.toggleLayer('water')}
                className="accent-yellow-400 cursor-pointer w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-2">
                <span>🐦</span>
                <span>Distant Songbirds</span>
              </span>
              <input
                type="checkbox"
                checked={settings.birds}
                onChange={() => gardenAudio.toggleLayer('birds')}
                className="accent-yellow-400 cursor-pointer w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-2">
                <span>🦗</span>
                <span>Evening Forest Crickets</span>
              </span>
              <input
                type="checkbox"
                checked={settings.crickets}
                onChange={() => gardenAudio.toggleLayer('crickets')}
                className="accent-yellow-400 cursor-pointer w-3.5 h-3.5"
              />
            </label>
          </div>

          {/* Quick toggle button */}
          <div className="mt-3 pt-2.5 border-t border-yellow-300/15">
            <button
              onClick={handleToggle}
              className="w-full py-2 rounded-lg font-serif text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: isPlaying
                  ? 'rgba(255, 206, 27, 0.2)'
                  : 'var(--mustard)',
                color: isPlaying ? 'var(--mustard)' : 'var(--olive-dark)',
                border: isPlaying ? '1px solid var(--mustard)' : 'none',
              }}
            >
              {isPlaying
                ? 'Pause Background Soundtrack'
                : 'Play “Landscape With a Fairy”'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
