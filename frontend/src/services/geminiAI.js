// Gemini AI Service - Using Backend API with Emergent LLM Key
// Sends requests to backend which uses emergentintegrations library

const API_BASE = process.env.REACT_APP_BACKEND_URL;

// System prompt for 4you assistant - kept for reference
const SYSTEM_PROMPT = `أنت المستشار المعرفي "فور يو"، صديق وزميل داعم للموظفين المنتقلين من وزارة الصحة إلى الشركة القابضة.`;

/**
 * Generate AI response using backend API
 * @param {string} question - User's question
 * @param {Array} sources - Array of source objects with content/fileData
 * @param {Array} chatHistory - Previous messages for context
 * @returns {Promise<string>} - AI generated response
 */
export async function generateAIResponse(question, sources, chatHistory = []) {
  try {
    // Prepare sources for API
    const apiSources = sources
      .filter(s => s.selected)
      .map(source => ({
        name: source.name,
        content: source.content || null,
        fileData: source.fileData || null,
        mimeType: source.mimeType || null
      }));

    if (apiSources.length === 0) {
      return 'ما عندي مصادر متاحة حالياً. لو تكرمت ارفع المصادر أول.';
    }

    console.log('Sending request to backend with', apiSources.length, 'sources');

    // Call backend API
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question,
        sources: apiSources,
        sessionId: localStorage.getItem('4you_session_id') || null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Backend API Error:', error);
      return 'عذراً، حدث خطأ. حاول مرة ثانية.';
    }

    const result = await response.json();
    
    // Save session ID for future requests
    if (result.sessionId) {
      localStorage.setItem('4you_session_id', result.sessionId);
    }

    console.log('Received response from backend');
    return result.response || 'عذراً، ما قدرت أجد إجابة. حاول تسأل بطريقة ثانية.';

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
  return !!API_BASE;
}
