import { useState, useEffect, useCallback } from "react";
import { CONFIG } from "@/config";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link?: string;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        fetch(`${CONFIG.api.baseUrl}/notifications`),
        fetch(`${CONFIG.api.baseUrl}/notifications/unread-count`),
      ]);

      if (listRes.ok && countRes.ok) {
        const list = await listRes.json();
        const count = await countRes.json();
        setNotifications(list);
        setUnreadCount(count.count);
      }
    } catch (e) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${CONFIG.api.baseUrl}/notifications/${id}/read`, { method: "POST" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${CONFIG.api.baseUrl}/notifications/read-all`, { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, refresh: fetchNotifications };
}
