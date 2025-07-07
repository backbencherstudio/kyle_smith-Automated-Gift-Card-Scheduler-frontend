// lib/NotificationManager/NotificationManager.tsx

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

// ==========================
// Types & Constants
// ==========================
type Notification = {
  id: string;
  created_at: string;
  read_at: string | null;
  type: string;
  text: string;
  sender?: { id: string; name: string; email: string; avatar: string };
};

type ApiNotification = {
  id: string;
  created_at: string;
  read_at: string | null;
  notification_event: { type: string; text: string };
  sender?: { id: string; name: string; email: string; avatar: string };
};

// Use only one env variable for both REST and WebSocket
const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || ""; // e.g. http://192.168.4.4:4000
const WS_NAMESPACE = "/notifications"; // <-- Note the plural!

// ==========================
// Helper: Map API to UI Notification
// ==========================
function mapApiNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    created_at: n.created_at,
    read_at: n.read_at,
    type: n.notification_event.type,
    text: n.notification_event.text,
    sender: n.sender,
  };
}

// ==========================
// Helper: Notification Type to Icon/Color
// ==========================
function getNotificationIcon(type: string) {
  // Map type to icon path and color
  switch (type) {
    case "gift_scheduled":
      return { icon: "/icon/gift.svg", color: "#6C63FF" };
    case "payment_success":
      return { icon: "/icon/payment.svg", color: "#22C55E" };
    case "payment_failed":
    case "payment_failed_user":
      return { icon: "/icon/payment.svg", color: "#EF4444" };
    case "user_signup":
      return { icon: "/icon/user.svg", color: "#0EA5E9" };
    case "gift_delivered_user":
    case "gift_delivered":
      return { icon: "/icon/giftlog.svg", color: "#F59E42" };
    case "inventory_low":
      return { icon: "/icon/note.svg", color: "#F59E42" };
    case "queue_health":
      return { icon: "/icon/note.svg", color: "#EF4444" };
    case "account_verified":
      return { icon: "/icon/setting.svg", color: "#22C55E" };
    case "birthday_reminder":
    case "gift_reminder":
      return { icon: "/icon/celebration.svg", color: "#F59E42" };
    default:
      return { icon: "/icon/notification.svg", color: "#6C63FF" };
  }
}

// ==========================
// Helper: Desktop Notification
// ==========================
function showDesktopNotification({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon?: string;
}) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

// ==========================
// Main Component
// ==========================
interface NotificationManagerProps {
  jwt: string; // Pass JWT as prop for API/socket auth
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ jwt }) => {
  // ==========================
  // State
  // ==========================
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const socketRef = useRef<Socket | null>(null);

  // ==========================
// API Calls
  // ==========================
  async function fetchNotifications(page = 1) {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/notifications?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications.map(mapApiNotification));
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (e) {
      // handle error
    }
    setLoading(false);
  }

  async function fetchUnreadCount() {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.count);
    } catch (e) {}
  }

  async function deleteNotification(id: string) {
    await fetch(`${API_BASE}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function clearAllNotifications() {
    await fetch(`${API_BASE}/api/notifications`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setNotifications([]);
    setUnreadCount(0);
  }

  // ==========================
  // WebSocket Setup
  // ==========================
  useEffect(() => {
    if (!jwt) return;
    // Connect to the /notifications namespace
    const socket = io(`${API_BASE}${WS_NAMESPACE}`, { auth: { token: jwt } });
    socketRef.current = socket;

    socket.on("notification", (n: any) => {
      const notif: Notification = {
        id: n.id,
        created_at: n.created_at,
        read_at: n.read_at,
        type: n.type,
        text: n.text,
        sender: n.sender,
      };
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
      showDesktopNotification({
        title: "New Notification",
        body: notif.text,
        icon: getNotificationIcon(notif.type).icon,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [jwt]);

  // ==========================
  // Initial Fetch
  // ==========================
  useEffect(() => {
    if (jwt) {
      fetchNotifications(page);
      fetchUnreadCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, page]);

  // ==========================
  // UI Subcomponents
  // ==========================
  function NotificationItem({ n }: { n: Notification }) {
    const { icon, color } = getNotificationIcon(n.type);
    return (
      <div
        className="flex items-center space-x-3 py-2 border-b last:border-b-0 transition-colors hover:bg-gray-50"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: color + "22" }}
        >
          <Image src={icon} alt={n.type} width={28} height={28} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-base text-headerColor">
            {n.sender?.name || "System"}
          </p>
          <p className="text-sm font-normal text-descriptionColor mt-1">
            {n.text}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs text-gray-500">
            {new Date(n.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <button
            className="text-xs text-red-400 mt-1 cursor-pointer hover:underline"
            onClick={() => deleteNotification(n.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // Render
  // ==========================
  return (
    <div>
      {/* Notification Bell */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          className="cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full"
          style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex justify-center items-center text-sm w-6 h-6 text-whiteColor rounded-full bg-redColor">
              {unreadCount}
            </span>
          )}
          <Image
            src="/icon/notification.svg"
            alt="notification"
            width={18}
            height={18}
          />
        </PopoverTrigger>

        <PopoverContent className="w-80 md:w-[467px] mt-4 p-0 max-h-[550px] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h4 className="text-base font-bold md:text-lg text-headerColor">
              Notifications
            </h4>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-base font-semibold underline cursor-pointer text-headerColor"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full px-4 py-2">
            <input
              type="text"
              className="w-full py-1.5 text-sm sm:text-base focus-visible:border-0 md:py-2.5 border md:rounded-[12px] rounded-md pl-7 pr-2"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IoSearch className="text-borderColor text-base absolute left-6 top-1/2 -translate-y-1/2" />
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto px-4 py-3 flex-1">
            {loading ? (
              <p className="text-center text-sm text-gray-500 py-6">
                Loading...
              </p>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {(showAll ? notifications : notifications.slice(0, 5))
                  .filter((n) =>
                    n.text.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((n) => (
                    <NotificationItem key={n.id} n={n} />
                  ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-6">
                No notifications available
              </p>
            )}
          </div>

          {/* Sticky Footer */}
          {notifications.length > 5 && !showAll && (
            <div className="border-t p-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={() => setShowAll(true)}
                className="text-headerColor font-bold flex gap-2 cursor-pointer items-center justify-center w-full"
              >
                View All <FaArrowRightLong />
              </button>
            </div>
          )}
          {showAll && totalPages > 1 && (
            <div className="border-t p-4 sticky bottom-0 bg-white z-10 flex justify-between">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-headerColor font-bold flex gap-2 cursor-pointer items-center"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-headerColor font-bold flex gap-2 cursor-pointer items-center"
              >
                Next
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationManager;
