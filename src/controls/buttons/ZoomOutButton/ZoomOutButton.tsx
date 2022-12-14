import * as React from 'react';
import { useMap, ViewState } from 'react-map-gl';

import { IMapButtonProps, MapButton } from '../MapButton';

/**
 * The `ZoomInButton` zooms the map out when clicked.  It respects the min and 
 * max zoom levels of the map. 
 * The current map ViewState must be passed to this control.
 * 
 * @example
 * ```tsx
  * <ZoomOutButton disabled {...this.state.viewState} x={40} y={250} hint={<>Zoom out</>}/>
 * ```
 */
const ZoomOutButton = (p: IMapButtonProps & ViewState) => {
  const { current: map } = useMap();
  return (
    <MapButton 
      disabled={p.zoom <= map.getMinZoom()} 
      onClick={() => map.zoomOut()} 
      {...p}>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M93.2,36.4c1.9,0,3.5,0.7,4.8,2c1.3,1.3,2,2.9,2,4.8v13.6c0,1.9-0.7,3.5-2,4.8c-1.3,1.3-2.9,2-4.8,2H63.6H6.8c-1.9,0-3.5-0.7-4.8-2c-1.3-1.3-2-2.9-2-4.8V43.2c0-1.9,0.7-3.5,2-4.8c1.3-1.3,2.9-2,4.8-2"/>
      </svg>
    </MapButton>
  );
}

export { ZoomOutButton }
