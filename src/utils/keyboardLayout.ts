// Keyboard layout utility for optimal key spacing

// Keys ordered by optimal spacing for different player counts
// Using home row and easily reachable keys
const KEY_LAYOUTS: Record<number, string[]> = {
    2: ['F', 'J'],
    3: ['D', 'G', 'K'],
    4: ['A', 'F', 'J', ';'],
    5: ['A', 'D', 'G', 'J', ';'],
    6: ['S', 'D', 'G', 'H', 'K', 'L'],
    7: ['A', 'S', 'D', 'G', 'H', 'K', 'L'],
    8: ['A', 'S', 'D', 'F', 'H', 'J', 'K', 'L'],
};

// Display names for special keys
const KEY_DISPLAY_NAMES: Record<string, string> = {
    ';': ';',
    ' ': 'SPACE',
};

export function getKeysForPlayerCount(count: number): string[] {
    if (count < 1) return ['F'];
    if (count === 1) return ['F'];
    if (count > 8) count = 8;
    return KEY_LAYOUTS[count] || KEY_LAYOUTS[8].slice(0, count);
}

export function getKeyDisplayName(key: string): string {
    return KEY_DISPLAY_NAMES[key] || key.toUpperCase();
}

// Generate vibrant colors for players
const PLAYER_COLORS = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Salmon
    '#AA96DA', // Lavender
    '#FCBAD3', // Pink
    '#A8D8EA', // Sky Blue
];

export function getPlayerColor(index: number): string {
    return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

// Generate random position within canvas bounds (using percentages 0-100)
export function generateBubblePosition(
    index: number,
    totalPlayers: number
): { x: number; y: number } {
    const padding = 15; // padding in percentage
    const usableWidth = 100 - padding * 2;
    const usableHeight = 100 - padding * 2;

    // Distribute players in a nice pattern
    const cols = Math.ceil(Math.sqrt(totalPlayers));
    const rows = Math.ceil(totalPlayers / cols);

    const col = index % cols;
    const row = Math.floor(index / cols);

    const cellWidth = usableWidth / cols;
    const cellHeight = usableHeight / rows;

    // Add some randomness within the cell
    const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.3;
    const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.3;

    return {
        x: padding + cellWidth * (col + 0.5) + randomOffsetX,
        y: padding + cellHeight * (row + 0.5) + randomOffsetY,
    };
}

// Generate random velocity for floating animation
export function generateBubbleVelocity(): { vx: number; vy: number } {
    const speed = 0.1 + Math.random() * 0.1;
    const angle = Math.random() * Math.PI * 2;
    return {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
    };
}
