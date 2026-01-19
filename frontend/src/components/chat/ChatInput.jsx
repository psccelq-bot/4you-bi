import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MicIcon, SendIcon } from '@/components/icons';
import { SourceCategory } from '@/data/mockData';

const ChatInput = ({
  inputText,
  setInputText,
  onSendMessage,
  isTyping,
  activeView,
  selectedRepoSource,
  disabled
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const getPlaceholder = () => {
    if (activeView === SourceCategory.ADVISOR) {
      return 'تحدث مع المستشار المعرفي alhootah...';
    }
    if (selectedRepoSource) {
      return `تحليل: ${selectedRepoSource.name}...`;
    }
    return 'بانتظار اختيار المصدر...';
  };

  const isDisabled = disabled || (!inputText.trim() || isTyping);

  return (
    <footer className="p-3 pb-6 md:p-6 lg:p-14 z-10">
      <div
        className={cn(
          "max-w-4xl mx-auto bg-foreground/5 backdrop-blur-2xl",
          "border border-foreground/10 rounded-[2rem] md:rounded-[3rem]",
          "p-1.5 md:p-3 flex gap-2 md:gap-4 items-end",
          "transition-all duration-200",
          disabled && 'opacity-20 pointer-events-none grayscale'
        )}
      >
        {/* Mic Button */}
        <Button
          variant="icon"
          size="icon-lg"
          className="flex-shrink-0 rounded-[1.2rem] md:rounded-[2rem] text-foreground/20 hover:text-primary hover:bg-foreground/5"
        >
          <MicIcon className="w-5 h-5 md:w-7 md:h-7" />
        </Button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          className={cn(
            "flex-1 bg-transparent py-4 md:py-6 px-2 outline-none resize-none",
            "font-bold text-[14px] md:text-[18px] text-foreground",
            "placeholder:text-foreground/10 custom-scrollbar max-h-[140px]"
          )}
          placeholder={getPlaceholder()}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send Button */}
        <Button
          onClick={onSendMessage}
          disabled={isDisabled}
          variant="premium"
          size="icon-lg"
          className={cn(
            "flex-shrink-0 rounded-[1.2rem] md:rounded-[2rem]",
            isDisabled && 'opacity-20 grayscale'
          )}
        >
          <SendIcon className="w-5 h-5 md:w-7 md:h-7" />
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] md:text-[12px] text-foreground/30 text-center mt-3 font-medium select-none">
        هذه أجوبة استرشادية من كتيب الأسئلة الشائعة الصادر من القابضة
      </p>
    </footer>
  );
};

export default ChatInput;
