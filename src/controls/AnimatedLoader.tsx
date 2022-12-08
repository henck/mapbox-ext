import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';

const DEFAULT_SIZE  = 40;      // Default control size (px)
const DEFAULT_COLOR = "white"; // Default control color

interface IAnimatedLoaderProps {
  /** @ignore */
  className?: string;
  /** Control x-coordinate. Negative values are offset from the right. */
  x: number;  
  /** Control y-coordinate. Negative values are offset from the bottom. */
  y: number;
  /** 
   * Optional control size in pixels. Defaults to `40`.
   */
  size?: number;
  /** 
   * Should the loader currently be shown? If false, the loader is not
   * displayed. If true, the loader is displayed.
   */
  active: boolean;
  /** 
   * Optional SVG color. Defaults to `white`.
   */
  color?: string;
}

class AnimatedLoaderBase extends React.Component<IAnimatedLoaderProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}>
        <Svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"/>
        </Svg>
      </div>
    );
  }
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fade = keyframes`
  0% { opacity: 1 }
  50% { opacity: 0.2 }
  100% { opacity: 1 }
`;

const Svg = styled('svg')`
  width: 100%;
  height: 100%;
  animation: ${rotate} 2s linear infinite, ${fade} 3s linear infinite;
`

/**
 * Shows an animated Loading component when the active prop is true.
 */
const AnimatedLoaderstyled = styled(AnimatedLoaderBase)`
  position: absolute;
  z-index: 100;

  ${p => p.x >= 0 && css`left: ${p.x}px;`}
  ${p => p.x < 0 && css`right: ${-p.x}px;`}
  ${p => p.y >= 0 && css`top: ${p.y}px;`}
  ${p => p.y < 0 && css`bottom: ${-p.y}px;`}

  max-width: 200px;
  max-height: 200px;
  width: ${p => p.size ?? DEFAULT_SIZE}px;
  height: ${p => p.size ?? DEFAULT_SIZE}px;

  opacity: 0;
  cursor: grab;
  pointer-events: none;
  user-select: none;
  transition: opacity ease-in-out 150ms;
  opacity: ${p => p.active ? 1 : 0};
  ${Svg} {
    fill: ${p => p.color ?? DEFAULT_COLOR};
  }
`

/**
 * A loading animation, to be shown when the map is loading. Captures no 
 * pointer events. Use the `active` prop to show and hide the animation. 
 * This shows a rotating notched-circle SVG.
 * 
 * @example
 * ```tsx
 * <AnimatedLoader x={-50} y={50} active color="green"/>
 * ```
 */
const AnimatedLoader = (p: IAnimatedLoaderProps) => <AnimatedLoaderstyled {...p}/>

export { AnimatedLoader, IAnimatedLoaderProps }
