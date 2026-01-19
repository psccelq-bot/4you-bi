import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoIcon } from '@/components/icons';
import { ADMIN_PASSWORD } from '@/data/mockData';

const AdminModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      onLogin();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-3xl p-6 animate-fade-in-up">
      <div className="bg-card w-full max-w-sm rounded-[3rem] shadow-elevated border border-foreground/5 overflow-hidden">
        {/* Header */}
        <div className="bg-royal-night p-10 text-center border-b border-foreground/5">
          <div className="w-20 h-20 bg-foreground/5 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-foreground/10">
            <LogoIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground/90">بوابة الأمان</h2>
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] mt-1">
            Management Access Only
          </p>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-6 bg-background/40 border rounded-2xl outline-none",
              "text-center text-3xl font-black text-primary",
              "focus:border-primary focus:ring-1 focus:ring-primary/30",
              "placeholder:text-foreground/10",
              error
                ? 'border-destructive animate-shake-light'
                : 'border-foreground/10'
            )}
            placeholder="••••"
            autoFocus
          />

          {error && (
            <p className="text-center text-destructive text-sm font-bold animate-fade-in-up">
              كلمة المرور غير صحيحة
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="glass"
              className="flex-1 py-4 text-xs uppercase"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              variant="premium"
              className="flex-[2] py-4 text-xs uppercase"
            >
              تأكيد
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
