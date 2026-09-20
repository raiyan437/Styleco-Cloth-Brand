"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminActivity, AdminSnapshot } from "@/domain/admin";
import {
  clearAdminSnapshot,
  readAdminSnapshot,
  writeAdminSnapshot,
} from "@/infrastructure/browser/admin-storage";

interface AdminContextValue {
  snapshot: AdminSnapshot;
  ready: boolean;
  updateSnapshot: (
    updater: (current: AdminSnapshot) => AdminSnapshot,
    activity?: Omit<AdminActivity, "id" | "createdAt">,
  ) => void;
  resetDemoData: () => void;
}

const Context = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const context = useContext(Context);
  if (!context) throw new Error("AdminProvider is required");
  return context;
}

export function AdminProvider({
  initialSnapshot,
  children,
}: {
  initialSnapshot: AdminSnapshot;
  children: ReactNode;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      const stored = readAdminSnapshot();
      if (stored) setSnapshot(stored);
      setReady(true);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (ready) writeAdminSnapshot(snapshot);
  }, [ready, snapshot]);

  const updateSnapshot = useCallback(
    (
      updater: (current: AdminSnapshot) => AdminSnapshot,
      activity?: Omit<AdminActivity, "id" | "createdAt">,
    ) => {
      setSnapshot((current) => {
        const updated = updater(current);
        if (!activity)
          return { ...updated, updatedAt: new Date().toISOString() };
        const event: AdminActivity = {
          ...activity,
          id: `activity-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...updated,
          updatedAt: event.createdAt,
          activity: [event, ...updated.activity].slice(0, 40),
        };
      });
    },
    [],
  );

  const resetDemoData = useCallback(() => {
    clearAdminSnapshot();
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({ snapshot, ready, updateSnapshot, resetDemoData }),
    [ready, resetDemoData, snapshot, updateSnapshot],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
