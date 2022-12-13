import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, MapboxGeoJSONFeature, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { IPoint, PointCollection } from '../../types/Types';
import { POINTS_LAYER, POLYGON_CIRCLE_COLOR, POLYGON_CIRCLE_STROKE_COLOR, POLYGON_FILL_COLOR_VALID } from '../PolygonEditor/Config';
import { Polygon } from '../../functions/Polygon';

interface ICircleEditorPointProps {
  point: IPoint;
  radius: number;
  /** Fired when points change. */
  onChange: (point: IPoint, radius: number) => void;
}

let point: IPoint = null;
let radius: number = null;

const CircleEditorPoint = (props: ICircleEditorPointProps) => {
  const { current: map } = useMap();
  let dragging: boolean = false;

  const handleMouseEnter = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = 'nesw-resize';
  }

  const handleMouseLeave = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = '';
  }

  const handleMouseDown = (e: MapLayerMouseEvent) => {
    dragging = true;
    map.getCanvas().style.cursor = 'move';
    map.getMap().dragPan.disable();
  }

  const handleMouseUp = (e: MapLayerMouseEvent) => {
    dragging = false;
    map.getCanvas().style.cursor = 'pointer';
    map.getMap().dragPan.enable();
  }

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    if(!dragging) return;
    let newRadius = Polygon.distance(point.lat, point.lng, e.lngLat.lat, e.lngLat.lng);
    props.onChange(point, newRadius);
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    e.preventDefault();
  }

  const mount = () => {
    // Register for clicks and moves:
    map.on('mouseenter', POINTS_LAYER, handleMouseEnter);
    map.on('mouseleave', POINTS_LAYER, handleMouseLeave);
    map.on('mousedown', POINTS_LAYER, handleMouseDown);
    map.on('mouseup', handleMouseUp);
    map.on('mousemove', handleMouseMove);
    map.on('click', POINTS_LAYER, handleClick);
  }

  const unmount = () => {
    // Unregister for clicks and moves:
    map.off('mouseleave', POINTS_LAYER, handleMouseLeave);
    map.off('mouseenter', POINTS_LAYER, handleMouseEnter);
    map.off('mousedown', POINTS_LAYER, handleMouseDown);
    map.off('mouseup', handleMouseUp);
    map.off('mousemove', handleMouseMove);
    map.off('click', POINTS_LAYER, handleClick);
  }

  // Mount/unmount only once:
  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  // Force the control to update when points change:
  React.useEffect(() => {
    point = { ...props.point };
    radius = props.radius;
  }, [props.point, props.radius]);

  const getJSON = (): FeatureCollection => {
    const lng = props.point.lng + (props.radius / 6371000) * (180 / Math.PI) / Math.cos(props.point.lat * Math.PI/180);
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lng, props.point.lat]
        }
      }]
    }
  }  

  return (
    <Source type="geojson" data={getJSON()}>
      <Layer 
        id={POINTS_LAYER}
        interactive
        type="circle"
        paint={{
          "circle-color": POLYGON_CIRCLE_COLOR,
          "circle-stroke-color": POLYGON_CIRCLE_STROKE_COLOR,
          "circle-radius": 5,
          "circle-stroke-width": 2
        }}
      />
    </Source>
  );
}

export { CircleEditorPoint }

