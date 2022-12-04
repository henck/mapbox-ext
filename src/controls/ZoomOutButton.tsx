import * as React from 'react';

import { useMap, ViewState } from 'react-map-gl';
import { IMapButtonProps, MapButton } from './MapButton';

const ZoomOutButton = (p: IMapButtonProps & ViewState) => {
  const { current: map } = useMap();
  return (
    <MapButton disabled={p.zoom <= map.getMinZoom()} onClick={() => map.zoomOut()} {...p}>
      <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M1600 736v192q0 40-28 68t-68 28h-1216q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h1216q40 0 68 28t28 68z"/>
      </svg>
    </MapButton>
  );
}

export { ZoomOutButton }
