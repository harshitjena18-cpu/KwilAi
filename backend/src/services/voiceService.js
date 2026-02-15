import speech from '@google-cloud/speech';
import textToSpeech from '@google-cloud/text-to-speech';
import geminiService from './geminiService.js';
import fs from 'fs';

/**
 * Google Speech Services
 * Speech-to-Text and Text-to-Speech integration
 */

class VoiceService {
  constructor() {
    // Initialize Google Cloud clients
    // If credentials file is provided, use it. Otherwise, use environment variables.
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))
      : null;

    this.speechClient = new speech.SpeechClient(
      credentials ? { credentials } : {}
    );
    
    this.ttsClient = new textToSpeech.TextToSpeechClient(
      credentials ? { credentials } : {}
    );
  }

  /**
   * Convert audio file to text using Google Speech-to-Text
   * @param {Buffer} audioBuffer - Audio file buffer
   * @param {string} encoding - Audio encoding (LINEAR16, FLAC, etc.)
   * @param {number} sampleRateHertz - Sample rate
   * @param {string} languageCode - Language code (default: en-US)
   * @returns {Promise<string>} Transcribed text
   */
  async speechToText(audioBuffer, options = {}) {
    try {
      const {
        encoding = 'LINEAR16',
        sampleRateHertz = 16000,
        languageCode = 'en-US',
        audioChannelCount = 1
      } = options;

      console.log('Starting speech-to-text conversion...');

      const audio = {
        content: audioBuffer.toString('base64')
      };

      const config = {
        encoding,
        sampleRateHertz,
        languageCode,
        audioChannelCount,
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true
      };

      const request = {
        audio,
        config
      };

      const [response] = await this.speechClient.recognize(request);
      
      if (!response.results || response.results.length === 0) {
        throw new Error('No speech detected in audio');
      }

      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      console.log('Transcription:', transcription);
      return transcription;

    } catch (error) {
      console.error('Speech-to-Text error:', error.message);
      throw new Error(`Speech-to-Text error: ${error.message}`);
    }
  }

  /**
   * Convert text to audio using Google Text-to-Speech
   * @param {string} text - Text to convert
   * @param {object} options - Voice options
   * @returns {Promise<Buffer>} Audio buffer
   */
  async textToSpeech(text, options = {}) {
    try {
      const {
        languageCode = 'en-US',
        voiceName = 'en-US-Neural2-F', // Natural female voice
        ssmlGender = 'FEMALE',
        speakingRate = 1.0,
        pitch = 0.0,
        audioEncoding = 'MP3'
      } = options;

      console.log('Starting text-to-speech conversion...');

      const request = {
        input: { text },
        voice: {
          languageCode,
          name: voiceName,
          ssmlGender
        },
        audioConfig: {
          audioEncoding,
          speakingRate,
          pitch,
          effectsProfileId: ['small-bluetooth-speaker-class-device']
        }
      };

      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content generated');
      }

      console.log('Text-to-speech conversion successful');
      return response.audioContent;

    } catch (error) {
      console.error('Text-to-Speech error:', error.message);
      throw new Error(`Text-to-Speech error: ${error.message}`);
    }
  }

  /**
   * Process voice query: Audio -> Text -> Gemini AI -> Text -> Audio
   * @param {Buffer} audioBuffer - Input audio buffer
   * @param {object} audioOptions - Audio configuration
   * @returns {Promise<object>} Response object with audio and text
   */
  async processVoiceQuery(audioBuffer, audioOptions = {}) {
    try {
      console.log('Processing voice query...');

      // Step 1: Convert audio to text (Speech-to-Text)
      const userQuery = await this.speechToText(audioBuffer, audioOptions);
      
      if (!userQuery || userQuery.trim().length === 0) {
        throw new Error('No speech detected in audio');
      }

      console.log('User query:', userQuery);

      // Step 2: Generate cooking assistant response with Gemini AI
      const aiResponse = await this.getCookingAssistanceResponse(userQuery);

      console.log('AI response:', aiResponse);

      // Step 3: Convert response to audio (Text-to-Speech)
      const responseAudio = await this.textToSpeech(aiResponse, {
        voiceName: 'en-US-Neural2-F', // Friendly female voice
        speakingRate: 0.95 // Slightly slower for clarity
      });

      return {
        success: true,
        userQuery,
        aiResponse,
        audioContent: responseAudio,
        audioFormat: 'mp3'
      };

    } catch (error) {
      console.error('Voice query processing error:', error.message);
      throw error;
    }
  }

  /**
   * Get cooking assistance response from Gemini AI
   * @param {string} query - User's cooking question
   * @returns {Promise<string>} AI response
   */
  async getCookingAssistanceResponse(query) {
    try {
      // Build a specialized prompt for cooking assistance
      const prompt = this.buildCookingAssistantPrompt(query);

      // Call Gemini AI
      const response = await this.callGeminiForAssistance(prompt);

      return response;

    } catch (error) {
      console.error('Cooking assistance error:', error.message);
      throw error;
    }
  }

  /**
   * Build a cooking assistant prompt for Gemini AI
   * @param {string} userQuery - User's question
   * @returns {string} Formatted prompt
   */
  buildCookingAssistantPrompt(userQuery) {
    return `You are Kwil, an expert AI cooking assistant and nutritionist. 
A user needs help while cooking and asked: "${userQuery}"

Provide a helpful, concise, and friendly response. Guidelines:
- Keep responses SHORT and CLEAR (max 3-4 sentences for simple questions)
- Use simple language suitable for voice interaction
- For cooking instructions, be specific with temperatures, times, and techniques
- For ingredient questions, suggest alternatives if relevant
- For nutrition questions, provide accurate information
- For recipe suggestions, be creative but practical
- Always prioritize food safety
- Be encouraging and supportive

Respond naturally as if speaking to someone in their kitchen. Do NOT use markdown, bullet points, or special formatting - just plain conversational text.`;
  }

  /**
   * Call Gemini AI for cooking assistance
   * @param {string} prompt - Full prompt with context
   * @returns {Promise<string>} AI response
   */
  async callGeminiForAssistance(prompt) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const axios = (await import('axios')).default;
      const apiKey = process.env.GEMINI_API_KEY;
      const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
      const model = 'gemini-pro';

      const response = await axios.post(
        `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512, // Keep responses concise for voice
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response from Gemini AI');
      }

      // Clean up the response for voice output
      let cleanText = text.trim();
      
      // Remove any markdown formatting
      cleanText = cleanText.replace(/\*\*/g, '');
      cleanText = cleanText.replace(/\*/g, '');
      cleanText = cleanText.replace(/#{1,6}\s/g, '');
      
      // Remove bullet points
      cleanText = cleanText.replace(/^[-•]\s/gm, '');
      
      return cleanText;

    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      throw new Error(`AI assistance error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate step-by-step audio instructions for a recipe
   * @param {Array} steps - Recipe steps
   * @returns {Promise<Array>} Array of audio buffers for each step
   */
  async generateStepAudioInstructions(steps) {
    try {
      console.log(`Generating audio for ${steps.length} recipe steps...`);

      const audioInstructions = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepText = `Step ${step.number || i + 1}. ${step.instruction}`;
        
        const audioBuffer = await this.textToSpeech(stepText, {
          voiceName: 'en-US-Neural2-F',
          speakingRate: 0.9 // Slower for cooking instructions
        });

        audioInstructions.push({
          stepNumber: step.number || i + 1,
          text: stepText,
          audio: audioBuffer,
          duration: step.duration || null
        });
      }

      console.log(`Generated ${audioInstructions.length} step audio instructions`);
      return audioInstructions;

    } catch (error) {
      console.error('Step audio generation error:', error.message);
      throw error;
    }
  }
}

export default new VoiceService();
