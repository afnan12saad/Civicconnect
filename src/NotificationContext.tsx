/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('civic_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'System Access Granted',
        message: 'Your biometric signature has been validated for Sector 7.',
        time: '2m ago',
        read: false,
        type: 'success'
      },
      {
        id: '2',
        title: 'Report Update',
        message: 'The issue "Oak St Pothole" has been moved to "Scheduled".',
        time: '1h ago',
        read: false,
        type: 'info'
      },
      {
        id: '3',
        title: 'Civic Duty Alert',
        message: 'High traffic density detected in your usual zone. Exercise caution.',
        time: '4h ago',
        read: true,
        type: 'warning'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('civic_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotif: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
