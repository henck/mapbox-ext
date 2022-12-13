import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { IPoint, PointCollection } from '../../types/Types';
import { Polygon } from '../../functions/Polygon';
import { POINTS_LAYER, POLYGON_CIRCLE_COLOR, POLYGON_CIRCLE_STROKE_COLOR, POLYGON_LAYER, POLYGON_LINE_COLOR_INVALID, POLYGON_LINE_COLOR_VALID } from './Config';

interface IPolygonBuilderProps {
  /** Fired when polygon builder is cancelled. */
  onCancel: () => void;
  /** Fired when polygon builder completes. */
  onComplete: (points: PointCollection) => void;
}

const PolygonBuilder = (props: IPolygonBuilderProps) => {
  const { current: map } = useMap();
  const [points, setPoints] = React.useState([] as IPoint[]);
  const [cursor, setCursor] = React.useState({ lat: 0, lng: 0 });

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
    setCursor({ lng: e.lngLat.lng, lat: e.lngLat.lat });
  }

  const handleClickPoint = (e: MapLayerMouseEvent) => {
    e.preventDefault(); // Prevent layerless click from running.
    submit();
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    if(e.defaultPrevented) return; // Don't run if points-layer click runs.
    e.preventDefault();
    const p: IPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    points.push(p);
    setPoints([...points]);
  }

  //
  // Polygons can only be submitted if they have at least 3 points and
  // are valid (i.e. do not self-intersect).
  // 
  const submit = () => {
    if(points.length >= 3 && Polygon.isValid(points)) props.onComplete(points);
  }

  const mount = () => {
    // Start listening to keyboard:
    document.addEventListener('keydown', handleKeydown);         
    map.on('mousemove', handleMouseMove);
    map.on('click', POINTS_LAYER, handleClickPoint);
    map.on('click', handleClick);
    map.getCanvas().style.cursor = 'crosshair';
  }  

  const unmount = () => {
    // Stop listing to keyboard:
    document.removeEventListener('keydown', handleKeydown);      
    map.off('mousemove', handleMouseMove);
    map.off('click', POINTS_LAYER, handleClickPoint);    
    map.off('click', handleClick);
    map.getCanvas().style.cursor = '';
  }

  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  const getPointsJSON = (): FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: points.map((p, idx) => { return {
        type: 'Feature',
        id: idx,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat]
        }
      }})
    }
  }  

  const getLinesJSON = (): FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [...points.map(p => [p.lng, p.lat]), [cursor.lng, cursor.lat]]
        }
      }]
    }
  }

  return (
    <>
      <Source type="geojson" data={getPointsJSON()}>
        <Layer 
          id={POINTS_LAYER}
          interactive
          type="circle"
          paint={{
            "circle-color": POLYGON_CIRCLE_COLOR,
            "circle-stroke-color": POLYGON_CIRCLE_STROKE_COLOR,
            "circle-radius": 3,
            "circle-stroke-width": 2
          }}
        />      
      </Source>
      <Source type="geojson" data={getLinesJSON()}>
        <Layer 
          id={POLYGON_LAYER}
          type='line'
          paint={{
            "line-color": Polygon.isValid(points) ? POLYGON_LINE_COLOR_VALID : POLYGON_LINE_COLOR_INVALID,
            "line-width": 1.5,
            "line-dasharray": [ 2, 1 ]
          }}
        />      
      </Source>      
    </>
  );
}

export { PolygonBuilder }
