// Bubble component with floating animation and flash effect

import { motion } from 'framer-motion';
import type { Player } from '../../types/game';
import './Bubble.css';

interface BubbleProps {
    player: Player;
    showKey?: boolean;
}

export function Bubble({ player, showKey = true }: BubbleProps) {
    const { name, assignedKey, keyDisplayName, bubblePosition, color, isActive } = player;

    return (
        <motion.div
            className={`bubble ${isActive ? 'bubble--active' : ''}`}
            style={{
                left: `${bubblePosition.x}%`,
                top: `${bubblePosition.y}%`,
                '--bubble-color': color,
                '--bubble-glow': color,
            } as React.CSSProperties}
            animate={{
                scale: isActive ? [1, 1.15, 1.1] : 1,
                boxShadow: isActive
                    ? `0 0 60px ${color}, 0 0 100px ${color}, 0 0 140px ${color}`
                    : `0 8px 32px rgba(0, 0, 0, 0.3)`,
            }}
            transition={{
                scale: { duration: 0.2 },
                boxShadow: { duration: 0.15 },
            }}
        >
            {/* Inner glow effect */}
            <div className="bubble__inner" style={{ background: color }} />

            {/* Key display */}
            {showKey && (
                <div className="bubble__key">
                    <span className="bubble__key-text">{keyDisplayName || assignedKey}</span>
                </div>
            )}

            {/* Arched name below bubble */}
            <svg className="bubble__name-arc" viewBox="0 0 120 40" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <path
                        id={`arc-${player.id}`}
                        d="M 10,35 Q 60,10 110,35"
                        fill="none"
                    />
                </defs>
                <text className="bubble__name-text">
                    <textPath
                        href={`#arc-${player.id}`}
                        startOffset="50%"
                        textAnchor="middle"
                    >
                        {name}
                    </textPath>
                </text>
            </svg>
        </motion.div>
    );
}
