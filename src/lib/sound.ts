// Web Audio API synthesizer for zero-dependency game audio and cosmic ambient music

class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxMuted: boolean = false;
  private musicMuted: boolean = true; // Default ambient music off until user turns on
  private bgmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedSfx = localStorage.getItem('future_lab_sfx_muted');
        const storedBgm = localStorage.getItem('future_lab_bgm_muted');
        if (storedSfx !== null) this.sfxMuted = storedSfx === 'true';
        if (storedBgm !== null) this.musicMuted = storedBgm === 'true';
      } catch {
        // Ignore storage errors
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxMuted(muted: boolean) {
    this.sfxMuted = muted;
    try {
      localStorage.setItem('future_lab_sfx_muted', String(muted));
    } catch {}
  }

  public getSfxMuted(): boolean {
    return this.sfxMuted;
  }

  public setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    try {
      localStorage.setItem('future_lab_bgm_muted', String(muted));
    } catch {}

    if (muted) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
  }

  public getMusicMuted(): boolean {
    return this.musicMuted;
  }

  // Soft mechanical keyboard tick
  public playKeyTick(pitchMultiplier: number = 1.0) {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 480 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // Laser beam shot sound
  public playLaserShot() {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  // Target explosion / particle blast
  public playExplosion() {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {}
  }

  // Target lock-on ping
  public playLockOn() {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  // Countdown Beep (3, 2, 1) and Go
  public playCountdown(isFinal: boolean = false) {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = isFinal ? 1200 : 700;
      const dur = isFinal ? 0.3 : 0.12;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch {}
  }

  // Combo multiplier chime with pitch scaling based on combo level
  public playCombo(comboLevel: number = 1) {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const baseMultiplier = Math.min(1 + comboLevel * 0.1, 2.2);
      const notes = [523.25, 659.25, 783.99, 1046.5].map(f => f * baseMultiplier);
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.22);
      });
    } catch {}
  }

  // Error buzz
  public playError() {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {}
  }

  // Level up / Victory fanfare
  public playVictory() {
    if (this.sfxMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.7];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {}
  }

  // Cosmic ambient space synthesizer music generator
  public startAmbientMusic() {
    if (this.musicMuted || this.isBgmPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.isBgmPlaying = true;

      // Chord progression for sci-fi atmosphere: Am -> F -> C -> G (frequencies around octave 2 & 3)
      const chordNotes = [
        [110, 164.81, 220, 329.63], // Am
        [87.31, 130.81, 174.61, 261.63], // F
        [130.81, 164.81, 196, 261.63], // C
        [98, 146.83, 196, 293.66], // G
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!this.isBgmPlaying || !this.ctx || this.musicMuted) return;
        const currentChord = chordNotes[chordIndex % chordNotes.length];
        chordIndex++;

        currentChord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

          // Gentle ambient breathing envelope
          const now = this.ctx!.currentTime;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.012, now + 1.5);
          gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now);
          osc.stop(now + 4.0);
        });
      };

      playChord();
      this.bgmInterval = window.setInterval(playChord, 3800);
    } catch {}
  }

  public stopAmbientMusic() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundManager();
