import express from 'express';
import multer from 'multer';
import voiceController from '../controllers/voiceController.js';

const router = express.Router();

// Configure multer for memory storage (files stored as Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimeTypes = [
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/webm',
      'audio/ogg',
      'audio/flac',
      'audio/x-flac'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

/**
 * @route   POST /api/voice/query
 * @desc    Process voice query with Speech-to-Text -> Gemini AI -> Text-to-Speech
 * @access  Public
 * @body    audio file (form-data)
 * @body    encoding (optional): LINEAR16, FLAC, etc.
 * @body    sampleRateHertz (optional): default 16000
 * @body    languageCode (optional): default en-US
 */
router.post('/query', upload.single('audio'), voiceController.processVoiceQuery);

/**
 * @route   POST /api/voice/text-to-speech
 * @desc    Convert text to speech audio
 * @access  Public
 * @body    text: string
 * @body    languageCode (optional): default en-US
 * @body    voiceName (optional): default en-US-Neural2-F
 * @body    speakingRate (optional): default 1.0
 */
router.post('/text-to-speech', voiceController.textToSpeech);

/**
 * @route   POST /api/voice/recipe-instructions
 * @desc    Generate audio instructions for recipe steps
 * @access  Public
 * @body    steps: array of step objects
 */
router.post('/recipe-instructions', voiceController.generateRecipeInstructions);

/**
 * @route   POST /api/voice/assistance
 * @desc    Get cooking assistance (text response only)
 * @access  Public
 * @body    query: string
 */
router.post('/assistance', voiceController.getCookingAssistance);

export default router;
