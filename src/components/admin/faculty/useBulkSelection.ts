"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "stcet:admin:faculty:selection";
const EMPTY_SELECTION: Set<number> = new Set();

let selected: Set<number> = EMPTY_SELECTION;
let hydrated = false;
const listeners = new Set<() => void>();

function readStoredSelection(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (value): value is number =>
        typeof value === "number" && Number.isSafeInteger(value) && value > 0,
    );
  } catch {
    return [];
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  const stored = readStoredSelection();
  if (stored.length) selected = new Set(stored);
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const before = selected;
  hydrate();
  if (selected !== before) listener();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return selected;
}

function getServerSnapshot() {
  return EMPTY_SELECTION;
}

function commit(next: Set<number>) {
  selected = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Session storage is unavailable; selection simply will not persist.
  }
  emit();
}

export function useBulkSelection() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback((id: number) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    commit(next);
  }, []);

  const selectMany = useCallback((ids: number[], value: boolean) => {
    const next = new Set(selected);
    for (const id of ids) {
      if (value) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }
    commit(next);
  }, []);

  const removeMany = useCallback((ids: number[]) => {
    const next = new Set(selected);
    for (const id of ids) next.delete(id);
    commit(next);
  }, []);

  const clear = useCallback(() => commit(new Set()), []);

  return { selected: snapshot, toggle, selectMany, removeMany, clear };
}
