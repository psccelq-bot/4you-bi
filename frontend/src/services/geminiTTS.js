// Gemini TTS Service - High Quality Female Arabic Voice
// Uses Backend API for TTS generation

const API_BASE = process.env.REACT_APP_BACKEND_URL;

/**
 * Generate speech audio from Arabic text using Backend TTS API
 * Uses Kore voice (female, clear and professional)
 * 
 * @param {string} text - The Arabic text to convert to speech
 * @returns {Promise<string|null>} - Base64 encoded audio data or null on error
 */
export async function generateSpeech(text) {
  try {
    console.log('Calling TTS API...');
    
    const response = await fetch(`${API_BASE}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      console.error('TTS API Error:', response.status);
      return null;
    }

    const result = await response.json();
    
    if (result.error) {
      console.error('TTS Error:', result.error);
      return null;
    }

    if (!result.audio) {
      console.error('No audio data in response');
      return null;
    }

    console.log('TTS audio received successfully');
    return result.audio;
    
  } catch (error) {
    console.error('Gemini TTS Error:', error);
    return null;
  }
}

/**
 * Decode Base64 PCM audio data to Uint8Array
 * @param {string} base64Data - Base64 encoded PCM data
 * @returns {Uint8Array} - Raw PCM bytes
 */
export function decodePCM(base64Data) {
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('PCM decode error:', error);
    return new Uint8Array(0);
  }
}

/**
 * Convert raw PCM bytes to AudioBuffer for Web Audio API
 * Gemini TTS outputs 24kHz 16-bit mono PCM
 * 
 * @param {Uint8Array} pcmData - Raw PCM audio bytes
 * @param {AudioContext} audioContext - Web Audio API context
 * @param {number} sampleRate - Sample rate (default 24000 Hz for Gemini)
 * @param {number} numChannels - Number of audio channels (default 1 - mono)
 * @returns {AudioBuffer} - Decoded audio buffer ready to play
 */
export function decodeAudioData(pcmData, audioContext, sampleRate = 24000, numChannels = 1) {
  try {
    // PCM data is 16-bit signed integers (2 bytes per sample)
    const numSamples = Math.floor(pcmData.length / 2);
    
    if (numSamples === 0) {
      throw new Error('No audio samples to decode');
    }
    
    const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Convert 16-bit PCM to float32 (-1.0 to 1.0)
    const dataView = new DataView(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength);
    
    for (let i = 0; i < numSamples; i++) {
      // Read 16-bit signed integer (little-endian)
      const int16 = dataView.getInt16(i * 2, true);
      // Normalize to float32 range
      channelData[i] = int16 / 32768;
    }

    return audioBuffer;
  } catch (error) {
    console.error('Audio decode error:', error);
    throw error;
  }
}

/**
 * Check if Gemini TTS is configured
 */
export function isConfigured() {
  return !!API_BASE;
}
