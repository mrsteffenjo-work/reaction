// Results component - End game statistics and leaderboard

import { useGameStore } from '../../store/gameStore';
import {
    calculateAverage,
    calculateFastest,
    calculateSlowest,
    calculateProgression,
    generateFunStats,
    formatTime,
    getRankingSuffix,
} from '../../utils/statistics';
import { motion } from 'framer-motion';
import './Results.css';

export function Results() {
    const { players, resetGame } = useGameStore();

    // Sort players by average time
    const rankedPlayers = [...players].sort((a, b) => {
        const avgA = calculateAverage(a.reactionTimes);
        const avgB = calculateAverage(b.reactionTimes);
        if (avgA === 0 && avgB === 0) return 0;
        if (avgA === 0) return 1;
        if (avgB === 0) return -1;
        return avgA - avgB;
    });

    const winner = rankedPlayers[0];
    const funStats = generateFunStats(players);

    return (
        <div className="results">
            <motion.div
                className="results__winner"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <div className="results__trophy">🏆</div>
                <h1 className="results__winner-title">Winner!</h1>
                <div
                    className="results__winner-name"
                    style={{ color: winner?.color }}
                >
                    {winner?.name}
                </div>
                <div className="results__winner-time">
                    {formatTime(Math.round(calculateAverage(winner?.reactionTimes || [])))} avg
                </div>
            </motion.div>

            <div className="results__leaderboard">
                <h2 className="results__section-title">🏅 Final Standings</h2>
                <div className="results__rankings">
                    {rankedPlayers.map((player, index) => {
                        const avg = calculateAverage(player.reactionTimes);
                        const fastest = calculateFastest(player.reactionTimes);
                        const slowest = calculateSlowest(player.reactionTimes);
                        const progression = calculateProgression(player.reactionTimes);

                        return (
                            <motion.div
                                key={player.id}
                                className={`results__player ${index === 0 ? 'results__player--winner' : ''}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ '--player-color': player.color } as React.CSSProperties}
                            >
                                <div className="results__player-rank">
                                    {index < 3 ? (
                                        <span className="results__medal">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                        </span>
                                    ) : (
                                        <span className="results__rank-number">
                                            {index + 1}{getRankingSuffix(index + 1)}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="results__player-color"
                                    style={{ background: player.color }}
                                />

                                <div className="results__player-info">
                                    <span className="results__player-name">{player.name}</span>
                                    <div className="results__player-stats">
                                        <span className="results__stat">
                                            <span className="results__stat-label">Avg</span>
                                            <span className="results__stat-value">{formatTime(Math.round(avg))}</span>
                                        </span>
                                        <span className="results__stat">
                                            <span className="results__stat-label">Best</span>
                                            <span className="results__stat-value results__stat-value--best">{formatTime(fastest)}</span>
                                        </span>
                                        <span className="results__stat">
                                            <span className="results__stat-label">Worst</span>
                                            <span className="results__stat-value results__stat-value--worst">{formatTime(slowest)}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="results__player-trend">
                                    {progression.trend === 'improving' && (
                                        <span className="results__trend results__trend--up">📈 +{progression.improvement}%</span>
                                    )}
                                    {progression.trend === 'declining' && (
                                        <span className="results__trend results__trend--down">📉 {progression.improvement}%</span>
                                    )}
                                    {progression.trend === 'steady' && (
                                        <span className="results__trend results__trend--steady">➡️ steady</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {funStats.length > 0 && (
                <div className="results__fun-stats">
                    <h2 className="results__section-title">✨ Awards</h2>
                    <div className="results__awards">
                        {funStats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                className="results__award"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <span className="results__award-icon">{stat.icon}</span>
                                <div className="results__award-info">
                                    <span className="results__award-title">{stat.title}</span>
                                    <span className="results__award-player">{stat.playerName}</span>
                                    <span className="results__award-value">{stat.value}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <motion.button
                className="results__play-again"
                onClick={resetGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                🔄 Play Again
            </motion.button>
        </div>
    );
}
