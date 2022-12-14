import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, LngLat, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { PointCollection } from '../../types/Types';
import { POLYGON_SCALER_COLOR, SCALER_LAYER } from '../../types/EditorConfig';

interface IPolygonEditorScalerProps {
  /** Polygon points. */
  points: PointCollection;
  /** Fired when points change. */
  onChange: (points: PointCollection) => void;
}

let startDragPoints: PointCollection;

const PolygonEditorScaler = (props: IPolygonEditorScalerProps) => {
  const { current: map } = useMap();
  // Currently dragging?
  let dragging = false;
  // Point where dragging began:
  let dragSource: LngLat = null;
  // Original points when dragging began:
  let currentdragPoints: PointCollection;

  const handleMouseEnter = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = 'nesw-resize';
  }

  const handleMouseLeave = (e: MapLayerMouseEvent) => {
    if(!dragging) map.getCanvas().style.cursor = '';
  }  

  const handleMouseDown = (e: MapLayerMouseEvent) => {
    // Disable map drag:
    map.getMap().dragPan.disable();
    map.getCanvas().style.cursor = 'nesw-resize';
    dragging = true;

    dragSource = e.lngLat;
    currentdragPoints = startDragPoints;
  }

  const handleMouseUp = (e: MapLayerMouseEvent) => {
    // Re-enable map drag:
    map.getMap().dragPan.enable();
    map.getCanvas().style.cursor = '';
    dragging = false;
  }

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    if(!dragging) return;

    // Calculate polygon centroid.
    const centerLng = currentdragPoints.map(p => p.lng).reduce((a, b) => (a + b)) / currentdragPoints.length;
    const centerLat = currentdragPoints.map(p => p.lat).reduce((a, b) => (a + b)) / currentdragPoints.length;

    // Old distance from scale-point to centroid:
    const oldDLat = dragSource.lat - centerLat;
    const oldDLng = dragSource.lng - centerLng;

    // New distance from scale-point to centroid:
    const newDLat = e.lngLat.lat - centerLat;
    const newDLng = e.lngLat.lng - centerLng;

    // Ratio is the ratio of the new distance to the old one:
    let ratioLat = newDLat / oldDLat;
    let ratioLng = newDLng / oldDLng;

    // Lock aspect ratio:
    if (e.originalEvent.shiftKey) {
    if(Math.abs(ratioLat) > Math.abs(ratioLng)) {
      ratioLng = ratioLat;
    } else {
      ratioLat = ratioLng;
    }
  }
    
    // For each point:
    // Calculate distance to centroid.
    // Multiply distance by ratio.
    const newPoints = currentdragPoints.map(p => { 
      const dLat = centerLat + (p.lat - centerLat) * ratioLat;
      const dLng = centerLng + (p.lng - centerLng) * ratioLng;
      return { lat: dLat, lng: dLng }
    });
    props.onChange(newPoints);
  }

  const mount = () => {
    // Register for clicks and moves:
    map.on('mouseenter', SCALER_LAYER, handleMouseEnter);
    map.on('mouseleave', SCALER_LAYER, handleMouseLeave);    
    map.on('mousedown', SCALER_LAYER, handleMouseDown);
    map.on('mouseup', handleMouseUp);
    map.on('mousemove', handleMouseMove);
  }

  const unmount = () => {
    // Unregister for clicks and moves:
    map.off('mouseenter', SCALER_LAYER, handleMouseEnter);
    map.off('mouseleave', SCALER_LAYER, handleMouseLeave);    
    map.off('mousedown', SCALER_LAYER, handleMouseDown);
    map.off('mouseup', handleMouseUp);
    map.off('mousemove', handleMouseMove);
  }

  // Mounting/unmounting must only happen once.
  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  // startDragPoints must be updated every time the props points are updated.
  React.useEffect(() => {
    startDragPoints = props.points.slice();
  }, [props.points]);
  
  const getRectCoords = () => {
    // - Calculate bbox of polygon
    // - Move point left/right by 5% of width
    // - Move points up/down by 5% of height    
    let minLat = Math.min(...props.points.map(p => p.lat));
    let maxLat = Math.max(...props.points.map(p => p.lat));
    let minLng = Math.min(...props.points.map(p => p.lng));
    let maxLng = Math.max(...props.points.map(p => p.lng));
    const height = Math.abs(maxLat - minLat);
    const width = Math.abs(maxLng - minLng);
    minLat -= 0.05 * height;
    maxLat += 0.05 * height;
    minLng -= 0.05 * width;
    maxLng += 0.05 * width;
    return [ minLng, minLat, maxLng, maxLat ];
  }

  // Calculate a bounding box around the polygon, at 5% distance from the
  // polygon's vertices.
  const getRectangleJSON = (): FeatureCollection => {
    const [ minLng, minLat, maxLng, maxLat ] = getRectCoords();
    return {
      type: 'FeatureCollection',
      features: [{ 
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[ 
            [ minLng, maxLat ], 
            [ maxLng, maxLat ], 
            [ maxLng, minLat ],
            [ minLng, minLat ],
            [ minLng, maxLat ]
          ]]
        }
      }]
    }
  }

  // Calculate the location of a single point at the bottom right of the 
  // polygon.
  const getPointJSON = (): FeatureCollection => {
    const [ , minLat, maxLng, ] = getRectCoords();
    return {
      type: 'FeatureCollection',
      features: [{ 
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [ maxLng, minLat ]
        }
      }]
    }    
  }

  return (
    <>
    <Source type="geojson" data={getRectangleJSON()}>
      <Layer
        type="line"
        paint={{
          "line-color": "white",
          "line-width": 1,
          "line-dasharray": [ 2, 2 ]
        }}
      />
    </Source>
    <Source type="geojson" data={getPointJSON()}>
      <Layer
        id={SCALER_LAYER}
        type="circle"
        interactive
        paint={{
          "circle-color": POLYGON_SCALER_COLOR,
          "circle-radius": 5
        }}
      />
    </Source>
    </>
  );
}

export { PolygonEditorScaler }
