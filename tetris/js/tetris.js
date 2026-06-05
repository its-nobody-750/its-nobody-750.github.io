// Tetris Game Engine Core Logic

export const COLS = 10;
export const ROWS = 20;

// Tetromino definitions
export const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [2, 2],
        [2, 2]
    ],
    T: [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0]
    ],
    S: [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0]
    ],
    Z: [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    J: [
        [6, 0, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 7],
        [7, 7, 7],
        [0, 0, 0]
    ]
};

// Colors indexed to match the values in the grid
export const NEON_COLORS = [
    null,                   // 0 is empty
    '#00f0ff',              // 1: I (Cyan)
    '#ffdf00',              // 2: O (Yellow)
    '#9d00ff',              // 3: T (Purple)
    '#39ff14',              // 4: S (Green)
    '#ff007f',              // 5: Z (Magenta)
    '#0044ff',              // 6: J (Blue)
    '#ff6c00'               // 7: L (Orange)
];

export class Tetris {
    constructor() {
        this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        
        this.hasHeldThisTurn = false;
        this.gameOver = false;
        this.paused = false;
        
        this.bag = [];
        this.reset();
    }

    reset() {
        this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.holdPiece = null;
        this.hasHeldThisTurn = false;
        this.gameOver = false;
        this.paused = false;
        this.bag = [];
        
        this.nextPiece = this.generatePiece();
        this.spawnPiece();
    }

    // Standard 7-bag randomizer for balanced distribution
    generatePiece() {
        if (this.bag.length === 0) {
            this.bag = Object.keys(SHAPES);
            // Shuffle
            for (let i = this.bag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
        
        const type = this.bag.pop();
        const matrix = JSON.parse(JSON.stringify(SHAPES[type]));
        
        return {
            type,
            matrix,
            x: Math.floor((COLS - matrix[0].length) / 2),
            y: type === 'I' ? -1 : 0
        };
    }

    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.generatePiece();
        this.hasHeldThisTurn = false;

        // Game over if new piece immediately overlaps blocks
        if (this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
        }
    }

    checkCollision(matrix, xOffset, yOffset) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const nextX = xOffset + c;
                    const nextY = yOffset + r;

                    // Walls and floor checks
                    if (nextX < 0 || nextX >= COLS || nextY >= ROWS) {
                        return true;
                    }

                    // Ceiling check (allow pieces to rotate slightly above grid, but check for locked blocks)
                    if (nextY >= 0) {
                        if (this.board[nextY][nextX] !== 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    move(dirX) {
        if (this.gameOver || this.paused) return false;
        
        if (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x + dirX, this.currentPiece.y)) {
            this.currentPiece.x += dirX;
            return true;
        }
        return false;
    }

    // SRS-lite (Super Rotation System simplified) for satisfying wall-kicks
    rotate() {
        if (this.gameOver || this.paused) return false;

        const originalMatrix = this.currentPiece.matrix;
        const size = originalMatrix.length;
        const rotatedMatrix = Array.from({ length: size }, () => Array(size).fill(0));

        // Transpose and reverse rows (Clockwise Rotation)
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                rotatedMatrix[c][size - 1 - r] = originalMatrix[r][c];
            }
        }

        // Test offsets for rotation wall kick
        // Standard, then Left 1, Right 1, Up 1, Down 1 (only if I/T/etc near bottom)
        const kicks = [
            [0, 0],   // No shift
            [-1, 0],  // Shift left 1
            [1, 0],   // Shift right 1
            [0, -1],  // Shift up 1
            [-2, 0],  // Shift left 2 (mainly for I pieces)
            [2, 0],   // Shift right 2
        ];

        for (const [kx, ky] of kicks) {
            if (!this.checkCollision(rotatedMatrix, this.currentPiece.x + kx, this.currentPiece.y + ky)) {
                this.currentPiece.matrix = rotatedMatrix;
                this.currentPiece.x += kx;
                this.currentPiece.y += ky;
                return true;
            }
        }

        return false;
    }

    drop() {
        if (this.gameOver || this.paused) return false;

        if (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            return true;
        }

        // Lock piece if it cannot drop further
        this.lockPiece();
        return false;
    }

    hardDrop() {
        if (this.gameOver || this.paused) return 0;
        
        let dropCount = 0;
        while (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            dropCount++;
        }
        
        this.lockPiece();
        return dropCount;
    }

    lockPiece() {
        const matrix = this.currentPiece.matrix;
        const px = this.currentPiece.x;
        const py = this.currentPiece.y;

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const blockY = py + r;
                    const blockX = px + c;

                    // If locked out of bounds at the top, game over
                    if (blockY < 0) {
                        this.gameOver = true;
                    } else {
                        this.board[blockY][blockX] = matrix[r][c];
                    }
                }
            }
        }

        if (!this.gameOver) {
            this.clearLines();
            this.spawnPiece();
        }
    }

    clearLines() {
        let linesClearedThisTurn = 0;

        for (let r = ROWS - 1; r >= 0; r--) {
            // Check if row is completely filled
            if (this.board[r].every(val => val !== 0)) {
                // Remove the row
                this.board.splice(r, 1);
                // Put a brand new empty row at the top
                this.board.unshift(Array(COLS).fill(0));
                // Increment rows cleared (compensate search index since index shifts)
                r++;
                linesClearedThisTurn++;
            }
        }

        if (linesClearedThisTurn > 0) {
            this.lines += linesClearedThisTurn;
            
            // Standard Nintendo Scoring System
            const basePoints = [0, 100, 300, 500, 800];
            this.score += basePoints[Math.min(linesClearedThisTurn, 4)] * this.level;

            // Level Progression (10 lines per level)
            const nextLevel = Math.floor(this.lines / 10) + 1;
            if (nextLevel > this.level) {
                this.level = nextLevel;
                // Dispatch custom event for level up audio/sfx
                window.dispatchEvent(new CustomEvent('tetrisLevelUp'));
            } else {
                window.dispatchEvent(new CustomEvent('tetrisLineClear', { detail: { lines: linesClearedThisTurn } }));
            }
        }
    }

    hold() {
        if (this.gameOver || this.paused || this.hasHeldThisTurn) return false;

        const currentType = this.currentPiece.type;
        const tempHold = this.holdPiece;

        // Reset matrix to default rotation before storing
        this.holdPiece = {
            type: currentType,
            matrix: JSON.parse(JSON.stringify(SHAPES[currentType]))
        };

        if (tempHold) {
            this.currentPiece = {
                type: tempHold.type,
                matrix: tempHold.matrix,
                x: Math.floor((COLS - tempHold.matrix[0].length) / 2),
                y: tempHold.type === 'I' ? -1 : 0
            };
        } else {
            this.spawnPiece();
        }

        this.hasHeldThisTurn = true;
        return true;
    }

    getGhostY() {
        if (!this.currentPiece) return 0;
        
        let ghostY = this.currentPiece.y;
        while (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, ghostY + 1)) {
            ghostY++;
        }
        return ghostY;
    }

    getDropInterval() {
        // Decreasing interval based on Level (Level 1: 800ms down to Level 15: ~70ms)
        return Math.max(50, 800 - (this.level - 1) * 70);
    }
}
