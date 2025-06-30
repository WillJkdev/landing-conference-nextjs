import { useEffect, useState } from "react";

interface EventSettings {
  name: string;
  logoUrl?: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  ticketPrice: number;
  currency: string;
  maxAttendees: number;
}

export function useEventSettings() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings/event");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching event settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return { settings, loading };
}
