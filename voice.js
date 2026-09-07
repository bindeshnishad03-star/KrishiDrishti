/* KrishiDrishti Voice Input & Output System (Speech-to-Text & Text-to-Speech) */

const LANG_SPEECH_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
  mai: 'hi-IN',
  awa: 'hi-IN',
  bun: 'hi-IN',
  hr: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  or: 'or-IN'
};

const VoiceService = {
  recognition: null,
  isListening: false,
  synth: window.speechSynthesis || null,

  getSpeechLang() {
    const current = (typeof i18n !== 'undefined') ? i18n.currentLang : 'en';
    return LANG_SPEECH_MAP[current] || 'en-IN';
  },

  // 1. Voice Input (Speech-to-Text)
  startListening(onResultCallback, targetInputElement = null) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (typeof showToast === 'function') {
        showToast('Voice speech recognition is not supported in this browser. Please use Chrome/Edge.', 'error');
      }
      return;
    }

    if (this.isListening && this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.getSpeechLang();

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateMicUI(true);
        if (typeof showToast === 'function') {
          showToast(`Listening (${this.recognition.lang})... Speak now! 🎙️`, 'info');
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[Voice STT Result]:', transcript);

        if (targetInputElement) {
          targetInputElement.value = transcript;
          targetInputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (typeof onResultCallback === 'function') {
          onResultCallback(transcript);
        }

        if (typeof showToast === 'function') {
          showToast(`Captured: "${transcript}"`, 'success');
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[Voice STT Error]:', event.error);
        this.isListening = false;
        this.updateMicUI(false);
        if (typeof showToast === 'function') {
          showToast(`Voice input error: ${event.error}`, 'error');
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateMicUI(false);
      };

      this.recognition.start();
    } catch (e) {
      console.error('[Voice STT Exception]:', e);
      this.isListening = false;
      this.updateMicUI(false);
    }
  },

  updateMicUI(active) {
    document.querySelectorAll('.voice-mic-btn').forEach(btn => {
      if (active) {
        btn.classList.add('recording');
        btn.innerHTML = '<i class="fas fa-dot-circle fa-beat" style="color: red;"></i> Listening...';
      } else {
        btn.classList.remove('recording');
        btn.innerHTML = '<i class="fas fa-microphone"></i> Voice Input';
      }
    });
  },

  // 2. Voice Output (Text-to-Speech)
  speak(text) {
    if (!this.synth) {
      if (typeof showToast === 'function') {
        showToast('Text-to-speech is not supported in this browser.', 'error');
      }
      return;
    }

    if (!text || text.trim() === '') return;

    // Stop ongoing speech
    this.synth.cancel();

    // Strip HTML tags for clean reading
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.getSpeechLang();
    utterance.rate = 0.95; // Slightly slower for clear farmer comprehension
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const targetLang = this.getSpeechLang();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.updateSpeakerUI(true);
      if (typeof showToast === 'function') {
        showToast('Reading out loud... 🔊', 'info');
      }
    };

    utterance.onend = () => {
      this.updateSpeakerUI(false);
    };

    utterance.onerror = (e) => {
      console.warn('[Voice TTS Error]:', e);
      this.updateSpeakerUI(false);
    };

    this.synth.speak(utterance);
  },

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.updateSpeakerUI(false);
    }
  },

  speakElementText(selector) {
    const el = document.querySelector(selector);
    if (el) {
      this.speak(el.innerText || el.textContent);
    }
  },

  updateSpeakerUI(active) {
    document.querySelectorAll('.voice-speak-btn').forEach(btn => {
      if (active) {
        btn.classList.add('speaking');
        btn.innerHTML = '<i class="fas fa-volume-up fa-fade" style="color: var(--accent);"></i> Reading...';
      } else {
        btn.classList.remove('speaking');
        btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
      }
    });
  }
};

window.VoiceService = VoiceService;
