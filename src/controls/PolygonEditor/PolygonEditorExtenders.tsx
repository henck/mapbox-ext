import * as React from 'react';
import { FeatureCollection, Point } from 'geojson';
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';

import { PointCollection } from '../../types/Types';
import { EXTENDERS_LAYER, POLYGON_LINE_COLOR_VALID } from '../../types/EditorConfig';

interface IPolygonEditorExtendersProps {
  /** Points from which to derive extender points. */
  points: PointCollection;
  /** Fired when points change. */
  onChange: (points: PointCollection) => void;
}

let points: PointCollection = [];

const PolygonEditorExtenders = (props: IPolygonEditorExtendersProps) => {
  const { current: map } = useMap();

  const handleMouseEnter = (e: MapLayerMouseEvent) => {
    map.getCanvas().style.cursor = 'crosshair';
  }

  const handleMouseLeave = (e: MapLayerMouseEvent) => {
    map.getCanvas().style.cursor = '';
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    e.preventDefault();
    const p = e.features[0];
    const idx:number = p.id as number;
    const geometry = p.geometry as Point;
    let newPoints = points.slice();
    newPoints.splice(idx + 1, 0, { lng: geometry.coordinates[0], lat: geometry.coordinates[1] });
    props.onChange(newPoints);    
  }

  const mount = () => {
    // Register for clicks and moves:
    map.on('mouseenter', EXTENDERS_LAYER, handleMouseEnter);
    map.on('mouseleave', EXTENDERS_LAYER, handleMouseLeave);
    map.on('click', EXTENDERS_LAYER, handleClick);
  }

  const unmount = () => {
    // Unregister for clicks and moves:
    map.off('mouseenter', EXTENDERS_LAYER, handleMouseEnter);
    map.off('mouseleave', EXTENDERS_LAYER, handleMouseLeave);
    map.off('click', EXTENDERS_LAYER, handleClick);
  }

  // Mount/unmount only once:
  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  React.useEffect(() => {
    points = props.points.slice();
  }, [props.points]);

  const getJSON = (): FeatureCollection => {
    // For each two points, we need a middle point.
    // Each middle point needs an index so we know where to insert it.
    const extenderPoints: PointCollection = [];
    for(let i = 0; i < props.points.length; i++) {
      const a = props.points[i];
      const b = i == props.points.length - 1 ? props.points[0] : props.points[i+1];
      const lat = a.lat + (b.lat - a.lat) / 2;
      const lng = a.lng + (b.lng - a.lng) / 2;
      extenderPoints.push({ lng: lng, lat: lat });
    }

    return {
      type: 'FeatureCollection',
      features: extenderPoints.map((p, idx) => { return {
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
        id={EXTENDERS_LAYER}
        interactive
        type="circle"
        paint={{
          "circle-color": POLYGON_LINE_COLOR_VALID,
          "circle-radius": 3
        }}
      />      
    </Source>
  );
}

export { PolygonEditorExtenders }

