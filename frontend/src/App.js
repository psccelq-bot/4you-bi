import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
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
  initialSources,
  getInitialAdvisorMessages,
  getInitialRepositoryMessages,
  mockAdvisorResponses,
  mockRepositoryResponses,
  generateId
} from '@/data/mockData';
import useLocalStorage from '@/hooks/useLocalStorage';

function App() {
  // State Management
  const [sources, setSources] = useLocalStorage('4you_sources', initialSources);
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
  const speechSynthRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [advisorMessages, repositoryMessages, isTyping, scrollToBottom]);

  // Helper to generate mock response
  const generateMockResponse = (userText, isAdvisor) => {
    const lowerText = userText.toLowerCase();
    const responses = isAdvisor ? mockAdvisorResponses : mockRepositoryResponses;

    if (isAdvisor) {
      if (lowerText.includes('راتب') || lowerText.includes('معاش')) {
        return responses.salary;
      }
      if (lowerText.includes('مزايا') || lowerText.includes('فوائد') || lowerText.includes('تأمين')) {
        return responses.benefits;
      }
      if (lowerText.includes('انتقال') || lowerText.includes('نقل')) {
        return responses.transfer;
      }
      if (lowerText.includes('تدريب') || lowerText.includes('تأهيل')) {
        return responses.training;
      }
      if (lowerText.includes('أهلا') || lowerText.includes('مرحبا') || lowerText.includes('اسمي')) {
        return responses.greeting;
      }
    } else {
      if (lowerText.includes('ملخص') || lowerText.includes('تلخيص')) {
        return responses.summary;
      }
      if (lowerText.includes('بحث') || lowerText.includes('ابحث')) {
        return responses.search;
      }
      if (lowerText.includes('استخرج') || lowerText.includes('استخراج')) {
        return responses.extract;
      }
    }

    return responses.default;
  };

  // Handle sending message
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

    // Add user message
    if (activeView === SourceCategory.ADVISOR) {
      setAdvisorMessages((prev) => [...prev, userMessage]);
    } else {
      setRepositoryMessages((prev) => [...prev, userMessage]);
    }

    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    // Generate response
    const responseText = generateMockResponse(userText, activeView === SourceCategory.ADVISOR);

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

    setIsTyping(false);

    // Auto-speak if enabled
    if (isAutoSpeak) {
      handleToggleSpeak(assistantMessage.id, responseText);
    }
  };

  // Initialize Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
    return () => {
      // Cleanup: stop any playing speech
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // Stop current speech
  const stopSpeech = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
    currentUtteranceRef.current = null;
    setCurrentPlayingId(null);
    setIsPreparingAudio(null);
  }, []);

  // Handle text-to-speech (Real implementation)
  const handleToggleSpeak = useCallback((msgId, text) => {
    // If same message is playing, stop it
    if (currentPlayingId === msgId) {
      stopSpeech();
      return;
    }

    // Stop any current speech
    stopSpeech();

    // Check if speech synthesis is available
    if (!speechSynthRef.current) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    setIsPreparingAudio(msgId);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; // Arabic - Saudi Arabia
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get available Arabic voices
    const voices = speechSynthRef.current.getVoices();
    const arabicVoice = voices.find(voice => 
      voice.lang.startsWith('ar') || voice.name.toLowerCase().includes('arabic')
    );
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPreparingAudio(null);
      setCurrentPlayingId(msgId);
    };

    utterance.onend = () => {
      setCurrentPlayingId(null);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setCurrentPlayingId(null);
      setIsPreparingAudio(null);
      currentUtteranceRef.current = null;
    };

    // Store reference and speak
    currentUtteranceRef.current = utterance;
    
    // Small delay to ensure voices are loaded
    setTimeout(() => {
      speechSynthRef.current.speak(utterance);
    }, 100);
  }, [currentPlayingId, stopSpeech]);

  // File upload handler
  const handleFileUpload = (event, category) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    let type = SourceType.TEXT;
    if (isPdf) type = SourceType.PDF;
    else if (isExcel) type = SourceType.EXCEL;

    const newSource = {
      id: generateId(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: type,
      category: category,
      content: `محتوى ${file.name}`,
      mimeType: file.type,
      selected: true,
      theme: SourceTheme.CYAN,
      createdAt: new Date().toISOString()
    };

    setSources((prev) => [...prev, newSource]);
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
      text: `يا أهلاً بك، تم تفعيل المصدر: "${source.name}".. كيف يمكن لمستشارك المعرفي خدمتك في تحليل محتوى هذا الملف؟\nممكن نتشرف باسمك؟`,
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
