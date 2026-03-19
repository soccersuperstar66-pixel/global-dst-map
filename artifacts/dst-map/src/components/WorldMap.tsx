import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DSTCountry, DSTStatus } from "@/types";
import { STATUS_CONFIG } from "@/constants/statusConfig";

interface WorldMapProps {
  countries: DSTCountry[];
  selectedCountry: DSTCountry | null;
  onCountrySelect: (country: DSTCountry | null) => void;
  activeFilters: Set<DSTStatus>;
}

/** GeoJSON fetched from GitHub CDN. For local dev with a cached copy, download via:
 *  sh scripts/download-geojson.sh */
const WORLD_GEOJSON_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

/** Extract ISO 3166-1 alpha-2 code from a GeoJSON feature's properties. */
function featureCode(props: Record<string, unknown>): string {
  return String(props["ISO3166-1-Alpha-2"] ?? props["ISO_A2"] ?? "");
}

/** Extract country display name from a GeoJSON feature's properties. */
function featureName(props: Record<string, unknown>): string {
  return String(props["name"] ?? props["ADMIN"] ?? "");
}

export function WorldMap({
  countries,
  selectedCountry,
  onCountrySelect,
  activeFilters,
}: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const countriesRef = useRef(countries);
  const activeFiltersRef = useRef(activeFilters);
  const onSelectRef = useRef(onCountrySelect);
  /**
   * Map from ISO-A2 code → the previous layer so we can reset its style
   * when the selection changes without needing to cast via `any`.
   */
  const layerByCode = useRef<Map<string, L.Path>>(new Map());

  countriesRef.current = countries;
  activeFiltersRef.current = activeFilters;
  onSelectRef.current = onCountrySelect;

  /**
   * Countries absent from the dataset are treated as "none" (no DST).
   * Pass `geoName` from the GeoJSON feature so the panel shows a real country name
   * instead of the raw ISO code.
   */
  const getCountryForCode = useCallback((code: string, geoName?: string): DSTCountry => {
    return (
      countriesRef.current.find((c) => c.countryCode === code) ?? {
        countryCode: code,
        countryName: geoName || code,
        status: "none",
        taxRate: null,
        revenueThreshold: { global: null, domestic: null, currency: "" },
        affectedCompanies: [],
        estimatedAnnualRevenue: null,
        effectiveDate: null,
        proposalDate: null,
        notes: "No Digital Services Tax currently in effect.",
      }
    );
  }, []);

  const getCountryStyle = useCallback(
    (countryCode: string, isHovered = false, isSelected = false): L.PathOptions => {
      const data = getCountryForCode(countryCode);

      if (!activeFiltersRef.current.has(data.status)) {
        return {
          fillColor: "#e8eaed",
          fillOpacity: 0.35,
          color: "#d0d4da",
          weight: 0.5,
          opacity: 0.6,
        };
      }

      const config = STATUS_CONFIG[data.status];
      return {
        fillColor: isHovered || isSelected ? config.mapHoverColor : config.mapColor,
        fillOpacity: isHovered || isSelected ? 0.9 : 0.75,
        color: isSelected ? "#1a3a5c" : "#fff",
        weight: isSelected ? 2.5 : isHovered ? 1.5 : 0.5,
        opacity: 1,
      };
    },
    [getCountryForCode]
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 8,
      zoomControl: true,
      attributionControl: false,
    });

    map.zoomControl.setPosition("topright");

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: "© CartoDB",
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    fetch(WORLD_GEOJSON_URL)
      .then((r) => r.json())
      .then((geojson) => {
        let selectedCode: string | null = null;

        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const code = feature ? featureCode(feature.properties ?? {}) : "";
            return getCountryStyle(code);
          },
          onEachFeature: (feature, featureLayer) => {
            const props = feature.properties ?? {};
            const code: string = featureCode(props);
            const name: string = featureName(props);

            if (code) {
              layerByCode.current.set(code, featureLayer as L.Path);
            }

            featureLayer.on("mouseover", () => {
              if (code !== selectedCode) {
                (featureLayer as L.Path).setStyle(getCountryStyle(code, true, false));
              }

              const countryData = getCountryForCode(code);
              const config = STATUS_CONFIG[countryData.status];
              let tooltipContent = `<strong>${name || code}</strong>`;
              if (activeFiltersRef.current.has(countryData.status)) {
                tooltipContent += `<br/><span style="color:${config.color}">● ${config.label}</span>`;
                if (countryData.taxRate !== null) {
                  tooltipContent += `<br/>Rate: ${countryData.taxRate}%`;
                }
              }
              featureLayer.bindTooltip(tooltipContent, {
                sticky: true,
                className: "dst-tooltip",
                direction: "top",
                offset: [0, -10],
              }).openTooltip();
            });

            featureLayer.on("mouseout", () => {
              if (code !== selectedCode) {
                (featureLayer as L.Path).setStyle(getCountryStyle(code, false, false));
              }
              featureLayer.closeTooltip();
            });

            featureLayer.on("click", () => {
              if (selectedCode && selectedCode !== code) {
                const prev = layerByCode.current.get(selectedCode);
                if (prev) prev.setStyle(getCountryStyle(selectedCode, false, false));
              }
              selectedCode = code;
              (featureLayer as L.Path).setStyle(getCountryStyle(code, false, true));

              // Pass GeoJSON name so fallback countries display properly in the detail panel.
              onSelectRef.current(getCountryForCode(code, name));
            });
          },
        }).addTo(map);

        geoLayerRef.current = layer;
      })
      .catch(console.error);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [getCountryStyle, getCountryForCode]);

  useEffect(() => {
    if (!geoLayerRef.current) return;
    geoLayerRef.current.setStyle((feature) => {
      const code = feature ? featureCode(feature.properties ?? {}) : "";
      const isSelected = selectedCountry?.countryCode === code;
      return getCountryStyle(code, false, isSelected);
    });
  }, [activeFilters, selectedCountry, getCountryStyle]);

  return <div ref={mapRef} className="world-map" />;
}
