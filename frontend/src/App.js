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

// Initial welcome messages
const getInitialAdvisorMessages = () => [
  {
    id: 'w-adv',
    role: 'assistant',
    text: 'أهلاً وسهلاً فيك. أنا فور يو، مساعدك المعرفي. ارفع المستندات اللي تبي تستفسر عنها، وأنا جاهز أساعدك.',
    timestamp: new Date()
  }
];

const getInitialRepositoryMessages = () => [
  {
    id: 'w-repo',
    role: 'assistant',
    text: 'أهلاً فيك في المكتبة الرقمية. اختر المستند اللي تبي تستفسر عنه.',
    timestamp: new Date()
  }
];

function App() {
  // State Management - Start with empty sources (user uploads their own)
  const [sources, setSources] = useLocalStorage('4you_sources', []);
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

    // Get relevant sources based on view
    let relevantSources = [];
    if (activeView === SourceCategory.ADVISOR) {
      relevantSources = sources.filter(s => s.selected && s.category === SourceCategory.ADVISOR);
    } else if (selectedRepoSource) {
      relevantSources = [selectedRepoSource];
    } else {
      relevantSources = sources.filter(s => s.selected && s.category === SourceCategory.REPOSITORY);
    }

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
  const handleAddLink = (category) => {
    const input = category === SourceCategory.ADVISOR ? advLinkInput : repoLinkInput;
    if (!input.trim()) return;

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
    category === SourceCategory.ADVISOR ? setAdvLinkInput('') : setRepoLinkInput('');
  };

  // Add manual text
  const handleAddManualText = (category) => {
    const newSource = {
      id: generateId(),
      name: `نص مضاف (${new Date().toLocaleTimeString('ar-SA')})`,
      type: SourceType.TEXT,
      category: category,
      content: 'نص مضاف يدوياً',
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
  const handleClearAllData = () => {
    if (window.confirm('هل أنت متأكد من مسح كافة سجلات المنصة؟')) {
      setSources(initialSources);
      setAdvisorMessages(getInitialAdvisorMessages());
      setRepositoryMessages(getInitialRepositoryMessages());
      setSelectedRepoSource(null);
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
