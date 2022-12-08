import * as React from 'react';
import { useMap, ViewState } from 'react-map-gl';

import { IMapButtonProps, MapButton } from './MapButton';

/**
 * The `ZoomInButton` zooms the map in when clicked.  It respects the min and 
 * max zoom levels of the map. 
 * The current map ViewState must be passed to this control.
 * 
 * @example
 * ```tsx
 * <ZoomInButton active {...this.state.viewState} x={40} y={200} hint={<>Zoom in</>}/>
 * ```
 */
const ZoomInButton = (p: IMapButtonProps & ViewState) => {
  const { current: map } = useMap();
  return (
    <MapButton 
      disabled={p.zoom >= map.getMaxZoom()} 
      onClick={() => map.zoomIn()} 
      {...p}>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M100,43.2v13.6c0,1.9-0.7,3.5-2,4.8c-1.3,1.3-2.9,2-4.8,2H63.6v29.5c0,1.9-0.7,3.5-2,4.8c-1.3,1.3-2.9,2-4.8,2H43.2c-1.9,0-3.5-0.7-4.8-2c-1.3-1.3-2-2.9-2-4.8V63.6H6.8c-1.9,0-3.5-0.7-4.8-2c-1.3-1.3-2-2.9-2-4.8V43.2c0-1.9,0.7-3.5,2-4.8c1.3-1.3,2.9-2,4.8-2h29.5V6.8c0-1.9,0.7-3.5,2-4.8c1.3-1.3,2.9-2,4.8-2h13.6c1.9,0,3.5,0.7,4.8,2c1.3,1.3,2,2.9,2,4.8v29.5h29.5c1.9,0,3.5,0.7,4.8,2C99.3,39.7,100,41.3,100,43.2z"/>
      </svg>
    </MapButton>
  );
}

export { ZoomInButton }
