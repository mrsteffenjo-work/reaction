// GameCanvas component - renders all player bubbles

import { useGameStore } from '../../store/gameStore';
import { Bubble } from '../Bubble/Bubble';
import './GameCanvas.css';

interface GameCanvasProps {
    showKeys?: boolean;
}

export function GameCanvas({ showKeys = true }: GameCanvasProps) {
    const players = useGameStore((state) => state.players);

    return (
        <div className="game-canvas">
            <div className="game-canvas__background">
                {/* Gradient orbs for visual interest */}
                <div className="game-canvas__orb game-canvas__orb--1" />
                <div className="game-canvas__orb game-canvas__orb--2" />
                <div className="game-canvas__orb game-canvas__orb--3" />
            </div>

            <div className="game-canvas__bubbles">
                {players.map((player) => (
                    <Bubble key={player.id} player={player} showKey={showKeys} />
                ))}
            </div>

            {players.length === 0 && (
                <div className="game-canvas__empty">
                    <p>Add players to begin</p>
                </div>
            )}
        </div>
    );
}
