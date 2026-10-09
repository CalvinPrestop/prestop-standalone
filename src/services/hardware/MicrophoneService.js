// MicrophoneService
// Currently uses the browser getUserMedia + Web Audio API to detect microphone input levels.
// Replace `detectMicrophone` / `simulateVoiceDetection` with the real kiosk microphone SDK later.

export const MicrophoneService = {
  isSimulated: true,

  isSupported() {
    return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  },

  // Opens the microphone and reports audio level (0..1) via onLevel.
  // Returns a controller with a stop() method.
  async detectMicrophone(onLevel) {
    if (!this.isSupported()) {
      throw new Error("Microphone not supported in this browser");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioCtx = window.AudioContext;
    const audioContext = new AudioCtx();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const avg = sum / data.length / 255;
      onLevel?.(avg);
      if (!stopped) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return {
      stop() {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        audioContext.close().catch(() => {});
      },
    };
  },

  // Fallback used when no microphone permission is available.
  async simulateVoiceDetection() {
    await new Promise((r) => setTimeout(r, 1500));
    return { detected: true, transcript: "Demo Transport" };
  },
};

export default MicrophoneService;