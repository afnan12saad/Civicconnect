/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusSquare, User, Building2, Bell, Check, Trash2, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

/** Utility for combining tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useLanguage } from '../LanguageContext';
import { useNotifications, Notification } from '../NotificationContext';

export default function Layout() {
  const { t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-surface border-b border-outline z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">CC</span>
          </div>
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">CivicConnect</h1>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 rounded-full transition-all relative z-[70]",
              showNotifications ? "bg-white/10" : "hover:bg-white/5"
            )}
          >
            <Bell className={cn("w-5 h-5 transition-colors", unreadCount > 0 ? "text-white" : "text-white/40")} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-error text-[7px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-surface">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-4 w-80 bg-surface-container border border-white/10 rounded-sm shadow-2xl overflow-hidden z-[60]"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Civic Alerts</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[9px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">System idle</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {notifications.map((n) => (
                        <NotificationItem 
                          key={n.id} 
                          notification={n} 
                          onRead={() => markAsRead(n.id)}
                          onRemove={() => removeNotification(n.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

function NotificationItem({ notification, onRead, onRemove }: { 
  notification: Notification; 
  onRead: () => void; 
  onRemove: () => void;
  key?: string | number;
}) {
  const Icon = notification.type === 'success' ? Check : 
               notification.type === 'warning' ? AlertTriangle : 
               notification.type === 'error' ? AlertCircle : Info;

  const colorClass = notification.type === 'success' ? 'text-emerald-500' : 
                     notification.type === 'warning' ? 'text-amber-500' : 
                     notification.type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div className={cn(
      "p-4 transition-colors group relative",
      notification.read ? "bg-transparent opacity-60" : "bg-white/[0.02]"
    )}>
      <div className="flex gap-4">
        <div className={cn("mt-1", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{notification.title}</h4>
            <span className="text-[8px] font-bold text-white/20 uppercase">{notification.time}</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">{notification.message}</p>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button onClick={onRead} className="p-1 hover:bg-white/10 rounded-sm text-white/40 hover:text-white">
            <Check className="w-3 h-3" />
          </button>
        )}
        <button onClick={onRemove} className="p-1 hover:bg-white/10 rounded-sm text-white/40 hover:text-white">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
