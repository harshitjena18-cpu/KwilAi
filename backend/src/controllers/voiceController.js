import voiceService from '../services/voiceService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Process voice query for cooking assistance
 * @route   POST /api/voice/query
 * @access  Public
 */
export const processVoiceQuery = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Audio file is required'
    });
  }

  console.log('Received audio file:', {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  // Get audio configuration from request body
  const {
    encoding = 'LINEAR16',
    sampleRateHertz = 16000,
    languageCode = 'en-US'
  } = req.body;

  try {
    // Process the voice query
    const result = await voiceService.processVoiceQuery(req.file.buffer, {
      encoding,
      sampleRateHertz: parseInt(sampleRateHertz),
      languageCode
    });

    // Set response headers for audio
    res.set({
      'Content-Type': 'audio/mpeg',
      'X-User-Query': encodeURIComponent(result.userQuery),
      'X-AI-Response': encodeURIComponent(result.aiResponse)
    });

    // Send audio as response
    res.send(result.audioContent);

  } catch (error) {
    console.error('Voice query error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process voice query'
    });
  }
});

/**
 * @desc    Convert text to speech (for recipe steps)
 * @route   POST /api/voice/text-to-speech
 * @access  Public
 */
export const textToSpeech = asyncHandler(async (req, res) => {
  const { text, languageCode, voiceName, speakingRate } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: 'Text is required'
    });
  }

  try {
    const audioBuffer = await voiceService.textToSpeech(text, {
      languageCode,
      voiceName,
      speakingRate: speakingRate ? parseFloat(speakingRate) : 1.0
    });

    // Set response headers
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="speech.mp3"'
    });

    // Send audio
    res.send(audioBuffer);

  } catch (error) {
    console.error('Text-to-speech error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to convert text to speech'
    });
  }
});

/**
 * @desc    Generate audio instructions for recipe steps
 * @route   POST /api/voice/recipe-instructions
 * @access  Public
 */
export const generateRecipeInstructions = asyncHandler(async (req, res) => {
  const { steps } = req.body;

  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Recipe steps array is required'
    });
  }

  try {
    const audioInstructions = await voiceService.generateStepAudioInstructions(steps);

    // Convert audio buffers to base64 for JSON response
    const response = audioInstructions.map(instruction => ({
      stepNumber: instruction.stepNumber,
      text: instruction.text,
      audio: instruction.audio.toString('base64'),
      duration: instruction.duration,
      format: 'mp3'
    }));

    res.status(200).json({
      success: true,
      count: response.length,
      instructions: response
    });

  } catch (error) {
    console.error('Recipe instructions error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate recipe instructions'
    });
  }
});

/**
 * @desc    Get cooking assistance (text only)
 * @route   POST /api/voice/assistance
 * @access  Public
 */
export const getCookingAssistance = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Query is required'
    });
  }

  try {
    const response = await voiceService.getCookingAssistanceResponse(query);

    res.status(200).json({
      success: true,
      query,
      response
    });

  } catch (error) {
    console.error('Cooking assistance error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get cooking assistance'
    });
  }
});

export default {
  processVoiceQuery,
  textToSpeech,
  generateRecipeInstructions,
  getCookingAssistance
};
