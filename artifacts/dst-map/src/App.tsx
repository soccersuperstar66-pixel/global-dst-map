import { useState } from "react";
import { Header } from "@/components/Header";
import { WorldMap } from "@/components/WorldMap";
import { FilterLegend } from "@/components/FilterLegend";
import { DetailPanel } from "@/components/DetailPanel";
import { useFilters } from "@/hooks/useFilters";
import { DSTCountry } from "@/types";
import rawData from "@/data/dst-data.json";
import "@/app.css";

const allCountries = rawData as DSTCountry[];

function App() {
  const [selectedCountry, setSelectedCountry] = useState<DSTCountry | null>(null);
  const { activeFilters, toggleFilter } = useFilters();

  return (
    <div className="app-root">
      <Header />
      <div className="map-container">
        <WorldMap
          countries={allCountries}
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
          activeFilters={activeFilters}
        />
        <FilterLegend activeFilters={activeFilters} onToggle={toggleFilter} />
        <DetailPanel
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      </div>
    </div>
  );
}

export default App;
