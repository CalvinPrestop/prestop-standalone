// SpeakerService
// Currently uses the browser SpeechSynthesis API to demonstrate the kiosk speaker.
// Replace `speakMessage` / `stop` with the real kiosk speaker SDK integration later.

let currentUtterance = null;

function estimateDuration(text) {
  return Math.max(1800, text.length * 55);
}

export const SpeakerService = {
  isSimulated: true,

  isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  },

  // Returns a Promise that resolves when speech finishes (or after a fallback delay).
  speakMessage(text, lang = "en") {
    return new Promise((resolve) => {
      if (!this.isSupported()) {
        setTimeout(resolve, estimateDuration(text));
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang === "en" ? "en-US" : lang;
        utter.rate = 0.95;
        utter.pitch = 1;
        let resolved = false;
        const done = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };
        utter.onend = done;
        utter.onerror = done;
        currentUtterance = utter;
        window.speechSynthesis.speak(utter);
        // Safety timeout in case onend never fires.
        setTimeout(done, estimateDuration(text) + 1500);
      } catch {
        setTimeout(resolve, estimateDuration(text));
      }
    });
  },

  stop() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
    currentUtterance = null;
  },
};

export default SpeakerService;