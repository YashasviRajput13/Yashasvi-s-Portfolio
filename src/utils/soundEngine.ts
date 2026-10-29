// Zero-dependency procedural Web Audio API sound engine for the Torii Ocean Sanctuary
class ZenSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private chimeTimer: number | null = null;
  private noiseNode: AudioNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startAmbient(): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;
      if (this.isPlaying) return true;

      const ctx = this.ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.01, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.5);
      master.connect(ctx.destination);
      this.masterGain = master;

      // Subtle ocean surf pink-ish filtered noise
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.015;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);

      const surfGain = ctx.createGain();
      surfGain.gain.setValueAtTime(0.28, ctx.currentTime);

      noise.connect(filter);
      filter.connect(surfGain);
      surfGain.connect(master);
      noise.start();
      this.noiseNode = noise;

      // Pentatonic Hirajoshi / Miyako-bushi koto bell notes
      const frequencies = [220.0, 246.94, 261.63, 329.63, 349.23, 440.0, 493.88, 523.25, 659.25];

      const playChime = () => {
        if (!this.isPlaying || !this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

        const osc = this.ctx.createOscillator();
        const sub = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        sub.type = 'triangle';
        sub.frequency.setValueAtTime(freq * 0.5, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.16, now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, now + 4.2);

        osc.connect(noteGain);
        sub.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        sub.start(now);
        osc.stop(now + 4.3);
        sub.stop(now + 4.3);
      };

      this.isPlaying = true;
      playChime();
      this.chimeTimer = window.setInterval(playChime, 2600);
      return true;
    } catch {
      return false;
    }
  }

  public stopAmbient() {
    this.isPlaying = false;
    if (this.chimeTimer !== null) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    try {
      if (this.noiseNode && 'stop' in this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop();
      }
    } catch {}
    this.noiseNode = null;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      } catch {}
    }
  }

  public toggleAmbient(): boolean {
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      return this.startAmbient();
    }
  }

  public playWhoosh() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 1.4;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(920, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(140, now + duration);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(now);
      source.stop(now + duration);
    } catch {}
  }
}

export const zenSound = new ZenSoundEngine();
