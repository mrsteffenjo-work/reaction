// Game Types for Multiplayer Reaction Time Game

export interface Player {
    id: string;
    name: string;
    assignedKey: string;
    keyDisplayName: string;
    bubblePosition: { x: number; y: number };
    bubbleVelocity: { vx: number; vy: number };
    reactionTimes: number[]; // ms per flash, -1 = missed/timeout
    color: string;
    isActive: boolean; // currently needs to react
    hasResponded: boolean; // responded this flash
}

export interface GameSettings {
    numberOfRounds: number;
    flashesPerRound: number;
    minFlashDelay: number; // ms between flashes
    maxFlashDelay: number; // ms between flashes
    reactionWindow: number; // ms to respond before timeout
}

export type GamePhase = 'lobby' | 'countdown' | 'playing' | 'roundEnd' | 'results';

export interface RoundStats {
    roundNumber: number;
    playerTimes: Record<string, number[]>; // playerId -> times in this round
}

export interface FunStat {
    title: string;
    playerName: string;
    value: string;
    icon: string;
}

export interface GameState {
    // Players
    players: Player[];

    // Settings
    settings: GameSettings;

    // Game state
    phase: GamePhase;
    currentRound: number;
    currentFlash: number;
    countdownValue: number;

    // Active flash state
    activePlayerId: string | null;
    flashStartTime: number | null;

    // History
    roundStats: RoundStats[];

    // Actions
    addPlayer: (name: string) => void;
    removePlayer: (id: string) => void;
    updateSettings: (settings: Partial<GameSettings>) => void;
    startGame: () => void;
    startCountdown: () => void;
    triggerFlash: (playerId: string) => void;
    recordReaction: (playerId: string, time: number) => void;
    recordTimeout: (playerId: string) => void;
    nextFlash: () => void;
    endRound: () => void;
    endGame: () => void;
    resetGame: () => void;
    updateBubblePositions: () => void;
}
