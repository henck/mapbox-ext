/** @module @ignore */
import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, MapboxGeoJSONFeature, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { PointCollection } from '../../types/Types';
import { POINTS_LAYER, POLYGON_CIRCLE_COLOR, POLYGON_CIRCLE_STROKE_COLOR, POLYGON_FILL_COLOR_VALID } from '../EditorConfig';

interface IPolygonEditorPointsProps {
  /** Polygon points. */
  points: PointCollection;
  /** Fired when points change. */
  onChange: (points: PointCollection) => void;
}

let points: PointCollection = [];

const PolygonEditorPoints = (props: IPolygonEditorPointsProps) => {
  const { current: map } = useMap();
  let selectedPoint: MapboxGeoJSONFeature = null;
  let dragging: boolean = false;
  let pointIndex: number = null;

  const handleKeydown = (e: KeyboardEvent) => {
    switch(e.code) {
      case 'NumpadDecimal':
      case 'Backspace':
        if(pointIndex !== null) {
          e.preventDefault();
          deleteCurrentPoint();
        }
        break;
    }
  }  

  const deleteCurrentPoint = () => {
    if(pointIndex == null) return;
    const newPoints = points.slice();
    newPoints.splice(pointIndex, 1);
    // Warning: this may leave fewer than 3 points!
    props.onChange(newPoints);    
  }

  const handleMouseEnter = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = 'pointer';
  }

  const handleMouseLeave = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = '';
  }

  const handleMouseDown = (e: MapLayerMouseEvent) => {
    pointIndex = e.features[0].id as number;
    if(selectedPoint) map.setFeatureState(selectedPoint, { selected: false });
    map.setFeatureState(e.features[0], { selected: true });
    selectedPoint = e.features[0];
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
    if(pointIndex === null) return;
    let newPoints = points.slice();
    newPoints[pointIndex].lng = e.lngLat.lng;
    newPoints[pointIndex].lat = e.lngLat.lat;
    props.onChange(newPoints);
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    e.preventDefault();
  }

  const mount = () => {
    // Start listening to keyboard:
    document.addEventListener('keydown', handleKeydown);        
    // Register for clicks and moves:
    map.on('mouseenter', POINTS_LAYER, handleMouseEnter);
    map.on('mouseleave', POINTS_LAYER, handleMouseLeave);
    map.on('mousedown', POINTS_LAYER, handleMouseDown);
    map.on('mouseup', POINTS_LAYER, handleMouseUp);
    map.on('mousemove', handleMouseMove);
    map.on('click', POINTS_LAYER, handleClick);
  }

  const unmount = () => {
    // Stop listing to keyboard:
    document.removeEventListener('keydown', handleKeydown);    
    // Unregister for clicks and moves:
    map.off('mouseleave', POINTS_LAYER, handleMouseLeave);
    map.off('mouseenter', POINTS_LAYER, handleMouseEnter);
    map.off('mousedown', POINTS_LAYER, handleMouseDown);
    map.on('mouseup', POINTS_LAYER, handleMouseUp);
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
    points = props.points.slice();
  }, [props.points]);

  // Convert points to a FeatureCollection:
  const getJSON = (): FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: props.points.map((p, idx) => { return {
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

  return (
    <Source type="geojson" data={getJSON()}>
      <Layer 
        id={POINTS_LAYER}
        interactive
        type="circle"
        paint={{
          "circle-color": POLYGON_CIRCLE_COLOR,
          "circle-stroke-color": POLYGON_CIRCLE_STROKE_COLOR,
          "circle-radius": [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            5,
            3
          ],
          "circle-stroke-width": 2
        }}
      />
    </Source>
  );
}

export { PolygonEditorPoints }

