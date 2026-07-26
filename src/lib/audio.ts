export type SoundName =
  | 'click' | 'hover' | 'nav-select' | 'section-enter'
  | 'save-success' | 'save-error' | 'link-hover' | 'tab-switch'
  | 'mute-on' | 'mute-off' | 'page-load' | 'badge-hover'
  | 'login-success' | 'easter-egg';

class MinecraftAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    if (typeof window !== 'undefined') {
      this.muted = localStorage.getItem('mc-muted') === 'true';
    }
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private async tryLoadSounds() {
    if (!this.ctx) return;
    const soundFiles: SoundName[] = ['click','hover','nav-select','section-enter','save-success','save-error','tab-switch','login-success'];
    for (const name of soundFiles) {
      try {
        const res = await fetch(`/sounds/${name}.ogg`);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          this.buffers.set(name, await this.ctx!.decodeAudioData(buf));
        }
      } catch {}
    }
  }

  play(name: SoundName, volume = 1.0) {
    if (this.muted || !this.ctx) return;
    if (this.buffers.has(name)) {
      this.playBuffer(name, volume);
    } else {
      this.synthesize(name, volume);
    }
  }

  private playBuffer(name: SoundName, volume: number) {
    const c = this.ensureCtx();
    const src = c.createBufferSource();
    const gain = c.createGain();
    src.buffer = this.buffers.get(name)!;
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(c.destination);
    src.start();
  }

  private synthesize(name: SoundName, volume: number) {
    const c = this.ensureCtx();
    const t = c.currentTime;
    switch(name) {
      case 'click': this.squareBlip(c, t, 220, 0.06, volume * 0.15); break;
      case 'hover': this.sineBlip(c, t, 1200, 0.04, volume * 0.05); break;
      case 'nav-select': this.sweep(c, t, 400, 200, 0.08, volume * 0.12); break;
      case 'section-enter': this.sineBlip(c, t, 660, 0.2, volume * 0.08); break;
      case 'save-success': this.ascendingChime(c, t, [400, 600, 800], volume); break;
      case 'save-error': this.wobble(c, t, 150, 0.2, volume * 0.1); break;
      case 'link-hover': this.sineBlip(c, t, 900, 0.03, volume * 0.04); break;
      case 'tab-switch': this.squareBlip(c, t, 300, 0.1, volume * 0.1); break;
      case 'mute-on': this.sweep(c, t, 500, 200, 0.06, volume * 0.1); break;
      case 'mute-off': this.sweep(c, t, 200, 500, 0.06, volume * 0.1); break;
      case 'badge-hover': this.squareBlip(c, t, 800, 0.05, volume * 0.06); break;
      case 'login-success': this.ascendingChime(c, t, [523, 659, 784, 1047], volume); break;
      case 'easter-egg': this.noiseBurst(c, t, 0.3, volume * 0.2); break;
      case 'page-load': this.startAmbient(c); break;
    }
  }

  private startAmbient(c: AudioContext) {
    if (this.ambientSource) return;
    const bufSize = c.sampleRate * 4;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, c.currentTime + 2);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    src.start();
    this.ambientSource = src;
    this.ambientGain = gain;
  }

  stopAmbient() {
    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch {}
      this.ambientSource = null;
      this.ambientGain = null;
    }
  }

  private sineBlip(c: AudioContext, t: number, freq: number, dur: number, vol: number) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur);
  }

  private squareBlip(c: AudioContext, t: number, freq: number, dur: number, vol: number) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur);
  }

  private sweep(c: AudioContext, t: number, from: number, to: number, dur: number, vol: number) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur);
  }

  private ascendingChime(c: AudioContext, t: number, freqs: number[], vol: number) {
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        if (this.ctx) this.sineBlip(this.ctx, this.ctx.currentTime, freq, 0.3, vol * 0.08);
      }, i * 100);
    });
  }

  private wobble(c: AudioContext, t: number, freq: number, dur: number, vol: number) {
    const o = c.createOscillator();
    const g = c.createGain();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 20;
    lfoGain.gain.value = 30;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    lfo.start(t);
    o.start(t);
    lfo.stop(t + dur);
    o.stop(t + dur);
  }

  private noiseBurst(c: AudioContext, t: number, dur: number, vol: number) {
    const bufSize = c.sampleRate * dur;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    const g = c.createGain();
    src.buffer = buf;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(g);
    g.connect(c.destination);
    src.start(t);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mc-muted', String(this.muted));
    }
    if (this.muted) this.stopAmbient();
    return this.muted;
  }

  isMuted() { return this.muted; }
}

export const audio = new MinecraftAudioEngine();
