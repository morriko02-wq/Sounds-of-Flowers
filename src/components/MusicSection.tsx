import React, { useState } from 'react';
import { SONGS } from '../data';
import { gardenAudio } from '../utils/ambientSound';

interface MusicSectionProps {
  onBack: () => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({ onBack }) => {
  // Only ONE song can have its player mounted and active at any given moment
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  const handlePlaySong = (songId: string) => {
    // If clicking the currently active song, stop it
    if (activeSongId === songId) {
      setActiveSongId(null);
      return;
    }

    // Immediately stop the previously playing song by switching activeSongId
    // Unmounting the previous iframe terminates its audio stream instantaneously
    setActiveSongId(songId);
    gardenAudio.playChime(659.25, 0.8, 0.02);
  };

  const handleStopAll = () => {
    setActiveSongId(null);
  };

  return (
    <div className="relative z-10 min-h-screen py-10 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col justify-between animate-fadeIn pb-24">
      <div>
        <h1
          className="font-cursive text-3xl sm:text-5xl text-center mb-2 font-bold"
          style={{
            color: 'var(--mustard)',
            textShadow: '0 3px 12px rgba(0,0,0,0.35)',
          }}
        >
          I see you here.
        </h1>
        <p className="text-center text-neutral-200 text-sm sm:text-base italic mb-8 max-w-lg mx-auto">
          Official master recordings with real vocals, melodies, and lyrics. Exactly one song plays at a time.
        </p>

        {/* Songs List */}
        <div className="space-y-6">
          {SONGS.map((song) => {
            const isActive = activeSongId === song.id;

            return (
              <div
                key={song.id}
                className={`group relative p-5 rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isActive
                    ? 'border-yellow-400 bg-black/55 shadow-[0_12px_36px_rgba(255,206,27,0.25)] ring-2 ring-yellow-400/60'
                    : 'border-yellow-300/30 bg-black/25 hover:border-yellow-300/60 hover:bg-black/35 shadow-lg'
                }`}
              >
                {/* Header Information Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0 transition-transform duration-300"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #FFE270, #FFCE1B)'
                          : 'linear-gradient(135deg, #FFCE1B, #8A6500)',
                        color: '#261b00',
                      }}
                    >
                      {isActive ? (
                        <div className="flex items-center gap-1 h-5" aria-hidden="true">
                          <span className="w-1 bg-[#261b00] rounded-full animate-[pulse_0.6s_infinite] h-4" />
                          <span className="w-1 bg-[#261b00] rounded-full animate-[pulse_0.9s_infinite] h-6" />
                          <span className="w-1 bg-[#261b00] rounded-full animate-[pulse_0.75s_infinite] h-3" />
                        </div>
                      ) : (
                        song.icon
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-cursive text-2xl font-bold leading-tight"
                          style={{ color: 'var(--mustard)' }}
                        >
                          {song.title}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/25 text-yellow-300 border border-yellow-400/40 animate-pulse">
                            Now Playing
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-200 text-sm font-serif">
                        {song.artist} · <span className="text-yellow-200/70 italic text-xs">{song.note}</span>
                      </p>
                    </div>
                  </div>

                  {/* Play / Stop Button & Spotify link */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handlePlaySong(song.id)}
                      type="button"
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg active:scale-95 ${
                        isActive
                          ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 ring-2 ring-yellow-300'
                          : 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 hover:scale-105'
                      }`}
                      aria-label={isActive ? `Stop ${song.title}` : `Play ${song.title}`}
                    >
                      <span>{isActive ? '⏹ Stop Song' : '▶ Play Song'}</span>
                    </button>

                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-[#1DB954]/40 text-neutral-200 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-white/10"
                      title="Open full track in Spotify app"
                    >
                      <span>↗ Spotify</span>
                    </a>
                  </div>
                </div>

                {/* Quote reflection */}
                {song.quote && (
                  <p className="text-xs italic font-serif text-yellow-200/80 mt-3 px-1">
                    {song.quote}
                  </p>
                )}

                {/* ONLY mount the Spotify player iframe when this song is active */}
                {/* When switching to another track, this iframe is unmounted, instantly stopping previous audio */}
                {isActive && (
                  <div className="mt-4 w-full rounded-xl overflow-hidden shadow-2xl bg-black/70 border border-yellow-400/50 animate-fadeIn">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-yellow-400/15 border-b border-yellow-400/30 text-[11px] text-yellow-200">
                      <span>Streaming official master track</span>
                      <button
                        onClick={handleStopAll}
                        className="text-neutral-400 hover:text-white text-xs px-2"
                        title="Close player"
                      >
                        ✕ Stop &amp; Close
                      </button>
                    </div>
                    <iframe
                      key={song.id}
                      title={`Spotify Player: ${song.title}`}
                      src={song.embedUrl}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="eager"
                      className="w-full rounded-b-xl"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-12 text-center">
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
