import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { NUM_CIRCLE_POINTS, POLYGON_FILL_COLOR_VALID, POLYGON_LINE_COLOR_VALID } from '../EditorConfig';
import { IPoint } from '../../types/Types';
import { Polygon } from '../../functions/Polygon';

interface ICircleBuilderProps {
  /** Fired when circle builder is cancelled. */
  onCancel: () => void;
  /** Fired when circle builder completes. */
  onComplete: (points: IPoint, radius: number) => void;
}

let point: IPoint = null;
let _radius: number = 0;

const CircleBuilder = (props: ICircleBuilderProps) => {
  const { current: map } = useMap();
  const [radius, setRadius] = React.useState(0);

  const handleKeydown = (e: KeyboardEvent) => {
    switch(e.code) {
      case 'Enter':
      case 'NumpadEnter':
        submit();
        break;
      case 'Escape':
        props.onCancel();
        break;
    }
  }  

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    if(point === null) return;
    _radius = Polygon.distance(point, e.lngLat);
    setRadius(_radius);
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    e.preventDefault();

    if(point === null) {
      point = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    } else {
      submit();
    }
  }

  const submit = () => {
    if(point !== null) props.onComplete(point, _radius);
  }

  const mount = () => {
    // Start listening to keyboard:
    document.addEventListener('keydown', handleKeydown);         
    map.on('mousemove', handleMouseMove);
    map.on('click', handleClick);
    map.getCanvas().style.cursor = 'crosshair';
    point = null;
  }  

  const unmount = () => {
    // Stop listing to keyboard:
    document.removeEventListener('keydown', handleKeydown);      
    map.off('mousemove', handleMouseMove);
    map.off('click', handleClick);
    map.getCanvas().style.cursor = '';
  }

  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  // Create a circle of 36 points.
  const getCircleJSON = (): FeatureCollection => {
    if(!point) return null;

    // Radius is in meters.
    const points: IPoint[] = [];
    for(let i = 0; i < NUM_CIRCLE_POINTS; i++) {
      const degrees = i * (360 / NUM_CIRCLE_POINTS);
      const rad = Polygon.toRadians(degrees);
      const dx = Math.cos(rad) * radius;
      const dy = Math.sin(rad) * radius;
      points.push(Polygon.addMeters(point, dx, dy));
    }

    return {
      type: 'FeatureCollection',
      features: [{ 
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [points.map(p => [p.lng, p.lat]).concat([[points[0].lng, points[0].lat]])]
        }
      }]
    }
  }  

  const getPointJSON = (): FeatureCollection => {
    if(!point) return null;

    const lng = point.lng + (radius / 6371000) * (180 / Math.PI) / Math.cos(point.lat * Math.PI/180);
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lng, point.lat]
        }
      }]
    }
  }

  return (
    <Source type="geojson" data={getCircleJSON()}>
      <Layer 
        type="fill"
        paint={{
          "fill-color": POLYGON_FILL_COLOR_VALID,
          "fill-opacity": 0.2
        }}
      />        
      <Layer 
        type="line"
        paint={{
          "line-color": POLYGON_LINE_COLOR_VALID,
          "line-width": 1.5,
          "line-dasharray": [ 2, 1 ]
        }}
      />
    </Source>
  );
}

export { CircleBuilder, ICircleBuilderProps }
