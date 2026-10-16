# A Letter in the Garden 🌿🌸 (Nji > Ayi)

An interactive, animated romantic web letter featuring 3D garden effects, blooming flowers, music player, spoken words, and chibi animations.

---

## 🚀 Option 1: Instant Run (No Node.js or Setup Required)
You can open this website immediately on **any device** (Phone, Tablet, Mac, Windows, iPhone, Android):

1. Double-click **`standalone.html`** (or open it with any web browser: Chrome, Safari, Edge, Firefox, Brave).
2. Everything (React, animations, styles, audio synthesizer) is self-contained in that single file.
3. The password to enter the letter is **`404125`** (or tap "Password helper" in the UI).

---

## 💻 Option 2: Full Developer Setup (Vite + React + TypeScript + Tailwind)
If you want to edit the React components or run the development server:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local dev server**:
   ```bash
   npm run dev
   ```
3. Open your browser at [http://localhost:3000](http://localhost:3000).

4. **Build production files**:
   ```bash
   npm run build
   ```

---

## 🌐 Option 3: Host Online for Free (Shareable Link for Ayi)
To give Ayi a permanent link they can open from anywhere:
1. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop) (free, no credit card).
2. Drag and drop the folder or rename `standalone.html` to `index.html` and drop it in.
3. You will get an instant live HTTPS link like `https://letter-for-ayi.netlify.app` that works on all devices worldwide!

---

## 📂 Project Structure
- `standalone.html` - Self-contained single-file version ready for double-clicking.
- `src/` - Complete React source code:
  - `components/AnimeChibiScene.tsx` - Hand-drawn chibi anime couple with blush, wind, and garden ambiance.
  - `components/ChibiScene3D.tsx` - Three.js 3D chibi scene.
  - `components/MusicSection.tsx` - Spotify and sound player.
  - `components/SpokenWordsSection.tsx` - Audio recordings and heartfelt voice clips.
  - `components/LetterSection.tsx` - The poetic romantic letter with interactive reading experience.
  - `components/RealisticFlowers.tsx` & `FlowerSpiral.tsx` - Blooming floral animations.
  - `components/PasswordGate.tsx` - Passcode protection (`404125`).
- `package.json` - Project metadata and scripts.
- `vite.config.ts` - Vite configuration.
