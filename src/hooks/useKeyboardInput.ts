// Keyboard input hook for handling player reactions

import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useKeyboardInput() {
    const { players, phase, activePlayerId, flashStartTime, recordReaction } = useGameStore();
    const pressedKeysRef = useRef<Set<string>>(new Set());

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Only process during active gameplay
            if (phase !== 'playing' || !activePlayerId || !flashStartTime) return;

            const key = event.key.toUpperCase();

            // Prevent key repeat
            if (pressedKeysRef.current.has(key)) return;
            pressedKeysRef.current.add(key);

            // Find player with this key
            const player = players.find(
                (p) => p.assignedKey.toUpperCase() === key
            );

            if (!player) return;

            // Check if this is the active player
            if (player.id === activePlayerId) {
                const reactionTime = performance.now() - flashStartTime;
                recordReaction(player.id, reactionTime);
            }
            // Wrong key pressed - could add feedback here
        },
        [players, phase, activePlayerId, flashStartTime, recordReaction]
    );

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        const key = event.key.toUpperCase();
        pressedKeysRef.current.delete(key);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Clear pressed keys when phase changes
    useEffect(() => {
        pressedKeysRef.current.clear();
    }, [phase]);
}
