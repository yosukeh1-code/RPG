class SoundManager {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;
    private bgmOscillators: OscillatorNode[] = [];
    private bgmGainNode: GainNode | null = null;
    private isBgmPlaying: boolean = false;

    constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser');
        }
    }

    private initContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    public playBGM(type: 'FIELD' | 'BATTLE') {
        this.initContext();
        this.stopBGM();

        if (this.isMuted || !this.audioContext) return;

        this.isBgmPlaying = true;
        this.bgmGainNode = this.audioContext.createGain();
        this.bgmGainNode.gain.value = 0.1;
        this.bgmGainNode.connect(this.audioContext.destination);

        // Simple melody loop
        const melody = type === 'FIELD'
            ? [261.63, 293.66, 329.63, 349.23, 392.00, 329.63, 293.66, 261.63] // C D E F G E D C
            : [440.00, 440.00, 493.88, 440.00, 415.30, 392.00, 349.23, 329.63]; // A A B A G# G F E (Battle tension)

        // Create oscillators for harmony
        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'square';
        osc1.connect(this.bgmGainNode);

        // Sequencer
        let noteIndex = 0;
        const interval = type === 'FIELD' ? 0.4 : 0.2; // Battle is faster

        const playNextNote = () => {
            if (!this.isBgmPlaying || !this.bgmGainNode || !this.audioContext) return;

            const note = melody[noteIndex % melody.length];

            osc1.frequency.setValueAtTime(note, this.audioContext.currentTime);
            osc1.frequency.setValueAtTime(note, this.audioContext.currentTime + interval - 0.05);

            noteIndex++;
            setTimeout(playNextNote, interval * 1000);
        };

        osc1.start();
        this.bgmOscillators.push(osc1);
        playNextNote();
    }

    public stopBGM() {
        this.isBgmPlaying = false;
        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
            osc.disconnect();
        });
        this.bgmOscillators = [];
        if (this.bgmGainNode) {
            this.bgmGainNode.disconnect();
            this.bgmGainNode = null;
        }
    }

    public playSE(type: 'ATTACK' | 'DAMAGE' | 'LEVEL_UP' | 'WIN') {
        this.initContext();
        if (this.isMuted || !this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        switch (type) {
            case 'ATTACK':
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'DAMAGE':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'LEVEL_UP':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);  // A4
                osc.frequency.setValueAtTime(554, now + 0.1); // C#5
                osc.frequency.setValueAtTime(659, now + 0.2); // E5
                osc.frequency.setValueAtTime(880, now + 0.3); // A5
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case 'WIN':
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now); // C
                osc.frequency.setValueAtTime(659.25, now + 0.1); // E
                osc.frequency.setValueAtTime(783.99, now + 0.2); // G
                osc.frequency.setValueAtTime(1046.50, now + 0.3); // C
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        }
        return this.isMuted;
    }
}

export const soundManager = new SoundManager();
