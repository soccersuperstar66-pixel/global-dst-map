import { DSTCountry } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate, formatRate } from "@/utils/format";

interface DetailPanelProps {
  country: DSTCountry | null;
  onClose: () => void;
}

export function DetailPanel({ country, onClose }: DetailPanelProps) {
  if (!country) return null;

  const { revenueThreshold } = country;

  const showFullDetail =
    country.status === "enacted" || country.status === "proposed" || country.status === "negotiating";

  return (
    <div className={`detail-panel ${country ? "detail-panel-open" : ""}`}>
      <div className="detail-panel-header">
        <div className="detail-panel-title-group">
          <h2 className="detail-panel-country">{country.countryName}</h2>
          <StatusBadge status={country.status} />
        </div>
        <button className="detail-close-btn" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="detail-panel-body">
        {showFullDetail ? (
          <>
            <div className="detail-grid">
              <div className="detail-card">
                <div className="detail-card-label">Tax Rate</div>
                <div className="detail-card-value detail-rate">
                  {formatRate(country.taxRate)}
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-card-label">Est. Annual Revenue</div>
                <div className="detail-card-value">
                  {formatCurrency(
                    country.estimatedAnnualRevenue,
                    revenueThreshold.currency || "USD"
                  )}
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-card-label">
                  {country.status === "enacted"
                    ? "Effective Date"
                    : country.status === "proposed"
                    ? "Proposed Date"
                    : "Status Date"}
                </div>
                <div className="detail-card-value">
                  {formatDate(country.effectiveDate ?? country.proposalDate)}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-section-title">Revenue Thresholds</div>
              <div className="detail-threshold-grid">
                <div className="detail-threshold-item">
                  <span className="detail-threshold-label">Global Revenue</span>
                  <span className="detail-threshold-value">
                    {revenueThreshold.global
                      ? formatCurrency(revenueThreshold.global, revenueThreshold.currency)
                      : country.status === "negotiating"
                      ? "TBD"
                      : "No minimum"}
                  </span>
                </div>
                <div className="detail-threshold-item">
                  <span className="detail-threshold-label">Domestic Revenue</span>
                  <span className="detail-threshold-value">
                    {revenueThreshold.domestic
                      ? formatCurrency(revenueThreshold.domestic, revenueThreshold.currency)
                      : country.status === "negotiating"
                      ? "TBD"
                      : "No minimum"}
                  </span>
                </div>
              </div>
            </div>

            {country.affectedCompanies.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-title">Primarily Affected Companies</div>
                <div className="detail-companies">
                  {country.affectedCompanies.map((company) => (
                    <span key={company} className="company-tag">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {country.status === "negotiating" && country.affectedCompanies.length === 0 && (
              <div className="detail-section">
                <div className="detail-section-title">Primarily Affected Companies</div>
                <p className="detail-notes" style={{ color: "#8a94a2" }}>
                  No formal DST enacted. Major global platforms would be affected under any future framework.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="detail-no-dst">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="detail-no-dst-icon">
              <circle cx="24" cy="24" r="20" stroke="#9ca3af" strokeWidth="2" />
              <path d="M16 24h16M24 16v16" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="detail-no-dst-text">No Digital Services Tax currently in effect</p>
          </div>
        )}

        <div className="detail-section">
          <div className="detail-section-title">Policy Context</div>
          <p className="detail-notes">{country.notes}</p>
        </div>

        <div className="detail-footer">
          <span className="detail-footer-text">
            Data sourced from Tax Foundation research. Last updated March 2026.
          </span>
        </div>
      </div>
    </div>
  );
}
