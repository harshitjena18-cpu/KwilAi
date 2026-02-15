# 🎤 Voice API Quick Reference

## Base URL
```
http://localhost:5000/api/voice
```

---

## Endpoints

### 1️⃣ Complete Voice Query

**POST** `/query`

Audio → Text → AI → Audio (complete pipeline)

**Request**:
```bash
curl -X POST http://localhost:5000/api/voice/query \
  -F "audio=@query.wav" \
  -F "encoding=LINEAR16" \
  -F "sampleRateHertz=16000" \
  --output response.mp3
```

**Parameters**:
- `audio` (file, required): Audio file
- `encoding` (optional): LINEAR16 | FLAC | MP3
- `sampleRateHertz` (optional): default 16000
- `languageCode` (optional): default en-US

**Response**: MP3 audio stream

**Headers**:
- `X-User-Query`: Transcribed query
- `X-AI-Response`: AI text response

---

### 2️⃣ Text-to-Speech

**POST** `/text-to-speech`

Convert text to audio

**Request**:
```bash
curl -X POST http://localhost:5000/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Preheat the oven to 350 degrees",
    "voiceName": "en-US-Neural2-F",
    "speakingRate": 1.0
  }' \
  --output instruction.mp3
```

**Body**:
```json
{
  "text": "string (required)",
  "languageCode": "en-US (optional)",
  "voiceName": "en-US-Neural2-F (optional)",
  "speakingRate": 1.0
}
```

**Response**: MP3 audio stream

---

### 3️⃣ Recipe Step Instructions

**POST** `/recipe-instructions`

Generate audio for all recipe steps

**Request**:
```bash
curl -X POST http://localhost:5000/api/voice/recipe-instructions \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      {
        "number": 1,
        "instruction": "Preheat oven to 350°F",
        "duration": 5
      },
      {
        "number": 2,
        "instruction": "Mix dry ingredients",
        "duration": 3
      }
    ]
  }'
```

**Response**:
```json
{
  "success": true,
  "count": 2,
  "instructions": [
    {
      "stepNumber": 1,
      "text": "Step 1. Preheat oven to 350°F",
      "audio": "<base64-mp3>",
      "duration": 5,
      "format": "mp3"
    }
  ]
}
```

---

### 4️⃣ Cooking Assistance (Text)

**POST** `/assistance`

Get AI cooking help (text only)

**Request**:
```bash
curl -X POST http://localhost:5000/api/voice/assistance \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I know when chicken is cooked?"
  }'
```

**Response**:
```json
{
  "success": true,
  "query": "How do I know when chicken is cooked?",
  "response": "Chicken is fully cooked when it reaches an internal temperature of 165°F (74°C)..."
}
```

---

## Voice Options

### English Voices

**Female**:
- `en-US-Neural2-C` - Standard Female
- `en-US-Neural2-F` - Friendly Female (default)
- `en-US-Neural2-G` - Warm Female
- `en-US-Neural2-H` - Professional Female

**Male**:
- `en-US-Neural2-A` - Standard Male
- `en-US-Neural2-D` - Deep Male
- `en-US-Neural2-I` - Young Male
- `en-US-Neural2-J` - Professional Male

### Audio Formats

**Input (Speech-to-Text)**:
- `LINEAR16` - 16-bit PCM (default)
- `FLAC` - Lossless
- `MP3` - Compressed
- `WAV` - Uncompressed
- `OGG_OPUS` - WebM compatible

**Output (Text-to-Speech)**:
- `MP3` - Default, best compatibility
- `LINEAR16` - High quality
- `OGG_OPUS` - Web optimized

---

## Common Use Cases

### 1. Hands-Free Cooking Help

```javascript
// User asks: "How long should I boil pasta?"
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('/api/voice/query', {
  method: 'POST',
  body: formData
});

// Play audio response
const audioBlob = await response.blob();
playAudio(audioBlob);
```

### 2. Recipe Step Audio

```javascript
// Generate audio for each step
const steps = recipe.steps;

const response = await fetch('/api/voice/recipe-instructions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ steps })
});

const { instructions } = await response.json();

// Play each step as user cooks
instructions.forEach(instruction => {
  const audio = base64ToBlob(instruction.audio);
  playAudio(audio);
});
```

### 3. Quick Text-to-Speech

```javascript
// Convert any text to speech
const text = "Add 2 cups of flour";

const response = await fetch('/api/voice/text-to-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text })
});

const audioBlob = await response.blob();
playAudio(audioBlob);
```

---

## Error Responses

### No Audio File
```json
{
  "success": false,
  "message": "Audio file is required"
}
```

### No Speech Detected
```json
{
  "success": false,
  "message": "No speech detected in audio"
}
```

### API Key Missing
```json
{
  "success": false,
  "message": "Gemini API key not configured"
}
```

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Only audio files are allowed."
}
```

---

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **File Size**: 10MB maximum
- **Audio Length**: Recommended <60 seconds per query

---

## Environment Setup

```bash
# .env file
GEMINI_API_KEY=your_gemini_key
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

---

## Testing

```bash
# Test TTS
curl -X POST http://localhost:5000/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello"}' \
  -o test.mp3 && afplay test.mp3

# Test assistance
curl -X POST http://localhost:5000/api/voice/assistance \
  -H "Content-Type: application/json" \
  -d '{"query": "How to boil eggs?"}'
```

---

## Quick Start

1. **Install dependencies**: `npm install`
2. **Setup Google Cloud**: Enable Speech & TTS APIs
3. **Add credentials**: Update `.env`
4. **Start server**: `npm run dev`
5. **Test**: Use curl commands above

---

**Version**: 1.0.0  
**Documentation**: `/backend/VOICE_ASSISTANT.md`
