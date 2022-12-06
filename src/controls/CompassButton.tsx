import * as React from 'react';
import { useMap, ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

import { IMapButtonProps, MapButton } from './MapButton';

interface IProps {
  /** 
   * Should pitch be visualized why tilting the arrow along the z-axis,
   * i.e. away from the viewer?
   */
  visualizePitch?: boolean;
  /**
   * Should the tip of the compass arrow be highlighted in a different color?
   * This value can either be true for a default red, or a custom color value.
   */
  contrastTip?: boolean | string;
}

const CompassButtonBase = (p: IMapButtonProps & ViewState & IProps) => {
  const { current: map } = useMap();
  return (
    <MapButton onClick={() => { map.rotateTo(0); map.resetNorthPitch() }} {...p}>
      <div style={{transform: `rotateX(${p.visualizePitch ? p.pitch : 0}deg)`}} >
        <svg style={{transform: `rotateZ(${-p.bearing}deg)`}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000">
          <polygon className="tip" points="100,1000 500,0 900,1000 500,700 "/>
          <polygon className="arrow" points="500,0 423,192.6 500,351.6 577,192.6 "/>          
        </svg>
      </div>
    </MapButton>
  );
}

const CompassButtonStyled = styled(CompassButtonBase)`
  /* Add custom tip color if specified. */
  ${p => p.contrastTip && css`
    svg polygon.arrow {
      fill: ${typeof p.contrastTip === "string" ? p.contrastTip : "red"};
    }`
  }
`

/**
 * The `CompassButton` shows a bearing arrow which points to the north. 
 * It optionally tilts the arrow to reflect the current pitch. 
 * 
 * The current map ViewState must be passed to this control.
 */

const CompassButton = (p: IMapButtonProps & ViewState & IProps) => <CompassButtonStyled {...p}/>

export { CompassButton, IProps }
