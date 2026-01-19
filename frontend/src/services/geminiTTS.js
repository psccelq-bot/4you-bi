// Gemini TTS Service - High Quality Female Arabic Voice
// Uses REST API directly for better compatibility

// API Key (fallback to hardcoded for development)
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyDP86IJ8ibRiJl09OT0UTd1QAFsUASzeWw';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate speech audio from Arabic text using Gemini TTS
 * Uses Kore voice (female, clear and professional)
 * 
 * @param {string} text - The Arabic text to convert to speech
 * @returns {Promise<string|null>} - Base64 encoded audio data or null on error
 */
export async function generateSpeech(text) {
  try {
    if (!API_KEY) {
      console.error('Missing REACT_APP_GOOGLE_API_KEY');
      return null;
    }

    const response = await fetch(
      `${API_BASE}/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: text }]
          }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Kore' // Female voice - clear and professional
                }
              }
            }
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini TTS API Error:', error);
      return null;
    }

    const result = await response.json();
    
    // Extract audio data from response
    const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      console.error('No audio data in response:', result);
      return null;
    }

    return audioData;
    
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
  return !!API_KEY;
}
