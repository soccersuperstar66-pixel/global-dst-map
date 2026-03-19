import dstData from "@/data/dst-data.json";
import { DSTCountry } from "@/types";

const data = dstData as DSTCountry[];

export function Header() {
  const enacted = data.filter((c) => c.status === "enacted").length;
  const proposed = data.filter((c) => c.status === "proposed").length;

  const companiesSet = new Set<string>();
  data.forEach((c) => {
    if (c.status === "enacted") {
      c.affectedCompanies.forEach((co) => companiesSet.add(co));
    }
  });

  const totalRevenue = data
    .filter((c) => c.status === "enacted" && c.estimatedAnnualRevenue !== null)
    .reduce((sum, c) => sum + (c.estimatedAnnualRevenue ?? 0), 0);

  function formatRevenue(n: number) {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    return `$${n.toLocaleString()}`;
  }

  return (
    <header className="header">
      <div className="header-title-row">
        <div className="header-title-group">
          <div className="header-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#1a3a5c" />
              <path d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M16 6C13.5 10 12 13 12 16C12 19 13.5 22 16 26" stroke="white" strokeWidth="1.5" />
              <path d="M16 6C18.5 10 20 13 20 16C20 19 18.5 22 16 26" stroke="white" strokeWidth="1.5" />
              <line x1="7" y1="16" x2="25" y2="16" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="header-title">Global Digital Services Tax Tracker</h1>
            <p className="header-subtitle">Tax Foundation · Policy Research Tool</p>
          </div>
        </div>
      </div>
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value stat-enacted">{enacted}</span>
          <span className="stat-label">DSTs Enacted</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value stat-proposed">{proposed}</span>
          <span className="stat-label">DSTs Proposed</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value stat-companies">{companiesSet.size}+</span>
          <span className="stat-label">Targeted Companies</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value stat-revenue">{formatRevenue(totalRevenue)}</span>
          <span className="stat-label">Est. Annual Revenue</span>
        </div>
      </div>
    </header>
  );
}
