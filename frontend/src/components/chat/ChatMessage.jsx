import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserIcon, BotIcon, SpeakerIcon, StopIcon, LogoIcon } from '@/components/icons';
import { formatTime } from '@/data/mockData';

const ChatMessage = ({
  message,
  isAdvisorView,
  currentPlayingId,
  isPreparingAudio,
  onToggleSpeak
}) => {
  const isAssistant = message.role === 'assistant';
  const isPlaying = currentPlayingId === message.id;
  const isPreparing = isPreparingAudio === message.id;

  return (
    <div
      className={cn(
        "flex animate-fade-in-up",
        isAssistant ? 'items-start gap-4' : 'flex-col items-end'
      )}
    >
      {/* Avatar for Assistant */}
      {isAssistant && (
        <div className="w-10 h-10 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center mt-1 flex-shrink-0">
          {isAdvisorView ? (
            <UserIcon className="w-5 h-5 text-primary" />
          ) : (
            <BotIcon className="w-5 h-5 text-primary" />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "relative max-w-[90%] p-6 md:p-8",
          isAssistant
            ? 'chat-bubble-assistant'
            : 'chat-bubble-user'
        )}
      >
        <p className="text-[14px] md:text-[17px] leading-relaxed font-medium text-foreground/90 whitespace-pre-wrap">
          {message.text}
        </p>

        {/* Assistant Message Footer */}
        {isAssistant && message.text && (
          <div className="mt-4 flex items-center justify-between border-t border-foreground/5 pt-3">
            <Button
              onClick={() => onToggleSpeak(message.id, message.text)}
              variant={isPlaying ? 'premium' : 'glass'}
              size="icon-sm"
              className="rounded-xl"
            >
              {isPreparing ? (
                <div className="w-4 h-4 bg-primary animate-pulse rounded-full" />
              ) : isPlaying ? (
                <StopIcon className="w-4 h-4" />
              ) : (
                <SpeakerIcon className="w-5 h-5" />
              )}
            </Button>
            <span className="text-[9px] font-black text-foreground/20 uppercase">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Typing Indicator Component
export const TypingIndicator = () => (
  <div className="flex items-center gap-3 px-12 animate-pulse">
    <LogoIcon className="w-5 h-5 text-primary animate-spin" />
    <span className="text-sm font-black text-foreground/40 italic">
      ALHOOTAH يفكر...
    </span>
  </div>
);

export default ChatMessage;
