"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@lib/toast"; // Assuming react-hot-toast is used
import { api } from "@lib/api";

export const useRealtimeNotifications = (
  userId: string | number | null,
  role: string | null,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Get token from cookies for authentication
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return "";
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const val = parts.pop()?.split(";").shift() || "";
        return val.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
      }
      return "";
    };
    const token = getCookie("auth_token");

    // Construct SSE URL with token
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const sseUrl = `${baseUrl}/notifications/stream?token=${encodeURIComponent(token || "")}&auth_token=${encodeURIComponent(token || "")}`;

    console.log(
      "SSE: Connecting to",
      sseUrl.split("?")[0],
      "with token present:",
      !!token,
    );
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("New realtime notification:", data);

        // Play notification sound
        try {
          const audio = new Audio("/sounds/notifictions.wav");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {
          console.error("Notification sound error:", e);
        }

        // 1. Show Toast (only if dropdown is not open)
        const isDropdownOpen = (
          window as Window & { isNotificationDropdownOpen?: boolean }
        ).isNotificationDropdownOpen;
        if (!isDropdownOpen) {
          toast.success(data.message, {
            title: data.title || "New Notification",
            duration: 5000,
          });
        }

        // 2. Invalidate React Query cache to refresh notification list/count
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // Also trigger a custom event for components like NotificationDropdown
        window.dispatchEvent(new CustomEvent("notificationsUpdated"));
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId, role, queryClient]);
};
