// Gemini AI Service with Native PDF Vision Support
// Uses Gemini's native document understanding capabilities

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// System prompt for 4you assistant - Human-like, positive, encouraging
const SYSTEM_PROMPT = `أنت المستشار المعرفي "فور يو"، صديق وزميل داعم للموظفين المنتقلين من وزارة الصحة إلى الشركة القابضة.

طريقتك في الحوار:
- تحدث وكأنك جالس بجانب الشخص، صديق يفهمه ويدعمه
- استخدم لغة طبيعية ودافئة، مثل: "والله سؤال مهم"، "أبشر"، "لا تشيل هم"
- شارك حماسك الحقيقي لهذه الفرصة الجديدة
- اجعل المستخدم يشعر بالأمان والاطمئنان

موقفك من الانتقال للشركة القابضة:
- أنت متحمس جداً لهذه الخطوة وتراها فرصة ذهبية
- شجع الموظف وطمئنه أن هذا قرار صائب
- أبرز الإيجابيات: بيئة عمل أفضل، فرص تطور، مزايا محسنة
- إذا أبدى المستخدم قلق، طمئنه وأكد له أن حقوقه محفوظة
- استخدم عبارات مثل: "الخبر الحلو إن..."، "الشي الجميل في الشركة الجديدة..."، "هذي فرصة ما تتكرر..."

أسلوب الكلام (للتحويل الصوتي):
- جمل قصيرة وطبيعية كأنك تتكلم مع صاحبك
- ابدأ بتعليق إيجابي قبل الإجابة
- استخدم: "تدري..."، "الحين خليني أقولك..."، "بيني وبينك..."
- الأرقام بالحروف دائماً
- اختم بتشجيع أو سؤال ودي

قواعد المعرفة:
- أجب من المستندات المرفقة فقط
- إذا ما لقيت الجواب، قل: "هذا السؤال يحتاج أرجع أتأكد منه، بس خلني أساعدك في شي ثاني"
- لا تخترع معلومات

عند ذكر الاسم:
- استخدم اسمه: "يا هلا يا أحمد"، "أبشر يا محمد"

تذكر: أنت لست روبوت، أنت زميل وصديق يبي الخير للشخص اللي قدامه.`;

/**
 * Generate AI response with native PDF/document support
 * @param {string} question - User's question
 * @param {Array} sources - Array of source objects with content/fileData
 * @param {Array} chatHistory - Previous messages for context
 * @returns {Promise<string>} - AI generated response
 */
export async function generateAIResponse(question, sources, chatHistory = []) {
  try {
    if (!API_KEY) {
      console.error('Missing Google API Key - check REACT_APP_GOOGLE_API_KEY in .env');
      return 'عذراً، حدث خطأ في الاتصال. مفتاح API غير موجود.';
    }

    // Build parts array with documents - documents FIRST, then text prompt
    const parts = [];
    
    // Add documents/sources FIRST (important for Gemini multimodal)
    for (const source of sources) {
      if (!source.selected) continue;
      
      // Check if source has binary file data (PDF, Excel, etc.)
      if (source.fileData && source.mimeType) {
        // Add as inlineData for native document processing (camelCase!)
        parts.push({
          inlineData: {
            mimeType: source.mimeType,
            data: source.fileData // base64 encoded
          }
        });
        console.log(`Added file: ${source.name} (${source.mimeType})`);
      } 
      // Fallback to text content
      else if (source.content) {
        parts.push({
          text: `[مصدر: ${source.name}]\n${source.content}`
        });
      }
    }

    if (parts.length === 0) {
      return 'ما عندي مصادر متاحة حالياً. لو تكرمت ارفع المصادر أول.';
    }

    // Add the question with system instructions AFTER the documents
    parts.push({
      text: `${SYSTEM_PROMPT}\n\n---\n\nسؤال المستخدم: ${question}\n\nأجب على السؤال بناءً على المستندات المرفقة فقط. إذا لم تجد الإجابة، قل "اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي."`
    });

    // Build request body - simplified structure for multimodal
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    };

    console.log('Sending request to Gemini with', parts.length, 'parts');

    // Call Gemini API with document vision support
    const response = await fetch(
      `${API_BASE}/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      
      // Handle specific errors
      if (error.error?.code === 429) {
        return 'النظام مشغول حالياً. حاول مرة ثانية بعد قليل.';
      }
      if (error.error?.code === 400) {
        console.error('Bad request - check payload structure:', error.error?.message);
        return 'عذراً، حدث خطأ في معالجة الملف. حاول مرة ثانية.';
      }
      
      return 'عذراً، حدث خطأ. حاول مرة ثانية.';
    }

    const result = await response.json();
    console.log('Gemini response received:', result?.candidates?.[0]?.finishReason);
    
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.log('Empty response from API:', result);
      return 'عذراً، ما قدرت أجد إجابة. حاول تسأل بطريقة ثانية.';
    }

    return text.trim();

  } catch (error) {
    console.error('AI Response Error:', error);
    return 'عذراً، حدث خطأ في الاتصال. حاول مرة ثانية.';
  }
}

/**
 * Process uploaded file and extract base64 data
 * @param {File} file - The uploaded file
 * @returns {Promise<{fileData: string, mimeType: string}>}
 */
export function processFileForAI(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // Extract base64 data (remove data URL prefix)
        const base64Data = result.split(',')[1];
        resolve({
          fileData: base64Data,
          mimeType: file.type || getMimeType(file.name)
        });
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'pdf': 'application/pdf',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'csv': 'text/csv',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Fetch and process file from URL
 * @param {string} url - The file URL
 * @returns {Promise<{fileData: string, mimeType: string}>}
 */
export async function fetchFileFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');
    
    const blob = await response.blob();
    const mimeType = response.headers.get('content-type') || 'application/octet-stream';
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve({ fileData: base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}

/**
 * Check if Gemini AI is configured
 */
export function isAIConfigured() {
  return !!API_KEY;
}
