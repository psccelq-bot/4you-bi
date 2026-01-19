// Gemini TTS Service using Emergent LLM Proxy

const EMERGENT_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const EMERGENT_API_BASE = 'https://api.emergentai.dev/v1';

/**
 * Generate speech audio from text using Gemini TTS via Emergent proxy
 * @param {string} text - The Arabic text to convert to speech
 * @returns {Promise<string|undefined>} - Base64 encoded PCM audio data
 */
export async function generateSpeech(text) {
  try {
    if (!EMERGENT_API_KEY) {
      throw new Error('Missing API key');
    }

    const response = await fetch(`${EMERGENT_API_BASE}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMERGENT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova', // or 'alloy', 'echo', 'fable', 'onyx', 'shimmer'
        response_format: 'mp3',
        speed: 1.0
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TTS API Error:', error);
      throw new Error(`TTS API error: ${response.status}`);
    }

    // Get audio blob
    const audioBlob = await response.blob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

  } catch (error) {
    console.error('Gemini TTS Error:', error);
    return undefined;
  }
}

/**
 * Decode Base64 audio data to ArrayBuffer
 * @param {string} base64Data - Base64 encoded audio data
 * @returns {ArrayBuffer} - Raw audio bytes
 */
export function decodeBase64ToArrayBuffer(base64Data) {
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error('Base64 decode error:', error);
    throw error;
  }
}

/**
 * Decode audio using Web Audio API's built-in decoder
 * @param {ArrayBuffer} audioData - Raw audio data (MP3, WAV, etc)
 * @param {AudioContext} audioContext - Web Audio API context
 * @returns {Promise<AudioBuffer>} - Decoded audio buffer ready to play
 */
export async function decodeAudioData(audioData, audioContext) {
  try {
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    return audioBuffer;
  } catch (error) {
    console.error('Audio decode error:', error);
    throw error;
  }
}

// Legacy exports for compatibility
export function decodePCM(base64Data) {
  return decodeBase64ToArrayBuffer(base64Data);
}
