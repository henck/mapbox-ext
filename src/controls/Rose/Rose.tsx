import * as React from 'react';
import { ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

interface IRoseProps {
  /** @ignore */
  className?: string;
  /** Horizontal compass rose position. A negative value is an offset from the right. */
  x: number;
  /** Vertical compass rose position. A negative value is an offset from the bottom. */
  y: number;
  /** Optional compass rose size (px). Defaults to 150. */
  size?: number;
  /** Optional foreground (background) color. */
  foreground?: string;
  /** Optional background (foreground) color. */
  background?: string;
  /** 
   * Should pitch be visualized why tilting the compass rose along the z-axis,
   * i.e. away from the viewer?
   */  
  visualizePitch?: boolean;
  /**
   * Should wind direction letters be hidden?
   */
  hideLetters?: boolean;
}

const RoseBase = (props: IRoseProps & ViewState) => 
  <div className={props.className} style={{transform: `rotateX(${props.visualizePitch ? props.pitch : 0}deg)`}} >
    <svg style={{transform: `rotateZ(${-props.bearing}deg)`}} 
      version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
      <g> {/* Outer circle */}
        <path className="foreground" d="M51,16.5c-18.7,0-33.9,15.2-33.9,33.9c0,18.7,15.2,33.9,33.9,33.9c18.7,0,33.9-15.2,33.9-33.9
          C84.9,31.7,69.7,16.5,51,16.5z M51,81.4c-17.1,0-31-13.9-31-31c0-17.1,13.9-31,31-31c17.1,0,31,13.9,31,31
          C82,67.5,68.1,81.4,51,81.4z"/>
        <path className="background" d="M51,19.4c-17.1,0-31,13.9-31,31c0,17.1,13.9,31,31,31c17.1,0,31-13.9,31-31
          C82,33.3,68.1,19.4,51,19.4z M51,78c-15.2,0-27.6-12.4-27.6-27.6c0-15.2,12.4-27.6,27.6-27.6c15.2,0,27.6,12.4,27.6,27.6
          C78.6,65.6,66.2,78,51,78z"/>
        <path className="foreground" d="M51,22.8c-15.2,0-27.6,12.4-27.6,27.6C23.4,65.6,35.7,78,51,78c15.2,0,27.6-12.4,27.6-27.6
          C78.6,35.1,66.2,22.8,51,22.8z M51,77.1c-14.8,0-26.8-12-26.8-26.8s12-26.8,26.8-26.8s26.8,12,26.8,26.8S65.8,77.1,51,77.1z"/>
      </g>
      <g> {/* Lower star */}
        <polygon className="foreground" points="57,50.3 69.9,31.4 51,44.4 32.1,31.4 45,50.4 32,69.3 51,56.4 69.9,69.3 	"/>
        <polygon className="background" points="54.2,53.7 68.3,33.2 54.4,47.2 33.8,33 47.8,47 33.6,67.6 47.6,53.6 
          68.2,67.7 	"/>
      </g>
      <g> {/* Upper circle */}
        <polygon className="foreground" points="51,90.9 44.8,56.6 10.5,50.4 44.8,44.2 51,9.9 57.2,44.2 91.5,50.4 57.2,56.6 	"/>
        <polygon className="background" points="13.6,50.4 50.5,50.4 44.7,44.6 	"/>
        <polygon className="background" points="51,13 51,49.9 56.8,44.1 	"/>
        <polygon className="background" points="88.4,50.4 51.5,50.4 57.3,56.2 	"/>
        <polygon className="background" points="51,87.8 51,50.9 45.2,56.7 	"/>
      </g>
      {!props.hideLetters && <>
        <g> {/* North */}
          <path className="foreground" d="M48.2,3.9h1.9l3.3,3.4V5.3c0-0.3,0-0.5-0.1-0.7c-0.1-0.2-0.2-0.3-0.4-0.4c-0.1-0.1-0.2-0.1-0.3-0.1
            c-0.1,0-0.2,0-0.4-0.1V3.9h2.4V4h0c-0.3,0-0.6,0.1-0.8,0.3c-0.2,0.2-0.3,0.5-0.3,1v3.4h-0.1l-4.1-4.2v2.8c0,0.3,0,0.5,0.1,0.7
            c0.1,0.2,0.2,0.3,0.3,0.4c0.1,0.1,0.3,0.1,0.4,0.1c0.1,0,0.2,0,0.4,0v0.1h-2.5V8.5c0.3,0,0.5-0.1,0.6-0.1c0.2-0.1,0.3-0.2,0.4-0.3
            c0.1-0.2,0.1-0.3,0.1-0.6V4.8c0-0.2,0-0.3-0.1-0.4c-0.1-0.1-0.2-0.2-0.3-0.3C48.6,4,48.4,4,48.2,4h-0.1V3.9z"/>
        </g>
        <g> {/* East */}
          <path className="foreground" d="M92.1,47.9h5.1v1.8h-0.1c-0.1-0.3-0.2-0.6-0.3-0.7c-0.1-0.2-0.2-0.3-0.3-0.5c-0.1-0.2-0.3-0.3-0.5-0.4
            c-0.3-0.1-0.6-0.2-1-0.2h-0.9v2.3h0.3c0.4,0,0.7-0.2,0.9-0.5c0.1-0.2,0.2-0.4,0.3-0.6c0-0.1,0.1-0.2,0.1-0.4h0.1v3.1h-0.1
            c0-0.2-0.1-0.3-0.1-0.5c0-0.1-0.1-0.3-0.1-0.4c0-0.1-0.1-0.2-0.2-0.3c-0.2-0.3-0.5-0.4-0.9-0.4h-0.2v2.1h0.8c0.2,0,0.4,0,0.6,0
            c0.2,0,0.4-0.1,0.5-0.2c0.1-0.1,0.3-0.2,0.4-0.3c0.2-0.2,0.4-0.4,0.5-0.7c0.1-0.2,0.1-0.4,0.2-0.7h0.1v2h-5.2l0-0.1h0.1
            c0.6,0,0.9-0.3,0.9-0.9v-2.8c0-0.3-0.1-0.5-0.2-0.7c-0.1-0.1-0.4-0.2-0.7-0.2h-0.1V47.9z"/>
        </g>
        <g> {/* West */}
          <path className="foreground" d="M2.5,47.9H5l0,0.1c-0.2,0-0.4,0-0.4,0.1c-0.1,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.2,0.1,0.3l1,2.8l1-2.4
            c-0.1-0.2-0.1-0.4-0.2-0.5c-0.1-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.3-0.2c-0.1,0-0.2-0.1-0.3-0.1v-0.1H8v0.1H7.9
            c-0.2,0-0.4,0-0.5,0.1c-0.1,0.1-0.2,0.2-0.2,0.3c0,0.1,0,0.2,0,0.3l1,2.8l1-2.6c0.1-0.1,0.1-0.3,0.1-0.4c0-0.2-0.1-0.3-0.2-0.4
            c-0.1-0.1-0.3-0.1-0.6-0.1l0-0.1h1.9v0.1c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.2,0.1-0.3,0.2c-0.2,0.2-0.4,0.4-0.5,0.7L8,52.8H7.8
            l-1.3-3.6l-1.4,3.6H5L3.6,49c-0.1-0.3-0.3-0.6-0.4-0.7s-0.3-0.2-0.6-0.2H2.5V47.9z"/>
        </g>
        <g> {/* South */}
          <path className="foreground" d="M52.7,92.4h0.1V94h-0.1c-0.1-0.4-0.3-0.7-0.5-0.9c-0.1-0.2-0.3-0.3-0.5-0.4c-0.2-0.1-0.4-0.2-0.7-0.3
            c-0.2-0.1-0.5-0.1-0.8-0.1c-0.2,0-0.4,0-0.5,0.1c-0.1,0.1-0.3,0.1-0.4,0.2c-0.1,0.1-0.1,0.2-0.2,0.2c0,0.1-0.1,0.2-0.1,0.3
            c0,0.2,0.1,0.3,0.2,0.4c0.1,0.1,0.1,0.1,0.2,0.2c0.1,0.1,0.2,0.1,0.4,0.2c0.2,0.1,0.4,0.1,0.7,0.2c0.1,0,0.1,0,0.2,0l0.2,0l0.3,0.1
            c0.5,0.1,0.8,0.2,1,0.3c0.2,0.1,0.4,0.2,0.5,0.4c0.1,0.1,0.2,0.2,0.3,0.4s0.1,0.3,0.1,0.5c0,0.2,0,0.3-0.1,0.5
            c-0.1,0.2-0.2,0.3-0.3,0.4c-0.2,0.2-0.4,0.3-0.6,0.4c-0.2,0.1-0.5,0.1-0.8,0.1c-0.2,0-0.4,0-0.6-0.1c-0.2,0-0.4-0.1-0.7-0.2
            c-0.2-0.1-0.3-0.1-0.4-0.1c-0.1,0-0.2,0-0.3,0c-0.2,0-0.3,0-0.4,0.1c-0.1,0.1-0.2,0.2-0.2,0.4h-0.1v-2.2h0.1c0,0.4,0.2,0.7,0.5,1.1
            c0.2,0.2,0.4,0.4,0.6,0.5c0.3,0.2,0.5,0.3,0.8,0.4s0.5,0.1,0.8,0.1c0.2,0,0.4,0,0.6-0.1c0.2-0.1,0.3-0.2,0.4-0.3s0.2-0.3,0.2-0.4
            c0-0.2-0.1-0.3-0.2-0.5c-0.1-0.1-0.1-0.1-0.2-0.2c-0.1-0.1-0.2-0.1-0.4-0.2c-0.2-0.1-0.4-0.1-0.7-0.2l-0.3-0.1
            c-0.5-0.1-0.9-0.3-1.1-0.3c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.3,0.1-0.5,0.2-0.7
            s0.4-0.4,0.7-0.5c0.3-0.1,0.6-0.2,0.9-0.2c0.5,0,1.1,0.1,1.6,0.4c0.2,0.1,0.3,0.1,0.4,0.1C52.5,92.8,52.6,92.6,52.7,92.4z"/>
        </g>
      </>}
    </svg>
  </div>

const RoseStyled = styled(RoseBase).attrs(p => ({
  size:       p.size ?? 150,
  foreground: p.foreground ?? "#ccc",
  background: p.background ?? "#333"
}))`
  /* Position */
  position: absolute;
  z-index: 100;
  ${p => p.x >= 0 && css`left:   ${p.x + p.padding.left}px;`}
  ${p => p.x < 0  && css`right:  ${p.padding.right - p.x}px;`}
  ${p => p.y >= 0 && css`top:    ${p.y + p.padding.top}px;`}
  ${p => p.y < 0  && css`bottom: ${-p.y - p.padding.bottom}px;`}  

  /* Size */
  width:  ${p => p.size}px;
  height: ${p => p.size}px;

  /* Interaction */
  user-select: none;
  pointer-events: none;

  /* Appearance */
  svg {
  .foreground { fill: ${p => p.foreground}; }  
  .background { fill: ${p => p.background}; }
  }
`

/** 
 * The `Rose` component shows a compass rose on the screen, which rotates
 * along with the map bearing. 
 * 
 * Optionally, `visualizePitch` can be set to tilt the rose according to the 
 * current pitch as well. Compass direction letters can be hidden. The colors 
 * (`foreground` and `background` can optionally set and default to monochrome.
 */
const Rose = (props: IRoseProps & ViewState) => <RoseStyled {...props}/>

export { Rose, IRoseProps }
