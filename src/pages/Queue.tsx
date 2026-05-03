/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter, Droplets, Lightbulb, TreePine, MapPinned, MoreHorizontal, ChevronRight, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Urgency } from '@/src/types';
import { cn } from '@/src/components/Layout';
import { Link } from 'react-router-dom';

const INITIAL_REPORTS = [
  {
    id: 'REP-8291',
    title: 'Burst main water pipe on Elm St',
    description: 'Significant water leakage on the main junction, causing traffic congestion and potential basement flooding in nearby houses.',
    category: 'Water Works',
    urgency: Urgency.HIGH,
    time: '2m ago',
    iconName: 'Droplets',
    color: 'red'
  },
  {
    id: 'REP-8288',
    title: 'Damaged streetlight in Riverside Park',
    description: 'Lamp post #42 near the entrance is flickering and occasionally completely dark, making the walkway unsafe after sunset.',
    category: 'Public Safety',
    urgency: Urgency.MEDIUM,
    time: '15m ago',
    iconName: 'Lightbulb',
    color: 'amber'
  },
  {
    id: 'REP-8285',
    title: 'Overgrown park shrubbery',
    description: 'The bushes along the cycling path near 5th and Main are beginning to obstruct the lane markers and need trimming.',
    category: 'Environment',
    urgency: Urgency.LOW,
    time: '1h ago',
    iconName: 'TreePine',
    color: 'green'
  }
];

const ICON_MAP: Record<string, any> = {
  'Droplets': Droplets,
  'Lightbulb': Lightbulb,
  'TreePine': TreePine,
  'MapPinned': MapPinned,
  'Trash2': Trash2,
  'AlertTriangle': AlertTriangle,
  'Water Works': Droplets,
  'Public Safety': ShieldCheckIcon,
  'Road Maintenance': AlertTriangle,
  'Sanitation': Trash2,
  'Environment': TreePine
};

// Helper for dynamic icons
function ShieldCheckIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>; }

export default function Queue() {
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const localReports = JSON.parse(localStorage.getItem('civic_reports') || '[]');
    setReports([...localReports, ...INITIAL_REPORTS]);
  }, []);

  const filteredReports = reports.filter(report => {
    if (filter === 'All') return true;
    if (filter === 'Urgency: High') return report.urgency === Urgency.HIGH;
    if (filter === 'Sanitation') return report.category === 'Sanitation' || report.category === 'Waste Management';
    if (filter === 'Roads & Infrastructure') return report.category === 'Water Works' || report.category === 'Road Maintenance';
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <header className="space-y-3">
        <h2 className="text-5xl font-serif text-white/90 tracking-tight">Queue</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Field review of active citizen reports</p>
      </header>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
        <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} icon={Filter} label="All Reports" />
        <FilterButton active={filter === 'Urgency: High'} onClick={() => setFilter('Urgency: High')} label="Urgency: High" />
        <FilterButton active={filter === 'Roads & Infrastructure'} onClick={() => setFilter('Roads & Infrastructure')} label="Roads & Infrastructure" />
        <FilterButton active={filter === 'Sanitation'} onClick={() => setFilter('Sanitation')} label="Sanitation" />
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <Link key={report.id} to={`/queue/${report.id}`} className="block">
            <ReportCard {...report} />
          </Link>
        ))}
      </div>

      <Link to="/report" className="fixed right-8 bottom-32 w-16 h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 border-4 border-black ring-1 ring-white/10">
        <Plus className="w-6 h-6" />
      </Link>
    </motion.div>
  );
}

function FilterButton({ label, icon: Icon, active, onClick }: { label: string, icon?: any, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] uppercase font-bold tracking-[0.2em] transition-all",
        active ? "bg-white text-black" : "bg-surface-container border border-white/10 text-white/40 hover:text-white hover:border-white/30"
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

function ReportCard({ id, title, description, category, urgency, time, iconName, color, image }: any) {
  const Icon = ICON_MAP[iconName] || ICON_MAP[category] || AlertTriangle;
  
  const urgencyColors: Record<string, string> = {
    red: "border-error text-error",
    amber: "border-amber-500/50 text-amber-500",
    green: "border-green-500/50 text-green-500"
  };

  return (
    <div className="bg-surface-container border border-white/10 p-6 rounded-sm hover:bg-surface-container-high transition-all group cursor-pointer shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <span className={cn("px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-[0.2em]", urgencyColors[color] || urgencyColors.amber)}>
            {urgency} Priority
          </span>
          <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-none">{id}</span>
        </div>
        <span className="text-white/20 text-[10px] font-bold uppercase">{time}</span>
      </div>
      
      <div className="flex gap-6 items-start mb-6">
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
          <p className="text-xs text-white/40 leading-relaxed max-w-md line-clamp-2">{description}</p>
        </div>
        {image && (
          <div className="w-20 h-20 rounded-sm border border-white/10 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
            <img src={image} className="w-full h-full object-cover" alt="Evidence" />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 border border-white/5 px-4 py-1.5 rounded-full text-white/40">
          <Icon className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{category}</span>
        </div>
        
        {color === 'red' ? (
          <div className="flex -space-x-3">
            {[1, 2].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-white/40">+2</div>
          </div>
        ) : (
          <MoreHorizontal className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
        )}
      </div>
    </div>
  );
}

// Minimal Icons for inside card details
function Trash2Icon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>; }
function PlusIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>; }
