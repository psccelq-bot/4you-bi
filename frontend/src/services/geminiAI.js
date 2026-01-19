// Gemini AI Service for Source-Based Q&A
// Uses Gemini to analyze uploaded sources and answer questions

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyDP86IJ8ibRiJl09OT0UTd1QAFsUASzeWw';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// System prompt for 4you assistant - TTS optimized
const SYSTEM_PROMPT = `أنت مساعد معرفي اسمك "فور يو" (4you). مهمتك الإجابة على أسئلة المستخدم بناءً على المصادر المرفقة فقط.

قواعد صارمة يجب اتباعها:
1. أجب فقط من المعلومات الموجودة في المصادر المرفقة
2. إذا لم تجد الإجابة في المصادر، قل بالضبط: "اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي."
3. لا تضف أي معلومات من خارج المصادر
4. لا تخترع أو تفترض معلومات غير موجودة

أسلوب الإجابة (مهم جداً للتحويل الصوتي):
- استخدم جمل قصيرة وواضحة
- استخدم نبرة هادئة وودية
- استخدم عبارات انتقالية مثل: "بالنسبة لـ..."، "بخصوص..."، "خليني أوضح لك..."
- اكتب الأرقام بالحروف (مثل: سبعة وعشرين بدلاً من 27)
- اختم بسؤال تفاعلي مثل: "هل في شي ثاني تبي تعرفه؟"
- تجنب الرموز التعبيرية والنقاط المتعددة
- اجعل الرد طبيعي وكأنك تتحدث مع شخص أمامك

اللغة: أجب بنفس لغة السؤال (عربي أو إنجليزي)`;

/**
 * Generate AI response based on sources
 * @param {string} question - User's question
 * @param {Array} sources - Array of source objects with content
 * @param {Array} chatHistory - Previous messages for context
 * @returns {Promise<string>} - AI generated response
 */
export async function generateAIResponse(question, sources, chatHistory = []) {
  try {
    if (!API_KEY) {
      console.error('Missing Google API Key');
      return 'عذراً، حدث خطأ في الاتصال. حاول مرة ثانية.';
    }

    // Prepare sources content
    const sourcesContent = sources
      .filter(s => s.selected && s.content)
      .map((s, i) => `[مصدر ${i + 1}: ${s.name}]\n${s.content}`)
      .join('\n\n---\n\n');

    if (!sourcesContent.trim()) {
      return 'ما عندي مصادر متاحة حالياً. لو تكرمت ارفع المصادر أول.';
    }

    // Build conversation history
    const historyMessages = chatHistory.slice(-6).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Build the prompt
    const userPrompt = `المصادر المتاحة:
${sourcesContent}

---

سؤال المستخدم: ${question}

أجب على السؤال بناءً على المصادر المتاحة فقط. إذا لم تجد الإجابة، قل "اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي."`;

    // Call Gemini API
    const response = await fetch(
      `${API_BASE}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }]
            },
            {
              role: 'model',
              parts: [{ text: 'فهمت. سأجيب فقط من المصادر المرفقة بأسلوب طبيعي ومناسب للتحويل الصوتي.' }]
            },
            ...historyMessages,
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      return 'عذراً، حدث خطأ. حاول مرة ثانية.';
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return 'عذراً، ما قدرت أجد إجابة. حاول تسأل بطريقة ثانية.';
    }

    return text.trim();

  } catch (error) {
    console.error('AI Response Error:', error);
    return 'عذراً، حدث خطأ في الاتصال. حاول مرة ثانية.';
  }
}

/**
 * Check if Gemini AI is configured
 */
export function isAIConfigured() {
  return !!API_KEY;
}
