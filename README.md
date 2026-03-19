# Global Digital Services Tax Tracker

An interactive world map visualizing Digital Services Taxes (DSTs) worldwide — a policy research tool for the [Tax Foundation](https://taxfoundation.org).

## Features

- **Full-screen choropleth map** — color-coded countries by DST status
- **39 jurisdictions** tracked with accurate DST taxonomy
- **Click any country** → slide-in detail panel with tax rate, revenue thresholds, affected companies, and policy notes
- **Filter legend** — toggle enacted, proposed, negotiating, and no-DST categories
- **Stats bar** — live counts of enacted DSTs, proposed DSTs, targeted companies, and estimated annual revenue

## Status categories

| Color | Status | Description |
|-------|--------|-------------|
| 🔴 Red | **Enacted** | Standalone gross-revenue DST in force |
| 🟠 Orange | **Proposed** | Formal legislative proposal introduced |
| 🔵 Blue | **Negotiating** | Active policy study or OECD discussions underway |
| ⚪ Gray | **No DST** | No standalone DST; may have standard VAT on digital services |

## Data

All country data lives in [`src/data/dst-data.json`](src/data/dst-data.json). Only genuine standalone Digital Services Taxes are classified as `enacted` — taxes that are:

- Revenue-based (applied to gross revenue, not profit)
- Targeting digital services specifically
- Separate from the country's standard VAT/GST system

Countries that have only extended VAT to digital services (Australia, Singapore, Japan, South Korea, etc.) are correctly classified as `none` with explanatory notes.

**Current coverage (39 jurisdictions):**
- Enacted (13): France, UK, Italy, Spain, Turkey, India, Kenya, Canada, Austria, Hungary, Tanzania, Nigeria, Zimbabwe
- Proposed (7): Czech Republic, Slovakia, Poland, Brazil, Indonesia, Bolivia, Mexico
- Negotiating (9): Germany, Ireland, Netherlands, Sweden, Senegal, Uganda, Ghana, Argentina, Thailand
- No DST (10): US, Japan, Australia, South Korea, Singapore, Norway, Switzerland, Malaysia, South Africa, Philippines

## Getting started

```bash
# Install dependencies
pnpm install

# Download the world GeoJSON map data (~14MB, not included in repo)
sh scripts/download-geojson.sh

# Start the development server
pnpm --filter @workspace/dst-map run dev
```

The app runs at `http://localhost:<PORT>` (port assigned automatically).

## Project structure

```
artifacts/dst-map/
├── public/
│   └── countries.geojson       # World map polygons (download via setup script)
├── src/
│   ├── components/
│   │   ├── WorldMap.tsx        # Leaflet choropleth map
│   │   ├── DetailPanel.tsx     # Slide-in country detail panel
│   │   ├── FilterLegend.tsx    # Status filter toggles
│   │   ├── Header.tsx          # Stats bar + title
│   │   └── StatusBadge.tsx     # Colored status pill
│   ├── constants/
│   │   └── statusConfig.ts     # Colors and labels per status
│   ├── data/
│   │   └── dst-data.json       # All 39 country records
│   ├── hooks/
│   │   └── useFilters.ts       # Filter state management
│   ├── utils/
│   │   └── format.ts           # Currency, date, and rate formatters
│   └── types.ts                # DSTCountry and DSTStatus types
└── ...
```

## Stack

- [React 18](https://react.dev) + TypeScript + [Vite](https://vitejs.dev)
- [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- pnpm workspace monorepo

## Data sources

Country DST data is sourced from Tax Foundation research, OECD reports, and national tax authority publications. Last updated March 2026.

## License

MIT
