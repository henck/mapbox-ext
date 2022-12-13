import * as React from 'react';
import { MapLayerMouseEvent, useMap, ViewState } from 'react-map-gl';
import styled, { css } from 'styled-components';

interface IDebugProps {
  /** @ignore */
  className?: string;
  /** Horizontal debug position. A negative value is an offset from the right. */
  x: number;
  /** Vertical debug position. A negative value is an offset from the bottom. */
  y: number;
}

const DebugBase = (props: IDebugProps & ViewState) => {
  const { current: map } = useMap();
  const [ mouseLat, setMouseLat ] = React.useState(0);
  const [ mouseLng, setMouseLng ] = React.useState(0);

  const format = (x: number, decimals: number): string => {
    return x.toLocaleString(undefined, { 
      useGrouping: true, 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals });    
  }

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    setMouseLng(e.lngLat.lng);
    setMouseLat(e.lngLat.lat);
  }

  const mount = () => {
    map.on('mousemove', handleMouseMove);
  }

  const unmount = () => {
    map.off('mousemove', handleMouseMove);
  }

  // Mounting/unmounting must only happen once.
  React.useEffect(() => {
    mount();
    return unmount
  }, []);    

  return (
    <div className={props.className}>
      <table>
        <tbody>
          <tr><td>Zoom            </td><td>{format(props.zoom, 2)}</td></tr>
          <tr><td>Map latitude    </td><td>{format(props.latitude, 4)}</td></tr>
          <tr><td>Map longitude   </td><td>{format(props.longitude, 4)}</td></tr>
          <tr><td>Mouse latitude  </td><td>{format(mouseLat, 4)}</td></tr>
          <tr><td>Mouse longitude </td><td>{format(mouseLng, 4)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const DebugStyled = styled(DebugBase)`
  /* Position */
  position: absolute;
  z-index: 1000;
  ${p => p.x >= 0 && css`left:   ${ p.x}px;`}
  ${p => p.x < 0  && css`right:  ${-p.x}px;`}
  ${p => p.y >= 0 && css`top:    ${ p.y}px;`}
  ${p => p.y < 0  && css`bottom: ${-p.y}px;`}  

  /** Appearance */
  background: white;
  color: black;
  border-radius: 8px;
  padding: 10px 16px 10px 16px;
  box-shadow: 2px 2px 2px rgb(0,0,0,0.5);
  pointer-events: none;
  user-select: none;

  td:first-child {
    padding-right: 12px;
  }
  td:last-child {
    text-align: right;
    font-weight: bold;
  }
`

const Debug = (props: IDebugProps & ViewState) => <DebugStyled {...props}/>

export { Debug, IDebugProps }
