/**
 * Web Audio Synthesizer & Procedural Jingle Generator
 * Synthesizes catchy advertising jingles with chords, basslines, leads, and percussion.
 * Includes real-time analyser hook for waveform visualization and WAV audio file export.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private scheduledNodes: (AudioNode | number)[] = [];
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private startTime = 0;
  private duration = 15; // standard 15-second jingle

  public initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Play procedural jingle in real-time
   */
  public async playJingle(options: {
    style: string;
    tempoBpm: number;
    brandName: string;
    callToAction: string;
    lyrics?: { time: string; line: string }[];
    onProgress?: (progress: number, currentTime: number) => void;
    onEnd?: () => void;
  }): Promise<void> {
    this.stop();
    const ctx = this.initContext();

    this.isPlaying = true;
    this.startTime = ctx.currentTime;
    this.duration = 15;

    // Create Master Gain and Analyser
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, ctx.currentTime);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    masterGain.connect(analyser);
    analyser.connect(ctx.destination);
    this.analyser = analyser;

    // Build Musical Arrangement
    this.scheduleArrangement(ctx, masterGain, options.tempoBpm, options.style);

    // Optional Speech Synthesis Voiceover if available in browser
    if ('speechSynthesis' in window && options.lyrics && options.lyrics.length > 0) {
      this.scheduleVoiceover(options.brandName, options.callToAction, options.lyrics);
    }

    // Progress Loop
    const updateProgress = () => {
      if (!this.isPlaying) return;
      const elapsed = ctx.currentTime - this.startTime;
      const progress = Math.min(1, elapsed / this.duration);

      if (options.onProgress) {
        options.onProgress(progress, elapsed);
      }

      if (elapsed >= this.duration) {
        this.stop();
        if (options.onEnd) options.onEnd();
      } else {
        this.animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    this.animationFrameId = requestAnimationFrame(updateProgress);
  }

  private scheduleArrangement(ctx: BaseAudioContext, destination: AudioNode, bpm: number, style: string) {
    const beatSeconds = 60 / (bpm || 120);
    const totalBars = 8;
    const isEnergetic = style.toLowerCase().includes('energetic') || style.toLowerCase().includes('synth');
    const isFriendly = style.toLowerCase().includes('friendly') || style.toLowerCase().includes('acoustic');

    // Chords progression: C maj - G maj - A min - F maj (I - V - vi - IV)
    const chordProgressions = [
      [261.63, 329.63, 392.0], // C4, E4, G4
      [246.94, 293.66, 392.0], // B3, D4, G4
      [220.0, 261.63, 329.63], // A3, C4, E4
      [174.61, 220.0, 261.63], // F3, A3, C4
    ];

    const bassNotes = [130.81, 98.0, 110.0, 87.31]; // C3, G2, A2, F2

    // Schedule 8 bars (approx 15 seconds at 120 BPM)
    for (let bar = 0; bar < totalBars; bar++) {
      const barStartTime = ctx.currentTime + bar * (beatSeconds * 4);
      if (barStartTime - ctx.currentTime > this.duration) break;

      const chord = chordProgressions[bar % chordProgressions.length];
      const bassFreq = bassNotes[bar % bassNotes.length];

      // Bass synth note
      this.playSynthNote(ctx, destination, bassFreq, barStartTime, beatSeconds * 3.8, 'sawtooth', 0.28, 400);

      // Harmony chords
      chord.forEach((freq, idx) => {
        const chordGain = isEnergetic ? 0.12 : 0.15;
        const waveType = isFriendly ? 'triangle' : 'sine';
        this.playPluckNote(ctx, destination, freq * (idx === 0 ? 1 : 1), barStartTime, beatSeconds * 3.5, waveType, chordGain);
      });

      // Arpeggios / Melodic Accent
      for (let beat = 0; beat < 4; beat++) {
        const beatTime = barStartTime + beat * beatSeconds;
        const arpHit = chord[(beat + bar) % chord.length] * 2; // Octave higher
        this.playPluckNote(ctx, destination, arpHit, beatTime, beatSeconds * 0.7, 'sine', 0.15);

        // Drums: Kick on 1 and 3, Snare/Clap on 2 and 4, Hi-hat on 8ths
        if (beat === 0 || beat === 2) {
          this.playKick(ctx, destination, beatTime);
        }
        if (beat === 1 || beat === 3) {
          this.playSnare(ctx, destination, beatTime);
        }
        this.playHiHat(ctx, destination, beatTime);
        this.playHiHat(ctx, destination, beatTime + beatSeconds * 0.5);
      }
    }

    // Final signature brand chime at 13s
    const chimeStart = ctx.currentTime + 12.5;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.playPluckNote(ctx, destination, freq, chimeStart + i * 0.12, 1.8, 'sine', 0.25);
    });
  }

  private playPluckNote(ctx: BaseAudioContext, destination: AudioNode, freq: number, startTime: number, duration: number, type: OscillatorType, maxGain: number) {
    if (startTime < ctx.currentTime - 0.05) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(maxGain, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
    this.scheduledNodes.push(osc);
  }

  private playSynthNote(ctx: BaseAudioContext, destination: AudioNode, freq: number, startTime: number, duration: number, type: OscillatorType, maxGain: number, cutoff = 800) {
    if (startTime < ctx.currentTime - 0.05) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, startTime);
    filter.frequency.exponentialRampToValueAtTime(cutoff * 0.5, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
    this.scheduledNodes.push(osc);
  }

  private playKick(ctx: BaseAudioContext, destination: AudioNode, startTime: number) {
    if (startTime < ctx.currentTime - 0.05) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.12);

    gain.gain.setValueAtTime(0.6, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
    this.scheduledNodes.push(osc);
  }

  private playSnare(ctx: BaseAudioContext, destination: AudioNode, startTime: number) {
    if (startTime < ctx.currentTime - 0.05) return;
    // Tone body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.frequency.setValueAtTime(180, startTime);
    osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.1);
    oscGain.gain.setValueAtTime(0.3, startTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
    osc.connect(oscGain);
    oscGain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + 0.15);

    // Noise snap (create buffer)
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    noise.start(startTime);
    this.scheduledNodes.push(noise, osc);
  }

  private playHiHat(ctx: BaseAudioContext, destination: AudioNode, startTime: number) {
    if (startTime < ctx.currentTime - 0.05) return;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start(startTime);
    this.scheduledNodes.push(noise);
  }

  private scheduleVoiceover(brand: string, cta: string, lyrics: { time: string; line: string }[]) {
    try {
      window.speechSynthesis.cancel();
      // Select punchy line or brand signoff
      const spokenLine = `${brand}. ${lyrics[1]?.line || lyrics[0]?.line || ''} ${cta}`;
      const utterance = new SpeechSynthesisUtterance(spokenLine);
      utterance.rate = 1.05;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;
      // Delay slightly for musical intro
      setTimeout(() => {
        if (this.isPlaying) {
          window.speechSynthesis.speak(utterance);
        }
      }, 1200);
    } catch {
      // Speech synthesis fallback
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.scheduledNodes.forEach((node) => {
      try {
        if (typeof node !== 'number' && 'stop' in node) {
          (node as any).stop();
        }
      } catch {}
    });
    this.scheduledNodes = [];
  }

  /**
   * Render and generate a real downloadable 16-bit PCM WAV Blob
   */
  public async exportWavBlob(options: {
    style: string;
    tempoBpm: number;
    durationSeconds?: number;
  }): Promise<Blob> {
    const duration = options.durationSeconds || 15;
    const sampleRate = 44100;
    const OfflineAudioCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const offlineCtx = new OfflineAudioCtx(2, sampleRate * duration, sampleRate);

    const masterGain = offlineCtx.createGain();
    masterGain.gain.setValueAtTime(0.7, 0);
    masterGain.connect(offlineCtx.destination);

    this.scheduleArrangement(offlineCtx, masterGain, options.tempoBpm, options.style);

    const renderedBuffer = await offlineCtx.startRendering();
    return this.audioBufferToWav(renderedBuffer);
  }

  /**
   * Encode AudioBuffer into standard RIFF WAVE file
   */
  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // RIFF identifier
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Interleave channels
    let offset = 44;
    const channelData: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channelData.push(buffer.getChannelData(c));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        let sample = channelData[channel][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const audioEngine = new AudioEngine();
