import * as React from 'react';

import { useMap, ViewState } from 'react-map-gl';
import { IMapButtonProps, MapButton } from './MapButton';

const PitchButton = (p: IMapButtonProps & ViewState & { visualizePitch?: boolean }) => {
  const { current: map } = useMap();
  return (
    <MapButton onClick={() => map.rotateTo(0)} {...p}>
      <div style={{transform: `rotateX(${p.visualizePitch ? p.pitch : 0}deg)`}} >
        <svg style={{transform: `rotateZ(${-p.bearing}deg)`}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000">
          <polygon points="100,1000 500,0 900,1000 500,700 "/>
        </svg>
      </div>
    </MapButton>
  );
}

export { PitchButton }
