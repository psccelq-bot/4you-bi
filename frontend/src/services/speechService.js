// Text-to-Speech Service using Web Speech API (Browser native)
// This is a free solution that works in all modern browsers

/**
 * Check if Web Speech API is supported
 * @returns {boolean}
 */
export function isSpeechSynthesisSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Get available voices, preferring Arabic voices
 * @returns {SpeechSynthesisVoice[]}
 */
export function getArabicVoices() {
  if (!isSpeechSynthesisSupported()) return [];
  
  const voices = window.speechSynthesis.getVoices();
  
  // Filter for Arabic voices
  const arabicVoices = voices.filter(voice => 
    voice.lang.startsWith('ar') || 
    voice.name.toLowerCase().includes('arabic') ||
    voice.name.includes('العربية')
  );
  
  // Return Arabic voices if found, otherwise return all voices
  return arabicVoices.length > 0 ? arabicVoices : voices;
}

/**
 * Generate and play speech from text
 * @param {string} text - The text to speak
 * @param {Object} options - Speech options
 * @param {function} onStart - Callback when speech starts
 * @param {function} onEnd - Callback when speech ends
 * @param {function} onError - Callback on error
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speak(text, options = {}, onStart = null, onEnd = null, onError = null) {
  if (!isSpeechSynthesisSupported()) {
    console.error('Speech synthesis not supported');
    if (onError) onError(new Error('Speech synthesis not supported'));
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure Arabic settings
  utterance.lang = options.lang || 'ar-SA';
  utterance.rate = options.rate || 0.9; // Slightly slower for clarity
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  // Try to find and set an Arabic voice
  const voices = getArabicVoices();
  if (voices.length > 0) {
    // Prefer Google or Microsoft voices for better quality
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      v.name.includes('Samira') ||
      v.name.includes('Laila')
    ) || voices[0];
    
    utterance.voice = preferredVoice;
    console.log('Using voice:', preferredVoice.name);
  }

  // Event handlers
  utterance.onstart = () => {
    console.log('Speech started');
    if (onStart) onStart();
  };

  utterance.onend = () => {
    console.log('Speech ended');
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.error('Speech error:', event.error);
    if (onError) onError(event);
  };

  // Speak the text
  window.speechSynthesis.speak(utterance);

  return utterance;
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Pause speech
 */
export function pauseSpeech() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume paused speech
 */
export function resumeSpeech() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.resume();
  }
}

/**
 * Check if currently speaking
 * @returns {boolean}
 */
export function isSpeaking() {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}

// Preload voices (Chrome requires this)
export function preloadVoices() {
  if (isSpeechSynthesisSupported()) {
    // Trigger voice loading
    window.speechSynthesis.getVoices();
    
    // Chrome fires voiceschanged event when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
      };
    }
  }
}
