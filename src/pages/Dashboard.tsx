/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingDown, Star, Map as MapIcon, Trash2, Construction, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/src/components/Layout';
import { useLanguage } from '../LanguageContext';

const ENTRIES = [
  { id: 1, title: "Street Light Failure", time: "2m", location: "North District, Sector 4B", category: "Infrastructure" },
  { id: 2, title: "Water Leakage", time: "15m", location: "South Point Apartments", category: "Infrastructure" },
  { id: 3, title: "Sewer Blockage", time: "45m", location: "East Industrial Zone", category: "Sanitation" },
  { id: 4, title: "Public Hazard", time: "1h", location: "Central Plaza", category: "Safety" },
];

const CITIZENS = [
  { id: "C-101", name: "J. VALDEZ", score: 98, status: "ELITE" },
  { id: "C-102", name: "A. CHEN", score: 85, status: "RELIABLE" },
  { id: "C-103", name: "M. ROSSI", score: 42, status: "VOLATILE" },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [citizenRatings, setCitizenRatings] = useState(CITIZENS);

  const handleRate = (id: string, delta: number) => {
    setCitizenRatings(prev => prev.map(c => 
      c.id === id ? { ...c, score: Math.min(100, Math.max(0, c.score + delta)) } : c
    ));
  };

  const filteredEntries = activeFilter 
    ? ENTRIES.filter(e => e.category === activeFilter)
    : ENTRIES;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-12"
    >
      {/* Header */}
      <section className="space-y-2">
        <h2 className="text-5xl font-serif tracking-tight text-on-surface/90">{t('dashboard')}</h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface/40 font-bold">{t('analytics')}</p>
      </section>

      {/* Metrics Bento Grid */}
      <section className="grid grid-cols-2 gap-6">
        <div className="col-span-2 bg-gradient-to-br from-surface-container-high to-surface border border-on-surface/10 p-8 rounded-sm relative overflow-hidden h-44 flex flex-col justify-between shadow-2xl">
          <div>
            <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-[0.3em]">{t('active_tickets')}</span>
            <p className="text-6xl font-serif text-on-surface mt-4">1,284</p>
          </div>
          <div className="flex items-center gap-3 text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">4.2% yield from last week</span>
          </div>
          <TrendingDown className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 text-on-surface rotate-12" />
        </div>

        <div className="bg-surface-container border border-on-surface/5 p-6 rounded-sm space-y-4">
          <span className="text-[10px] font-bold text-on-surface/30 uppercase tracking-[0.2em]">Avg. Resolution</span>
          <p className="text-3xl font-serif text-on-surface">3.4d</p>
          <div className="h-0.5 bg-on-surface/5 overflow-hidden">
            <div className="h-full bg-on-surface/40 w-3/4" />
          </div>
        </div>

        <div className="bg-surface-container border border-on-surface/5 p-6 rounded-sm space-y-4">
          <span className="text-[10px] font-bold text-on-surface/30 uppercase tracking-[0.2em]">Citizen Rating</span>
          <p className="text-3xl font-serif text-on-surface">4.8/5</p>
          <div className="flex gap-1 text-on-surface/80">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("w-3.5 h-3.5", i === 5 ? "opacity-20" : "fill-current")} />)}
          </div>
        </div>
      </section>

      {/* Density Map Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="font-serif text-xl text-on-surface/80">{t('map_view')}</h2>
          <MapIcon className="w-5 h-5 text-on-surface/20" />
        </div>
        <div className="h-64 relative rounded-sm overflow-hidden border border-on-surface/10 bg-surface-container-high shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070&auto=format&fit=crop" 
            alt="Exact Shivamogga Satellite Map" 
            className="w-full h-full object-cover opacity-60 contrast-125 transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
          
          {/* Live Data Markers */}
          <div className="absolute inset-0 pointer-events-none">
             {/* High Density */}
             <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-error shadow-[0_0_20px_rgba(255,77,77,1)] animate-pulse" />
             <div className="absolute top-[28%] left-[35%] w-12 h-12 rounded-full border border-error/20 animate-ping opacity-20" />
             
             {/* Medium Density */}
             <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
             <div className="absolute top-1/2 right-[15%] w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
             
             {/* Low Density */}
             <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-on-surface/40 shadow-[0_0_10px_on-surface/20]" />
             <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-on-surface/40 shadow-[0_0_10px_on-surface/20]" />
          </div>
          
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
            <Legend badgeColor="bg-error shadow-[0_0_10px_rgba(255,77,77,0.5)]" label="Critical Density" />
            <Legend badgeColor="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" label="Moderate Flow" />
            <Legend badgeColor="bg-on-surface/20" label="Sparse Activity" />
          </div>
        </div>
      </section>

      {/* Departmental Breakdown */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <h3 className="font-serif text-xl text-white/80">Departmental Ledger</h3>
          <button 
            onClick={() => setActiveFilter(null)}
            className="text-[10px] uppercase tracking-widest text-white/40 font-bold hover:text-white transition-colors"
          >
            Reset Focus
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CategoryCard 
            icon={Trash2} 
            name="Sanitation" 
            count={432} 
            status="CRITICAL" 
            statusColor="error" 
            active={activeFilter === 'Sanitation'}
            onClick={() => setActiveFilter('Sanitation')}
          />
          <CategoryCard 
            icon={Construction} 
            name="Infrastructure" 
            count={215} 
            status="STABLE" 
            statusColor="white/40" 
            active={activeFilter === 'Infrastructure'}
            onClick={() => setActiveFilter('Infrastructure')}
          />
          <CategoryCard 
            icon={ShieldCheck} 
            name="Safety" 
            count={98} 
            status="PENDING" 
            statusColor="amber" 
            active={activeFilter === 'Safety'}
            onClick={() => setActiveFilter('Safety')}
          />
        </div>
      </section>

      {/* Journal Entries */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-serif text-xl text-white/80">Journal Entries</h3>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{filteredEntries.length} Records</span>
        </div>
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <ActivityItem title={entry.title} time={entry.time} location={entry.location} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredEntries.length === 0 && (
            <div className="p-12 text-center border border-white/5 bg-white/[0.01]">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">No matching records in current ledger</p>
            </div>
          )}
        </div>
      </section>

      {/* Citizen Rating Ledger */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <h3 className="font-serif text-xl text-white/80">Citizen Rating Ledger</h3>
          <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Grade individual contributors</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {citizenRatings.map((citizen) => (
            <div key={citizen.id} className="bg-surface-container border border-white/5 p-4 flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/20">
                  {citizen.id}
                </div>
                <div>
                   <p className="text-xs font-bold text-white tracking-widest">{citizen.name}</p>
                   <p className={cn("text-[9px] font-bold tracking-widest mt-0.5", 
                    citizen.status === 'ELITE' ? "text-green-500" : 
                    citizen.status === 'RELIABLE' ? "text-white/40" : "text-error"
                   )}>{citizen.status}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xl font-serif text-white">{citizen.score}</p>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Protocol Score</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleRate(citizen.id, -5)}
                    className="p-2 border border-white/5 hover:bg-error/10 hover:border-error/20 text-white/20 hover:text-error transition-all rounded-sm"
                  >
                    <TrendingDown className="w-3 h-3 rotate-180" />
                  </button>
                  <button 
                    onClick={() => handleRate(citizen.id, 5)}
                    className="p-2 border border-white/5 hover:bg-green-500/10 hover:border-green-500/20 text-white/20 hover:text-green-500 transition-all rounded-sm"
                  >
                    <Star className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function Legend({ badgeColor, label }: { badgeColor: string, label: string }) {
  return (
    <div className="bg-surface-container/80 backdrop-blur-md px-3 py-1.5 rounded-sm text-[10px] font-bold border border-white/5 flex items-center gap-2 shadow-xl">
      <div className={cn("w-1.5 h-1.5 rounded-full", badgeColor)} /> 
      <span className="uppercase tracking-[0.1em] text-white/60">{label}</span>
    </div>
  );
}

function CategoryCard({ icon: Icon, name, count, status, statusColor, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-surface-container border p-6 rounded-sm flex items-center justify-between hover:bg-surface-container-high transition-all group w-full text-left",
        active ? "border-white/40 bg-white/[0.02]" : "border-white/5"
      )}
    >
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
          active ? "border-white text-white" : "border-white/10 text-white/20 group-hover:text-white group-hover:border-white/40"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-white text-sm uppercase tracking-widest">{name}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{count} open cases</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={cn("text-[10px] font-bold tracking-[0.2em] px-3 py-1 border rounded-full", 
          statusColor === 'error' ? "border-error text-error" : 
          statusColor === 'amber' ? "border-amber-500/50 text-amber-500" : 
          "border-white/10 text-white/40")}>
          {status}
        </span>
        <ChevronRight className={cn("w-4 h-4 transition-transform", active ? "rotate-90 text-white" : "text-white/10")} />
      </div>
    </button>
  );
}

function ActivityItem({ title, time, location }: { title: string, time: string, location: string }) {
  return (
    <div className="p-4 border-b border-white/5 flex gap-6 items-center hover:bg-white/[0.02] transition-colors group">
      <span className="text-[10px] font-bold text-white/20 group-hover:text-white transition-colors w-12">{time}</span>
      <div className="flex-1 min-w-0">
        <span className="font-bold text-white text-xs uppercase tracking-widest">{title}</span>
        <p className="text-[10px] text-white/30 truncate mt-1 uppercase tracking-tighter">{location}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/10" />
    </div>
  );
}
