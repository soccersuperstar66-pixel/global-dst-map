#!/bin/sh
# Download the world GeoJSON required by the DST map
mkdir -p artifacts/dst-map/public
curl -L "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson" \
  -o artifacts/dst-map/public/countries.geojson
echo "Downloaded countries.geojson to artifacts/dst-map/public/"
