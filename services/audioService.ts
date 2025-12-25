
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'sine', 0.1, 0.1);
  }

  playDeal() {
    this.playTone(400, 'triangle', 0.15, 0.05);
  }

  playWin() {
    this.playTone(600, 'sine', 0.3, 0.1);
    setTimeout(() => this.playTone(900, 'sine', 0.4, 0.1), 100);
  }

  playLoss() {
    this.playTone(200, 'sine', 0.5, 0.1);
  }

  playChip() {
    this.playTone(1200, 'sine', 0.05, 0.05);
  }
}

export const audio = new AudioService();
