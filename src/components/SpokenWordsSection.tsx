import React, { useState } from 'react';
import {
  RealisticCamellia,
  RealisticTulip,
  RealisticLily,
  RealisticCarnation,
  RealisticRose,
} from './RealisticFlowers';
import { DIGIBOUQUET_URL } from '../data';
import { gardenAudio } from '../utils/ambientSound';

interface SpokenWordsSectionProps {
  onBack: () => void;
}

interface FlowerMeaningItem {
  id: 'camellia' | 'tulip' | 'lily' | 'carnation' | 'rose';
  name: string;
  botanical: string;
  meaning: string;
  tagline: string;
  reflection: string;
  symbolismDetail: string;
  colorTheme: string;
}

export const SpokenWordsSection: React.FC<SpokenWordsSectionProps> = ({ onBack }) => {
  const [selectedFlowerId, setSelectedFlowerId] = useState<
    'camellia' | 'tulip' | 'lily' | 'carnation' | 'rose'
  >('camellia');
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');

  const flowers: FlowerMeaningItem[] = [
    {
      id: 'camellia',
      name: 'Camellia',
      botanical: 'Camellia japonica',
      meaning: 'Adoration, Devotion & Yearning',
      tagline: '“Even the flowers would adore the beauty of you.”',
      reflection:
        '“These flowers are beautiful in their own right, but I’m certain even they would adore the beauty of you.”',
      symbolismDetail:
        'In the Victorian language of flowers, the crimson camellia represents deep, steadfast admiration that endures across time and distance. It acknowledges a heart that still looks upon you with pure reverence.',
      colorTheme: '#C41E3A',
    },
    {
      id: 'tulip',
      name: 'Golden Tulip',
      botanical: 'Tulipa gesneriana',
      meaning: 'Declaration of True Affection',
      tagline: '“I loved you the way a barren field loves the rain...”',
      reflection:
        '“I loved you the way a barren field loves the rain... even if all we will ever be is an almost.”',
      symbolismDetail:
        'The golden tulip is an honest, unvarnished declaration of love. It speaks of a genuine heart that offered affection freely and without regret, even knowing the path ended in an almost.',
      colorTheme: '#E6A800',
    },
    {
      id: 'lily',
      name: 'White Lily',
      botanical: 'Lilium candidum',
      meaning: 'Purity, Reverence & Tender Asking',
      tagline: '“Could I be yours, if you’d have me?”',
      reflection:
        '“And if they could speak, I imagine they’d softly ask, ‘Could I be yours, if you’d have me?’”',
      symbolismDetail:
        'The white lily embodies innocence, tender vulnerability, and quiet peace. It whispers the fragile question kept inside—a gentle yearning for belonging and unconditional grace.',
      colorTheme: '#8AAB50',
    },
    {
      id: 'carnation',
      name: 'Blush Carnation',
      botanical: 'Dianthus caryophyllus',
      meaning: 'Heartfelt Apology & Lasting Gratitude',
      tagline: '“I’m sorry for choosing to be a coward.”',
      reflection:
        '“I’m sorry for making you feel unappreciated as someone who was once so close to me. Thank you for being willing to share conversations with me back then, for your time, your thoughts, and your heart.”',
      symbolismDetail:
        'Carnations are the flowers of heartfelt memory and gratitude. In floriography, they convey deep acknowledgment of regret, asking for forgiveness while cherishing every tender conversation shared.',
      colorTheme: '#D94168',
    },
    {
      id: 'rose',
      name: 'Garden Rose',
      botanical: 'Rosa damascena',
      meaning: 'Everlasting Harbor & Eternal Space',
      tagline: '“There will always be enough room for you there.”',
      reflection:
        '“I loved you yesterday, I love you today, and I will love you tomorrow and all the days that follow. There will always be enough room for you there. Be happy, and may you always find peace.”',
      symbolismDetail:
        'The ivory garden rose represents a harbor of peace, safe shelter, and timeless love. It is a blessing bestowed upon someone dear, wishing them endless gentleness, happiness, and kindness.',
      colorTheme: '#B89B59',
    },
  ];

  const currentFlower =
    flowers.find((f) => f.id === selectedFlowerId) || flowers[0];

  const renderFlowerIcon = (id: FlowerMeaningItem['id'], size = '100%') => {
    switch (id) {
      case 'camellia':
        return <RealisticCamellia size={size} />;
      case 'tulip':
        return <RealisticTulip size={size} />;
      case 'lily':
        return <RealisticLily size={size} />;
      case 'carnation':
        return <RealisticCarnation size={size} />;
      case 'rose':
        return <RealisticRose size={size} />;
    }
  };

  return (
    <div className="relative z-10 min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-between animate-fadeIn pb-24">
      <div>
        {/* Section Title */}
        <h1
          className="font-cursive text-3xl sm:text-5xl text-center mb-2 font-bold"
          style={{
            color: 'var(--mustard)',
            textShadow: '0 3px 12px rgba(0,0,0,0.35)',
          }}
        >
          What had the flowers wished to say?
        </h1>
        <p className="text-center text-yellow-100/80 text-sm sm:text-base italic mb-6 max-w-xl mx-auto font-serif">
          The botanical language of flowers (Floriography) &amp; unspoken thoughts left in the garden.
        </p>

        {/* Paper-style Journal Container */}
        <div className="paper-texture p-6 sm:p-10 md:p-12 text-neutral-900 shadow-2xl relative overflow-hidden rounded-2xl border border-[#d8c5a5]">
          {/* Header Note */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs font-serif text-[#6b6b00] border-b border-[#d8c8ab] pb-3 mb-6 gap-2">
            <span className="italic tracking-wider uppercase font-semibold flex items-center gap-1.5">
              <span>🌿</span>
              <span>Floriography Catalog · The Botanical Messages</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-neutral-500">Arranged for: <strong className="text-neutral-800">My almost us</strong></span>
              {/* View Switcher */}
              <div className="inline-flex rounded-lg bg-[#ebdcc2] p-0.5 border border-[#cbbb9f]">
                <button
                  type="button"
                  onClick={() => setViewMode('spotlight')}
                  className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-all ${
                    viewMode === 'spotlight'
                      ? 'bg-amber-100 text-neutral-900 shadow-sm font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Spotlight
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-amber-100 text-neutral-900 shadow-sm font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Meanings
                </button>
              </div>
            </div>
          </div>

          {/* Quick Flower Selector Ribbon */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#808000] mb-2 font-serif text-center">
              Select a flower to read its meaning &amp; whispered words:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              {flowers.map((fl) => {
                const isSelected = selectedFlowerId === fl.id;
                return (
                  <button
                    key={fl.id}
                    onClick={() => {
                      setSelectedFlowerId(fl.id);
                      gardenAudio.playChime(523.25, 1.0, 0.025);
                    }}
                    type="button"
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-100/90 border-[#808000] shadow-md scale-105 ring-2 ring-[#808000]/40'
                        : 'bg-[#faf3e6]/70 border-[#d8c8ab] hover:bg-amber-50 hover:border-[#b09e7c] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                      {renderFlowerIcon(fl.id, '100%')}
                    </div>
                    <div className="text-left">
                      <span className="block font-cursive text-base sm:text-lg font-bold leading-none text-[#3d3800]">
                        {fl.name}
                      </span>
                      <span className="block text-[10px] text-neutral-500 font-serif leading-none mt-0.5">
                        {fl.meaning.split(',')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIEW MODE 1: SPOTLIGHT VIEW */}
          {viewMode === 'spotlight' && (
            <div className="bg-[#FAF3E6] rounded-2xl border border-[#d8c5a5] p-6 sm:p-8 shadow-sm transition-all duration-500 my-4 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                {/* Large Flower Display */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-28 h-28 sm:w-36 sm:h-36 p-3 rounded-full bg-gradient-to-b from-white/80 to-amber-100/60 border border-[#d8c8ab] shadow-md flex items-center justify-center relative"
                    style={{
                      animation: 'floatFlower 6s ease-in-out infinite alternate',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))',
                    }}
                  >
                    {renderFlowerIcon(currentFlower.id, '100%')}
                  </div>
                  <span className="font-cursive text-2xl font-bold mt-3 text-[#3d3800]">
                    {currentFlower.name}
                  </span>
                  <span className="text-xs italic text-neutral-500 font-serif">
                    {currentFlower.botanical}
                  </span>
                </div>

                {/* Flower Meaning & Inscription Details */}
                <div className="flex-1 text-center md:text-left">
                  {/* Meaning Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAD8C4]/60 border border-[#d8c5a5] text-xs font-serif font-bold text-[#5c4a1e] mb-3">
                    <span>✨ Floriography Meaning:</span>
                    <span className="text-neutral-900 underline decoration-[#808000]/40">
                      {currentFlower.meaning}
                    </span>
                  </div>

                  {/* Primary Quote */}
                  <blockquote className="font-serif italic text-lg sm:text-xl text-neutral-900 leading-relaxed my-2 pl-2 border-l-2 border-[#808000]/60">
                    {currentFlower.reflection}
                  </blockquote>

                  {/* Deep Symbolism explanation */}
                  <p className="text-xs sm:text-sm text-neutral-700 font-serif leading-relaxed mt-3 pt-3 border-t border-[#e2d4bc]">
                    <strong className="text-[#665a00] font-semibold">Botanical Significance: </strong>
                    {currentFlower.symbolismDetail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: ALL FLOWER MEANINGS GRID */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 animate-fadeIn">
              {flowers.map((fl) => (
                <div
                  key={fl.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedFlowerId === fl.id
                      ? 'bg-[#FAF3E6] border-[#808000] shadow-md ring-1 ring-[#808000]/40'
                      : 'bg-[#faf5eb] border-[#d8c8ab] hover:border-[#b09e7c]'
                  }`}
                  onClick={() => setSelectedFlowerId(fl.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 flex-shrink-0">
                      {renderFlowerIcon(fl.id, '100%')}
                    </div>
                    <div>
                      <h4 className="font-cursive text-xl font-bold text-[#3d3800] leading-none">
                        {fl.name}
                      </h4>
                      <p className="text-[11px] italic text-neutral-500 font-serif">
                        {fl.botanical}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#ebdcc4]/50 rounded-lg p-2 text-xs font-serif mb-2">
                    <span className="font-bold text-[#58491c]">Meaning: </span>
                    <span className="font-medium text-neutral-900">{fl.meaning}</span>
                  </div>

                  <p className="text-xs font-serif italic text-neutral-800 line-clamp-3">
                    {fl.reflection}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Digital Bouquet Inscription Card */}
          <div className="mt-8 p-6 rounded-2xl bg-[#F7EFE1] border border-[#d8c5a5] text-center shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center text-xs font-serif text-neutral-500 mb-2 px-2 border-b border-[#e5d8c3] pb-2">
              <span>To: <strong className="text-neutral-800">My almost us</strong></span>
              <span>Theme: <strong className="text-[#808000]">Starlit Midnight</strong></span>
              <span>From: <strong className="text-neutral-800">Your Ji</strong></span>
            </div>

            <blockquote className="font-serif italic text-base sm:text-lg text-neutral-900 leading-relaxed my-3 px-2">
              “These flowers are beautiful in their own right, but I’m certain even they would adore the beauty of you. And if they could speak, I imagine they’d softly ask, <span className="font-bold text-[#665a00]">‘Could I be yours, if you’d have me?’</span>”
            </blockquote>

            <p className="text-xs text-neutral-600 font-serif italic">
              Arrangement: Camellia · Golden Tulip · White Lily · Preserved Midnight Greenery
            </p>
          </div>

          {/* Direct Connection Link to DigiBouquet */}
          <div className="mt-8 text-center flex flex-col items-center">
            <a
              href={DIGIBOUQUET_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gardenAudio.playGardenChimeChord()}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-serif font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              style={{
                backgroundColor: 'var(--mustard)',
                color: 'var(--olive-dark)',
                boxShadow: '0 8px 25px rgba(255, 206, 27, 0.45)',
              }}
            >
              <span>💐 Open Your DigiBouquet</span>
              <span className="text-xl">↗</span>
            </a>

            <p className="text-xs text-neutral-600 font-serif mt-3 italic max-w-md">
              Tap above to view your interactive digital bouquet created specially for you at digibouquet.net.
            </p>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-8 text-center">
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
