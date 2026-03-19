import { DSTStatus } from "@/types";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  mapColor: string;
  mapHoverColor: string;
}

export const STATUS_CONFIG: Record<DSTStatus, StatusConfig> = {
  enacted: {
    label: "DST Enacted",
    color: "#c0392b",
    bgColor: "#fdecea",
    textColor: "#7b1a14",
    mapColor: "#e74c3c",
    mapHoverColor: "#c0392b",
  },
  proposed: {
    label: "DST Proposed",
    color: "#d68910",
    bgColor: "#fef9e7",
    textColor: "#7d5209",
    mapColor: "#f39c12",
    mapHoverColor: "#d68910",
  },
  negotiating: {
    label: "Under Negotiation",
    color: "#1a6ca8",
    bgColor: "#eaf4fb",
    textColor: "#0e3d60",
    mapColor: "#3498db",
    mapHoverColor: "#1a6ca8",
  },
  none: {
    label: "No DST",
    color: "#5d6d7e",
    bgColor: "#f2f3f4",
    textColor: "#2e3f4f",
    mapColor: "#bdc3c7",
    mapHoverColor: "#95a5a6",
  },
};
