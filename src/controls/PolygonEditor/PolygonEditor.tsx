import * as React from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import { IPoint, PointCollection } from '../../types/Types';
import { PolygonEditorSurface } from './PolygonEditorSurface';
import { PolygonEditorPoints } from './PolygonEditorPoints';
import { PolygonEditorExtenders } from './PolygonEditorExtenders';
import { PolygonEditorScaler } from './PolygonEditorScaler';

interface IPolygonEditorProps {
  /** 
   * Points of polygon being drawn. The first point must not be duplicated
   * as the last point.
   */
  points: PointCollection;
  /** Fired when polygon's points change. */
  onChange: (points: PointCollection) => void;
  /** Fired when polygon is deleted. */
  onDelete: () => void;
  /** Fired when drawing mode is canceled. */
  onCancel: () => void;
  /** Can polygon be scaled? This will add a scaling box around the polygon. */
  allowScaling?: boolean;
}

const PolygonEditor = (props: IPolygonEditorProps) => {
  const { current: map } = useMap();

  const [points, setPoints] = React.useState(props.points);

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

  const handleChange = (newPoints: PointCollection) => {
    setPoints(newPoints);
    if(newPoints.length < 3) {
      props.onDelete();
    } else {
      props.onChange(newPoints);
    }
  }

  return (
    <>
      <PolygonEditorSurface   points={points} onChange={handleChange} />
      <PolygonEditorPoints    points={points} onChange={handleChange}/>
      <PolygonEditorExtenders points={points} onChange={handleChange}/>
      {props.allowScaling && <PolygonEditorScaler points={points} onChange={handleChange}/>}
    </>
  );
}

export { PolygonEditor, IPolygonEditorProps }
