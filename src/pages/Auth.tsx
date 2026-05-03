/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Languages } from 'lucide-react';
import { cn } from '@/src/components/Layout';
import { useLanguage } from '../LanguageContext';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!validateEmail(email)) {
      setError("INVALID AUTHENTICATION PROTOCOL: EMAIL_FORMAT_ERROR");
      setLoading(false);
      return;
    }

    if (mode !== 'forgot' && password.length < 6) {
      setError("SECURITY BREACH: PASSWORD_LENGTH_INSUFFICIENT");
      setLoading(false);
      return;
    }

    if (mode === 'forgot') {
      alert("Recovery protocol initiated. Check your civic link.");
      setMode('login');
    } else {
      localStorage.setItem('civic_user_email', email);
      if (mode === 'signup' && name) {
        localStorage.setItem('civic_user_name', name);
      } else if (mode === 'login' && !localStorage.getItem('civic_user_name')) {
        // Fallback name if logging in without prior signup in this session
        localStorage.setItem('civic_user_name', email.split('@')[0]);
      }
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-error/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* Language Switcher Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {['en', 'hi', 'kn'].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang as any)}
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border",
              language === lang 
                ? "bg-white text-black border-white" 
                : "bg-black/40 text-white/30 border-white/10 hover:border-white/40"
            )}
          >
            {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'KN'}
          </button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-serif text-white tracking-tight">CivicConnect Auth</h1>
          <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.4em]">Unified Spatial Ledger Protocol</p>
        </div>

        <div className="bg-surface-container border border-white/5 rounded-sm p-8 shadow-2xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.form 
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">{t('name_label')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-xs font-bold text-white tracking-widest focus:border-white/30 outline-none transition-all"
                      placeholder="ENTER LEGAL NAME..."
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">{t('email_label')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-xs font-bold text-white tracking-widest focus:border-white/30 outline-none transition-all"
                    placeholder="ENTER E-MAIL..."
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">{t('password_label')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-xs font-bold text-white tracking-widest focus:border-white/30 outline-none transition-all"
                      placeholder="ENTER PASSWORD..."
                    />
                  </div>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-sm"
                >
                  <AlertCircle className="w-4 h-4 text-error" />
                  <span className="text-[9px] font-bold text-error uppercase tracking-widest">{error}</span>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-5 rounded-sm font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? t('validate') : mode === 'signup' ? t('initialize') : 'Reset Protocol'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="pt-6 border-t border-white/5 flex flex-col gap-4 text-center">
            {mode === 'login' ? (
              <>
                <button 
                  onClick={() => setMode('forgot')}
                  className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                >
                  {t('forgot_password')}
                </button>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                  No Account? 
                  <button 
                    onClick={() => setMode('signup')}
                    className="ml-2 text-white/60 hover:text-white transition-colors"
                  >
                    {t('signup_prompt')}
                  </button>
                </p>
              </>
            ) : (
              <button 
                onClick={() => setMode('login')}
                className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
              >
                Return to Access Port
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[9px] text-white/10 uppercase tracking-[0.5em]">Secure Terminal • No. 425763582247</p>
      </motion.div>
    </div>
  );
}
