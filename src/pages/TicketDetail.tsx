/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, MapPin, TriangleAlert, Box, ChevronRight, HardHat, Camera, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/components/Layout';

export default function TicketDetail() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12 pb-12"
    >
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/queue')}
        className="flex items-center gap-3 group text-white/40 hover:text-white transition-all font-bold uppercase tracking-[0.2em] text-[10px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Vault</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-surface-container border border-white/5 p-8 rounded-sm shadow-2xl space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif text-white tracking-tight">Entry #CC-8291</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Logged OCT 24, 2023 • 09:14 AM</p>
          </div>
          <div className="border border-error text-error px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Critical Priority</span>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-56 bg-surface-container-high rounded-sm overflow-hidden border border-white/5 group">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?q=80&w=2070&auto=format&fit=crop" 
            alt="Ticket location map" 
            className="w-full h-full object-cover grayscale opacity-20 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white text-black p-4 rounded-full shadow-2xl ring-1 ring-white/20">
              <MapPin className="w-6 h-6 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Original Report */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Transcript</h3>
        <div className="bg-surface-container border border-white/5 p-8 rounded-sm italic text-white/60 leading-relaxed text-sm antialiased shadow-2xl font-serif">
          "There is a massive sinkhole forming right in the middle of the bike lane on Oak Street, just past the intersection with 5th. It's almost 2 feet wide and very deep. I almost crashed my bike this morning. It looks like a water main might be leaking underneath because the pavement around it is saturated."
        </div>
      </section>

      {/* Structured Data */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Metadata Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataItem icon={Box} label="Classification" value="Pavement / Road Safety" />
          <DataItem icon={TriangleAlert} label="Urgency" value="Immediate Action" color="error" />
          <DataItem icon={MapPin} label="Coordinates" value="342 Oak St (Bike Lane Westbound), District 4" />
        </div>
      </section>

      {/* Suggested Actions */}
      <section className="space-y-6 pt-4">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Directives</h3>
        <div className="grid grid-cols-1 gap-4">
          <ActionButton primary icon={HardHat} label="Initiate Repair Protocol" />
          <ActionButton secondary icon={Camera} label="Request Visual Metadata" />
          <ActionButton ghost icon={ShieldAlert} label="Escalate to Command" />
        </div>
      </section>
    </motion.div>
  );
}

function DataItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-surface-container border border-white/5 p-6 rounded-sm flex items-start gap-6 hover:bg-surface-container-high transition-all">
      <div className={cn("mt-1", color === 'error' ? "text-error" : "text-white/20")}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-2">
        <p className="text-[9px] uppercase font-bold text-white/30 tracking-[0.2em] leading-none">{label}</p>
        <p className={cn("text-xs font-bold uppercase tracking-widest antialiased leading-tight", color === 'error' ? "text-error" : "text-white/80")}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionButton({ primary, secondary, ghost, icon: Icon, label }: any) {
  return (
    <button className={cn(
      "w-full px-8 py-5 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-between transition-all active:scale-[0.98]",
      primary && "bg-white text-black shadow-2xl shadow-white/5 hover:bg-white/90",
      secondary && "bg-transparent border border-white/20 text-white hover:bg-white/5",
      ghost && "bg-transparent text-white/40 hover:text-white"
    )}>
      <div className="flex items-center gap-4">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-30" />
    </button>
  );
}
