export type Section = 'menu' | 'letter' | 'music' | 'spoken' | 'final';

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  embedUrl: string;
  icon: string;
  note?: string;
  quote?: string;
}

export interface FlowerData {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'tulip' | 'carnation' | 'rose';
  delay: number;
}
