import * as React from 'react';
import { useMap } from 'react-map-gl';

import { IMapButtonProps, MapButton } from '../MapButton';

interface IProps {
  /** 
   * (Optional) Container that should be made fullscreen. If omitted, this
   * will be the map's direct container.
   */
  container?: HTMLDivElement;
}

/**
 * The `FullscreenButton` toggles the map full-screen when clicked.  
 * 
 * @example
 * ```tsx
 * <FullscreenButton x={40} y={200} hint={<>Toggle full screen</>}/>
 * ```
 */
const FullscreenButton = (p: IMapButtonProps & IProps) => {
  const { current: map } = useMap();

  //
  // Does the browser offer full screen support?
  const checkFullscreenSupport = (): boolean => {
    return !!(
        window.document.fullscreenEnabled ||
        (window.document as any).webkitFullscreenEnabled
    );
  }

  const toggle = () => {
    if(document.fullscreenElement === null) {
      if(p.container) {
        p.container.requestFullscreen();
      } else {
        map.getContainer().requestFullscreen();
      }
    } else {
      window.document.exitFullscreen();
    }
  }

  return (
    <MapButton 
      disabled={!checkFullscreenSupport()} 
      onClick={toggle} 
      {...p}>
      <svg width="100" height="100" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/>
      </svg>
    </MapButton>
  );
}

export { FullscreenButton }
