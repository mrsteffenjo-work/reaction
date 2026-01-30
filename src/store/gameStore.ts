// Zustand store for game state management

import { create } from 'zustand';
import type { GameState, Player, GameSettings, RoundStats } from '../types/game';
import {
    getKeysForPlayerCount,
    getKeyDisplayName,
    getPlayerColor,
    generateBubblePosition,
    generateBubbleVelocity,
} from '../utils/keyboardLayout';

const DEFAULT_SETTINGS: GameSettings = {
    numberOfRounds: 3,
    flashesPerRound: 5,
    minFlashDelay: 1500,
    maxFlashDelay: 4000,
    reactionWindow: 2000,
};



function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function reassignKeys(players: Player[]): Player[] {
    const keys = getKeysForPlayerCount(players.length);
    return players.map((player, index) => ({
        ...player,
        assignedKey: keys[index] || 'X',
        keyDisplayName: getKeyDisplayName(keys[index] || 'X'),
    }));
}

function repositionBubbles(players: Player[]): Player[] {
    return players.map((player, index) => ({
        ...player,
        bubblePosition: generateBubblePosition(index, players.length),
        bubbleVelocity: generateBubbleVelocity(),
    }));
}

export const useGameStore = create<GameState>((set) => ({
    // Initial state
    players: [],
    settings: DEFAULT_SETTINGS,
    phase: 'lobby',
    currentRound: 0,
    currentFlash: 0,
    countdownValue: 3,
    activePlayerId: null,
    flashStartTime: null,
    roundStats: [],

    // Actions
    addPlayer: (name: string) => {
        set((state) => {
            if (state.players.length >= 8) return state;

            const newPlayer: Player = {
                id: generateId(),
                name: name.trim() || `Player ${state.players.length + 1}`,
                assignedKey: '',
                keyDisplayName: '',
                bubblePosition: { x: 0, y: 0 },
                bubbleVelocity: { vx: 0, vy: 0 },
                reactionTimes: [],
                color: getPlayerColor(state.players.length),
                isActive: false,
                hasResponded: false,
            };

            const newPlayers = [...state.players, newPlayer];
            return {
                players: repositionBubbles(reassignKeys(newPlayers)),
            };
        });
    },

    removePlayer: (id: string) => {
        set((state) => {
            const newPlayers = state.players.filter((p) => p.id !== id);
            return {
                players: repositionBubbles(reassignKeys(newPlayers)),
            };
        });
    },

    updateSettings: (newSettings: Partial<GameSettings>) => {
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        }));
    },

    startCountdown: () => {
        set({ phase: 'countdown', countdownValue: 3 });
    },

    startGame: () => {
        set((state) => ({
            phase: 'playing',
            currentRound: state.phase === 'roundEnd' ? state.currentRound : 1,
            currentFlash: 0,
            players: state.players.map((p) => ({
                ...p,
                reactionTimes: [],
                isActive: false,
                hasResponded: false,
            })),
            roundStats: state.phase === 'roundEnd' ? state.roundStats : [],
        }));
    },

    triggerFlash: (playerId: string) => {
        set((state) => ({
            activePlayerId: playerId,
            flashStartTime: performance.now(),
            currentFlash: state.currentFlash + 1,
            players: state.players.map((p) => ({
                ...p,
                isActive: p.id === playerId,
                hasResponded: false,
            })),
        }));
    },

    recordReaction: (playerId: string, time: number) => {
        set((state) => {
            if (state.activePlayerId !== playerId) return state;

            return {
                activePlayerId: null,
                flashStartTime: null,
                players: state.players.map((p) =>
                    p.id === playerId
                        ? {
                            ...p,
                            reactionTimes: [...p.reactionTimes, Math.round(time)],
                            isActive: false,
                            hasResponded: true,
                        }
                        : p
                ),
            };
        });
    },

    recordTimeout: (playerId: string) => {
        set((state) => ({
            activePlayerId: null,
            flashStartTime: null,
            players: state.players.map((p) =>
                p.id === playerId
                    ? {
                        ...p,
                        reactionTimes: [...p.reactionTimes, -1], // -1 indicates timeout
                        isActive: false,
                        hasResponded: false,
                    }
                    : p
            ),
        }));
    },

    nextFlash: () => {
        // This is handled by the game loop
    },

    endRound: () => {
        set((state) => {
            const roundStat: RoundStats = {
                roundNumber: state.currentRound,
                playerTimes: state.players.reduce(
                    (acc, p) => ({
                        ...acc,
                        [p.id]: p.reactionTimes.slice(-state.settings.flashesPerRound),
                    }),
                    {}
                ),
            };

            if (state.currentRound >= state.settings.numberOfRounds) {
                return {
                    phase: 'results',
                    roundStats: [...state.roundStats, roundStat],
                };
            }

            return {
                phase: 'roundEnd',
                currentRound: state.currentRound + 1,
                currentFlash: 0,
                roundStats: [...state.roundStats, roundStat],
                players: state.players.map((p) => ({
                    ...p,
                    isActive: false,
                    hasResponded: false,
                })),
            };
        });
    },

    endGame: () => {
        set({ phase: 'results' });
    },

    resetGame: () => {
        set((state) => ({
            phase: 'lobby',
            currentRound: 0,
            currentFlash: 0,
            countdownValue: 3,
            activePlayerId: null,
            flashStartTime: null,
            roundStats: [],
            players: repositionBubbles(
                state.players.map((p) => ({
                    ...p,
                    reactionTimes: [],
                    isActive: false,
                    hasResponded: false,
                }))
            ),
        }));
    },

    updateBubblePositions: () => {
        set((state) => {
            const padding = 5; // 5% padding
            const bubbleSize = 10; // Approx 10% bubble size

            return {
                players: state.players.map((p) => {
                    let { x, y } = p.bubblePosition;
                    let { vx, vy } = p.bubbleVelocity;

                    // Update position
                    x += vx;
                    y += vy;

                    // Bounce off walls (using percentages 0-100)
                    if (x < padding || x > 100 - padding - bubbleSize) {
                        vx = -vx;
                        x = Math.max(padding, Math.min(100 - padding - bubbleSize, x));
                    }
                    if (y < padding || y > 100 - padding - bubbleSize) {
                        vy = -vy;
                        y = Math.max(padding, Math.min(100 - padding - bubbleSize, y));
                    }

                    return {
                        ...p,
                        bubblePosition: { x, y },
                        bubbleVelocity: { vx, vy },
                    };
                }),
            };
        });
    },
}));

// Selector hooks for common data
export const usePlayersSelector = () => useGameStore((state) => state.players);
export const useSettingsSelector = () => useGameStore((state) => state.settings);
export const usePhaseSelector = () => useGameStore((state) => state.phase);
export const useActivePlayerSelector = () => useGameStore((state) => state.activePlayerId);
