// Main game loop hook

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
    const {
        phase,
        settings,
        currentRound,
        currentFlash,
        activePlayerId,
        flashStartTime,
        countdownValue,
        triggerFlash,
        recordTimeout,
        endRound,
        startGame,
        updateBubblePositions,
    } = useGameStore();

    const timeoutRef = useRef<number | null>(null);
    const flashTimeoutRef = useRef<number | null>(null);
    const animationRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);

    // Clear all timeouts
    const clearAllTimeouts = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (flashTimeoutRef.current) {
            clearTimeout(flashTimeoutRef.current);
            flashTimeoutRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    // Schedule next flash
    const scheduleNextFlash = useCallback(() => {
        const currentState = useGameStore.getState();
        const { phase: currentPhase, players: currentPlayers, settings: currentSettings } = currentState;

        if (currentPhase !== 'playing' || currentPlayers.length === 0) return;

        const delay =
            currentSettings.minFlashDelay +
            Math.random() * (currentSettings.maxFlashDelay - currentSettings.minFlashDelay);

        timeoutRef.current = window.setTimeout(() => {
            // Get fresh state for player selection
            const freshState = useGameStore.getState();
            if (freshState.phase !== 'playing' || freshState.players.length === 0) return;

            const randomIndex = Math.floor(Math.random() * freshState.players.length);
            const randomPlayer = freshState.players[randomIndex];
            triggerFlash(randomPlayer.id);
        }, delay);
    }, [triggerFlash]);

    // Handle countdown phase
    useEffect(() => {
        if (phase !== 'countdown') return;

        let count = 3;
        useGameStore.setState({ countdownValue: count });

        countdownRef.current = window.setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countdownRef.current!);
                countdownRef.current = null;
                startGame();
            } else {
                useGameStore.setState({ countdownValue: count });
            }
        }, 1000);

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
        };
    }, [phase, startGame]);

    // Handle active flash timeout
    useEffect(() => {
        if (!activePlayerId || !flashStartTime || phase !== 'playing') return;

        flashTimeoutRef.current = window.setTimeout(() => {
            recordTimeout(activePlayerId);
        }, settings.reactionWindow);

        return () => {
            if (flashTimeoutRef.current) {
                clearTimeout(flashTimeoutRef.current);
                flashTimeoutRef.current = null;
            }
        };
    }, [activePlayerId, flashStartTime, settings.reactionWindow, recordTimeout, phase]);

    // Handle flash completion -> next flash or end round
    useEffect(() => {
        if (phase !== 'playing') return;
        if (activePlayerId !== null) return; // Still waiting for reaction

        // Check if round is complete
        if (currentFlash >= settings.flashesPerRound) {
            endRound();
            return;
        }

        // Schedule next flash
        scheduleNextFlash();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [phase, activePlayerId, currentFlash, settings.flashesPerRound, scheduleNextFlash, endRound]);

    // Animation loop for bubble movement
    useEffect(() => {
        if (phase === 'lobby' || phase === 'results') {
            // Keep bubbles moving in lobby and results too
        }

        const animate = () => {
            updateBubblePositions();
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [phase, updateBubblePositions]);

    // Cleanup on unmount
    useEffect(() => {
        return clearAllTimeouts;
    }, [clearAllTimeouts]);

    return {
        countdownValue,
        currentRound,
        currentFlash,
        totalRounds: settings.numberOfRounds,
        flashesPerRound: settings.flashesPerRound,
    };
}
