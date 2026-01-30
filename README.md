# ⚡ Reaction Arena

A multiplayer reaction time game built with React, TypeScript, and Vite.

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open **http://localhost:5173** in your browser.

## 🎮 How to Play

1. **Add Players** - Enter names in the lobby (2-8 players)
2. **Configure Settings** - Adjust rounds, flashes, and reaction window
3. **Start Game** - Click "Start Game" when ready
4. **React!** - Press your assigned key when your bubble lights up
5. **View Results** - See winner, rankings, and fun stats

### ⌨️ Keyboard Assignments

Keys are automatically assigned for optimal spacing:

| Players | Keys |
|---------|------|
| 2 | F, J |
| 3 | D, G, K |
| 4 | A, F, J, ; |
| 5 | A, D, G, J, ; |
| 6+ | Spread across home row |

## ✨ Features

- **Multiplayer Support** - 2-8 players on same keyboard
- **Animated Bubbles** - Floating bubbles with glow effects
- **Arched Names** - Player names arc below bubbles
- **Configurable Game** - Rounds, flashes per round, reaction window
- **Live Statistics** - Real-time rankings during gameplay
- **Fun Awards** - Achievements like "Lightning Reflexes", "Most Improved", etc.

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Zustand (state management)
- Framer Motion (animations)

## 📁 Project Structure

```
src/
├── components/       # UI components
├── hooks/            # Game loop & keyboard input
├── store/            # Zustand state management
├── types/            # TypeScript interfaces
├── utils/            # Statistics & keyboard layout
└── App.tsx           # Main component
```
