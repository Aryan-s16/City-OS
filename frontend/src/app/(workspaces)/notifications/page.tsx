"use client";

import { Bell, CheckCircle, Info, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-title">Notifications</h1>
          <p className="mt-1 text-body text-text-muted">
            Stay updated on your reports and city alerts.
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-text-muted hover:text-text transition-colors flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-text-muted">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
              <Bell className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-text">You're all caught up!</h3>
            <p className="mt-2 max-w-sm text-sm text-text-muted">
              There are no new notifications at this time. When a mission is updated or an AI agent requests your attention, it will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-xl border ${n.read ? 'bg-bg border-transparent' : 'bg-surface border-border'} transition-colors flex gap-4`}
              onClick={() => { if (!n.read) markAsRead(n.id); }}
            >
              <div className="mt-1">
                {n.type === "info" && <Info className="h-5 w-5 text-brand" />}
                {n.type === "success" && <CheckCircle2 className="h-5 w-5 text-success" />}
                {n.type === "warning" && <AlertTriangle className="h-5 w-5 text-warning" />}
                {n.type === "error" && <AlertCircle className="h-5 w-5 text-danger" />}
              </div>
              <div className="flex-1">
                <h4 className={`text-base font-medium ${n.read ? 'text-text-muted' : 'text-text'}`}>
                  {n.title}
                </h4>
                <p className="text-sm text-text-muted mt-1">{n.message}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-text-subtle font-medium">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                  {n.link && (
                    <Link href={n.link} className="text-xs font-semibold text-brand hover:underline">
                      View details
                    </Link>
                  )}
                </div>
              </div>
              {!n.read && (
                <div className="flex items-center justify-center w-8">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
