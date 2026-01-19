import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuIcon } from '@/components/icons';
import { SourceCategory } from '@/data/mockData';

const Header = ({
  activeView,
  selectedRepoSource,
  setSelectedRepoSource,
  isAutoSpeak,
  setIsAutoSpeak,
  onToggleSidebar
}) => {
  return (
    <header className="h-16 md:h-20 bg-background/20 backdrop-blur-xl border-b border-foreground/5 px-5 md:px-12 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-foreground/50 hover:text-primary transition-colors"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-sm md:text-xl font-black text-foreground/90">
            {activeView === SourceCategory.ADVISOR
              ? 'مستشارك المعرفي'
              : selectedRepoSource
                ? `تحليل: ${selectedRepoSource.name}`
                : 'المكتبة الرقمية'}
          </h2>
          <p className="text-[8px] md:text-[10px] font-bold text-primary uppercase opacity-80 tracking-widest">
            4you Assistant
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Back to Repository Button */}
        {activeView === SourceCategory.REPOSITORY && selectedRepoSource && (
          <Button
            onClick={() => setSelectedRepoSource(null)}
            variant="glass"
            className="px-4 py-2 text-[11px] font-bold text-primary"
          >
            العودة للساحة
          </Button>
        )}

        {/* Auto Speak Toggle */}
        <Button
          onClick={() => setIsAutoSpeak(!isAutoSpeak)}
          variant={isAutoSpeak ? 'neon' : 'glass'}
          className={cn(
            "px-4 md:px-6 py-2 rounded-full text-[10px] md:text-[12px] font-black",
            isAutoSpeak && 'shadow-glow'
          )}
        >
          {isAutoSpeak ? 'النطق تلقائي' : 'تفعيل النطق'}
        </Button>
      </div>
    </header>
  );
};

export default Header;
