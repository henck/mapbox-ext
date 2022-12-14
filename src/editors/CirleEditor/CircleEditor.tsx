import { FeatureCollection } from 'geojson';
import * as React from 'react';
import { Layer, MapboxGeoJSONFeature, MapLayerMouseEvent, Source, useMap } from 'react-map-gl';
import { Polygon } from '../../functions/Polygon';
import { IPoint } from '../../types/Types';
import { NUM_CIRCLE_POINTS, POINTS_LAYER, POLYGON_CIRCLE_COLOR, POLYGON_CIRCLE_STROKE_COLOR, POLYGON_FILL_COLOR_VALID, POLYGON_LAYER, POLYGON_LINE_COLOR_VALID } from '../EditorConfig';
import { CircleEditorPoint } from './CircleEditorPoint';
import { CircleEditorSurface } from './CircleEditorSurface';

interface ICircleEditorProps {
  point: IPoint;
  radius: number;
  /** Fired when polygon's points change. */
  onChange: (point: IPoint, radius: number) => void;
  /** Fired when polygon is deleted. */
  onDelete: () => void;
  /** Fired when drawing mode is canceled. */
  onCancel: () => void;
}

const CircleEditor = (props: ICircleEditorProps) => {
  const { current: map } = useMap();

  const [point, setPoint] = React.useState(props.point);
  const [radius, setRadius] = React.useState(props.radius);

  const handleKeydown = (e: KeyboardEvent) => {
    switch(e.code) {
      case 'Escape':
      case 'Backspace':
        map.getCanvas().style.cursor = '';
        props.onCancel();
        break;
      case 'NumpadDecimal':
      case 'Backspace':
        if(!e.defaultPrevented) props.onDelete();
        break;        
    }
  }   

  const handleClick = (e: MapLayerMouseEvent) => {
    // Clicking the polygon child will prevent this default handling:
    if(e.defaultPrevented) return;
    props.onCancel();
  }

  const mount = () => {
    // Start listening to keyboard:
    document.addEventListener('keydown', handleKeydown);            
    map.on('click', handleClick);
  }

  const unmount = () => {
    // Stop listening to keyboard:
    document.removeEventListener('keydown', handleKeydown);            
    map.off('click', handleClick);
  }

  // Mounting/unmounting must only happen once:
  React.useEffect(() => {
    mount();
    return unmount
  }, []);

  const handleChange = (newPoint: IPoint, newRadius: number) => {
    setPoint(newPoint);
    setRadius(newRadius);
    props.onChange(newPoint, newRadius);
  }

  return (
    <>
      <CircleEditorSurface  point={point} radius={radius} onChange={handleChange} />
      <CircleEditorPoint    point={point} radius={radius} onChange={handleChange}/>
    </>
  );
}

export { CircleEditor, ICircleEditorProps }
