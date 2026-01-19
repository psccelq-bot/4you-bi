# 4you Holding AI Hub - Product Requirements Document

## Original Problem Statement
Build a sophisticated AI chat application named "4you Holding AI Hub" with:
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
│   ├── core/
│   ├── layout/
│   └── repository/
├── services/
│   ├── geminiAI.js      # Calls backend /api/chat
│   ├── geminiTTS.js     # Google TTS API
│   └── indexedDB.js     # Persistent source storage
├── App.js               # Main component
└── index.css            # Global styles
```

### Backend (FastAPI)
```
/app/backend/
├── server.py            # API endpoints including /api/chat
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

5. **Text-to-Speech**
   - Google Gemini TTS API
   - Female Arabic voice (Kore)

### Technical Implementation
- Fixed API payload structure (inlineData camelCase)
- Switched from direct Google API to Emergent LLM Key (no quota issues)
- IndexedDB for large file persistence
- Session management for chat continuity

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

Response:
```json
{
  "response": "أبشر، راتب الموظف خمسة عشر ألف ريال...",
  "sessionId": "uuid"
}
```

## Credentials
- **Admin Password:** `4you2025`
- **Emergent LLM Key:** Configured in backend/.env

## Testing Status ✅
- Backend: 100% (10 tests pass)
- Frontend: 100% (All features verified)
- Test files: `/app/tests/test_backend_api.py`

## Future Enhancements (Backlog)

### P1 - High Priority
- [ ] Excel file parsing and analysis
- [ ] Web link content extraction
- [ ] Multi-language support

### P2 - Medium Priority
- [ ] Voice input (STT)
- [ ] Export chat history
- [ ] Source tagging/categorization

### P3 - Low Priority
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements
- [ ] Analytics dashboard
