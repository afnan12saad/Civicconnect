/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edit2, Verified, FileText, CheckCircle, User, BellRing, ShieldCheck, HelpCircle, LogOut, ChevronRight, Camera, Mail, Phone, UserCircle, Calendar, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/src/components/Layout';
import { useLanguage } from '../LanguageContext';
import { Language } from '../translations';

export default function Profile({ onLogout }: { onLogout: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [showIdentity, setShowIdentity] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop");

  const [userName, setUserName] = useState("Alex Rivera");
  const [isEditingName, setIsEditingName] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-12"
    >
      {/* Profile Header */}
      <section className="bg-surface-container border border-white/5 p-12 rounded-sm flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <div className="px-4 py-1.5 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white/40">
            Rank: Gold
          </div>
        </div>

        <div className="relative group">
          <div className="w-40 h-40 rounded-full border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/20 bg-black/40 flex items-center justify-center">
            {profilePic ? (
              <img 
                src={profilePic} 
                alt={userName} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-white/10 group-hover:text-white/40 transition-all" />
            )}
          </div>
          <label className="absolute bottom-2 right-2 bg-white text-black p-3 rounded-full border-4 border-surface shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
            <Camera className="w-4 h-4" />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="text-center space-y-3">
          {isEditingName ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="bg-black/40 border border-white/20 rounded-sm text-3xl font-serif text-white tracking-tight px-6 py-2 focus:border-white/40 outline-none text-center"
                autoFocus
              />
              <button 
                onClick={() => setIsEditingName(false)}
                className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold hover:text-white transition-colors"
              >
                {t('save')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 group/name">
              <h1 className="text-5xl font-serif text-white tracking-tight">{userName}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover/name:opacity-100 transition-all p-2 hover:bg-white/10 rounded-full"
              >
                <Edit2 className="w-4 h-4 text-white/40" />
              </button>
            </div>
          )}
          <div className="inline-flex items-center gap-2 text-white/30">
            <Verified className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t('verified')}</span>
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="bg-surface-container border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <MenuItem 
          icon={Languages} 
          label={t('language')} 
          active={showLanguages}
          onClick={() => setShowLanguages(!showLanguages)}
        />
        <AnimatePresence>
          {showLanguages && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white/[0.01] border-b border-white/5"
            >
              <div className="p-4 grid grid-cols-3 gap-4">
                <LanguageButton 
                  lang="en" 
                  current={language} 
                  onClick={() => setLanguage('en')} 
                  label="English" 
                />
                <LanguageButton 
                  lang="hi" 
                  current={language} 
                  onClick={() => setLanguage('hi')} 
                  label="हिंदी (Hindi)" 
                />
                <LanguageButton 
                  lang="kn" 
                  current={language} 
                  onClick={() => setLanguage('kn')} 
                  label="ಕನ್ನಡ (Kannada)" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Account Statistics */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] px-1">{t('recent_activity')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard icon={FileText} label="Reports Filed" value="12" color="blue" />
          <StatCard icon={CheckCircle} label="Issues Resolved" value="08" color="emerald" />
        </div>
      </section>

      {/* Menu Options */}
      <section className="bg-surface-container border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <div className="space-y-0">
          <MenuItem 
            icon={User} 
            label={t('identity')} 
            active={showIdentity}
            onClick={() => setShowIdentity(!showIdentity)}
          />
          <AnimatePresence>
            {showIdentity && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white/[0.01] border-b border-white/5"
              >
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <IdentityField icon={Mail} label="Contact Email" value="alex.rivera@protocol.sys" />
                  <IdentityField icon={Phone} label="Terminal Phone" value="+1 (555) 012-9844" />
                  <IdentityField icon={UserCircle} label="Biological Gender" value="Male / Identity X" />
                  <IdentityField icon={Calendar} label="Epoch Age" value="28 Cycles" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <MenuItem icon={BellRing} label="Alert Protocols" />
          <MenuItem icon={ShieldCheck} label="Encryption & Keys" />
          <MenuItem icon={HelpCircle} label="Support Nexus" last />
        </div>
      </section>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full py-5 flex items-center justify-center gap-4 bg-transparent border border-error/20 text-error font-bold rounded-sm uppercase tracking-[0.3em] text-[10px] hover:bg-error/5 active:scale-[0.99] transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('logout')}</span>
      </button>
    </motion.div>
  );
}

function LanguageButton({ lang, current, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-4 px-2 rounded-sm border transition-all text-[10px] font-bold uppercase tracking-widest",
        current === lang 
          ? "bg-white text-black border-white" 
          : "bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function IdentityField({ icon: Icon, label, value }: any) {
  return (
    <div className="space-y-2 border-l border-white/10 pl-6">
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{label}</span>
      <div className="flex items-center gap-3">
        <Icon className="w-3 h-3 text-white/40" />
        <span className="text-xs font-bold text-white/80 tracking-widest">{value}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-surface-container border border-white/5 p-8 rounded-sm flex items-center gap-8 shadow-2xl group hover:bg-surface-container-high transition-colors">
      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white transition-all shadow-xl">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] leading-none">{label}</p>
        <p className="text-4xl font-serif text-white mt-3">{value}</p>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, last, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group text-left",
        !last && "border-b border-white/5",
        active && "bg-white/[0.02]"
      )}
    >
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-10 h-10 rounded-full border flex items-center justify-center transition-colors",
          active ? "border-white text-white" : "border-white/5 text-white/20 group-hover:text-white"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={cn(
          "text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
          active ? "text-white" : "text-white/60 group-hover:text-white"
        )}>{label}</span>
      </div>
      <ChevronRight className={cn(
        "w-4 h-4 text-white/10 transition-all",
        active ? "rotate-90 text-white" : "opacity-40 group-hover:opacity-100 group-hover:translate-x-1"
      )} />
    </button>
  );
}
