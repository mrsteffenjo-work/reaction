// Lobby component - Player setup and game configuration

import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import './Lobby.css';

export function Lobby() {
    const { players, settings, addPlayer, removePlayer, updateSettings, startCountdown } = useGameStore();
    const [playerName, setPlayerName] = useState('');

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (players.length < 8) {
            addPlayer(playerName);
            setPlayerName('');
        }
    };

    const canStart = players.length >= 1;

    return (
        <div className="lobby">
            <div className="lobby__section">
                <h2 className="lobby__title">
                    <span className="lobby__title-icon">👥</span>
                    Players
                    <span className="lobby__player-count">{players.length}/8</span>
                </h2>

                <form className="lobby__add-form" onSubmit={handleAddPlayer}>
                    <input
                        type="text"
                        className="lobby__input"
                        placeholder="Enter player name..."
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        maxLength={12}
                        disabled={players.length >= 8}
                    />
                    <button
                        type="submit"
                        className="lobby__add-btn"
                        disabled={players.length >= 8}
                    >
                        Add
                    </button>
                </form>

                <div className="lobby__players">
                    <AnimatePresence mode="popLayout">
                        {players.map((player) => (
                            <motion.div
                                key={player.id}
                                className="lobby__player"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                style={{ '--player-color': player.color } as React.CSSProperties}
                            >
                                <div
                                    className="lobby__player-color"
                                    style={{ background: player.color }}
                                />
                                <span className="lobby__player-name">{player.name}</span>
                                <span className="lobby__player-key">{player.keyDisplayName}</span>
                                <button
                                    className="lobby__player-remove"
                                    onClick={() => removePlayer(player.id)}
                                    aria-label="Remove player"
                                >
                                    ×
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {players.length === 0 && (
                        <p className="lobby__empty">Add at least 1 player to start</p>
                    )}
                </div>
            </div>

            <div className="lobby__section">
                <h2 className="lobby__title">
                    <span className="lobby__title-icon">⚙️</span>
                    Settings
                </h2>

                <div className="lobby__settings">
                    <label className="lobby__setting">
                        <span className="lobby__setting-label">Rounds</span>
                        <div className="lobby__setting-control">
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ numberOfRounds: Math.max(1, settings.numberOfRounds - 1) })}
                            >
                                −
                            </button>
                            <span className="lobby__setting-value">{settings.numberOfRounds}</span>
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ numberOfRounds: Math.min(10, settings.numberOfRounds + 1) })}
                            >
                                +
                            </button>
                        </div>
                    </label>

                    <label className="lobby__setting">
                        <span className="lobby__setting-label">Flashes per Round</span>
                        <div className="lobby__setting-control">
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ flashesPerRound: Math.max(1, settings.flashesPerRound - 1) })}
                            >
                                −
                            </button>
                            <span className="lobby__setting-value">{settings.flashesPerRound}</span>
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ flashesPerRound: Math.min(20, settings.flashesPerRound + 1) })}
                            >
                                +
                            </button>
                        </div>
                    </label>

                    <label className="lobby__setting">
                        <span className="lobby__setting-label">Reaction Window</span>
                        <div className="lobby__setting-control">
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ reactionWindow: Math.max(500, settings.reactionWindow - 250) })}
                            >
                                −
                            </button>
                            <span className="lobby__setting-value">{settings.reactionWindow / 1000}s</span>
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ reactionWindow: Math.min(5000, settings.reactionWindow + 250) })}
                            >
                                +
                            </button>
                        </div>
                    </label>

                    <label className="lobby__setting">
                        <span className="lobby__setting-label">Min Flash Delay</span>
                        <div className="lobby__setting-control">
                            <button
                                className="lobby__setting-btn"
                                onClick={() => {
                                    const newMin = Math.max(500, settings.minFlashDelay - 500);
                                    updateSettings({ minFlashDelay: newMin });
                                }}
                            >
                                −
                            </button>
                            <span className="lobby__setting-value">{settings.minFlashDelay / 1000}s</span>
                            <button
                                className="lobby__setting-btn"
                                onClick={() => {
                                    const newMin = Math.min(settings.maxFlashDelay - 500, settings.minFlashDelay + 500);
                                    updateSettings({ minFlashDelay: newMin });
                                }}
                            >
                                +
                            </button>
                        </div>
                    </label>

                    <label className="lobby__setting">
                        <span className="lobby__setting-label">Max Flash Delay</span>
                        <div className="lobby__setting-control">
                            <button
                                className="lobby__setting-btn"
                                onClick={() => {
                                    const newMax = Math.max(settings.minFlashDelay + 500, settings.maxFlashDelay - 500);
                                    updateSettings({ maxFlashDelay: newMax });
                                }}
                            >
                                −
                            </button>
                            <span className="lobby__setting-value">{settings.maxFlashDelay / 1000}s</span>
                            <button
                                className="lobby__setting-btn"
                                onClick={() => updateSettings({ maxFlashDelay: Math.min(10000, settings.maxFlashDelay + 500) })}
                            >
                                +
                            </button>
                        </div>
                    </label>
                </div>
            </div>

            <button
                className="lobby__start-btn"
                onClick={startCountdown}
                disabled={!canStart}
            >
                {canStart ? '🚀 Start Game' : 'Add a player to start'}
            </button>
        </div>
    );
}
