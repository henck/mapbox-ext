import { FeatureCollection, Feature } from 'geojson';
import * as React from 'react';
import { Layer, Source, useMap, ViewState } from 'react-map-gl';

interface IDegreesGridProps {
  degrees: number;
  /** Graticule color. */
  color?: string;
}

const Graticule = (props: IDegreesGridProps & ViewState) => {
  const { current: map } = useMap();

  const getBounds = () => {
    const bounds = map.getBounds();
    
    let north = bounds.getNorth();
    let south = bounds.getSouth();
    const vdiff = Math.abs(north-south);
    north += vdiff;
    south -= vdiff;

    let west = bounds.getWest();
    let east = bounds.getEast();
    const hdiff = Math.abs(east-west);
    east += hdiff;
    west -= hdiff;

    if(east > 180) {
      west -= (east - 180);
      east = 190;
    }
    if(west < -180) {
      east -= (west - 180);
      west = -190;
    }

    return { north, east, south, west };
  }

  const toDMS = (value: number): number[] => {
    value = Math.abs(value);
    let degrees = Math.trunc(value);
    let seconds = (value-degrees) * 3600;
    // Seconds are multiplied by 10,000, rounded, then divided again to avoid float errors.
    let minutes = Math.trunc(Math.round((seconds / 60) * 10000) / 10000);
    seconds = Math.round(seconds) % 60;
    return [degrees, minutes, seconds];
  }  

  const formatLatitude = (lat: number) => {
    const [d,m,s] = toDMS(lat);
    let ms = m.toString(); if(ms.length < 2) ms = "0" + ms;
    let ss = s.toFixed(0); if(ss.length < 2) ss = "0" + ss;
    return `${d}\u00B0 ${ms}\u2032 ${ss}\u2033 ${d >= 0 ? "N" : "S"}`;
  }

  const formatLongitude = (lng: number) => {
    const [d,m,s] = toDMS(lng);
    let ms = m.toString(); if(ms.length < 2) ms = "0" + ms;
    let ss = s.toFixed(0); if(ss.length < 2) ss = "0" + ss;
    return `${d}\u00B0 ${ms}\u2032 ${ss}\u2033 ${d >= 0 ? "E" : "W"}`;
  }  

  const buildGrid = (): FeatureCollection => {
    const step = props.degrees / Math.pow(2, Math.ceil(props.zoom - 1));

    const bounds = getBounds();
    
    const features: Feature[] = [];
    let count = 0;
    for (let lng = -180 + step; lng <= 180; lng += step) {
      if(!(lng > bounds.west && lng < bounds.east)) continue;
      features.push({
        type: 'Feature',
        geometry: {type: 'LineString', coordinates: [[lng, -90], [lng, 90]]},
        properties: {}
      });
      count++;
    }
    for (let lat = -80 + step; lat <= 80; lat += step) {
      if(!(lat < bounds.north && lat > bounds.south)) continue;
      features.push({
        type: 'Feature',
        geometry: {type: 'LineString', coordinates: [[-180, lat], [180, lat]]},
        properties: {}
      });
      count++;
    }

    for (let lng = -180 + step; lng <= 180; lng += step) {
      if(!(lng > bounds.west && lng < bounds.east)) continue;
      for (let lat = -80 + step; lat <= 80; lat += step) {
        if(!(lat < bounds.north && lat > bounds.south)) continue;
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng + step / 2, lat] },
          properties: { x: formatLatitude(lat)}
        });
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat + step / 2] },
          properties: { x: formatLongitude(lng)}
        });
        count += 2;
      }
    }  

    // console.log(count, "features drawn");
    return { type: 'FeatureCollection', features: features };
  }

  const [featureCollection, setFeatureCollection] = React.useState({ type: 'FeatureCollection', features: [] } as FeatureCollection);

  React.useEffect(() => {
    setFeatureCollection(buildGrid());
  }, [props.zoom, props.latitude, props.longitude]);

  return (
    <>
      <Source type="geojson" data={featureCollection}>
        <Layer
          type="line"
          filter={['==', ["geometry-type"], 'LineString']}
          paint={{ 
            "line-color": props.color ?? "lightblue",
            "line-width": 1
          }}
        />
        <Layer
          type="symbol"
          filter={['==', ["geometry-type"], 'Point']}
          layout={{
            "symbol-placement": "point",
            'text-size': 10,
            'text-field': '{x}'
          }}
          paint={{
            'text-color': '#fff',
            'text-halo-width': 1,
            'text-halo-blur': 0,
            'text-halo-color': '#333',
          }}
        />
      </Source>
    </>
  );
}

export { Graticule }
