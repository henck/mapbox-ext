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
      <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/>
      </svg>
    </MapButton>
  );
}

export { ZoomInButton }
