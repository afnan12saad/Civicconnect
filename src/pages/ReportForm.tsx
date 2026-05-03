/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Route, TriangleAlert, MapPin, Image as ImageIcon, Check, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/components/Layout';
import { useLanguage } from '../LanguageContext';

export default function ReportForm() {
  const { t, language } = useLanguage();
  const [description, setDescription] = useState("There's a large pothole on Oak Street near the primary school. It's causing cars to swerve and seems quite deep.");
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(false);
  const recognitionRef = useRef<any>(null);

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
                  defaultValue="342 OAK ST, PRIMARY DISTRICT 4"
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
               <select className="w-full bg-surface-container border border-white/5 rounded-sm p-3 text-[10px] font-bold text-white/80 uppercase tracking-widest outline-none focus:border-white/20 transition-all cursor-pointer appearance-none">
                 <option>Road Maintenance</option>
                 <option>Sanitation</option>
                 <option>Water Works</option>
                 <option>Public Safety</option>
               </select>
             </div>
             <div className="space-y-2">
               <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold leading-none">Urgency Protocol</span>
               <select className="w-full bg-surface-container border border-white/5 rounded-sm p-3 text-[10px] font-bold text-amber-500 uppercase tracking-widest outline-none focus:border-white/20 transition-all cursor-pointer appearance-none">
                 <option>Medium-High</option>
                 <option>Critical</option>
                 <option>Emergency</option>
                 <option>Standard</option>
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
      <div className="group relative h-64 rounded-sm overflow-hidden border border-white/10 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop" 
          alt="Pothole Close-up" 
          className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 bg-surface/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
          <ImageIcon className="w-4 h-4 text-white/40" />
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Metadata: Pothole_Capture_01.jpg</span>
          <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-8 flex flex-col gap-4">
        <button className="w-full bg-white text-black py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-white/90 active:scale-[0.98] transition-all">
          Acquire Asset Token
        </button>
        <button className="w-full bg-transparent text-white/40 border border-white/10 py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.3em] hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all">
          Save to Ledger
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
