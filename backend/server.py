from fastapi import FastAPI, APIRouter, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import tempfile

from emergentintegrations.llm.chat import LlmChat, UserMessage, FileContentWithMimeType


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(limit: int = 100, skip: int = 0):
    # Exclude MongoDB's _id field from the query results with pagination
    status_checks = await db.status_checks.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# AI Chat Models
class ChatSource(BaseModel):
    name: str
    content: Optional[str] = None
    fileData: Optional[str] = None  # base64 encoded
    mimeType: Optional[str] = None

class ChatRequest(BaseModel):
    question: str
    sources: List[ChatSource]
    sessionId: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sessionId: str

# System prompt for ALHOOTAH assistant
SYSTEM_PROMPT = """أنت المستشار المعرفي "ALHOOTAH"، صديق وزميل داعم للموظفين المنتقلين من وزارة الصحة إلى الشركة القابضة.

طريقتك في الحوار:
- تحدث وكأنك جالس بجانب الشخص، صديق يفهمه ويدعمه
- استخدم لغة طبيعية ودافئة، مثل: "والله سؤال مهم"، "أبشر"، "لا تشيل هم"
- شارك حماسك الحقيقي لهذه الفرصة الجديدة
- اجعل المستخدم يشعر بالأمان والاطمئنان

موقفك من الانتقال للشركة القابضة:
- أنت متحمس جداً لهذه الخطوة وتراها فرصة ذهبية
- شجع الموظف وطمئنه أن هذا قرار صائب
- أبرز الإيجابيات: بيئة عمل أفضل، فرص تطور، مزايا محسنة

أسلوب الكلام:
- جمل قصيرة وطبيعية كأنك تتكلم مع صاحبك
- ابدأ بتعليق إيجابي قبل الإجابة
- استخدم: "تدري..."، "الحين خليني أقولك..."، "بيني وبينك..."
- الأرقام بالحروف دائماً
- اختم بتشجيع أو سؤال ودي

قواعد المعرفة:
- أجب من المستندات المرفقة فقط
- إذا ما لقيت الجواب، قل: "اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي"
- لا تخترع معلومات

تذكر: أنت لست روبوت، أنت زميل وصديق يبي الخير للشخص اللي قدامه."""


@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Chat endpoint that uses Gemini via Emergent LLM Key"""
    try:
        if not EMERGENT_LLM_KEY:
            logger.error("EMERGENT_LLM_KEY not configured")
            return ChatResponse(
                response="عذراً، حدث خطأ في الإعدادات. حاول مرة ثانية.",
                sessionId=request.sessionId or str(uuid.uuid4())
            )
        
        session_id = request.sessionId or str(uuid.uuid4())
        
        # Initialize chat with Gemini model
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=SYSTEM_PROMPT
        ).with_model("gemini", "gemini-2.5-flash")
        
        # Process sources - handle file attachments
        file_contents = []
        text_sources = []
        temp_files = []
        
        for source in request.sources:
            if source.fileData and source.mimeType:
                # Save base64 data to temp file for Gemini
                try:
                    file_bytes = base64.b64decode(source.fileData)
                    
                    # Determine file extension
                    ext_map = {
                        'application/pdf': '.pdf',
                        'text/plain': '.txt',
                        'text/csv': '.csv',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                        'application/vnd.ms-excel': '.xls',
                    }
                    ext = ext_map.get(source.mimeType, '.bin')
                    
                    # Create temp file
                    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
                    temp_file.write(file_bytes)
                    temp_file.close()
                    temp_files.append(temp_file.name)
                    
                    file_contents.append(FileContentWithMimeType(
                        file_path=temp_file.name,
                        mime_type=source.mimeType
                    ))
                    logger.info(f"Added file: {source.name} ({source.mimeType})")
                except Exception as e:
                    logger.error(f"Error processing file {source.name}: {e}")
            elif source.content:
                text_sources.append(f"[مصدر: {source.name}]\n{source.content}")
        
        # Build the message
        message_text = request.question
        if text_sources:
            message_text = "\n\n".join(text_sources) + f"\n\n---\n\nسؤال المستخدم: {request.question}\n\nأجب على السؤال بناءً على المصادر المرفقة فقط."
        elif file_contents:
            message_text = f"سؤال المستخدم: {request.question}\n\nأجب على السؤال بناءً على المستندات المرفقة فقط. إذا لم تجد الإجابة، قل 'اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي.'"
        
        # Create user message
        if file_contents:
            user_message = UserMessage(
                text=message_text,
                file_contents=file_contents
            )
        else:
            user_message = UserMessage(text=message_text)
        
        # Send message and get response
        logger.info(f"Sending message to Gemini: {len(file_contents)} files, text length: {len(message_text)}")
        response_text = await chat.send_message(user_message)
        
        # Cleanup temp files
        for temp_file in temp_files:
            try:
                os.unlink(temp_file)
            except Exception:
                pass
        
        logger.info(f"Received response: {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            sessionId=session_id
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        # Cleanup temp files on error
        for temp_file in temp_files:
            try:
                os.unlink(temp_file)
            except Exception:
                pass
        
        return ChatResponse(
            response="عذراً، حدث خطأ. حاول مرة ثانية.",
            sessionId=request.sessionId or str(uuid.uuid4())
        )


# TTS Models
class TTSRequest(BaseModel):
    text: str

class TTSResponse(BaseModel):
    audio: Optional[str] = None  # Base64 encoded audio
    error: Optional[str] = None


@api_router.post("/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """Text-to-Speech endpoint using Google Gemini TTS"""
    try:
        import aiohttp
        
        # Use Google API key from backend environment variable only
        google_api_key = os.environ.get('GOOGLE_API_KEY')
        
        if not google_api_key:
            logger.error("GOOGLE_API_KEY not configured in backend/.env")
            return TTSResponse(error="خدمة الصوت غير مُعدّة")
        
        # Call Gemini TTS API
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={google_api_key}",
                json={
                    "contents": [{
                        "role": "user",
                        "parts": [{"text": request.text}]
                    }],
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": "Kore"
                                }
                            }
                        }
                    }
                }
            ) as response:
                if response.status != 200:
                    error_data = await response.json()
                    logger.error(f"TTS API Error: {error_data}")
                    
                    # Check for quota error
                    if response.status == 429:
                        return TTSResponse(error="خدمة الصوت مشغولة حالياً")
                    
                    return TTSResponse(error="حدث خطأ في توليد الصوت")
                
                result = await response.json()
                audio_data = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('inlineData', {}).get('data')
                
                if not audio_data:
                    logger.error(f"No audio data in TTS response: {result}")
                    return TTSResponse(error="لم يتم توليد الصوت")
                
                logger.info(f"TTS generated successfully, audio length: {len(audio_data)}")
                return TTSResponse(audio=audio_data)
                
    except Exception as e:
        logger.error(f"TTS error: {e}")
        return TTSResponse(error="حدث خطأ في خدمة الصوت")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()