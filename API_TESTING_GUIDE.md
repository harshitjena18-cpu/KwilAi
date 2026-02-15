# API Testing Guide - Nutrition & Cooking Sessions

Quick reference for testing the new endpoints with cURL or Postman.

## Setup

```bash
# Replace with your actual values
PROJECT_ID="your-project-id"
ANON_KEY="your-anon-key"
API_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-d1bfecde"
```

---

## 🥗 Nutrition Endpoints

### 1. Add Nutrition Entry

```bash
curl -X POST "${API_URL}/nutrition" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "calories": 450,
    "protein": 25,
    "carbs": 45,
    "fats": 15,
    "recipeId": "recipe-001",
    "recipeName": "Grilled Chicken Salad"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "entry": {
    "id": "nutrition:test-user-123:1739621400000",
    "userId": "test-user-123",
    "date": "2026-02-15",
    "calories": 450,
    "protein": 25,
    "carbs": 45,
    "fats": 15,
    "recipeId": "recipe-001",
    "recipeName": "Grilled Chicken Salad",
    "createdAt": "2026-02-15T10:30:00.000Z"
  }
}
```

### 2. Get Daily Summary

```bash
curl "${API_URL}/nutrition/daily/test-user-123/2026-02-15" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

### 3. Get Weekly Summary

```bash
# Current week
curl "${API_URL}/nutrition/weekly/test-user-123" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Specific week
curl "${API_URL}/nutrition/weekly/test-user-123?weekStart=2026-02-10" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

### 4. Delete Nutrition Entry

```bash
curl -X DELETE "${API_URL}/nutrition/test-user-123/nutrition:test-user-123:1739621400000" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 👨‍🍳 Cooking Session Endpoints

### 1. Start Cooking Session

```bash
curl -X POST "${API_URL}/cooking/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "recipeId": "recipe-001",
    "recipeName": "Grilled Chicken Salad",
    "totalSteps": 8
  }'
```

**Save the session ID from response for next steps!**

### 2. Get Active Session

```bash
curl "${API_URL}/cooking/active/test-user-123/recipe-001" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

### 3. Get All User Sessions

```bash
# All sessions
curl "${API_URL}/cooking/sessions/test-user-123" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Active only
curl "${API_URL}/cooking/sessions/test-user-123?includeCompleted=false" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

### 4. Next Step

```bash
curl -X POST "${API_URL}/cooking/next" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "sessionId": "session:test-user-123:1739621400000"
  }'
```

### 5. Previous Step

```bash
curl -X POST "${API_URL}/cooking/previous" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "sessionId": "session:test-user-123:1739621400000"
  }'
```

### 6. Go to Specific Step

```bash
curl -X POST "${API_URL}/cooking/goto" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "sessionId": "session:test-user-123:1739621400000",
    "stepIndex": 3
  }'
```

### 7. Finish Session (with Nutrition)

```bash
curl -X POST "${API_URL}/cooking/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "sessionId": "session:test-user-123:1739621400000",
    "nutrition": {
      "calories": 450,
      "protein": 25,
      "carbs": 45,
      "fats": 15
    }
  }'
```

### 8. Delete Session

```bash
curl -X DELETE "${API_URL}/cooking/session/test-user-123/session:test-user-123:1739621400000" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

### 9. Get Cooking Stats

```bash
curl "${API_URL}/cooking/stats/test-user-123" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 🧪 Complete Test Flow

Run this complete flow to test all features:

```bash
# 1. Start a cooking session
SESSION_ID=$(curl -X POST "${API_URL}/cooking/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "userId": "test-user-123",
    "recipeId": "recipe-001",
    "recipeName": "Grilled Chicken Salad",
    "totalSteps": 5
  }' | jq -r '.session.id')

echo "Session started: $SESSION_ID"

# 2. Progress through steps
for i in {1..4}; do
  echo "Moving to step $i..."
  curl -X POST "${API_URL}/cooking/next" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -d "{
      \"userId\": \"test-user-123\",
      \"sessionId\": \"$SESSION_ID\"
    }"
  sleep 1
done

# 3. Finish and log nutrition
curl -X POST "${API_URL}/cooking/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{
    \"userId\": \"test-user-123\",
    \"sessionId\": \"$SESSION_ID\",
    \"nutrition\": {
      \"calories\": 450,
      \"protein\": 25,
      \"carbs\": 45,
      \"fats\": 15
    }
  }"

# 4. Check today's nutrition
TODAY=$(date +%Y-%m-%d)
curl "${API_URL}/nutrition/daily/test-user-123/$TODAY" \
  -H "Authorization: Bearer ${ANON_KEY}"

# 5. Get weekly summary
curl "${API_URL}/nutrition/weekly/test-user-123" \
  -H "Authorization: Bearer ${ANON_KEY}"

# 6. Get cooking stats
curl "${API_URL}/cooking/stats/test-user-123" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 📋 Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Kwil AI - Nutrition & Cooking",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://{{projectId}}.supabase.co/functions/v1/make-server-d1bfecde"
    },
    {
      "key": "projectId",
      "value": "your-project-id"
    },
    {
      "key": "anonKey",
      "value": "your-anon-key"
    }
  ],
  "item": [
    {
      "name": "Nutrition",
      "item": [
        {
          "name": "Add Entry",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{anonKey}}"
              }
            ],
            "url": "{{baseUrl}}/nutrition",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"test-user-123\",\n  \"calories\": 450,\n  \"protein\": 25,\n  \"carbs\": 45,\n  \"fats\": 15,\n  \"recipeId\": \"recipe-001\",\n  \"recipeName\": \"Chicken Salad\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## ✅ Expected Results

After running the complete test flow, you should see:

1. **Cooking Session:** Created and progressed through 5 steps
2. **Session Completed:** Marked as finished with completion timestamp
3. **Nutrition Entry:** Automatically added with 450 calories
4. **Daily Summary:** Shows total nutrition for today
5. **Weekly Summary:** Shows 7 days with today's data
6. **Cooking Stats:** Shows 1 completed session, 100% completion rate

---

## 🐛 Troubleshooting

### Error: "Missing required fields"
- Check that all required fields are included in request body
- Verify JSON is valid

### Error: "Session not found"
- Ensure session ID is correct
- Check if session was already deleted

### Error: "Already at last step"
- You're trying to go beyond the total steps
- Use finish endpoint instead

### Error: "Unauthorized"
- Verify Authorization header is set
- Check that anon key is correct
- Ensure userId matches the session owner

---

## 📊 Monitoring

Check server logs for detailed error messages:
```bash
# View Supabase function logs
supabase functions logs make-server-d1bfecde
```

---

**Happy Testing! 🎉**
