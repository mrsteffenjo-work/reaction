// Main App component

import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { Lobby } from './components/Lobby/Lobby';
import { GameCanvas } from './components/GameCanvas/GameCanvas';
import { LiveStats } from './components/LiveStats/LiveStats';
import { Results } from './components/Results/Results';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function Countdown() {
  const countdownValue = useGameStore((state) => state.countdownValue);

  return (
    <motion.div
      className="countdown"
      key={countdownValue}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="countdown__value">{countdownValue}</span>
      <span className="countdown__text">Get Ready!</span>
    </motion.div>
  );
}

function RoundEnd() {
  const { currentRound, settings } = useGameStore();
  const startGame = useGameStore((state) => state.startGame);

  return (
    <motion.div
      className="round-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="round-end__title">Round {currentRound - 1} Complete!</h2>
      <p className="round-end__subtitle">
        {settings.numberOfRounds - currentRound + 1} round{settings.numberOfRounds - currentRound + 1 !== 1 ? 's' : ''} remaining
      </p>
      <motion.button
        className="round-end__btn"
        onClick={() => startGame()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Round {currentRound}
      </motion.button>
    </motion.div>
  );
}

function App() {
  const phase = useGameStore((state) => state.phase);

  // Initialize game hooks
  useGameLoop();
  useKeyboardInput();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__title-icon">⚡</span>
          Reaction Arena
        </h1>
        <p className="app__subtitle">Test your reflexes against friends!</p>
      </header>

      <main className="app__main">
        <AnimatePresence mode="wait">
          {phase === 'lobby' && (
            <motion.div
              key="lobby"
              className="app__layout app__layout--lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="app__canvas-section">
                <GameCanvas showKeys={true} />
              </div>
              <aside className="app__sidebar">
                <Lobby />
              </aside>
            </motion.div>
          )}

          {phase === 'countdown' && (
            <motion.div
              key="countdown"
              className="app__layout app__layout--playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="app__canvas-section app__canvas-section--countdown">
                <GameCanvas />
                <Countdown />
              </div>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div
              key="playing"
              className="app__layout app__layout--playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="app__canvas-section">
                <GameCanvas />
              </div>
              <aside className="app__sidebar">
                <LiveStats />
              </aside>
            </motion.div>
          )}

          {phase === 'roundEnd' && (
            <motion.div
              key="roundEnd"
              className="app__layout app__layout--playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="app__canvas-section">
                <GameCanvas />
                <RoundEnd />
              </div>
              <aside className="app__sidebar">
                <LiveStats />
              </aside>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div
              key="results"
              className="app__layout app__layout--results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Results />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="app__footer">
        <p>Press your assigned key when your bubble lights up!</p>
      </footer>
    </div>
  );
}

export default App;
