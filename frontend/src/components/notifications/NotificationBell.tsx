import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "../../hooks/usePhase4";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  function handleClick(id: string, contractId: string | null) {
    markRead.mutate(id);
    setOpen(false);
    if (contractId) navigate(`/contracts/${contractId}`);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink-soft hover:text-ink transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-redline px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-ink/10 bg-white shadow-lg z-50">
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
              Notifications
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-ink-soft">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id, n.contract_id)}
                  className={`block w-full border-b border-ink/[0.06] px-4 py-3 text-left last:border-b-0 hover:bg-paper/60 transition-colors ${
                    n.is_read ? "opacity-60" : ""
                  }`}
                >
                  <p className="text-xs font-semibold text-ink">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">{n.message}</p>
                  <p className="mt-1 font-mono text-[9px] text-ink-soft/60">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}