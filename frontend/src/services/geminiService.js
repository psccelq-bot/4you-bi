import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini AI client
const getAIClient = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing REACT_APP_GEMINI_API_KEY');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generate speech audio from text using Gemini TTS
 * @param {string} text - The Arabic text to convert to speech
 * @returns {Promise<string|undefined>} - Base64 encoded PCM audio data
 */
export async function generateSpeech(text) {
  try {
    const ai = getAIClient();
    if (!ai) {
      throw new Error('Gemini API not configured');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Kore' // Arabic-friendly voice
            },
          },
        },
      },
    });

    // Extract base64 audio data
    const audioData = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData;
  } catch (error) {
    console.error('Gemini TTS Error:', error);
    return undefined;
  }
}

/**
 * Decode Base64 PCM audio data to Uint8Array
 * @param {string} base64Data - Base64 encoded PCM data
 * @returns {Uint8Array} - Raw PCM bytes
 */
export function decodePCM(base64Data) {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert raw PCM bytes to AudioBuffer for Web Audio API
 * @param {Uint8Array} pcmData - Raw PCM audio bytes
 * @param {AudioContext} audioContext - Web Audio API context
 * @param {number} sampleRate - Sample rate (default 24000 Hz)
 * @param {number} numChannels - Number of audio channels (default 1 - mono)
 * @returns {Promise<AudioBuffer>} - Decoded audio buffer ready to play
 */
export async function decodeAudioData(pcmData, audioContext, sampleRate = 24000, numChannels = 1) {
  // PCM data is 16-bit signed integers (2 bytes per sample)
  const numSamples = pcmData.length / 2;
  const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  // Convert 16-bit PCM to float32 (-1.0 to 1.0)
  const dataView = new DataView(pcmData.buffer);
  for (let i = 0; i < numSamples; i++) {
    // Read 16-bit signed integer (little-endian)
    const int16 = dataView.getInt16(i * 2, true);
    // Normalize to float32 range
    channelData[i] = int16 / 32768;
  }

  return audioBuffer;
}
