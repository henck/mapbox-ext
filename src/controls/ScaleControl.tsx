import * as React from 'react';
import { ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

const DEFAULT_WIDTH = 100;

interface IProps {
  className?: string;
  anchor: number[];
  /** Control's base width (px). Defaults to 100px */
  width?: number; 
}

const STEPS = [
  1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 
  20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000, 2000000,
  3000000, 5000000
];

class ScaleControlBase extends React.Component<IProps & ViewState> {
  //
  // Given a distance in meters, determine a rounded value.
  // 
  getRoundedMeters = (meters: number) => {
    let current_diff = 999999999;
    let dist = 0;    
    STEPS.forEach(step => {
      const diff = Math.abs(meters - step);
      if(diff < current_diff) {
        current_diff = diff;
        dist = step;
      }
    });
    return dist;
  }

  formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  //
  // Convert distance in meters to human-readable text (with units).
  //
  getHumanText = (meters: number) => {
    if(meters >= 1000) {
      return `${this.formatNumber(meters / 1000)}km`;
    } else {
      return `${this.formatNumber(meters)}m`;
    }
  }

  render = () => {
    const p = this.props;
    const meterspx = 156543.03392 * Math.cos(p.latitude * Math.PI / 180) / Math.pow(2, p.zoom + 1);

    let width = p.width ?? DEFAULT_WIDTH;
    let meters = width * meterspx;
    const dist = this.getRoundedMeters(meters);
    width = width * dist / meters;

    return (
      <div className={p.className} style={{width: `${width}px`}}>
        {this.getHumanText(dist)}
      </div>
    );
  }
}

const ScaleControlStyled = styled(ScaleControlBase)`
  position: absolute;
  z-index: 1;
  ${p => p.anchor[0] >= 0 && css`left: ${p.anchor[0]}px;`}
  ${p => p.anchor[0] < 0 && css`right: ${-p.anchor[0]}px;`}
  ${p => p.anchor[1] >= 0 && css`top: ${p.anchor[1]}px;`}
  ${p => p.anchor[1] < 0 && css`bottom: ${-p.anchor[1]}px;`}    

  box-sizing: border-box;
  border: solid 2px #333333;
  border-top: none;
  user-select: none;
  pointer-events: none;
  width: 200px;
  height: 20px;
  background: #C7C7C7;
  font-size: 10px;
  color: #333;
  padding-left: 5px;
  white-space: nowrap;
`

/** 
 * Adds a ScaleControl to the map. 
 */
class ScaleControl extends React.Component<IProps> {
  render = () => <ScaleControlStyled {...this.props as any}/>
}

export { ScaleControl }
