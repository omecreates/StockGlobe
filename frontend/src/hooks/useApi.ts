// src/hooks/useApi.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generic data-fetching hook with loading/error states and stale-while-revalidate.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react";

export interface UseApiResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  deps: unknown[] = [],
): UseApiResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetch = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = fetch();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetch };
}

// ─── Auto-refresh hook ───────────────────────────────────────────────────────

export function usePollingApi<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  intervalMs = 30_000,
): UseApiResult<T> {
  const result = useApi(fetcher, fallback);

  useEffect(() => {
    const timer = setInterval(result.refetch, intervalMs);
    return () => clearInterval(timer);
  }, [result.refetch, intervalMs]);

  return result;
}

// ─── Active section detection ─────────────────────────────────────────────────

export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((io) => io.disconnect());
  }, [sectionIds]);

  return active;
}

// ─── WebSocket hook ──────────────────────────────────────────────────────────

export interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  reconnectDelay?: number;
  enabled?: boolean;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const { onMessage, reconnectDelay = 3000, enabled = true } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled) return;

    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => {
          setConnected(false);
          reconnectTimer = setTimeout(connect, reconnectDelay);
        };
        ws.onerror = () => ws.close();
        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            onMessageRef.current?.(data);
          } catch {
            /* ignore malformed frames */
          }
        };
      } catch {
        reconnectTimer = setTimeout(connect, reconnectDelay);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [url, reconnectDelay, enabled]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { connected, send };
}

// ─── Smooth scroll to section ─────────────────────────────────────────────────

export function useScrollTo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
}
