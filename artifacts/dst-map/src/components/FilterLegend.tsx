import { DSTStatus } from "@/types";
import { STATUS_CONFIG } from "@/constants/statusConfig";
import { ALL_STATUSES } from "@/hooks/useFilters";

interface FilterLegendProps {
  activeFilters: Set<DSTStatus>;
  onToggle: (status: DSTStatus) => void;
}

export function FilterLegend({ activeFilters, onToggle }: FilterLegendProps) {
  return (
    <div className="filter-legend">
      <div className="filter-legend-title">Filter by Status</div>
      <div className="filter-legend-items">
        {ALL_STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          const isActive = activeFilters.has(status);
          return (
            <button
              key={status}
              className={`filter-item ${isActive ? "filter-item-active" : "filter-item-inactive"}`}
              onClick={() => onToggle(status)}
              title={`Toggle ${config.label}`}
            >
              <span
                className="filter-dot"
                style={{ backgroundColor: isActive ? config.color : "#ccc" }}
              />
              <span className="filter-item-label">{config.label}</span>
            </button>
          );
        })}
      </div>
      <div className="filter-legend-hint">Click country to explore</div>
    </div>
  );
}
