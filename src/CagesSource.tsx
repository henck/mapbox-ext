/** @module @ignore */
import * as React from 'react';
import { Layer, Source } from 'react-map-gl';
import { FeatureCollection } from 'geojson';

import { NUM_CIRCLE_POINTS } from './editors/EditorConfig';
import { Polygon } from './functions/Polygon';
import { ICage } from './MapView';
import { IPoint } from './types/Types';

interface ICagesSourceProps {
  cages: ICage[];
  selectedCage: ICage;
}

const CagesSource = (props: ICagesSourceProps) => {

  const cageToCoords = (cage: ICage) => {
    if(cage.type == 'polygon') {
      return [[...cage.points.map(p => [ p.lng, p.lat]), [cage.points[0].lng, cage.points[0].lat]]];
    } else {
      const points: IPoint[] = [];
      for(let i = 0; i < NUM_CIRCLE_POINTS; i++) {
        const degrees = i * (360 / NUM_CIRCLE_POINTS);
        const rad = Polygon.toRadians(degrees);
        const dx = Math.cos(rad) * cage.radius;
        const dy = Math.sin(rad) * cage.radius;
        points.push(Polygon.addMeters(cage.point, dx, dy));
      }
      return [[...points.map(p => [ p.lng, p.lat]), [points[0].lng, points[0].lat]]];
    }
  }

  const getJSON = React.useMemo((): FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: props.cages
                .filter((cage) => cage != props.selectedCage)
                .map((cage, idx) => { return { 
          id: idx,
          type: 'Feature',
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: cageToCoords(cage)
          }
        }
      })
    }
  }, [props.cages, props.selectedCage]);

  return (
    <Source generateId type="geojson" data={getJSON}>
      <Layer 
        id="cages" 
        interactive
        type="fill"
        paint={{
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'gold',
            'lightblue'
            ],      
          'fill-opacity': 0.5
        }}
        />
      <Layer 
        type="line"
        paint={{
          'line-color': 'black',
          'line-width': 1
        }}
        />
  </Source>    
  );
}

export { CagesSource, ICagesSourceProps }
