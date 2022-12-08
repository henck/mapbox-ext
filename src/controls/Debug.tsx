import * as React from 'react';
import { LngLatLike, ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

interface IDebugProps {
  className?: string;
  x: number;
  y: number;
  mouseLat: number;
  mouseLng: number;
}

const DebugBase = (props: IDebugProps & ViewState) => {
  const format = (x: number, decimals: number): string => {
    return x.toLocaleString(undefined, { 
      useGrouping: true, 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals });    
  }
  return (
    <div className={props.className}>
      <table>
        <tbody>
          <tr><td>Zoom</td><td>{format(props.zoom, 2)}</td></tr>
          <tr><td>Map latitude</td><td>{format(props.latitude, 4)}</td></tr>
          <tr><td>Map longitude</td><td>{format(props.longitude, 4)}</td></tr>
          <tr><td>Mouse latitude</td><td>{format(props.mouseLat, 4)}</td></tr>
          <tr><td>Mouse longitude</td><td>{format(props.mouseLng, 4)}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

const Debug = styled(DebugBase)`
  position: absolute;
  z-index: 1000;
  ${p => p.x >= 0 && css`left: ${p.x}px;`}
  ${p => p.x < 0 && css`right: ${-p.x}px;`}
  ${p => p.y >= 0 && css`top: ${p.y}px;`}
  ${p => p.y < 0 && css`bottom: ${-p.y}px;`}  

  background: white;
  color: black;
  border-radius: 8px;
  pointer-events: none;
  user-select: none;
  padding: 10px 16px 10px 16px;
  box-shadow: 2px 2px 2px rgb(0,0,0,0.5);

  td:first-child {
    padding-right: 12px;
  }
  td:last-child {
    text-align: right;
    font-weight: bold;
  }
`

export { Debug }