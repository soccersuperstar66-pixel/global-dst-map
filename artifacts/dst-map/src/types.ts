export type DSTStatus = "enacted" | "proposed" | "negotiating" | "none";

export interface RevenueThreshold {
  global: number | null;
  domestic: number | null;
  currency: string;
}

export interface DSTCountry {
  countryCode: string;
  countryName: string;
  status: DSTStatus;
  taxRate: number | null;
  revenueThreshold: RevenueThreshold;
  affectedCompanies: string[];
  estimatedAnnualRevenue: number | null;
  effectiveDate: string | null;
  proposalDate: string | null;
  notes: string;
}
