import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  LogoIcon,
  CloseIcon,
  UserIcon,
  LibraryIcon,
  UploadIcon,
  LinkIcon,
  TrashIcon,
  FileTextIcon,
  ExcelIcon
} from '@/components/icons';
import { SourceType, SourceCategory } from '@/data/mockData';

const Sidebar = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  setSelectedRepoSource,
  isAdmin,
  setIsAdmin,
  setShowAdminModal,
  // Admin props
  sources,
  activeAdminTab,
  setActiveAdminTab,
  advLinkInput,
  setAdvLinkInput,
  repoLinkInput,
  setRepoLinkInput,
  onFileUpload,
  onAddLink,
  onAddManualText,
  onRemoveSource,
  onClearAllData,
  fileInputRef
}) => {
  const getSourceIcon = (type) => {
    const cls = "w-4 h-4";
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 md:w-80",
          "premium-sidebar border-l border-foreground/5",
          "transform transition-transform duration-500",
          "lg:relative lg:translate-x-0",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-foreground/5 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 text-foreground/30 hover:text-foreground lg:hidden transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="p-4 bg-foreground/5 inline-block rounded-3xl mb-4 border border-foreground/10">
              <LogoIcon className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-xl font-black text-foreground/90">4you Hub</h1>
            <p className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em]">
              Cognitive Advisor
            </p>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 custom-scrollbar">
            <div className="p-5 space-y-8">
              {/* Main Navigation */}
              <section className="space-y-2">
                <button
                  onClick={() => {
                    setActiveView(SourceCategory.ADVISOR);
                    setSelectedRepoSource(null);
                  }}
                  className={cn(
                    "w-full text-right p-4 rounded-2xl border transition-all duration-200",
                    activeView === SourceCategory.ADVISOR
                      ? 'bg-primary/10 border-primary/40'
                      : 'border-transparent hover:bg-foreground/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <UserIcon
                      className={cn(
                        "w-5 h-5",
                        activeView === SourceCategory.ADVISOR
                          ? 'text-primary'
                          : 'text-foreground/20'
                      )}
                    />
                    <h3
                      className={cn(
                        "text-[12px] font-black uppercase",
                        activeView === SourceCategory.ADVISOR
                          ? 'text-primary'
                          : 'text-foreground/20'
                      )}
                    >
                      مستشارك المعرفي
                    </h3>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveView(SourceCategory.REPOSITORY);
                    setSelectedRepoSource(null);
                  }}
                  className={cn(
                    "w-full text-right p-4 rounded-2xl border transition-all duration-200",
                    activeView === SourceCategory.REPOSITORY
                      ? 'bg-primary/10 border-primary/40'
                      : 'border-transparent hover:bg-foreground/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <LibraryIcon
                      className={cn(
                        "w-5 h-5",
                        activeView === SourceCategory.REPOSITORY
                          ? 'text-primary'
                          : 'text-foreground/20'
                      )}
                    />
                    <h3
                      className={cn(
                        "text-[12px] font-black uppercase",
                        activeView === SourceCategory.REPOSITORY
                          ? 'text-primary'
                          : 'text-foreground/20'
                      )}
                    >
                      المكتبة الرقمية
                    </h3>
                  </div>
                </button>
              </section>

              {/* Admin Panel */}
              {isAdmin && (
                <section className="space-y-4 animate-fade-in-up">
                  <div className="px-2 border-r-2 border-primary">
                    <h4 className="text-[10px] font-black text-primary uppercase">
                      لوحة التحكم
                    </h4>
                  </div>

                  <Tabs
                    value={activeAdminTab}
                    onValueChange={setActiveAdminTab}
                    className="w-full"
                  >
                    <TabsList className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-1">
                      <TabsTrigger
                        value={SourceCategory.ADVISOR}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        )}
                      >
                        المستشار
                      </TabsTrigger>
                      <TabsTrigger
                        value={SourceCategory.REPOSITORY}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        )}
                      >
                        المكتبة
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeAdminTab} className="mt-4">
                      <div className="p-4 bg-foreground/5 rounded-2xl border border-foreground/5 space-y-3 text-[11px]">
                        {/* File Upload */}
                        <div
                          onClick={() => fileInputRef?.current?.click()}
                          className="py-6 border-2 border-dashed border-foreground/10 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 transition-all"
                        >
                          <UploadIcon className="w-5 h-5 text-primary" />
                          <span className="text-foreground/60">رفع ملف (PDF/Excel)</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => onFileUpload(e, activeAdminTab)}
                          accept=".pdf,.xlsx,.xls,.txt"
                        />

                        {/* Link Input */}
                        <div className="flex gap-1">
                          <Input
                            type="text"
                            value={activeAdminTab === SourceCategory.ADVISOR ? advLinkInput : repoLinkInput}
                            onChange={(e) =>
                              activeAdminTab === SourceCategory.ADVISOR
                                ? setAdvLinkInput(e.target.value)
                                : setRepoLinkInput(e.target.value)
                            }
                            placeholder="رابط خارجي..."
                            className="flex-1 bg-background/40 border-foreground/10 rounded-lg px-3 py-2 text-[10px]"
                          />
                          <Button
                            onClick={() => onAddLink(activeAdminTab)}
                            variant="neon"
                            size="icon-sm"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Manual Text Button */}
                        <Button
                          onClick={() => onAddManualText(activeAdminTab)}
                          variant="glass"
                          className="w-full text-[10px]"
                        >
                          إضافة نص يدوياً
                        </Button>

                        {/* Sources List */}
                        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                          {sources
                            .filter((s) => s.category === activeAdminTab)
                            .map((s) => (
                              <div
                                key={s.id}
                                className="flex items-center justify-between p-2 bg-background/20 rounded-lg border border-foreground/5"
                              >
                                <div className="flex items-center gap-2">
                                  {getSourceIcon(s.type)}
                                  <span className="truncate flex-1 text-foreground/60 text-[10px]">
                                    {s.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => onRemoveSource(s.id)}
                                  className="text-destructive/40 hover:text-destructive transition-colors"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Clear All Button */}
                  <Button
                    onClick={onClearAllData}
                    variant="outline"
                    className="w-full py-3 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 text-[10px] font-black"
                  >
                    تصفير سجلات المنصة
                  </Button>
                </section>
              )}
            </div>
          </ScrollArea>

          {/* Footer - Admin Toggle */}
          <div className="p-6 border-t border-foreground/5 bg-background/40">
            <Button
              onClick={() => (isAdmin ? setIsAdmin(false) : setShowAdminModal(true))}
              variant="glass"
              className="w-full py-4 text-[11px] font-black"
            >
              <LogoIcon
                className={cn(
                  "w-4 h-4",
                  isAdmin ? 'text-primary animate-pulse' : 'text-foreground/20'
                )}
              />
              {isAdmin ? 'مغادرة الإدارة' : 'دخول الإدارة'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
