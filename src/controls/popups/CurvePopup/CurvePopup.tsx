import * as React from 'react';
import { useMap } from 'react-map-gl';
import styled from 'styled-components';

import { Curve, ICurveAppearanceProps } from './Curve';

const CURVE_WIDTH = 100;

interface ICurvePopupProps {
  className?: string;
  children?: React.ReactNode;
  latitude: number;
  longitude: number;
  distance?: number;
  curve?: ICurveAppearanceProps;
  visible: boolean;
}


const CurvePopupBase = (props: ICurvePopupProps) => {
  const { current: map } = useMap();

  const getViewport = () => {
    return {
      vw: Math.max(document.documentElement.clientWidth  || 0, window.innerWidth  || 0),
      vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }
  }

  // Convert lat/lng to screen coordinates.
  let { x, y } = map.project([ props.longitude, props.latitude ]);

  // Get viewport dimensions:
  const { vw, vh } = getViewport();
  const half = vh / 2;
  
  const isLeft  = x > vw / 2;
  const isAbove = y > vh / 2;

  x = x + (props.distance ?? 30) * (isLeft ? -1 : 1);

  const CURVE_HEIGHT = vh / 4;
  const fraction = Math.abs((half - y) / half);
  const curve_height = CURVE_HEIGHT * fraction;

  const dx = x + CURVE_WIDTH * (isLeft ? -1 : 1);
  const dy = y + (isAbove  ? -curve_height : curve_height);

  return (
    <div className={props.className} style={{
      left: dx + "px",
      top:  dy + "px"
    }}>
      <BodyHolder style={{
          transform: `translateX(${isLeft ? "-100%" : "0%"}) translateY(-50%)`
        }}>
        {props.children}
      </BodyHolder>
      <Curve x1={0} y1={0} x2={CURVE_WIDTH * (isLeft ? 1 : -1)} y2={isAbove ? curve_height : -curve_height} {...props.curve}/>
    </div>
  );
}

const BodyHolder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: auto;
  height: auto;
  pointer-events: none;
  user-select: none;
`

const CurvePopupStyled = styled(CurvePopupBase)`
  position: absolute;
  width: 0;
  height: 0;
  opacity: ${p => p.visible ? 1: 0};
  transition: opacity ease-in-out 200ms;
  
`

const CurvePopup = (props: ICurvePopupProps) => <CurvePopupStyled {...props}/>

export { CurvePopup }
