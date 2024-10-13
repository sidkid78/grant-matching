'use client'

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getNotifications, markNotificationAsRead, Notification } from '../services/notificationService';
  
export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const fetchedNotifications = await getNotifications();
    setNotifications(fetchedNotifications);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <CardContent className="py-2">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li key={notification.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}