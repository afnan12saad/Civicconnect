/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusSquare, User, Building2, Bell } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for combining tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useLanguage } from '../LanguageContext';

export default function Layout() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-surface border-b border-outline z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold">CC</span>
          </div>
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">CivicConnect</h1>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-16 pb-24">
        <div className="max-w-2xl mx-auto w-full p-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface border-t border-outline flex items-center justify-around px-4">
        <NavButton to="/" icon={LayoutDashboard} label={t('dashboard')} />
        <NavButton to="/queue" icon={ListTodo} label={t('queue')} />
        <NavButton to="/report" icon={PlusSquare} label={t('report')} />
        <NavButton to="/profile" icon={User} label={t('profile')} />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

function NavButton({ to, icon: Icon, label }: NavButtonProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-full py-2 gap-1.5 transition-all duration-300 rounded-sm relative",
          isActive ? "text-white" : "text-white/30 hover:text-white/60"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{label}</span>
          <div className={cn(
            "absolute -bottom-4 w-8 h-px bg-white transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0"
          )} />
        </>
      )}
    </NavLink>
  );
}
