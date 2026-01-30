// LiveStats component - Real-time statistics display during gameplay

import { useGameStore } from '../../store/gameStore';
import { calculateAverage, formatTime } from '../../utils/statistics';
import { motion } from 'framer-motion';
import './LiveStats.css';

export function LiveStats() {
    const { players, currentRound, currentFlash, settings, phase } = useGameStore();

    const totalFlashes = settings.flashesPerRound * settings.numberOfRounds;
    const completedFlashes = (currentRound - 1) * settings.flashesPerRound + currentFlash;
    const progress = totalFlashes > 0 ? (completedFlashes / totalFlashes) * 100 : 0;

    // Sort players by average time for live ranking
    const rankedPlayers = [...players].sort((a, b) => {
        const avgA = calculateAverage(a.reactionTimes);
        const avgB = calculateAverage(b.reactionTimes);
        if (avgA === 0 && avgB === 0) return 0;
        if (avgA === 0) return 1;
        if (avgB === 0) return -1;
        return avgA - avgB;
    });

    return (
        <div className="live-stats">
            <div className="live-stats__header">
                <h2 className="live-stats__title">📊 Live Stats</h2>
                <div className="live-stats__round">
                    Round {currentRound}/{settings.numberOfRounds}
                </div>
            </div>

            <div className="live-stats__progress">
                <div className="live-stats__progress-label">
                    <span>Flash {currentFlash}/{settings.flashesPerRound}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="live-stats__progress-bar">
                    <motion.div
                        className="live-stats__progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <div className="live-stats__rankings">
                <h3 className="live-stats__section-title">Current Rankings</h3>
                <div className="live-stats__players">
                    {rankedPlayers.map((player, index) => {
                        const avg = calculateAverage(player.reactionTimes);
                        const lastTime = player.reactionTimes[player.reactionTimes.length - 1];
                        const hasReacted = player.reactionTimes.length > 0;

                        return (
                            <motion.div
                                key={player.id}
                                className={`live-stats__player ${player.isActive ? 'live-stats__player--active' : ''}`}
                                layout
                                transition={{ duration: 0.3 }}
                            >
                                <span className="live-stats__rank">
                                    {hasReacted ? `#${index + 1}` : '-'}
                                </span>
                                <div
                                    className="live-stats__player-color"
                                    style={{ background: player.color }}
                                />
                                <span className="live-stats__player-name">{player.name}</span>
                                <div className="live-stats__times">
                                    {hasReacted ? (
                                        <>
                                            <span className="live-stats__avg">{formatTime(Math.round(avg))}</span>
                                            {lastTime !== undefined && (
                                                <span className={`live-stats__last ${lastTime < 0 ? 'live-stats__last--timeout' : ''}`}>
                                                    {formatTime(lastTime)}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="live-stats__waiting">Waiting...</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="live-stats__legend">
                <div className="live-stats__legend-item">
                    <span className="live-stats__legend-dot live-stats__legend-dot--avg" />
                    Average
                </div>
                <div className="live-stats__legend-item">
                    <span className="live-stats__legend-dot live-stats__legend-dot--last" />
                    Last
                </div>
            </div>
        </div>
    );
}
