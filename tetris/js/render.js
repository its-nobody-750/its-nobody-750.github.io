// Canvas Renderer with Neon Effects and Particles
import { COLS, ROWS, NEON_COLORS } from './tetris.js';

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2; // slight upward drift
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.alpha -= this.decay;
        return this.alpha > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class Renderer {
    constructor(gameCanvasId, holdCanvasId, nextCanvasId) {
        this.canvas = document.getElementById(gameCanvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.holdCanvas = document.getElementById(holdCanvasId);
        this.holdCtx = this.holdCanvas.getContext('2d');
        
        this.nextCanvas = document.getElementById(nextCanvasId);
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.blockSize = this.canvas.width / COLS;
        this.particles = [];
        
        // Screen shake variables
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
    }

    triggerScreenShake(intensity = 6, duration = 12) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.canvas.parentElement.classList.add('screen-shake');
        setTimeout(() => {
            this.canvas.parentElement.classList.remove('screen-shake');
        }, duration * 16.6); // roughly match frames at 60Hz
    }

    triggerLineClearParticles(row, colorIndex) {
        const color = NEON_COLORS[colorIndex] || '#fff';
        const y = row * this.blockSize + this.blockSize / 2;
        
        for (let col = 0; col < COLS; col++) {
            const x = col * this.blockSize + this.blockSize / 2;
            for (let i = 0; i < 6; i++) {
                this.particles.push(new Particle(
                    x + (Math.random() - 0.5) * this.blockSize,
                    y + (Math.random() - 0.5) * this.blockSize,
                    color
                ));
            }
        }
    }

    render(game) {
        const ctx = this.ctx;
        ctx.save();

        // 1. Handle screen shake calculations
        if (this.shakeDuration > 0) {
            const dx = (Math.random() - 0.5) * this.shakeIntensity;
            const dy = (Math.random() - 0.5) * this.shakeIntensity;
            ctx.translate(dx, dy);
            this.shakeDuration--;
        }

        // 2. Clear main board
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 3. Draw grid lines (subtle background helper)
        this.drawGridLines();

        // 4. Draw locked blocks on the board
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (game.board[r][c] !== 0) {
                    this.drawBlock(ctx, c, r, game.board[r][c], this.blockSize);
                }
            }
        }

        // 5. Draw active falling piece and ghost piece
        if (game.currentPiece && !game.gameOver) {
            // A. Draw Ghost Piece (shadow)
            const ghostY = game.getGhostY();
            this.drawPiece(ctx, game.currentPiece.matrix, game.currentPiece.x, ghostY, game.currentPiece.type, this.blockSize, true);

            // B. Draw Active Piece
            this.drawPiece(ctx, game.currentPiece.matrix, game.currentPiece.x, game.currentPiece.y, game.currentPiece.type, this.blockSize, false);
        }

        // 6. Update and Draw Particles
        this.particles = this.particles.filter(p => {
            const alive = p.update();
            if (alive) p.draw(ctx);
            return alive;
        });

        ctx.restore();

        // 7. Draw hold and next previews
        this.renderPreviews(game);
    }

    drawGridLines() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 1;

        for (let c = 1; c < COLS; c++) {
            const x = c * this.blockSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let r = 1; r < ROWS; r++) {
            const y = r * this.blockSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }

    drawPiece(ctx, matrix, xOffset, yOffset, type, size, isGhost) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    // Get color index mapping
                    const colorIndex = matrix[r][c];
                    this.drawBlock(ctx, xOffset + c, yOffset + r, colorIndex, size, isGhost);
                }
            }
        }
    }

    drawBlock(ctx, x, y, colorIndex, size, isGhost = false) {
        // Skip drawing above the top boundary for regular pieces
        if (y < 0 && !isGhost) return;

        const color = NEON_COLORS[colorIndex];
        const px = x * size;
        const py = y * size;

        ctx.save();

        if (isGhost) {
            // Dashed outline with low opacity neon color fill
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.07;
            ctx.fillRect(px + 2, py + 2, size - 4, size - 4);
        } else {
            // Premium Gradient Styling with Glow Effects
            ctx.shadowBlur = 12;
            ctx.shadowColor = color;

            // Block Fill Gradient
            const grad = ctx.createLinearGradient(px, py, px + size, py + size);
            grad.addColorStop(0, '#ffffff'); // Glossy top-left highlight
            grad.addColorStop(0.15, color);   // Solid neon body
            grad.addColorStop(0.85, color);
            grad.addColorStop(1, this.shadeColor(color, -40)); // Darker bottom shade

            ctx.fillStyle = grad;
            ctx.beginPath();
            // Round borders slightly for modern grid block appeal
            const radius = 4;
            ctx.roundRect(px + 1, py + 1, size - 2, size - 2, radius);
            ctx.fill();

            // Inner Bevel Accent
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0; // turn off shadow for thin highlight
            ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);
        }

        ctx.restore();
    }

    // Adjust brightness of hex color for 3D bevel shadings
    shadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = (R > 0) ? R : 0;
        G = (G > 0) ? G : 0;
        B = (B > 0) ? B : 0;

        const rr = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const gg = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const bb = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + rr + gg + bb;
    }

    renderPreviews(game) {
        // 1. Render Hold Piece Box
        this.renderPreviewBox(this.holdCtx, this.holdCanvas, game.holdPiece);

        // 2. Render Next Piece Box
        this.renderPreviewBox(this.nextCtx, this.nextCanvas, game.nextPiece);
    }

    renderPreviewBox(ctx, canvas, piece) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!piece) return;

        const matrix = piece.matrix;
        const size = matrix.length;
        const previewBlockSize = canvas.width / 4; // grid is 4x4 max for preview boxes

        // Calculate offsets to center the block inside preview box
        let minX = size, maxX = 0, minY = size, maxY = 0;
        let empty = true;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] !== 0) {
                    empty = false;
                    if (c < minX) minX = c;
                    if (c > maxX) maxX = c;
                    if (r < minY) minY = r;
                    if (r > maxY) maxY = r;
                }
            }
        }

        if (empty) return;

        const pWidth = (maxX - minX + 1) * previewBlockSize;
        const pHeight = (maxY - minY + 1) * previewBlockSize;
        const offsetX = (canvas.width - pWidth) / 2 - minX * previewBlockSize;
        const offsetY = (canvas.height - pHeight) / 2 - minY * previewBlockSize;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] !== 0) {
                    const colorIndex = matrix[r][c];
                    const color = NEON_COLORS[colorIndex];
                    const px = offsetX + c * previewBlockSize;
                    const py = offsetY + r * previewBlockSize;

                    ctx.save();
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = color;
                    
                    const grad = ctx.createLinearGradient(px, py, px + previewBlockSize, py + previewBlockSize);
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(0.2, color);
                    grad.addColorStop(1, this.shadeColor(color, -30));

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.roundRect(px + 1, py + 1, previewBlockSize - 2, previewBlockSize - 2, 3);
                    ctx.fill();

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 0.5;
                    ctx.shadowBlur = 0;
                    ctx.strokeRect(px + 1.5, py + 1.5, previewBlockSize - 3, previewBlockSize - 3);

                    ctx.restore();
                }
            }
        }
    }
}
