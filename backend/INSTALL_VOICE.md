# 🎤 Voice Assistant - Installation Guide

## Quick Install (3 Steps)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@google-cloud/speech` - Speech-to-Text API
- `@google-cloud/text-to-speech` - Text-to-Speech API
- `multer` - File upload handling
- `axios` - HTTP client

---

### Step 2: Setup Google Cloud

#### A. Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a Project" → "New Project"
3. Name: `kwil-ai-voice` (or your choice)
4. Click "Create"

#### B. Enable APIs

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable:
   - **Cloud Speech-to-Text API**
   - **Cloud Text-to-Speech API**

#### C. Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. **Service account details**:
   - Name: `kwil-voice-service`
   - Description: `Voice assistant for Kwil AI`
   - Click "Create and Continue"
4. **Grant permissions**:
   - Add role: `Cloud Speech Client`
   - Add role: `Cloud Text-to-Speech Client`
   - Click "Continue" → "Done"
5. **Create Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON"
   - Click "Create"
6. **Save the file**:
   - Save the downloaded JSON file as `google-credentials.json`
   - Move it to `/backend` directory

---

### Step 3: Update Environment Variables

Edit `/backend/.env` and add:

```bash
# Google Cloud Voice APIs
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Gemini AI (if not already set)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Verify Installation

### 1. Start the Server

```bash
npm run dev
```

You should see:
```
🍽️  Kwil AI Backend Server Started
Environment: DEVELOPMENT
Port:        5000
```

### 2. Test Text-to-Speech

```bash
curl -X POST http://localhost:5000/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Kwil AI"}' \
  --output test.mp3
```

### 3. Play the Audio

**macOS**:
```bash
afplay test.mp3
```

**Linux**:
```bash
mpg123 test.mp3
# or
vlc test.mp3
```

**Windows**:
```bash
start test.mp3
```

### 4. Test Cooking Assistance

```bash
curl -X POST http://localhost:5000/api/voice/assistance \
  -H "Content-Type: application/json" \
  -d '{"query": "How long should I boil pasta?"}'
```

Expected response:
```json
{
  "success": true,
  "query": "How long should I boil pasta?",
  "response": "Most pasta should be boiled for 8-12 minutes..."
}
```

---

## Troubleshooting

### Error: "Cannot find module '@google-cloud/speech'"

**Solution**: Install dependencies
```bash
cd backend
npm install
```

---

### Error: "GOOGLE_APPLICATION_CREDENTIALS not found"

**Solution**: Check `.env` file
1. Open `/backend/.env`
2. Verify line exists: `GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json`
3. Check file exists: `/backend/google-credentials.json`
4. Restart server

---

### Error: "The caller does not have permission"

**Solution**: Verify service account permissions
1. Go to Google Cloud Console
2. IAM & Admin → Service Accounts
3. Check service account has:
   - Cloud Speech Client
   - Cloud Text-to-Speech Client

---

### Error: "API has not been enabled"

**Solution**: Enable APIs
1. Go to APIs & Services → Library
2. Search "Cloud Speech-to-Text API" → Enable
3. Search "Cloud Text-to-Speech API" → Enable

---

### Error: "No response from Gemini AI"

**Solution**: Check Gemini API key
1. Open `/backend/.env`
2. Verify `GEMINI_API_KEY` is set
3. Get key from: https://makersuite.google.com/app/apikey

---

## Security Checklist

Before deploying to production:

- [ ] Move `google-credentials.json` outside of version control
- [ ] Add `google-credentials.json` to `.gitignore`
- [ ] Use environment-specific credentials (dev, staging, prod)
- [ ] Enable billing alerts in Google Cloud
- [ ] Set up quotas to prevent unexpected costs
- [ ] Add JWT authentication to voice endpoints
- [ ] Implement per-user rate limiting

---

## What's Next?

### 1. Test All Endpoints

```bash
# Recipe step audio
curl -X POST http://localhost:5000/api/voice/recipe-instructions \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      {"number": 1, "instruction": "Preheat oven to 350 degrees"},
      {"number": 2, "instruction": "Mix the dry ingredients"}
    ]
  }'
```

### 2. Test Enhanced Ranking

```bash
curl "http://localhost:5000/api/recipes/suggestions?ingredients=chicken,rice&healthGoal=weight-loss&budget=low&limit=5"
```

### 3. Integrate with Frontend

See `/VOICE_AND_RANKING_SETUP.md` for React Native integration examples.

### 4. Monitor Costs

- Go to Google Cloud Console → Billing
- Set up budget alerts
- Monitor API usage

---

## API Reference

Full API documentation: `/backend/VOICE_API_QUICK_REFERENCE.md`

**Endpoints**:
- `POST /api/voice/query` - Complete voice interaction
- `POST /api/voice/text-to-speech` - Text to audio
- `POST /api/voice/recipe-instructions` - Recipe step audio
- `POST /api/voice/assistance` - Cooking help (text)

---

## Support

If you encounter issues:

1. Check server logs: `npm run dev`
2. Verify all environment variables are set
3. Test with simple curl commands
4. Review Google Cloud Console for quota limits
5. Check `/backend/VOICE_ASSISTANT.md` for detailed docs

---

## Cost Estimate

**Free Tier** (per month):
- Speech-to-Text: 60 minutes FREE
- Text-to-Speech: 1M characters FREE

**After Free Tier**:
- Speech-to-Text: ~$1.44/hour
- Text-to-Speech: $4-16 per 1M characters

**Typical Monthly Cost** (100 active users):
- ~$50-100/month

---

**Installation Time**: ~15 minutes  
**Difficulty**: ⭐⭐☆☆☆ (Easy)  
**Status**: Ready to install ✅
