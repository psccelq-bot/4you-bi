import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toaster, toast } from '@/components/ui/sonner';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ChatMessage, { TypingIndicator } from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import RepositoryGrid from '@/components/chat/RepositoryGrid';
import AdminModal from '@/components/modals/AdminModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SourceCategory,
  SourceType,
  SourceTheme,
  generateId
} from '@/data/mockData';
import useLocalStorage from '@/hooks/useLocalStorage';
import { generateSpeech, decodePCM, decodeAudioData, isConfigured } from '@/services/geminiTTS';
import { generateAIResponse, processFileForAI } from '@/services/geminiAI';
import { getSourcesFromDB, saveSourcesToDB, clearAllSources } from '@/services/indexedDB';

// Initial welcome messages - Warm, positive and human-like
const getInitialAdvisorMessages = () => [
  {
    id: 'w-adv',
    role: 'assistant',
    text: 'يا أهلاً وسهلاً بك.. معك المستشار المعرفي فور يو، يسعدني جداً مرافقتك في رحلة الانتقال الإيجابي من وزارة الصحة إلى الشركة القابضة. هذه مرحلة جديدة ومثيرة، وأنا هنا لأساعدك في كل استفساراتك. تفضل، كيف يمكنني خدمتك اليوم؟ وممكن نتشرف باسمك الكريم؟',
    timestamp: new Date()
  }
];

const getInitialRepositoryMessages = () => [
  {
    id: 'w-repo',
    role: 'assistant',
    text: 'يا هلا فيك في مكتبتك الرقمية.. المستشار المعرفي فور يو جاهز لمساعدتك في تحليل واستخراج المعلومات من الوثائق. اختر المصدر اللي يهمك، وخليني أساعدك في فهم محتواه. ممكن نتشرف باسمك؟',
    timestamp: new Date()
  }
];

function App() {
  // State Management - Sources in IndexedDB for persistence
  const [sources, setSources] = useState([]);
  const [sourcesLoaded, setSourcesLoaded] = useState(false);
  const [advisorMessages, setAdvisorMessages] = useLocalStorage(
    '4you_advisor_messages',
    getInitialAdvisorMessages()
  );
  const [repositoryMessages, setRepositoryMessages] = useLocalStorage(
    '4you_repository_messages',
    getInitialRepositoryMessages()
  );

  const [activeView, setActiveView] = useState(SourceCategory.ADVISOR);
  const [activeAdminTab, setActiveAdminTab] = useState(SourceCategory.ADVISOR);
  const [selectedRepoSource, setSelectedRepoSource] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [isPreparingAudio, setIsPreparingAudio] = useState(null);

  // Admin Inputs
  const [advLinkInput, setAdvLinkInput] = useState('');
  const [repoLinkInput, setRepoLinkInput] = useState('');

  // Refs
  const chatEndRef = useRef(null);
  const advisorFileInputRef = useRef(null);
  const repositoryFileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentAudioSourceRef = useRef(null);

  // Load sources from IndexedDB on mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        const savedSources = await getSourcesFromDB();
        if (savedSources && savedSources.length > 0) {
          setSources(savedSources);
          console.log(`Loaded ${savedSources.length} sources from IndexedDB`);
        }
        setSourcesLoaded(true);
      } catch (error) {
        console.error('Error loading sources from IndexedDB:', error);
        setSourcesLoaded(true);
      }
    };
    loadSources();
  }, []);

  // Save sources to IndexedDB whenever they change (only after initial load)
  const sourcesRef = useRef(sources);
  useEffect(() => {
    // Skip if not loaded yet or if sources haven't actually changed
    if (!sourcesLoaded) return;
    
    // Only save if sources actually changed (not just initial empty state)
    const prevSources = sourcesRef.current;
    if (JSON.stringify(prevSources) === JSON.stringify(sources)) return;
    
    sourcesRef.current = sources;
    
    // Save to IndexedDB
    saveSourcesToDB(sources).catch(error => {
      console.error('Error saving sources to IndexedDB:', error);
    });
  }, [sources, sourcesLoaded]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [advisorMessages, repositoryMessages, isTyping, scrollToBottom]);

  // Handle sending message - Uses Gemini AI to answer from sources
  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText('');

    // Create user message
    const userMessage = {
      id: generateId(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    // Get current messages for context
    const currentMessages = activeView === SourceCategory.ADVISOR 
      ? advisorMessages 
      : repositoryMessages;

    // Add user message
    if (activeView === SourceCategory.ADVISOR) {
      setAdvisorMessages((prev) => [...prev, userMessage]);
    } else {
      setRepositoryMessages((prev) => [...prev, userMessage]);
    }

    setIsTyping(true);

    // Get relevant sources - use all available sources for the current view
    let relevantSources = [];
    if (activeView === SourceCategory.ADVISOR) {
      // Use all selected advisor sources OR all sources if none specifically for advisor
      const advisorSources = sources.filter(s => s.selected && s.category === SourceCategory.ADVISOR);
      relevantSources = advisorSources.length > 0 ? advisorSources : sources.filter(s => s.selected);
    } else if (selectedRepoSource) {
      relevantSources = [selectedRepoSource];
    } else {
      relevantSources = sources.filter(s => s.selected && s.category === SourceCategory.REPOSITORY);
    }

    // If no sources found, use all available selected sources
    if (relevantSources.length === 0) {
      relevantSources = sources.filter(s => s.selected);
    }

    console.log('Using sources:', relevantSources.map(s => s.name));

    try {
      // Generate AI response from sources
      const responseText = await generateAIResponse(
        userText, 
        relevantSources,
        currentMessages.slice(-6) // Last 6 messages for context
      );

      const assistantMessage = {
        id: generateId(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date()
      };

      // Add assistant message
      if (activeView === SourceCategory.ADVISOR) {
        setAdvisorMessages((prev) => [...prev, assistantMessage]);
      } else {
        setRepositoryMessages((prev) => [...prev, assistantMessage]);
      }

      // Auto-speak if enabled
      if (isAutoSpeak) {
        handleToggleSpeak(assistantMessage.id, responseText);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: generateId(),
        role: 'assistant',
        text: 'عذراً، حدث خطأ. حاول مرة ثانية.',
        timestamp: new Date()
      };
      
      if (activeView === SourceCategory.ADVISOR) {
        setAdvisorMessages((prev) => [...prev, errorMessage]);
      } else {
        setRepositoryMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Stop current audio playback
  const stopCurrentAudio = useCallback(() => {
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      currentAudioSourceRef.current = null;
    }
    setCurrentPlayingId(null);
    setIsPreparingAudio(null);
  }, []);

  // Handle text-to-speech using Gemini TTS API with female voice
  const handleToggleSpeak = useCallback(async (msgId, text) => {
    // If same message is playing, stop it
    if (currentPlayingId === msgId) {
      stopCurrentAudio();
      return;
    }

    // Stop any current playback
    stopCurrentAudio();

    // Check if Gemini TTS is configured
    if (!isConfigured()) {
      toast.error('خدمة الصوت غير مُعدّة', {
        description: 'يرجى إضافة مفتاح Google API'
      });
      return;
    }

    // Initialize AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });
    }

    // Resume AudioContext if suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsPreparingAudio(msgId);

    try {
      // Call Gemini TTS API
      const audioBase64 = await generateSpeech(text);

      if (audioBase64) {
        const ctx = audioContextRef.current;
        
        // Decode PCM data
        const pcmBytes = decodePCM(audioBase64);
        const audioBuffer = decodeAudioData(pcmBytes, ctx, 24000, 1);

        // Stop preparing indicator
        setIsPreparingAudio(null);
        setCurrentPlayingId(msgId);

        // Create and play audio source
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setCurrentPlayingId(null);
          currentAudioSourceRef.current = null;
        };

        currentAudioSourceRef.current = source;
        source.start(0);
        
        toast.success('جاري تشغيل الصوت...', {
          duration: 2000
        });
        
      } else {
        throw new Error('No audio data received');
      }
    } catch (error) {
      console.error('Gemini TTS Error:', error);
      setIsPreparingAudio(null);
      setCurrentPlayingId(null);
      toast.error('عذراً، لم نتمكن من تشغيل الصوت', {
        description: 'حدث خطأ أثناء توليد الصوت'
      });
    }
  }, [currentPlayingId, stopCurrentAudio]);

  // File upload handler - processes files for native Gemini vision
  const handleFileUpload = async (event, category) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    const isImage = file.type.startsWith('image/');

    let type = SourceType.TEXT;
    if (isPdf) type = SourceType.PDF;
    else if (isExcel) type = SourceType.EXCEL;

    // Show loading toast
    toast.loading('جاري رفع الملف...', { id: 'upload' });

    try {
      // Process file for AI (get base64 data)
      const { fileData, mimeType } = await processFileForAI(file);

      const newSource = {
        id: generateId(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: type,
        category: category,
        content: '', // Will use fileData instead
        fileData: fileData, // Base64 encoded file for Gemini vision
        mimeType: mimeType,
        selected: true,
        theme: SourceTheme.CYAN,
        createdAt: new Date().toISOString()
      };

      setSources((prev) => [...prev, newSource]);
      toast.success(`تم رفع "${file.name}" بنجاح`, { id: 'upload' });
      
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('حدث خطأ أثناء رفع الملف', { id: 'upload' });
    }

    event.target.value = '';
  };

  // Add external link
  const handleAddLink = async (category) => {
    const input = category === SourceCategory.ADVISOR ? advLinkInput : repoLinkInput;
    if (!input.trim()) return;

    // Check if it's a file URL (PDF, etc.)
    const isFileUrl = /\.(pdf|xlsx|xls|csv|doc|docx|png|jpg|jpeg)$/i.test(input);

    if (isFileUrl) {
      toast.loading('جاري تحميل الملف من الرابط...', { id: 'link-upload' });
      
      try {
        const { fetchFileFromURL } = await import('@/services/geminiAI');
        const { fileData, mimeType } = await fetchFileFromURL(input);
        
        const newSource = {
          id: generateId(),
          name: input.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'ملف من رابط',
          type: mimeType.includes('pdf') ? SourceType.PDF : SourceType.LINK,
          category: category,
          content: '',
          fileData: fileData,
          mimeType: mimeType,
          selected: true,
          theme: SourceTheme.CYAN,
          createdAt: new Date().toISOString()
        };

        setSources((prev) => [...prev, newSource]);
        toast.success('تم تحميل الملف بنجاح', { id: 'link-upload' });
      } catch (error) {
        console.error('Link fetch error:', error);
        toast.error('لم نتمكن من تحميل الملف من الرابط', { id: 'link-upload' });
      }
    } else {
      // Regular text link
      const newSource = {
        id: generateId(),
        name: 'رابط خارجي',
        type: SourceType.LINK,
        category: category,
        content: input,
        mimeType: 'text/url',
        selected: true,
        theme: SourceTheme.CYAN,
        createdAt: new Date().toISOString()
      };

      setSources((prev) => [...prev, newSource]);
    }

    category === SourceCategory.ADVISOR ? setAdvLinkInput('') : setRepoLinkInput('');
  };

  // Add manual text
  const handleAddManualText = (category) => {
    const text = prompt('أدخل النص الذي تريد إضافته:');
    if (!text?.trim()) return;

    const newSource = {
      id: generateId(),
      name: `نص مضاف (${new Date().toLocaleTimeString('ar-SA')})`,
      type: SourceType.TEXT,
      category: category,
      content: text,
      mimeType: 'text/plain',
      selected: true,
      theme: SourceTheme.CYAN,
      createdAt: new Date().toISOString()
    };

    setSources((prev) => [...prev, newSource]);
  };

  // Remove source
  const handleRemoveSource = (id) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    if (selectedRepoSource?.id === id) {
      setSelectedRepoSource(null);
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    if (window.confirm('هل أنت متأكد من مسح كافة سجلات المنصة؟')) {
      setSources([]);
      setAdvisorMessages(getInitialAdvisorMessages());
      setRepositoryMessages(getInitialRepositoryMessages());
      setSelectedRepoSource(null);
      await clearAllSources(); // Clear IndexedDB
      toast.success('تم مسح جميع البيانات');
    }
  };

  // Select source for chat
  const handleSelectSource = (source) => {
    setSelectedRepoSource(source);

    const welcomeMsg = {
      id: generateId(),
      role: 'assistant',
      text: `تم تفعيل المصدر: "${source.name}". يمكنك الآن الاستفسار عن محتوى هذا الملف وسأجيبك بناء على المعلومات الموجودة فيه فقط.`,
      timestamp: new Date()
    };

    setRepositoryMessages((prev) => [...prev, welcomeMsg]);
  };

  // Admin login
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminModal(false);
  };

  // Get messages for current view
  const currentMessages =
    activeView === SourceCategory.ADVISOR ? advisorMessages : repositoryMessages;

  // Get repository sources
  const repositorySources = sources.filter(
    (s) => s.category === SourceCategory.REPOSITORY
  );

  return (
    <div className="flex h-screen overflow-hidden font-cairo text-foreground bg-background" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        setSelectedRepoSource={setSelectedRepoSource}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        setShowAdminModal={setShowAdminModal}
        sources={sources}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
        advLinkInput={advLinkInput}
        setAdvLinkInput={setAdvLinkInput}
        repoLinkInput={repoLinkInput}
        setRepoLinkInput={setRepoLinkInput}
        onFileUpload={handleFileUpload}
        onAddLink={handleAddLink}
        onAddManualText={handleAddManualText}
        onRemoveSource={handleRemoveSource}
        onClearAllData={handleClearAllData}
        fileInputRef={
          activeAdminTab === SourceCategory.ADVISOR
            ? advisorFileInputRef
            : repositoryFileInputRef
        }
      />

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col relative"
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        {/* Header */}
        <Header
          activeView={activeView}
          selectedRepoSource={selectedRepoSource}
          setSelectedRepoSource={setSelectedRepoSource}
          isAutoSpeak={isAutoSpeak}
          setIsAutoSpeak={setIsAutoSpeak}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto h-full">
            {activeView === SourceCategory.REPOSITORY && !selectedRepoSource ? (
              <RepositoryGrid
                sources={repositorySources}
                onSelectSource={handleSelectSource}
              />
            ) : (
              <div className="space-y-10 pb-12">
                {currentMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isAdvisorView={activeView === SourceCategory.ADVISOR}
                    currentPlayingId={currentPlayingId}
                    isPreparingAudio={isPreparingAudio}
                    onToggleSpeak={handleToggleSpeak}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          activeView={activeView}
          selectedRepoSource={selectedRepoSource}
          disabled={activeView === SourceCategory.REPOSITORY && !selectedRepoSource}
        />
      </main>

      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onLogin={handleAdminLogin}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
