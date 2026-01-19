# ALHOOTAH AI Hub - Product Requirements Document

## Original Problem Statement
Build a sophisticated AI chat application named "ALHOOTAH AI Hub" (formerly 4you Holding AI Hub) with:
- Arabic Right-to-Left (RTL) interface with premium dark theme
- Dual-Mode Interface: Cognitive Advisor + Digital Library
- AI assistant that answers ONLY from uploaded sources (PDF, Excel, text)
- Admin panel to manage knowledge sources
- Text-to-Speech for AI responses

## User's Preferred Language
Arabic (العربية) - All UI text in Arabic

## Architecture

### Frontend (React)
```
/app/frontend/src/
├── components/
│   ├── admin/
│   ├── chat/
│   │   └── ChatMessage.jsx  # Shows user questions + assistant responses
│   ├── core/
│   ├── layout/
│   └── repository/
├── services/
│   ├── geminiAI.js      # Calls backend /api/chat
│   ├── geminiTTS.js     # Backend TTS API
│   └── indexedDB.js     # Persistent source storage
├── hooks/
│   └── useLocalStorage.js  # Fixed stale closure issue
├── App.js               # Main component
└── index.css            # Global styles
```

### Backend (FastAPI)
```
/app/backend/
├── server.py            # API endpoints: /api/chat, /api/tts
├── tests/
│   └── test_backend_api.py
└── .env                 # EMERGENT_LLM_KEY
```

## What's Been Implemented ✅

### Core Features (2025-01-19)
1. **AI Chat with Emergent LLM Key**
   - Backend API endpoint `/api/chat` using emergentintegrations library
   - Gemini 2.5 Flash model for text generation
   - Answers ONLY from uploaded sources
   - Human-like Arabic responses with Saudi dialect
   - Assistant name: ALHOOTAH

2. **Source Management**
   - Upload PDF files (stored as base64)
   - Add manual text sources
   - Add web links
   - IndexedDB persistence

3. **Admin Panel**
   - Password-protected (4you2025)
   - Manage sources for Advisor and Repository modes

4. **Dual-Mode Interface**
   - Cognitive Advisor: General AI assistant with all sources
   - Digital Library: Chat with specific documents

5. **Chat Display**
   - User questions now visible in chat with avatar
   - Assistant responses with speaker icon
   - "ALHOOTAH يفكر..." typing indicator

6. **Text-to-Speech (Backend API)**
   - /api/tts endpoint using Google Gemini TTS
   - Note: Currently limited by Google API quota

### Bug Fixes Applied
- Fixed useLocalStorage stale closure (messages now persist correctly)
- Fixed chat display (user questions now visible)
- Changed branding from "4you" to "ALHOOTAH"
- Fixed API payload structure for Gemini

## API Endpoints

### POST /api/chat
Request:
```json
{
  "question": "كم راتب الموظف؟",
  "sources": [
    {
      "name": "معلومات الرواتب",
      "content": "الراتب 15000 ريال",
      "fileData": null,
      "mimeType": null
    }
  ],
  "sessionId": "optional-session-id"
}
```

### POST /api/tts
Request:
```json
{
  "text": "مرحبا"
}
```

## Credentials
- **Admin Password:** `4you2025`
- **Emergent LLM Key:** Configured in backend/.env

## Testing Status ✅
- Backend: 100% (All tests pass)
- Frontend: 100% (All features verified)
- Chat display: ✅ User questions visible
- AI responses: ✅ From sources only

## Known Limitations
- TTS limited by Google API quota (429 errors)
- Need new Google API key or wait 24h for quota reset

## Future Enhancements (Backlog)

### P1 - High Priority
- [ ] Get new Google API key for TTS
- [ ] Excel file parsing and analysis
- [ ] Web link content extraction

### P2 - Medium Priority
- [ ] Voice input (STT)
- [ ] Export chat history as PDF
- [ ] Source tagging/categorization

### P3 - Low Priority
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements
- [ ] Analytics dashboard
