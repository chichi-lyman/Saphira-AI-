import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

class HapticFeedbackEngine {
  private isSupported: boolean = typeof window !== 'undefined' && 'navigator' in window;
  private audioCtx: AudioContext | null = null;

  // Web Audio Fallback for desktop machines or browsers that do not support hardware vibration
  private playSubtleChirp(frequency: number, duration: number, type: 'sine' | 'triangle' = 'sine') {
    try {
      if (typeof window === 'undefined') return;
      
      // Lazily initialize AudioContext to comply with browser safety guidelines
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      
      // Smooth subtle decay to mimic physical micro-impacts
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (error) {
      // Safe fallback, skip audio play
    }
  }

  public async vibrateBrowser(pattern: number | number[]) {
    if (this.isSupported && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe fallback
      }
    }
  }

  public async light() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      this.vibrateBrowser(15);
    }
    this.playSubtleChirp(600, 0.05, 'sine');
  }

  public async medium() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      this.vibrateBrowser(30);
    }
    this.playSubtleChirp(400, 0.08, 'sine');
  }

  public async heavy() {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {
      this.vibrateBrowser(60);
    }
    this.playSubtleChirp(200, 0.12, 'triangle');
  }

  public async success() {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      this.vibrateBrowser([40, 60, 40]);
    }
    this.playSubtleChirp(523.25, 0.06, 'sine'); // C5
    setTimeout(() => {
      this.playSubtleChirp(659.25, 0.12, 'sine'); // E5
    }, 60);
  }

  public async warning() {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (e) {
      this.vibrateBrowser([80, 80, 100]);
    }
    this.playSubtleChirp(293.66, 0.1, 'triangle'); // D4
    setTimeout(() => {
      this.playSubtleChirp(293.66, 0.1, 'triangle'); // D4
    }, 120);
  }

  public async error() {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (e) {
      this.vibrateBrowser([120, 50, 120]);
    }
    this.playSubtleChirp(150, 0.15, 'triangle');
    setTimeout(() => {
      this.playSubtleChirp(120, 0.2, 'triangle');
    }, 100);
  }
}

export const haptic = new HapticFeedbackEngine();
export default haptic;
