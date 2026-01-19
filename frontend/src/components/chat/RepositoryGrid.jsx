import React from 'react';
import { cn } from '@/lib/utils';
import { FileTextIcon, ExcelIcon, LinkIcon } from '@/components/icons';
import { SourceType, getThemeClasses } from '@/data/mockData';

const RepositoryGrid = ({ sources, onSelectSource }) => {
  const getSourceIcon = (type) => {
    const cls = "w-6 h-6";
    switch (type) {
      case SourceType.PDF:
        return <FileTextIcon className={cls} />;
      case SourceType.EXCEL:
        return <ExcelIcon className={cls} />;
      case SourceType.LINK:
        return <LinkIcon className={cls} />;
      default:
        return <FileTextIcon className={cls} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case SourceType.PDF:
        return 'PDF';
      case SourceType.EXCEL:
        return 'Excel';
      case SourceType.LINK:
        return 'رابط';
      default:
        return 'نص';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center py-12 space-y-10 animate-scale-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl md:text-4xl font-black text-foreground/90">
          ساحة المكتبة الرقمية
        </h3>
        <p className="text-sm md:text-base text-foreground/30 max-w-lg mx-auto">
          اختر أحد المصادر المرفوعة لبدء جلسة تحليل مخصصة مع مستشارك المعرفي.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {sources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-foreground/30 text-sm">
              لا توجد مصادر في المكتبة. قم بإضافة مصادر من لوحة التحكم.
            </p>
          </div>
        ) : (
          sources.map((source) => (
            <button
              key={source.id}
              onClick={() => onSelectSource(source)}
              className={cn(
                "group p-8 bg-foreground/5 border border-foreground/10",
                "rounded-[2.5rem] text-right",
                "transition-all duration-300",
                "hover:scale-[1.03] active:scale-[0.98]",
                getThemeClasses(source.theme)
              )}
            >
              {/* Icon */}
              <div className="mb-6 p-4 bg-foreground/5 inline-block rounded-2xl border border-foreground/10 group-hover:border-current/30 transition-colors">
                {getSourceIcon(source.type)}
              </div>

              {/* Title */}
              <h4 className="text-[16px] font-black text-foreground truncate">
                {source.name}
              </h4>

              {/* Type Label */}
              <p className="text-[10px] font-bold opacity-30 uppercase mt-1">
                {getTypeLabel(source.type)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default RepositoryGrid;
