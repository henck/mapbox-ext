import * as React from 'react';
import { FeatureCollection } from 'geojson';
import { Layer, LngLat, MapboxGeoJSONFeature, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { PointCollection } from '../../types/Types';
import { Polygon } from '../../functions/Polygon';
import { POINTS_LAYER, POLYGON_FILL_COLOR_INVALID, POLYGON_FILL_COLOR_VALID, POLYGON_LAYER, POLYGON_LINE_COLOR_VALID } from '../../types/EditorConfig';

interface IPolygonEditorSurfaceProps {
  /** Polygon points. */
  points: PointCollection;
  /** Fired when points change. */
  onChange: (points: PointCollection) => void;
}

let startDragPoints: PointCollection;

const PolygonEditorSurface = (props: IPolygonEditorSurfaceProps) => {
  const { current: map } = useMap();
  // Currently dragging?
  let dragging = false;
  // Point where dragging began:
  let dragSource: LngLat = null;
  // Original points when dragging began:
  let currentdragPoints: PointCollection;

  const handleMouseDown = (e: MapLayerMouseEvent) => {
    if(e.features.find((f: MapboxGeoJSONFeature) => f.layer.id != POLYGON_LAYER)) return;
    // Disable map drag:
    map.getMap().dragPan.disable();
    map.getCanvas().style.cursor = 'move';
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
    const dLat = e.lngLat.lat - dragSource.lat;
    const dLng = e.lngLat.lng - dragSource.lng;
    const newPoints = currentdragPoints.map(p => { 
      return {
        lat: p.lat + dLat,
        lng: p.lng + dLng
      }
    });
    props.onChange(newPoints);
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
    startDragPoints = props.points.slice();
  }, [props.points]);
  
  // Convert polygon's points to a FeatureCollection. The first point is 
  // duplicated as the last point as this is required in GeoJSON.
  const getJSON = (): FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: [{ 
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [props.points.map(p => [p.lng, p.lat]).concat([[props.points[0].lng, props.points[0].lat]])]
        }
      }]
    }
  }

  return (
    <Source type="geojson" data={getJSON()}>
      <Layer
        id={POLYGON_LAYER}
        interactive
        type="fill"
        paint={{
          "fill-color": Polygon.isValid(props.points) ? POLYGON_FILL_COLOR_VALID : POLYGON_FILL_COLOR_INVALID,
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

export { PolygonEditorSurface }
