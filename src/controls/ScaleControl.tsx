import * as React from 'react';
import { ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

const DEFAULT_WIDTH = 100;

interface IProps {
  /** @ignore */
  className?: string;
  /**
   * Control horizontal position. A negative value means offset from the right.
   */
  x: number;
  /**
   * Control vertical position. A negative value means offset from the bottom.
   */
  y: number;
  /** 
   * Control's base width (px). The width may expand to double this.
   * @defaultValue 100
   */
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
  private getRoundedMeters = (meters: number) => {
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

  private formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  //
  // Convert distance in meters to human-readable text (with units).
  //
  private getHumanText = (meters: number) => {
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
    const meters = width * meterspx;
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
  ${p => p.x >= 0 && css`left: ${p.x}px;`}
  ${p => p.x < 0 && css`right: ${-p.x}px;`}
  ${p => p.y >= 0 && css`top: ${p.y}px;`}
  ${p => p.y < 0 && css`bottom: ${-p.y}px;`}    

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
 * The `ScaleControl` shows a scale in meters per pixel.
 * 
 * The control is positioned using `x` and `{y}`. Negative coordinates mean 
 * offsets from right and bottom.
 */
const ScaleControl = (p: IProps & ViewState) => <ScaleControlStyled {...p}/>

export { ScaleControl, IProps }
