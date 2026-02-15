# 🎤 Voice Assistant Integration

## Overview

The Kwil AI voice assistant provides hands-free cooking assistance using Google Speech-to-Text and Text-to-Speech APIs, powered by Gemini AI for intelligent responses.

## Features

✅ **Speech-to-Text**: Convert user voice queries to text using Google Speech API  
✅ **AI-Powered Responses**: Get intelligent cooking assistance from Gemini AI  
✅ **Text-to-Speech**: Convert AI responses to natural-sounding audio  
✅ **Recipe Step Audio**: Generate audio instructions for recipe steps  
✅ **Multi-language Support**: Support for multiple languages and voice options  
✅ **High-Quality Voices**: Neural voices for natural-sounding speech

---

## API Endpoints

### 1. Voice Query (Complete Pipeline)

**POST** `/api/voice/query`

Process a complete voice interaction: Audio → Text → AI Response → Audio

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `audio` (file): Audio file (WAV, MP3, FLAC, etc.)
  - `encoding` (optional): Audio encoding (LINEAR16, FLAC, etc.) - default: LINEAR16
  - `sampleRateHertz` (optional): Sample rate - default: 16000
  - `languageCode` (optional): Language code - default: en-US

**Example:**
```bash
curl -X POST http://localhost:5000/api/voice/query \
  -F "audio=@query.wav" \
  -F "encoding=LINEAR16" \
  -F "sampleRateHertz=16000" \
  -F "languageCode=en-US" \
  --output response.mp3
```

**Response:**
- **Content-Type**: `audio/mpeg`
- **Headers**:
  - `X-User-Query`: Original transcribed query (URL encoded)
  - `X-AI-Response`: AI text response (URL encoded)
- **Body**: MP3 audio stream

---

### 2. Text-to-Speech

**POST** `/api/voice/text-to-speech`

Convert text to speech audio.

**Request:**
```json
{
  "text": "Preheat the oven to 350 degrees Fahrenheit",
  "languageCode": "en-US",
  "voiceName": "en-US-Neural2-F",
  "speakingRate": 1.0
}
```

**Response:**
- **Content-Type**: `audio/mpeg`
- **Body**: MP3 audio stream

**Example:**
```bash
curl -X POST http://localhost:5000/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Mix the flour and sugar together"}' \
  --output instruction.mp3
```

---

### 3. Recipe Step Audio Instructions

**POST** `/api/voice/recipe-instructions`

Generate audio instructions for all recipe steps.

**Request:**
```json
{
  "steps": [
    {
      "number": 1,
      "instruction": "Preheat the oven to 350°F",
      "duration": 5
    },
    {
      "number": 2,
      "instruction": "Mix flour, sugar, and eggs in a bowl",
      "duration": 10
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "instructions": [
    {
      "stepNumber": 1,
      "text": "Step 1. Preheat the oven to 350°F",
      "audio": "<base64-encoded-mp3>",
      "duration": 5,
      "format": "mp3"
    },
    {
      "stepNumber": 2,
      "text": "Step 2. Mix flour, sugar, and eggs in a bowl",
      "audio": "<base64-encoded-mp3>",
      "duration": 10,
      "format": "mp3"
    }
  ]
}
```

---

### 4. Cooking Assistance (Text Only)

**POST** `/api/voice/assistance`

Get text-based cooking assistance without audio.

**Request:**
```json
{
  "query": "How do I know when chicken is fully cooked?"
}
```

**Response:**
```json
{
  "success": true,
  "query": "How do I know when chicken is fully cooked?",
  "response": "Chicken is fully cooked when it reaches an internal temperature of 165°F (74°C). Use a meat thermometer inserted into the thickest part of the meat. The juices should run clear, not pink, and the meat should no longer be pink inside."
}
```

---

## Setup Instructions

### 1. Install Required Packages

The following packages are required for voice functionality:

```bash
cd backend
npm install @google-cloud/speech @google-cloud/text-to-speech multer
```

### 2. Google Cloud Setup

#### Option A: Service Account (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
4. Create a service account:
   - Go to IAM & Admin → Service Accounts
   - Create Service Account
   - Grant roles: "Cloud Speech Client" and "Cloud Text-to-Speech Client"
5. Download the JSON key file
6. Save it as `google-credentials.json` in the backend directory

Add to `.env`:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

#### Option B: Application Default Credentials (Development)

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth application-default login
```

### 3. Update Environment Variables

Add to `backend/.env`:

```bash
# Gemini AI (already configured for recipes)
GEMINI_API_KEY=your_gemini_api_key

# Google Cloud (for voice services)
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

### 4. Test the Integration

```bash
# Start the backend server
npm run dev

# Test health check
curl http://localhost:5000/health

# Test voice endpoint (requires audio file)
curl -X POST http://localhost:5000/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Kwil AI"}' \
  --output test.mp3

# Play the audio
# macOS: afplay test.mp3
# Linux: mpg123 test.mp3
# Windows: start test.mp3
```

---

## Voice Options

### Available Neural Voices

**English (US)**:
- `en-US-Neural2-A` - Male
- `en-US-Neural2-C` - Female
- `en-US-Neural2-D` - Male
- `en-US-Neural2-F` - Female (default)
- `en-US-Neural2-G` - Female
- `en-US-Neural2-H` - Female
- `en-US-Neural2-I` - Male
- `en-US-Neural2-J` - Male

**Other Languages**:
- `en-GB-Neural2-A` - British English (Female)
- `es-US-Neural2-A` - Spanish (Female)
- `fr-FR-Neural2-A` - French (Female)
- `de-DE-Neural2-A` - German (Female)

[Full list of voices](https://cloud.google.com/text-to-speech/docs/voices)

### Audio Encoding Options

**Speech-to-Text**:
- `LINEAR16` - 16-bit PCM (default)
- `FLAC` - Free Lossless Audio Codec
- `MULAW` - 8-bit μ-law
- `AMR` - Adaptive Multi-Rate
- `OGG_OPUS` - Opus in Ogg container
- `WEBM_OPUS` - Opus in WebM container

**Text-to-Speech Output**:
- `MP3` - MPEG Audio Layer 3 (default)
- `LINEAR16` - 16-bit PCM
- `OGG_OPUS` - Opus in Ogg container

---

## Enhanced Recipe Ranking

The recipe ranking system has been upgraded with intelligent scoring:

### Scoring Components

1. **Ingredient Match (0-30 points)**
   - Calculates percentage of user ingredients in recipe
   - Prioritizes recipes using available ingredients

2. **Health Goal Optimization (0-25 points)**
   - **Weight Loss**: Low-calorie recipes (<300 cal = 25pts, <600 cal = 10pts)
   - **Muscle Gain**: High-protein recipes (40g+ = 25pts, 20g+ = 10pts)
   - **High Protein**: Similar to muscle gain (35g+ = 25pts)
   - **Low-Carb**: Low-carb recipes (<15g = 25pts, <50g = 15pts)
   - **Heart Health**: High health scores (80+ = 25pts)

3. **Budget Match (0-20 points)**
   - **Low Budget**: <$2/serving = 20pts, <$3 = proportional
   - **Medium Budget**: <$4/serving = 20pts, <$6 = proportional
   - **High Budget**: <$7/serving = 20pts, <$10 = proportional

4. **Quality Factors (0-25 points)**
   - User ratings: 5-star = 10pts
   - Spoonacular score: max 10pts
   - Popularity: saved count (max 5pts)
   - Quick recipes: <30min = 5pts, <45min = 3pts

### Total Score Range

- **Minimum**: ~50 points (base health score)
- **Maximum**: ~150 points (perfect match across all criteria)

### API Usage

```bash
GET /api/recipes/suggestions?ingredients=chicken,rice&healthGoal=muscle-gain&budget=low
```

Response includes `optimizationScore` for each recipe, sorted descending.

---

## Mobile Integration Example

### React Native (Frontend)

```typescript
// Record audio
import { Audio } from 'expo-av';

const recordAndQuery = async () => {
  // Record audio
  const recording = await Audio.Recording.createAsync(
    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  );
  
  // ... user speaks ...
  
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  
  // Send to API
  const formData = new FormData();
  formData.append('audio', {
    uri,
    type: 'audio/wav',
    name: 'query.wav'
  });
  formData.append('encoding', 'LINEAR16');
  formData.append('sampleRateHertz', '16000');
  
  const response = await fetch('http://your-api.com/api/voice/query', {
    method: 'POST',
    body: formData
  });
  
  // Get response headers
  const userQuery = decodeURIComponent(response.headers.get('X-User-Query'));
  const aiResponse = decodeURIComponent(response.headers.get('X-AI-Response'));
  
  // Get audio blob
  const audioBlob = await response.blob();
  
  // Play audio response
  const sound = new Audio.Sound();
  await sound.loadAsync({ uri: URL.createObjectURL(audioBlob) });
  await sound.playAsync();
};
```

---

## Cost Estimation

### Google Cloud Pricing

**Speech-to-Text**:
- First 60 minutes/month: FREE
- After 60 minutes: $0.006 per 15 seconds (~$1.44/hour)

**Text-to-Speech**:
- First 1 million characters/month: FREE
- After 1M characters: $4.00 per 1M characters (Standard)
- Neural voices: $16.00 per 1M characters

**Estimated Monthly Costs** (1000 users, 10 queries each):
- 10,000 queries × 30 seconds avg = 5,000 minutes
- Speech-to-Text: $480
- Text-to-Speech: ~$64 (Neural voices)
- **Total: ~$544/month**

### Cost Optimization Tips

1. Cache common responses
2. Use standard voices instead of neural for less critical content
3. Implement user quotas
4. Use WebSocket for streaming to reduce overhead
5. Compress audio before upload

---

## Error Handling

### Common Errors

**No speech detected**:
```json
{
  "success": false,
  "message": "No speech detected in audio"
}
```

**API key not configured**:
```json
{
  "success": false,
  "message": "Gemini API key not configured"
}
```

**Invalid audio format**:
```json
{
  "success": false,
  "message": "Invalid file type. Only audio files are allowed."
}
```

---

## Testing

### Test Files

Create test audio files:

```bash
# macOS: Record with QuickTime Player or use say command
say "How long should I cook pasta?" -o query.aiff
ffmpeg -i query.aiff -ar 16000 query.wav

# Linux: Use arecord
arecord -d 5 -f S16_LE -r 16000 query.wav

# Test the endpoint
curl -X POST http://localhost:5000/api/voice/query \
  -F "audio=@query.wav" \
  --output response.mp3
```

### Postman Collection

Import the updated Postman collection from `/backend/postman_collection.json` for voice endpoints.

---

## Security Considerations

1. **Rate Limiting**: Already configured in server.js (100 req/15min)
2. **File Size Limits**: 10MB max (configured in multer)
3. **File Type Validation**: Only audio files accepted
4. **API Key Protection**: Keep credentials in `.env`, never commit
5. **CORS**: Configure allowed origins in production
6. **Authentication**: Add JWT auth for production endpoints

---

## Future Enhancements

- [ ] WebSocket support for real-time streaming
- [ ] Voice activity detection
- [ ] Multi-speaker support
- [ ] Emotion detection in voice
- [ ] Context-aware conversations
- [ ] Voice commands for app navigation
- [ ] Offline voice processing
- [ ] Custom wake word ("Hey Kwil")

---

## Support

For issues or questions:
1. Check Google Cloud Console for API status
2. Verify API keys are correct in `.env`
3. Check server logs for detailed error messages
4. Ensure audio files are in supported formats
5. Review Google Cloud quotas and billing

---

**Last Updated**: February 2026  
**Version**: 1.0.0
