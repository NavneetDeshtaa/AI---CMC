import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Mail,
  MailX,
} from "lucide-react";

import {
  useNotifications,
  useMarkNotificationRead,
} from "../../hooks/usePhase4";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    data: notifications,
  } = useNotifications();

  const markRead =
    useMarkNotificationRead();

  const unreadCount =
    notifications?.filter(
      (notification) =>
        !notification.is_read,
    ).length ?? 0;

  function handleClick(
    id: string,
    contractId: string | null,
  ) {
    markRead.mutate(id);

    setOpen(false);

    if (contractId) {
      navigate(
        `/app/contracts/${contractId}`,
      );
    }
  }

  return (
    <div className="relative">
      {/* =====================================================
          BELL BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          open
            ? "border-[#d0d2d5] bg-[#f7f7f6] text-[#181a20]"
            : "border-[#e2e2e2] bg-white text-[#666a72] hover:bg-[#f7f7f6] hover:text-[#181a20]"
        }`}
      >
        <Bell
          size={16}
          strokeWidth={1.7}
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d24d4d] px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-white">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-[#e2e2e2] bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.25)]">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-3.5">
            <div>
              <p className="text-[12px] font-semibold text-[#181a20]">
                Notifications
              </p>

              <p className="mt-0.5 text-[10px] text-[#92959b]">
                Contract updates and reminders
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-[#f1f2f2] px-2 py-1 text-[9px] font-semibold tabular-nums text-[#555961]">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="max-h-[360px] overflow-y-auto">
            {!notifications ||
            notifications.length === 0 ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#777b83]">
                  <Bell
                    size={15}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="text-[12px] font-medium text-[#181a20]">
                  No notifications
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#85888f]">
                  Contract reminders and updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      handleClick(
                        notification.id,
                        notification.contract_id,
                      )
                    }
                    className={`group block w-full border-b border-[#eeeeee] px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[#fafafa] ${
                      notification.is_read
                        ? "bg-white"
                        : "bg-[#fbfdfc]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* =================================================
                          UNREAD INDICATOR
                      ================================================= */}

                      <div className="mt-1.5 flex w-2 shrink-0 justify-center">
                        {!notification.is_read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2f9076]" />
                        )}
                      </div>

                      {/* =================================================
                          MESSAGE
                      ================================================= */}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-[11px] text-[#181a20] ${
                            notification.is_read
                              ? "font-medium"
                              : "font-semibold"
                          }`}
                        >
                          {notification.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#747880]">
                          {notification.message}
                        </p>

                        {/* =================================================
                            META
                        ================================================= */}

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="flex items-center gap-1">
                            {notification.email_sent ? (
                              <Mail
                                size={10}
                                strokeWidth={1.7}
                                className="text-[#2f9076]"
                              />
                            ) : (
                              <MailX
                                size={10}
                                strokeWidth={1.7}
                                className="text-[#a0a3a9]"
                              />
                            )}

                            <span
                              className={`text-[9px] ${
                                notification.email_sent
                                  ? "text-[#4f766b]"
                                  : "text-[#999ca2]"
                              }`}
                            >
                              {notification.email_sent
                                ? "Email sent"
                                : "In-app only"}
                            </span>
                          </div>

                          <span className="h-1 w-1 rounded-full bg-[#d0d2d5]" />

                          <span className="text-[9px] text-[#999ca2]">
                            {new Date(
                              notification.created_at,
                            ).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ),
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}