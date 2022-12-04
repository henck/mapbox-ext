import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface IProps {
  className?: string;
  active: boolean;
}

/**
 * A loading animation, to be shown when the map is loading. Captures no 
 * pointer events.
 */
class AnimatedLoaderBase extends React.Component<IProps> {
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

const Svg = styled('svg')`
  width: 40px;
  height: 40px;
  fill: #fff;
  animation: ${rotate} 2s linear infinite;
`

/**
 * Shows an animated Loading component when the active prop is true.
 */
const AnimatedLoader = styled(AnimatedLoaderBase)`
  position: absolute;
  right: 40px;
  top: 40px;
  opacity: 0;
  cursor: grab;
  pointer-events: none;
  transition: opacity ease-in-out 150ms;
  opacity: ${p => p.active ? 1 : 0};
`

export { AnimatedLoader }
