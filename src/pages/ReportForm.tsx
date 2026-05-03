/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Route, TriangleAlert, MapPin, Image as ImageIcon, Check, Mic, MicOff, ShieldCheck, Box, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/components/Layout';
import { useLanguage } from '../LanguageContext';
import { useNotifications } from '../NotificationContext';
import { Urgency, ReportStatus } from '../types';

export default function ReportForm() {
  const { t, language } = useLanguage();
  const { addNotification } = useNotifications();
  const [description, setDescription] = useState("There's a large pothole on Oak Street near the primary school. It's causing cars to swerve and seems quite deep.");
  const [category, setCategory] = useState("Road Maintenance");
  const [urgency, setUrgency] = useState(Urgency.MEDIUM_HIGH);
  const [location, setLocation] = useState("342 OAK ST, PRIMARY DISTRICT 4");
  
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(false);
  const [isTokenAcquired, setIsTokenAcquired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportImage, setReportImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAcquireToken = async () => {
    setIsTokenAcquired(true);
    addNotification({
      title: t('token_acquired' as any),
      message: 'CIVIC_TOKEN_018274 has been successfully minted for this report.',
      type: 'success'
    });
  };

  const handleSaveToLedger = async () => {
    if (!isTokenAcquired) return;
    
    setIsSaving(true);
    // Simulate ledger delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Construct new report
    const newReport = {
      id: `REP-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: description.split('.')[0].slice(0, 50) + (description.split('.')[0].length > 50 ? '...' : ''),
      description: description,
      category: category,
      urgency: urgency,
      status: ReportStatus.PENDING,
      location: location,
      time: 'Just now',
      timestamp: new Date().toISOString(),
      image: reportImage,
      iconName: category // Use category mapping
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('civic_reports') || '[]');
    localStorage.setItem('civic_reports', JSON.stringify([newReport, ...existing]));

    setIsSaving(false);
    setIsSubmitted(true);
    
    addNotification({
      title: t('report_submitted' as any),
      message: t('report_message' as any),
      type: 'success'
    });
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language based on app language
      if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
      else if (language === 'kn') recognitionRef.current.lang = 'kn-IN';
      else recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setDescription(transcript);
        setMicError(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError(true);
        }
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const toggleListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setMicError(false);
      try {
        // Explicitly request microphone access first to trigger the browser prompt
        // inside the iframe environment.
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Immediately stop tracks as we only needed it for permission elevation
            stream.getTracks().forEach(track => track.stop());
          } catch (err: any) {
            console.warn('Initial mic permission check failed:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              setMicError(true);
              return;
            }
          }
        }

        if (!recognitionRef.current) {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (!SpeechRecognition) {
            console.error('Speech recognition not supported');
            return;
          }
          
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map((result: any) => result.transcript)
              .join('');
            setDescription(transcript);
            setMicError(false);
          };

          recognitionRef.current.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
              setMicError(true);
            }
            setIsListening(false);
          };
        }

        // Set language based on current selection
        if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
        else if (language === 'kn') recognitionRef.current.lang = 'kn-IN';
        else recognitionRef.current.lang = 'en-US';

        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        console.error('Recognition start error:', e);
        setIsListening(false);
        if (e.name === 'NotAllowedError') {
          setMicError(true);
        }
      }
    }
  };
  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-8"
      >
        <div className="w-24 h-24 border border-emerald-500/20 rounded-full flex items-center justify-center bg-emerald-500/5 relative">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
          <div className="absolute inset-0 border border-emerald-500/40 rounded-full animate-ping opacity-20" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-serif text-white tracking-tight">{t('report_submitted' as any)}</h2>
          <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">{t('report_message' as any)}</p>
        </div>
        <div className="pt-8 grid grid-cols-1 gap-4 w-full max-w-xs">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col items-start gap-2">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Transaction Hash</span>
            <span className="text-[10px] font-mono text-emerald-500/80 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black py-4 rounded-sm font-bold text-[10px] uppercase tracking-[0.3em]"
          >
            Terminal Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12 pb-12"
    >
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em]">
          <span className="text-white/20">Stage 02/03: Details</span>
          <span className="text-white">66%</span>
        </div>
        <div className="h-px w-full bg-white/5">
          <div className="h-full bg-white w-2/3" />
        </div>
      </div>

      {/* Hero Header */}
      <header className="space-y-2">
        <h2 className="text-5xl font-serif text-white tracking-tight leading-tight">Draft a<br/>Complaint</h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold max-w-xs">
          Describe the issue in your own words. Our AI will handle the classification.
        </p>
      </header>

      {/* Description Area */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Issue Description</label>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {micError && (
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-[9px] font-bold text-error uppercase tracking-widest bg-error/10 px-3 py-1.5 rounded-sm border border-error/20"
                >
                  {t('mic_error' as any)}
                </motion.span>
              )}
            </AnimatePresence>
            <button 
              onClick={toggleListening}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[9px] font-bold uppercase tracking-widest",
                isListening 
                  ? "bg-error/10 border-error text-error animate-pulse" 
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
              )}
            >
            {isListening ? (
              <>
                <MicOff className="w-3 h-3" />
                {t('voice_stop' as any)}
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" />
                {t('voice_start' as any)}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="relative group">
        <textarea 
            className="w-full h-48 p-6 bg-surface-container border border-white/5 rounded-sm text-sm font-medium focus:border-white/20 focus:ring-0 outline-none transition-all resize-none shadow-2xl text-white/80"
            placeholder="Initialize report..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-6">
            <button className="bg-white/5 hover:bg-white/10 text-white/40 hover:text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10">
              Process Data
            </button>
            <div className="flex items-center gap-3 text-white/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest italic">Awaiting...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Geospatial Configuration */}
      <div className="border border-white/10 rounded-sm p-8 space-y-8 bg-gradient-to-br from-surface-container to-surface shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 flex items-center gap-2 text-white/10">
           <MapPin className="w-12 h-12" />
        </div>

        <div className="flex items-center gap-3 text-white/60">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Geospatial Extraction</span>
        </div>

        <section className="space-y-6">
           <div className="space-y-4">
             <label className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em]">Target Location Coordinates</label>
             <div className="flex gap-3">
               <div className="relative flex-1">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                 <input 
                  type="text" 
                  className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-xs font-bold text-white tracking-widest focus:border-white/30 outline-none"
                  placeholder="SEARCH ON GOOGLE MAPS..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                 />
               </div>
               <button 
                 onClick={() => alert("Initializing Google Maps API Protocol...")}
                 className="bg-white/5 border border-white/10 p-4 rounded-sm hover:bg-white/10 hover:text-white transition-all text-white/60"
               >
                 <Route className="w-4 h-4" />
               </button>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-6 relative z-10">
             <div className="space-y-2">
               <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold leading-none">AI Classification</span>
               <select 
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 className="w-full bg-surface-container border border-white/5 rounded-sm p-3 text-[10px] font-bold text-white/80 uppercase tracking-widest outline-none focus:border-white/20 transition-all cursor-pointer appearance-none"
               >
                 <option value="Road Maintenance">Road Maintenance</option>
                 <option value="Sanitation">Sanitation</option>
                 <option value="Water Works">Water Works</option>
                 <option value="Public Safety">Public Safety</option>
                 <option value="Environment">Environment</option>
               </select>
             </div>
             <div className="space-y-2">
               <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold leading-none">Urgency Protocol</span>
               <select 
                 value={urgency}
                 onChange={(e) => setUrgency(e.target.value as Urgency)}
                 className="w-full bg-surface-container border border-white/5 rounded-sm p-3 text-[10px] font-bold text-amber-500 uppercase tracking-widest outline-none focus:border-white/20 transition-all cursor-pointer appearance-none"
               >
                 <option value={Urgency.LOW}>Standard (Low)</option>
                 <option value={Urgency.MEDIUM}>Medium</option>
                 <option value={Urgency.MEDIUM_HIGH}>Medium-High</option>
                 <option value={Urgency.HIGH}>High</option>
                 <option value={Urgency.CRITICAL}>Critical / Emergency</option>
               </select>
             </div>
           </div>
        </section>

        <div className="pt-4 border-t border-white/5">
           <p className="text-[10px] text-white/20 italic font-medium tracking-tight">
             Coordinates are auto-verified against the civic spatial ledger. Manual override enabled for this session.
           </p>
        </div>
      </div>

      {/* Visual Context */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] px-1">Visual Evidence</label>
        <div className="group relative h-64 rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-surface-container flex items-center justify-center">
          {reportImage ? (
            <>
              <img 
                src={reportImage} 
                alt="Report Evidence" 
                className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="bg-surface/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
                  <ImageIcon className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">Metadata: Evidence_Log.png</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <button 
                  onClick={() => setReportImage(null)}
                  className="p-3 bg-error/20 border border-error/40 rounded-full text-error hover:bg-error transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-6 group/btn"
            >
              <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center bg-white/5 group-hover/btn:bg-white/10 group-hover/btn:border-white/20 transition-all">
                <Upload className="w-6 h-6 text-white/20 group-hover/btn:text-white/60 transition-all" />
              </div>
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block">Select Optical Capture</span>
                <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest block">Supports PNG, JPG, RAW</span>
              </div>
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-8 flex flex-col gap-4">
        <button 
          onClick={handleAcquireToken}
          disabled={isTokenAcquired}
          className={cn(
            "w-full py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3",
            isTokenAcquired 
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
              : "bg-white text-black hover:bg-white/90"
          )}
        >
          {isTokenAcquired ? (
            <>
              <Check className="w-4 h-4" />
              {t('token_acquired' as any)}
            </>
          ) : (
            <>
              <Box className="w-4 h-4" />
              {t('acquire_token' as any)}
            </>
          )}
        </button>
        <button 
          onClick={handleSaveToLedger}
          disabled={!isTokenAcquired || isSaving}
          className={cn(
            "w-full border py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.3em] active:scale-[0.98] transition-all flex items-center justify-center gap-3",
            !isTokenAcquired 
              ? "bg-transparent text-white/10 border-white/5 cursor-not-allowed" 
              : isSaving
                ? "bg-white/10 text-white border-white/20"
                : "bg-transparent text-white/40 border-white/10 hover:text-white hover:bg-white/5"
          )}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              {t('saving' as any)}
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              {t('save_ledger' as any)}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ExtractionItem({ label, icon: Icon, value, highlight, full }: any) {
  return (
    <div className={cn(
      "border-b border-white/5 pb-4 space-y-2",
      full && "col-span-2"
    )}>
      <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold leading-none">{label}</span>
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", highlight === 'amber' ? "text-amber-500/60" : "text-white/20")} />
        <span className={cn("text-xs font-bold uppercase tracking-widest", highlight === 'amber' ? "text-amber-500" : "text-white/80")}>
          {value}
        </span>
      </div>
    </div>
  );
}
