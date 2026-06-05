// Main Application Controller
import { Tetris } from './tetris.js';
import { Renderer } from './render.js';
import { audioSystem } from './audio.js';

class App {
    constructor() {
        this.game = new Tetris();
        this.renderer = new Renderer('game-canvas', 'hold-canvas', 'next-canvas');
        
        // Loop management
        this.lastTime = 0;
        this.dropCounter = 0;
        this.animationFrameId = null;

        // Player Info
        this.playerName = "GRID_RUNNER";

        // DOM Elements
        this.scoreDisplay = document.getElementById('score-display');
        this.levelDisplay = document.getElementById('level-display');
        this.linesDisplay = document.getElementById('lines-display');
        this.playerNameInput = document.getElementById('player-name-input');
        
        // Overlays
        this.startOverlay = document.getElementById('start-overlay');
        this.pauseOverlay = document.getElementById('pause-overlay');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        this.finalScoreVal = document.getElementById('final-score-val');
        
        // Buttons
        this.startBtn = document.getElementById('start-game-btn');
        this.resumeBtn = document.getElementById('resume-game-btn');
        this.restartBtn = document.getElementById('restart-game-btn');
        
        // Sound controls
        this.muteBtn = document.getElementById('mute-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeVal = document.getElementById('volume-val');
        this.speakerIcon = document.getElementById('speaker-icon');

        this.init();
    }

    init() {
        // Load Leaderboard Scores
        this.fetchLeaderboard();

        // Register Inputs
        this.registerKeyboardEvents();
        this.registerUIEvents();
        this.registerVirtualControls();
        this.registerCustomGameEvents();

        // Draw initial blank frames
        this.renderer.renderPreviews(this.game);
        
        // Force rendering grid initially
        this.renderer.render(this.game);
    }

    registerKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.game.gameOver) return;

            // Pause toggle
            if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
                audioSystem.resume();
                this.togglePause();
                e.preventDefault();
                return;
            }

            if (this.game.paused || this.startOverlay.classList.contains('active')) {
                return;
            }

            // Keyboard commands
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.game.move(-1)) audioSystem.playMove();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.game.move(1)) audioSystem.playMove();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.game.rotate()) audioSystem.playRotate();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.game.drop();
                    this.game.score += 1; // 1 point per soft drop cell
                    this.updateHUD();
                    this.dropCounter = 0; // reset drop timer
                    audioSystem.playMove();
                    e.preventDefault();
                    break;
                case ' ':
                    // Hard Drop
                    const droppedRows = this.game.hardDrop();
                    this.game.score += droppedRows * 2; // 2 points per hard drop cell
                    this.updateHUD();
                    this.dropCounter = 0;
                    this.renderer.triggerScreenShake(8, 10);
                    audioSystem.playDrop();
                    e.preventDefault();
                    break;
                case 'Shift':
                case 'c':
                case 'C':
                    if (this.game.hold()) {
                        audioSystem.playRotate();
                        this.dropCounter = 0;
                    }
                    e.preventDefault();
                    break;
            }
        });
    }

    registerUIEvents() {
        // Game control triggers
        this.startBtn.addEventListener('click', () => {
            audioSystem.resume();
            this.playerName = this.playerNameInput.value.trim() || "GRID_RUNNER";
            this.startOverlay.classList.remove('active');
            this.startGame();
        });

        this.resumeBtn.addEventListener('click', () => {
            audioSystem.resume();
            this.togglePause();
        });

        this.restartBtn.addEventListener('click', () => {
            audioSystem.resume();
            this.gameOverOverlay.classList.remove('active');
            this.startGame();
        });

        // Audio Triggers
        this.muteBtn.addEventListener('click', () => {
            audioSystem.resume();
            audioSystem.setMuted(!audioSystem.muted);
            this.updateAudioUI();
        });

        this.volumeSlider.addEventListener('input', (e) => {
            audioSystem.resume();
            const vol = parseFloat(e.target.value) / 100;
            audioSystem.setVolume(vol);
            this.volumeVal.textContent = `${e.target.value}%`;
            if (audioSystem.muted) {
                audioSystem.setMuted(false);
            }
            this.updateAudioUI();
        });
    }

    registerVirtualControls() {
        const attachBtn = (id, action) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('pointerdown', (e) => {
                audioSystem.resume();
                if (this.game.gameOver || this.game.paused || this.startOverlay.classList.contains('active')) return;
                action();
                e.preventDefault();
            });
        };

        attachBtn('ctrl-left', () => {
            if (this.game.move(-1)) audioSystem.playMove();
        });
        attachBtn('ctrl-right', () => {
            if (this.game.move(1)) audioSystem.playMove();
        });
        attachBtn('ctrl-rotate', () => {
            if (this.game.rotate()) audioSystem.playRotate();
        });
        attachBtn('ctrl-hold', () => {
            if (this.game.hold()) {
                audioSystem.playRotate();
                this.dropCounter = 0;
            }
        });
        attachBtn('ctrl-down', () => {
            this.game.drop();
            this.game.score += 1;
            this.updateHUD();
            this.dropCounter = 0;
            audioSystem.playMove();
        });
        attachBtn('ctrl-drop', () => {
            const dropped = this.game.hardDrop();
            this.game.score += dropped * 2;
            this.updateHUD();
            this.dropCounter = 0;
            this.renderer.triggerScreenShake(8, 10);
            audioSystem.playDrop();
        });
    }

    registerCustomGameEvents() {
        // Custom events triggered inside the Tetris engine
        window.addEventListener('tetrisLineClear', (e) => {
            const linesCleared = e.detail.lines;
            audioSystem.playLineClear();
            this.updateHUD();
            
            // Screen shake intensifies with multiple rows cleared (e.g. Tetris clear)
            const shakeLevel = linesCleared * 3;
            this.renderer.triggerScreenShake(shakeLevel, 12);

            // Find full rows on board to spawn animations.
            // Since we cleared lines, we scan the rows that just had full lines.
            // For simplicity, we just trigger clear animations on lines around the middle block area
            for (let r = 0; r < 20; r++) {
                // Approximate location of line clears (just above bottom stack)
                // The grid engine handles splice/unshift immediately before this event,
                // so we generate visuals dynamically.
                // We'll spawn particles in the row range that got emptied.
            }
            // Trigger beautiful particle bursts in the bottom rows area for dramatic feel
            this.renderer.triggerLineClearParticles(18, Math.floor(Math.random() * 7) + 1);
        });

        window.addEventListener('tetrisLevelUp', () => {
            audioSystem.playLevelUp();
            this.updateHUD();
            this.renderer.triggerScreenShake(12, 20);
        });
    }

    updateAudioUI() {
        if (audioSystem.muted || audioSystem.volume === 0) {
            this.speakerIcon.innerHTML = `<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.874c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />`;
            this.muteBtn.classList.add('muted');
        } else {
            this.speakerIcon.innerHTML = `<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.874c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 5.25 5.25 0 000-7.42.75.75 0 111.06-1.06 6.75 6.75 0 010 9.54z" /><path d="M21.3 20.2a.75.75 0 11-1.06-1.06 9.15 9.15 0 000-12.87.75.75 0 111.06-1.06 10.65 10.65 0 010 14.99z" />`;
            this.muteBtn.classList.remove('muted');
        }
        this.volumeSlider.value = audioSystem.muted ? 0 : Math.round(audioSystem.volume * 100);
        this.volumeVal.textContent = `${this.volumeSlider.value}%`;
    }

    startGame() {
        this.game.reset();
        this.updateHUD();
        this.lastTime = performance.now();
        this.dropCounter = 0;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        audioSystem.playLevelUp(); // fanfare starts the game
        this.gameLoop();
    }

    togglePause() {
        if (this.game.gameOver || this.startOverlay.classList.contains('active')) return;

        this.game.paused = !this.game.paused;

        if (this.game.paused) {
            this.pauseOverlay.classList.add('active');
            cancelAnimationFrame(this.animationFrameId);
        } else {
            this.pauseOverlay.classList.remove('active');
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }

    gameLoop(time = performance.now()) {
        if (this.game.paused || this.game.gameOver) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;

        // Auto falling based on current game level speed
        if (this.dropCounter >= this.game.getDropInterval()) {
            const dropped = this.game.drop();
            // If drop failed (block locked), play brief landing thump
            if (!dropped) {
                audioSystem.playMove();
            }
            this.dropCounter = 0;
        }

        // Draw HUD scores
        this.updateHUD();

        // Render Frame
        this.renderer.render(this.game);

        // Check Game Over
        if (this.game.gameOver) {
            this.handleGameOver();
        } else {
            this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    updateHUD() {
        // Score formatting: pad with zeros (e.g. 000120)
        const scoreStr = String(this.game.score).padStart(6, '0');
        this.scoreDisplay.textContent = scoreStr;

        const levelStr = String(this.game.level).padStart(2, '0');
        this.levelDisplay.textContent = levelStr;

        const linesStr = String(this.game.lines).padStart(2, '0');
        this.linesDisplay.textContent = linesStr;
    }

    handleGameOver() {
        audioSystem.playGameOver();
        this.finalScoreVal.textContent = this.game.score;
        this.gameOverOverlay.classList.add('active');
        this.submitHighScore();
    }

    submitHighScore() {
        const payload = {
            name: this.playerName,
            score: this.game.score,
            level: this.game.level,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            let scores = JSON.parse(localStorage.getItem('tetrisHighScores') || '[]');
            scores.push(payload);
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 10);
            localStorage.setItem('tetrisHighScores', JSON.stringify(scores));
            this.renderLeaderboard(scores);
        } catch (e) {
            console.error("Could not save score:", e);
        }
    }

    fetchLeaderboard() {
        try {
            const list = JSON.parse(localStorage.getItem('tetrisHighScores') || '[]');
            this.renderLeaderboard(list);
        } catch (e) {
            console.error("Could not fetch leaderboard:", e);
        }
    }

    renderLeaderboard(scoresList) {
        const listEl = document.getElementById('leaderboard-list');
        if (!listEl) return;
        
        listEl.innerHTML = '';
        scoresList.forEach((entry) => {
            const li = document.createElement('li');
            
            // Highlight entry if it is our current player score on game over
            if (entry.name === this.playerName && entry.score === this.game.score && this.game.gameOver) {
                li.classList.add('highlight');
            }
            
            li.innerHTML = `
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
            `;
            listEl.appendChild(li);
        });
    }
}

// Instantiate App on load
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
