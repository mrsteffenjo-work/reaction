// Statistics calculation utilities

import type { Player, FunStat } from '../types/game';

export function calculateAverage(times: number[]): number {
    const validTimes = times.filter(t => t > 0);
    if (validTimes.length === 0) return 0;
    return validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
}

export function calculateFastest(times: number[]): number {
    const validTimes = times.filter(t => t > 0);
    if (validTimes.length === 0) return 0;
    return Math.min(...validTimes);
}

export function calculateSlowest(times: number[]): number {
    const validTimes = times.filter(t => t > 0);
    if (validTimes.length === 0) return 0;
    return Math.max(...validTimes);
}

export function calculateMedian(times: number[]): number {
    const validTimes = times.filter(t => t > 0).sort((a, b) => a - b);
    if (validTimes.length === 0) return 0;
    const mid = Math.floor(validTimes.length / 2);
    return validTimes.length % 2 !== 0
        ? validTimes[mid]
        : (validTimes[mid - 1] + validTimes[mid]) / 2;
}

export function countTimeouts(times: number[]): number {
    return times.filter(t => t === -1).length;
}

export function calculateConsistency(times: number[]): number {
    const validTimes = times.filter(t => t > 0);
    if (validTimes.length < 2) return 100;

    const avg = calculateAverage(validTimes);
    const variance = validTimes.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / validTimes.length;
    const stdDev = Math.sqrt(variance);

    // Convert to a 0-100 score where lower stdDev = higher consistency
    const consistencyScore = Math.max(0, 100 - (stdDev / avg) * 100);
    return Math.round(consistencyScore);
}

export interface ProgressionData {
    times: number[];
    trend: 'improving' | 'declining' | 'steady';
    improvement: number; // percentage change from first half to second half
}

export function calculateProgression(times: number[]): ProgressionData {
    const validTimes = times.filter(t => t > 0);

    if (validTimes.length < 4) {
        return { times: validTimes, trend: 'steady', improvement: 0 };
    }

    const midpoint = Math.floor(validTimes.length / 2);
    const firstHalf = validTimes.slice(0, midpoint);
    const secondHalf = validTimes.slice(midpoint);

    const firstAvg = calculateAverage(firstHalf);
    const secondAvg = calculateAverage(secondHalf);

    const improvement = ((firstAvg - secondAvg) / firstAvg) * 100;

    let trend: 'improving' | 'declining' | 'steady';
    if (improvement > 5) trend = 'improving';
    else if (improvement < -5) trend = 'declining';
    else trend = 'steady';

    return { times: validTimes, trend, improvement: Math.round(improvement) };
}

export function generateFunStats(players: Player[]): FunStat[] {
    const stats: FunStat[] = [];

    if (players.length === 0) return stats;

    // Find the player with best consistency
    let bestConsistency = { player: players[0], score: 0 };
    let mostImproved = { player: players[0], improvement: -Infinity };
    let quickestReflexes = { player: players[0], fastest: Infinity };
    let mostTimeouts = { player: players[0], count: 0 };
    let slowestReaction = { player: players[0], slowest: 0 };

    for (const player of players) {
        const consistency = calculateConsistency(player.reactionTimes);
        if (consistency > bestConsistency.score) {
            bestConsistency = { player, score: consistency };
        }

        const progression = calculateProgression(player.reactionTimes);
        if (progression.improvement > mostImproved.improvement) {
            mostImproved = { player, improvement: progression.improvement };
        }

        const fastest = calculateFastest(player.reactionTimes);
        if (fastest > 0 && fastest < quickestReflexes.fastest) {
            quickestReflexes = { player, fastest };
        }

        const timeouts = countTimeouts(player.reactionTimes);
        if (timeouts > mostTimeouts.count) {
            mostTimeouts = { player, count: timeouts };
        }

        const slowest = calculateSlowest(player.reactionTimes);
        if (slowest > slowestReaction.slowest) {
            slowestReaction = { player, slowest };
        }
    }

    // Add fun stats
    if (bestConsistency.score > 70) {
        stats.push({
            title: 'Steady Hands',
            playerName: bestConsistency.player.name,
            value: `${bestConsistency.score}% consistency`,
            icon: '🎯',
        });
    }

    if (mostImproved.improvement > 10) {
        stats.push({
            title: 'Most Improved',
            playerName: mostImproved.player.name,
            value: `${mostImproved.improvement}% faster`,
            icon: '📈',
        });
    }

    if (quickestReflexes.fastest < Infinity) {
        stats.push({
            title: 'Lightning Reflexes',
            playerName: quickestReflexes.player.name,
            value: `${quickestReflexes.fastest}ms`,
            icon: '⚡',
        });
    }

    if (mostTimeouts.count > 0) {
        stats.push({
            title: 'Sleepy Head',
            playerName: mostTimeouts.player.name,
            value: `${mostTimeouts.count} timeouts`,
            icon: '😴',
        });
    }

    if (slowestReaction.slowest > 500) {
        stats.push({
            title: 'Slow & Steady',
            playerName: slowestReaction.player.name,
            value: `${slowestReaction.slowest}ms`,
            icon: '🐢',
        });
    }

    return stats;
}

export function formatTime(ms: number): string {
    if (ms < 0) return 'TIMEOUT';
    if (ms === 0) return '-';
    return `${ms}ms`;
}

export function getRankingSuffix(rank: number): string {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
}
