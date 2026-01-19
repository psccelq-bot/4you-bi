// Mock data for 4you Holding AI Hub
// Updated with strict source-based knowledge rules

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

// Initial welcome messages - Updated for 4you identity
export const getInitialAdvisorMessages = () => [
  {
    id: 'w-adv',
    role: 'assistant',
    text: 'أهلا بك، أنا 4you مساعدك المعرفي. يسعدني مساعدتك في الإجابة على استفساراتك بناء على المصادر المتاحة لدي. كيف يمكنني خدمتك اليوم؟',
    timestamp: new Date()
  }
];

export const getInitialRepositoryMessages = () => [
  {
    id: 'w-repo',
    role: 'assistant',
    text: 'أهلا بك في المكتبة الرقمية. أنا 4you جاهز لمساعدتك في تحليل واستخراج المعلومات من الوثائق المتاحة. اختر المصدر الذي تريد الاستفسار عنه.',
    timestamp: new Date()
  }
];

// Response when question is outside sources
export const OUT_OF_SCOPE_RESPONSE = 'اعتذر منك عزيزي ... هذا خارج موضوعنا';

// Response when no sources are available
export const NO_SOURCES_RESPONSE = 'لا توجد مصادر متاحة حالياً. يرجى رفع المصادر أولاً حتى أتمكن من مساعدتك.';

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

// Admin password (in real app, this would be server-side)
export const ADMIN_PASSWORD = '4you2025';

/**
 * Search for answer in sources content
 * @param {string} query - User's question
 * @param {Array} sources - Available sources
 * @returns {string|null} - Found answer or null
 */
export const searchInSources = (query, sources) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const queryLower = query.toLowerCase();
  const queryArabic = query;
  
  // Keywords to search for
  const keywords = {
    salary: ['راتب', 'رواتب', 'معاش', 'صرف', 'الراتب', 'salary', 'pay'],
    leave: ['إجازة', 'إجازات', 'اجازة', 'عطلة', 'leave', 'vacation', 'holiday'],
    insurance: ['تأمين', 'طبي', 'صحي', 'insurance', 'medical', 'health'],
    allowance: ['بدل', 'بدلات', 'سكن', 'نقل', 'allowance', 'housing', 'transport'],
    hours: ['ساعات', 'دوام', 'عمل', 'وقت', 'hours', 'work', 'time'],
    training: ['تدريب', 'تطوير', 'دورات', 'training', 'development'],
    evaluation: ['تقييم', 'أداء', 'evaluation', 'performance'],
    attendance: ['حضور', 'انصراف', 'تأخير', 'attendance'],
    resignation: ['استقالة', 'نهاية الخدمة', 'مكافأة', 'resignation', 'end of service']
  };

  // Combine all source content
  const allContent = sources
    .filter(s => s.selected)
    .map(s => s.content)
    .join('\n');

  // Check which category the question falls into
  for (const [category, words] of Object.entries(keywords)) {
    const matched = words.some(word => 
      queryLower.includes(word.toLowerCase()) || queryArabic.includes(word)
    );
    
    if (matched) {
      // Search for relevant content
      const lines = allContent.split('\n').filter(line => line.trim());
      const relevantLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineHasKeyword = words.some(word => 
          line.toLowerCase().includes(word.toLowerCase()) || line.includes(word)
        );
        
        if (lineHasKeyword) {
          // Get context (line before and after)
          if (i > 0) relevantLines.push(lines[i - 1]);
          relevantLines.push(line);
          if (i < lines.length - 1) relevantLines.push(lines[i + 1]);
        }
      }
      
      if (relevantLines.length > 0) {
        // Remove duplicates and format
        const unique = [...new Set(relevantLines)].filter(l => l.trim());
        return formatAnswer(unique, category);
      }
    }
  }

  return null;
};

/**
 * Format the answer in natural Arabic
 */
const formatAnswer = (lines, category) => {
  const content = lines.join('\n').trim();
  
  const intros = {
    salary: 'بخصوص استفسارك عن الراتب، ',
    leave: 'بالنسبة للإجازات، ',
    insurance: 'فيما يتعلق بالتأمين، ',
    allowance: 'بخصوص البدلات، ',
    hours: 'بالنسبة لساعات العمل، ',
    training: 'فيما يخص التدريب والتطوير، ',
    evaluation: 'بخصوص تقييم الأداء، ',
    attendance: 'بالنسبة للحضور والانصراف، ',
    resignation: 'فيما يتعلق بنهاية الخدمة، '
  };
  
  const intro = intros[category] || '';
  
  return `${intro}بناءً على المصادر المتاحة:\n\n${content}\n\nهل لديك استفسار آخر؟`;
};
