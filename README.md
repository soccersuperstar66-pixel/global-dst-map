# Global Digital Services Tax Tracker

Interactive world map visualizing Digital Services Taxes (DSTs) worldwide — a policy research tool for the [Tax Foundation](https://taxfoundation.org).

## Features

- **Full-screen choropleth map** powered by [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org)
- **Color-coded by status**: Enacted (red) · Proposed (orange) · Under Negotiation (blue) · No DST (gray)
- **39 jurisdictions** tracked with accurate DST taxonomy (true revenue-based DSTs, not VAT extensions)
- **Click any country** → slide-in detail panel with tax rate, revenue thresholds, affected companies, and policy notes
- **Filter legend** to toggle status categories
- **Summary stats bar**: enacted count, proposed count, targeted companies, estimated annual revenue

## Data

All data is in `artifacts/dst-map/src/data/dst-data.json`. Only genuine standalone Digital Services Taxes (gross-revenue based, separate from VAT/GST) are classified as "enacted". Countries that have only extended standard VAT to digital services are correctly classified as "none" with explanatory notes.

## Getting Started

```bash
# Install dependencies
pnpm install

# Download the world GeoJSON (required for the map, ~14MB)
sh scripts/download-geojson.sh

# Start development server
pnpm --filter @workspace/dst-map run dev
```

## Stack

- React 18 + TypeScript + Vite
- Leaflet + react-leaflet (choropleth map)
- Tailwind CSS + shadcn/ui components
- pnpm workspace monorepo

## License

MIT
