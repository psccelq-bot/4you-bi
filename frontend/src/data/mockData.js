// Mock data for 4you Holding AI Hub
// Optimized for Natural Text-to-Speech Output

// Source types
export const SourceType = {
  PDF: 'pdf',
  EXCEL: 'excel',
  TEXT: 'text',
  LINK: 'link'
};

// Source themes
export const SourceTheme = {
  CYAN: 'cyan',
  ROYAL: 'royal',
  EMERALD: 'emerald',
  SUNSET: 'sunset',
  MIDNIGHT: 'midnight'
};

// Source categories
export const SourceCategory = {
  ADVISOR: 'advisor',
  REPOSITORY: 'repository'
};

// Initial mock sources for the repository
export const initialSources = [
  {
    id: 'src-1',
    name: 'دليل الموظف الجديد',
    type: SourceType.PDF,
    category: SourceCategory.REPOSITORY,
    content: `
      دليل الموظف الجديد للشركة القابضة
      
      الفصل الأول: مقدمة عن الشركة
      الشركة القابضة هي كيان مؤسسي حديث يهدف إلى تطوير قطاع الخدمات الصحية.
      تأسست الشركة في عام 2024 برؤية طموحة لتحقيق التميز في الخدمات المقدمة.
      
      الفصل الثاني: حقوق الموظف
      - الراتب: يتم صرف الراتب في اليوم 27 من كل شهر
      - الإجازات السنوية: 30 يوم عمل
      - التأمين الطبي: شامل للموظف وعائلته
      - بدل السكن: 25% من الراتب الأساسي
      - بدل النقل: 10% من الراتب الأساسي
      
      الفصل الثالث: واجبات الموظف
      - الالتزام بمواعيد العمل الرسمية من 8 صباحاً حتى 4 مساءً
      - المحافظة على سرية المعلومات
      - التعاون مع الزملاء
      
      الفصل الرابع: التدريب والتطوير
      توفر الشركة برامج تدريبية متنوعة لتطوير مهارات الموظفين.
    `,
    mimeType: 'application/pdf',
    selected: true,
    theme: SourceTheme.CYAN,
    createdAt: new Date().toISOString()
  },
  {
    id: 'src-2',
    name: 'الأسئلة الشائعة',
    type: SourceType.PDF,
    category: SourceCategory.ADVISOR,
    content: `
      كتيب الأسئلة الشائعة - الشركة القابضة
      
      س: متى يتم صرف الراتب؟
      ج: يتم صرف الراتب في اليوم 27 من كل شهر ميلادي.
      
      س: كم عدد أيام الإجازة السنوية؟
      ج: 30 يوم عمل للموظف بعد إتمام سنة في الخدمة.
      
      س: هل يشمل التأمين الطبي العائلة؟
      ج: نعم، التأمين الطبي شامل للموظف وزوجته وأبنائه حتى سن 25 سنة.
      
      س: ما هي ساعات العمل الرسمية؟
      ج: من الساعة 8 صباحاً حتى 4 مساءً، من الأحد إلى الخميس.
      
      س: كيف أتقدم بطلب إجازة؟
      ج: من خلال نظام الخدمة الذاتية الإلكتروني أو بتقديم طلب خطي للمدير المباشر.
      
      س: ما هي البدلات المستحقة؟
      ج: بدل سكن 25% وبدل نقل 10% من الراتب الأساسي.
      
      س: هل توجد مكافأة نهاية الخدمة؟
      ج: نعم، حسب نظام العمل السعودي، نصف راتب عن كل سنة للخمس سنوات الأولى، وراتب كامل عن كل سنة بعدها.
      
      س: كيف يتم تقييم الأداء؟
      ج: تقييم سنوي من المدير المباشر يشمل الأداء والسلوك والتطور المهني.
    `,
    mimeType: 'application/pdf',
    selected: true,
    theme: SourceTheme.ROYAL,
    createdAt: new Date().toISOString()
  },
  {
    id: 'src-3',
    name: 'سلم الرواتب والبدلات',
    type: SourceType.EXCEL,
    category: SourceCategory.REPOSITORY,
    content: `
      جدول سلم الرواتب والبدلات
      
      المستوى الأول (مبتدئ):
      - الراتب الأساسي: 8,000 ريال
      - بدل السكن: 2,000 ريال
      - بدل النقل: 800 ريال
      - الإجمالي: 10,800 ريال
      
      المستوى الثاني (متوسط):
      - الراتب الأساسي: 12,000 ريال
      - بدل السكن: 3,000 ريال
      - بدل النقل: 1,200 ريال
      - الإجمالي: 16,200 ريال
      
      المستوى الثالث (متقدم):
      - الراتب الأساسي: 18,000 ريال
      - بدل السكن: 4,500 ريال
      - بدل النقل: 1,800 ريال
      - الإجمالي: 24,300 ريال
      
      المستوى الرابع (إشرافي):
      - الراتب الأساسي: 25,000 ريال
      - بدل السكن: 6,250 ريال
      - بدل النقل: 2,500 ريال
      - الإجمالي: 33,750 ريال
    `,
    mimeType: 'application/vnd.ms-excel',
    selected: true,
    theme: SourceTheme.EMERALD,
    createdAt: new Date().toISOString()
  },
  {
    id: 'src-4',
    name: 'سياسات الموارد البشرية',
    type: SourceType.PDF,
    category: SourceCategory.REPOSITORY,
    content: `
      وثيقة سياسات وإجراءات الموارد البشرية
      
      سياسة الحضور والانصراف:
      - يجب على الموظف تسجيل الحضور إلكترونياً عند الوصول
      - التأخير المسموح: 15 دقيقة فقط
      - التأخير المتكرر يؤثر على التقييم السنوي
      
      سياسة الإجازات:
      - إجازة سنوية: 30 يوم
      - إجازة مرضية: حسب التقرير الطبي
      - إجازة زواج: 5 أيام
      - إجازة وفاة: 5 أيام للأقارب من الدرجة الأولى
      
      سياسة السرية:
      - جميع معلومات الشركة سرية
      - يمنع مشاركة كلمات المرور
      - يمنع نسخ الملفات على أجهزة خارجية
      
      سياسة المظهر:
      - الالتزام بالزي الرسمي
      - المظهر اللائق والمهني
    `,
    mimeType: 'application/pdf',
    selected: true,
    theme: SourceTheme.SUNSET,
    createdAt: new Date().toISOString()
  }
];

// Initial welcome messages - TTS optimized
export const getInitialAdvisorMessages = () => [
  {
    id: 'w-adv',
    role: 'assistant',
    text: 'أهلاً وسهلاً فيك. أنا فور يو، مساعدك المعرفي. خليني أساعدك في أي استفسار عندك من المصادر المتاحة.',
    timestamp: new Date()
  }
];

export const getInitialRepositoryMessages = () => [
  {
    id: 'w-repo',
    role: 'assistant',
    text: 'أهلاً فيك في المكتبة الرقمية. اختر المصدر اللي تبي تستفسر عنه، وأنا جاهز أساعدك.',
    timestamp: new Date()
  }
];

// Response when question is outside sources - TTS friendly
export const OUT_OF_SCOPE_RESPONSE = 'اعتذر منك عزيزي، هذا الموضوع خارج نطاق المصادر المتاحة عندي.';

// Response when no sources are available
export const NO_SOURCES_RESPONSE = 'حالياً ما عندي مصادر متاحة. لو تكرمت ارفع المصادر أول، وبعدها أقدر أساعدك.';

// Helper function to generate unique IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to format timestamp
export const formatTime = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
};

// Helper to get theme classes
export const getThemeClasses = (theme) => {
  switch (theme) {
    case SourceTheme.ROYAL:
      return 'hover:bg-purple-500/10 hover:border-purple-500/40 text-purple-400';
    case SourceTheme.EMERALD:
      return 'hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400';
    case SourceTheme.SUNSET:
      return 'hover:bg-orange-500/10 hover:border-orange-500/40 text-orange-400';
    case SourceTheme.MIDNIGHT:
      return 'hover:bg-indigo-500/10 hover:border-indigo-500/40 text-indigo-400';
    default:
      return 'hover:bg-primary/10 hover:border-primary/40 text-primary';
  }
};

// Admin password
export const ADMIN_PASSWORD = '4you2025';

/**
 * TTS-Optimized Response Templates
 * Natural, conversational Arabic phrases for voice output
 */
const TTS_TEMPLATES = {
  // Opening phrases - calm and confident
  openings: [
    'طيب، خليني أوضح لك.',
    'ببساطة،',
    'حسب الموجود في المستند،',
    'تمام، بالنسبة لسؤالك،',
    'أكيد، خليني أفيدك.',
  ],
  
  // Transition phrases
  transitions: [
    'وكمان،',
    'بالإضافة لذلك،',
    'ومن ناحية ثانية،',
    'وبخصوص،',
  ],
  
  // Closing phrases - supportive
  closings: [
    'هل في شي ثاني تبي تعرفه؟',
    'إذا عندك أي استفسار ثاني، أنا موجود.',
    'تبي أوضح لك أكثر؟',
    'في شي ثاني أقدر أساعدك فيه؟',
  ],
  
  // Salary related
  salary: {
    intro: 'بالنسبة للراتب،',
    details: [
      'يتم صرف الراتب في اليوم السابع والعشرين من كل شهر.',
      'الراتب يشمل الأساسي مع البدلات.',
    ]
  },
  
  // Leave related
  leave: {
    intro: 'بخصوص الإجازات،',
    details: [
      'الإجازة السنوية ثلاثين يوم عمل.',
      'تقدر تقدم طلب الإجازة من خلال النظام الإلكتروني أو عن طريق مديرك المباشر.',
    ]
  },
  
  // Insurance related
  insurance: {
    intro: 'بالنسبة للتأمين الطبي،',
    details: [
      'التأمين شامل لك ولعائلتك.',
      'يغطي الزوجة والأبناء حتى عمر خمسة وعشرين سنة.',
    ]
  },
  
  // Working hours
  hours: {
    intro: 'بخصوص ساعات العمل،',
    details: [
      'الدوام الرسمي من الثامنة صباحاً حتى الرابعة مساءً.',
      'أيام العمل من الأحد إلى الخميس.',
    ]
  },
  
  // Allowances
  allowances: {
    intro: 'بالنسبة للبدلات،',
    details: [
      'بدل السكن خمسة وعشرين بالمئة من الراتب الأساسي.',
      'وبدل النقل عشرة بالمئة.',
    ]
  }
};

/**
 * Search for answer in sources and format for TTS
 * @param {string} query - User's question
 * @param {Array} sources - Available sources
 * @returns {string|null} - TTS-optimized answer or null
 */
export const searchInSources = (query, sources) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const queryLower = query.toLowerCase();
  const queryArabic = query;
  
  // Combine all source content
  const allContent = sources
    .filter(s => s.selected)
    .map(s => s.content)
    .join('\n');

  // Check for different topics and return TTS-friendly responses
  
  // Salary questions
  if (containsAny(queryArabic, ['راتب', 'رواتب', 'معاش', 'صرف', 'الراتب', 'salary', 'pay'])) {
    if (allContent.includes('راتب') || allContent.includes('صرف')) {
      return formatTTSResponse('salary', allContent);
    }
  }
  
  // Leave questions
  if (containsAny(queryArabic, ['إجازة', 'إجازات', 'اجازة', 'عطلة', 'leave', 'vacation'])) {
    if (allContent.includes('إجازة') || allContent.includes('اجازة')) {
      return formatTTSResponse('leave', allContent);
    }
  }
  
  // Insurance questions
  if (containsAny(queryArabic, ['تأمين', 'طبي', 'صحي', 'insurance', 'medical'])) {
    if (allContent.includes('تأمين') || allContent.includes('طبي')) {
      return formatTTSResponse('insurance', allContent);
    }
  }
  
  // Allowance questions
  if (containsAny(queryArabic, ['بدل', 'بدلات', 'سكن', 'نقل', 'allowance'])) {
    if (allContent.includes('بدل')) {
      return formatTTSResponse('allowances', allContent);
    }
  }
  
  // Working hours questions
  if (containsAny(queryArabic, ['ساعات', 'دوام', 'عمل', 'وقت', 'hours', 'work time'])) {
    if (allContent.includes('ساعات') || allContent.includes('دوام')) {
      return formatTTSResponse('hours', allContent);
    }
  }
  
  // Training questions
  if (containsAny(queryArabic, ['تدريب', 'تطوير', 'دورات', 'training'])) {
    if (allContent.includes('تدريب') || allContent.includes('تطوير')) {
      return buildTTSResponse(
        'بخصوص التدريب والتطوير،',
        'الشركة توفر برامج تدريبية متنوعة لتطوير مهاراتك. هدفهم إنك تتطور وتنمو في مسيرتك المهنية.',
        getRandomClosing()
      );
    }
  }
  
  // Evaluation questions
  if (containsAny(queryArabic, ['تقييم', 'أداء', 'evaluation', 'performance'])) {
    if (allContent.includes('تقييم') || allContent.includes('أداء')) {
      return buildTTSResponse(
        'بالنسبة لتقييم الأداء،',
        'يتم تقييمك سنوياً من مديرك المباشر. التقييم يشمل أداءك في العمل، وسلوكك المهني، وتطورك خلال السنة.',
        getRandomClosing()
      );
    }
  }
  
  // End of service questions
  if (containsAny(queryArabic, ['نهاية الخدمة', 'مكافأة', 'استقالة', 'end of service'])) {
    if (allContent.includes('نهاية الخدمة') || allContent.includes('مكافأة')) {
      return buildTTSResponse(
        'بخصوص مكافأة نهاية الخدمة،',
        'حسب نظام العمل، تستحق نصف راتب عن كل سنة في الخمس سنوات الأولى. وبعدها راتب كامل عن كل سنة إضافية.',
        getRandomClosing()
      );
    }
  }
  
  // Attendance questions
  if (containsAny(queryArabic, ['حضور', 'انصراف', 'تأخير', 'attendance'])) {
    if (allContent.includes('حضور') || allContent.includes('تأخير')) {
      return buildTTSResponse(
        'بالنسبة للحضور والانصراف،',
        'لازم تسجل حضورك إلكترونياً لما توصل. والتأخير المسموح فيه خمسة عشر دقيقة فقط. التأخير المتكرر ممكن يأثر على تقييمك السنوي.',
        getRandomClosing()
      );
    }
  }

  return null;
};

/**
 * Helper: Check if text contains any of the keywords
 */
const containsAny = (text, keywords) => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase()) || text.includes(keyword)
  );
};

/**
 * Format TTS-optimized response based on topic
 */
const formatTTSResponse = (topic, content) => {
  const template = TTS_TEMPLATES[topic];
  if (!template) return null;
  
  const intro = template.intro;
  const details = template.details.join(' ');
  const closing = getRandomClosing();
  
  return buildTTSResponse(intro, details, closing);
};

/**
 * Build a complete TTS-friendly response
 */
const buildTTSResponse = (intro, body, closing) => {
  return `${intro} ${body} ${closing}`;
};

/**
 * Get random closing phrase
 */
const getRandomClosing = () => {
  const closings = TTS_TEMPLATES.closings;
  return closings[Math.floor(Math.random() * closings.length)];
};

/**
 * Get random opening phrase
 */
const getRandomOpening = () => {
  const openings = TTS_TEMPLATES.openings;
  return openings[Math.floor(Math.random() * openings.length)];
};
