// Web Audio API Retro Sound Effects Synthesizer

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterVolume = null;
        this.volume = 0.5; // default 50%
        this.muted = false;
    }

    init() {
        if (this.ctx) return;
        
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterVolume = this.ctx.createGain();
            this.masterVolume.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.masterVolume.connect(this.ctx.destination);
        } catch (e) {
            console.error("Web Audio API not supported in this browser", e);
        }
    }

    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterVolume && this.ctx) {
            this.masterVolume.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.masterVolume && this.ctx) {
            this.masterVolume.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    // Play a standard synth tone
    playTone(freqStart, freqEnd, duration, type = 'sine', gainStart = 0.3) {
        this.resume();
        if (!this.ctx || this.muted) return;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
        
        if (freqEnd !== freqStart) {
            osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
        }

        gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playMove() {
        // Short soft thump
        this.playTone(150, 100, 0.05, 'triangle', 0.15);
    }

    playRotate() {
        // Quick upward sweep
        this.playTone(200, 350, 0.08, 'triangle', 0.15);
    }

    playDrop() {
        // Heavy low thump
        this.playTone(120, 50, 0.12, 'sine', 0.4);
    }

    playLineClear() {
        // Rapid retro arpeggio (C5 -> E5 -> G5 -> C6)
        this.resume();
        if (!this.ctx || this.muted) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const noteLength = 0.08;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.12, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + noteLength);

            osc.connect(gain);
            gain.connect(this.masterVolume);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + noteLength);
        });
    }

    playLevelUp() {
        // Fanfare chord progression
        this.resume();
        if (!this.ctx || this.muted) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const start = now + idx * 0.08;
            gain.gain.setValueAtTime(0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.masterVolume);

            osc.start(start);
            osc.stop(start + 0.4);
        });
    }

    playGameOver() {
        // Descending sad sweep
        this.playTone(300, 60, 0.8, 'sawtooth', 0.25);
    }
}

export const audioSystem = new AudioSystem();
