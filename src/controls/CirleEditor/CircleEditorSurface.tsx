import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, LngLat, MapboxGeoJSONFeature, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { IPoint, PointCollection } from '../../types/Types';
import { Polygon } from '../../functions/Polygon';
import { POINTS_LAYER, POLYGON_FILL_COLOR_INVALID, POLYGON_FILL_COLOR_VALID, POLYGON_LAYER, POLYGON_LINE_COLOR_VALID } from '../PolygonEditor/Config';
import { NUM_CIRCLE_POINTS } from '../PolygonEditor/Config';

interface ICircleEditorSurfaceProps {
  point: IPoint;
  radius: number;
  /** Fired when points change. */
  onChange: (point: IPoint, radius: number) => void;
}

let radius: number;
let startDragPoint: IPoint;

const CircleEditorSurface = (props: ICircleEditorSurfaceProps) => {
  const { current: map } = useMap();
  // Currently dragging?
  let dragging = false;
  // Point where dragging began:
  let dragSource: LngLat = null;
  // Original points when dragging began:
  let currentdragPoint: IPoint;

  const handleMouseDown = (e: MapLayerMouseEvent) => {
    if(e.features.find((f: MapboxGeoJSONFeature) => f.layer.id != POLYGON_LAYER)) return;
    // Disable map drag:
    map.getMap().dragPan.disable();
    map.getCanvas().style.cursor = 'move';
    dragging = true;
    dragSource = e.lngLat;
    currentdragPoint = startDragPoint;
  }

  const handleMouseUp = (e: MapLayerMouseEvent) => {
    // Re-enable map drag:
    map.getMap().dragPan.enable();
    map.getCanvas().style.cursor = '';
    dragging = false;
  }

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    if(!dragging) return;
    const dLat = e.lngLat.lat - dragSource.lat;
    const dLng = e.lngLat.lng - dragSource.lng;
    const newPoint = {
      lat: currentdragPoint.lat + dLat,
      lng: currentdragPoint.lng + dLng
    }
    props.onChange(newPoint, radius);
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    // If the polygon is clicked, then the click must be consumed so it
    // doesn't propagate to the parent. The parent must check for
    // isDefaultPrevented.
    e.preventDefault();
  }

  const mount = () => {
    // Register for clicks and moves:
    map.on('mousedown', [POLYGON_LAYER, POINTS_LAYER], handleMouseDown);
    map.on('mouseup', handleMouseUp);
    map.on('mousemove', handleMouseMove);
    map.on('click', POLYGON_LAYER, handleClick);
  }

  const unmount = () => {
    // Unregister for clicks and moves:
    map.off('mousedown', [POLYGON_LAYER, POINTS_LAYER], handleMouseDown);
    map.off('mouseup', handleMouseUp);
    map.off('mousemove', handleMouseMove);
    map.off('click', POLYGON_LAYER, handleClick);
  }

  // Mounting/unmounting must only happen once.
  React.useEffect(() => {
    mount();
    return unmount
  }, []);  
  
  // startDragPoints must be updated every time the props points are updated.
  React.useEffect(() => {
    startDragPoint = props.point;
    radius = props.radius;
  }, [props.point, props.radius]);
  
  const getCircleJSON = (): FeatureCollection => {
    // Radius is in meters.
    const circle_points: IPoint[] = [];
    for(let i = 0; i < NUM_CIRCLE_POINTS; i++) {
      const degrees = i * (360 / NUM_CIRCLE_POINTS);
      const rad = Polygon.toRadians(degrees);
      const dx = Math.cos(rad) * props.radius;
      const dy = Math.sin(rad) * props.radius;
      circle_points.push(Polygon.addMeters(props.point.lng, props.point.lat, dx, dy));
    }

    return {
      type: 'FeatureCollection',
      features: [{ 
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [circle_points.map(p => [p.lng, p.lat]).concat([[circle_points[0].lng, circle_points[0].lat]])]
        }
      }]
    }
  }  

  return (
    <Source type="geojson" data={getCircleJSON()}>
      <Layer 
        id={POLYGON_LAYER}
        interactive      
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

export { CircleEditorSurface }
