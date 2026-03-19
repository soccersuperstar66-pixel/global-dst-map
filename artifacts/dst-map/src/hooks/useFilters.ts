import { useState, useCallback } from "react";
import { DSTStatus } from "@/types";

export const ALL_STATUSES: DSTStatus[] = ["enacted", "proposed", "negotiating", "none"];

export function useFilters() {
  const [activeFilters, setActiveFilters] = useState<Set<DSTStatus>>(
    new Set(ALL_STATUSES)
  );

  const toggleFilter = useCallback((status: DSTStatus) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        if (next.size > 1) {
          next.delete(status);
        }
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const isVisible = useCallback(
    (status: DSTStatus) => activeFilters.has(status),
    [activeFilters]
  );

  return { activeFilters, toggleFilter, isVisible };
}
