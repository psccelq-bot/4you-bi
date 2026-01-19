// Mock data for 4you Holding AI Hub

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
    content: 'محتوى دليل الموظف الجديد - كل ما تحتاج معرفته عن الانضمام للشركة القابضة',
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
    content: 'كتيب الأسئلة الشائعة - جميع الاستفسارات المتعلقة بعملية الانتقال',
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
    content: 'جدول تفصيلي بسلم الرواتب والبدلات والمزايا',
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
    content: 'وثيقة سياسات وإجراءات الموارد البشرية',
    mimeType: 'application/pdf',
    selected: true,
    theme: SourceTheme.SUNSET,
    createdAt: new Date().toISOString()
  }
];

// Initial welcome messages
export const getInitialAdvisorMessages = () => [
  {
    id: 'w-adv',
    role: 'assistant',
    text: 'يا أهلاً بك.. معك المستشار المعرفي alhootah، يسعدني جداً مرافقتك في رحلة الانتقال الإيجابي من وزارة الصحة إلى الشركة القابضة. تفضل، كيف يمكنني خدمتك اليوم؟\nممكن نتشرف باسمك؟',
    timestamp: new Date()
  }
];

export const getInitialRepositoryMessages = () => [
  {
    id: 'w-repo',
    role: 'assistant',
    text: 'أهلاً بك في مكتبتك الرقمية.. المستشار المعرفي alhootah جاهز لمساعدتك في تحليل واستخراج المعلومات من الوثائق التي تختارها.\nممكن نتشرف باسمك؟',
    timestamp: new Date()
  }
];

// Mock responses for advisor chat
export const mockAdvisorResponses = {
  default: 'شكراً لتواصلك معنا. أنا هنا لمساعدتك في أي استفسار يخص الانتقال للشركة القابضة. كيف يمكنني خدمتك؟',
  
  salary: 'بخصوص الرواتب والبدلات، تم تصميم الهيكل الجديد بعناية لضمان حفاظكم على جميع حقوقكم المكتسبة. سيتم احتساب الراتب الجديد بناءً على سنوات الخبرة والدرجة الوظيفية الحالية، مع إمكانية الحصول على علاوات إضافية حسب الأداء.',
  
  benefits: 'المزايا والفوائد تشمل: التأمين الطبي الشامل لك ولأفراد عائلتك، بدل سكن، بدل نقل، إجازات سنوية مدفوعة، برامج تدريب وتطوير مستمرة، وخطة ادخار تقاعدية.',
  
  transfer: 'عملية الانتقال ستتم بشكل سلس ومنظم. سيتم إخطاركم بجميع التفاصيل قبل موعد الانتقال بوقت كافٍ. جميع حقوقكم الوظيفية محفوظة وسيتم نقلها كاملة.',
  
  training: 'نعم، سيكون هناك برنامج تأهيلي شامل لجميع المنتقلين يشمل: التعريف بالهيكل التنظيمي الجديد، الأنظمة والإجراءات، والتدريب على الأدوات والبرامج المستخدمة.',
  
  greeting: 'أهلاً وسهلاً بك! يسعدني التعرف عليك. كيف أقدر أساعدك اليوم؟'
};

// Mock responses for repository chat
export const mockRepositoryResponses = {
  default: 'تم تحليل الوثيقة المحددة. هل لديك سؤال محدد عن محتواها؟',
  
  summary: 'بناءً على تحليل الوثيقة، إليك أهم النقاط الرئيسية...',
  
  search: 'تم البحث في الوثيقة وتم العثور على المعلومات المطلوبة...',
  
  extract: 'تم استخراج البيانات المطلوبة من الوثيقة بنجاح.'
};

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
