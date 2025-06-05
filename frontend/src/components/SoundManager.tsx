import { useEffect, useState, useCallback } from 'react';

export default function SoundManager() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new AudioContext();
      setAudioContext(context);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const playBeep = useCallback((frequency: number = 800, duration: number = 200, type: OscillatorType = 'square') => {
    if (!audioContext || !isEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }, [audioContext, isEnabled]);

  const playStartupSound = useCallback(() => {
    if (!isEnabled) return;
    // Windows 95 startup-like sound
    setTimeout(() => playBeep(523, 150), 0);    // C5
    setTimeout(() => playBeep(659, 150), 150);  // E5
    setTimeout(() => playBeep(784, 150), 300);  // G5
    setTimeout(() => playBeep(1047, 300), 450); // C6
  }, [isEnabled, playBeep]);

  const playClickSound = useCallback(() => {
    if (!isEnabled) return;
    playBeep(1000, 50, 'sine');
  }, [isEnabled, playBeep]);

  const playErrorSound = useCallback(() => {
    if (!isEnabled) return;
    playBeep(200, 500, 'sawtooth');
  }, [isEnabled, playBeep]);

  const playSuccessSound = useCallback(() => {
    if (!isEnabled) return;
    setTimeout(() => playBeep(523, 100), 0);   // C5
    setTimeout(() => playBeep(659, 100), 100); // E5
    setTimeout(() => playBeep(784, 200), 200); // G5
  }, [isEnabled, playBeep]);

  const playNotificationSound = useCallback(() => {
    if (!isEnabled) return;
    playBeep(800, 100);
    setTimeout(() => playBeep(1000, 100), 150);
  }, [isEnabled, playBeep]);

  // Add event listeners for various UI interactions
  useEffect(() => {
    if (!isEnabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('win95-button')) {
        playClickSound();
      }
    };

    const handleSuccess = () => {
      playSuccessSound();
    };

    const handleError = () => {
      playErrorSound();
    };

    // Play startup sound when component mounts
    playStartupSound();

    document.addEventListener('click', handleClick);
    
    // Listen for custom events
    window.addEventListener('retro-success', handleSuccess);
    window.addEventListener('retro-error', handleError);
    window.addEventListener('retro-notification', playNotificationSound);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('retro-success', handleSuccess);
      window.removeEventListener('retro-error', handleError);
      window.removeEventListener('retro-notification', playNotificationSound);
    };
  }, [isEnabled, playClickSound, playSuccessSound, playErrorSound, playStartupSound, playNotificationSound]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="win95-window bg-win95-gray border-win95-raised p-2">
        <div className="win95-title-bar bg-win95-blue text-white px-2 py-1 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-2">
              <div className="w-2 h-2 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">🔊 Sound</span>
          </div>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className="text-white hover:bg-red-600 px-1 text-xs font-bold"
          >
            {isEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`win95-button px-2 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              isEnabled ? 'bg-green-500 text-white' : 'bg-win95-gray text-black'
            }`}
          >
            {isEnabled ? 'ON' : 'OFF'}
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={playClickSound}
              className="win95-button px-1 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken bg-win95-gray text-black"
              title="Test Click Sound"
            >
              🖱️
            </button>
            <button
              onClick={playSuccessSound}
              className="win95-button px-1 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken bg-win95-gray text-black"
              title="Test Success Sound"
            >
              ✅
            </button>
            <button
              onClick={playErrorSound}
              className="win95-button px-1 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken bg-win95-gray text-black"
              title="Test Error Sound"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
