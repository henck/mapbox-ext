import * as React from 'react';
import styled, { css } from 'styled-components';

const HEIGHT = 24;                     // Hint height (px)
const DEFAULT_BACKGROUND = "#333";   // Default background color
const DEFAULT_COLOR = "#fff";        // Default border and text color
const DEFAULT_BORDER_RADIUS = 4;       // Default border radius (px)
const TRANSITION_TIME = 0.2;           // Transition time (s)

interface IProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
  /** Hint horizontal offset from center of parent, in pixels. */
  offset: number;
  /** Should Hint appear to left or right of parent? */
  side: 'left' | 'right';
  /** 
   * Optional foreground color. 
   * @defaultValue #fff
   */
  foreground?: string;
  /** 
   * Optional background color.
   * @defaultValue #333
   */
  background?: string;
  /** 
   * Optional border radius.
   * @defaultValue 4
   */
  borderRadius?: number;
}

class HintBase extends React.Component<IProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}>
        {p.children}
        {/* Solid arrow */}
        <svg className="fill" viewBox="0 0 50 100">
          <polygon points="50,0, 0,50, 50, 100, 50, 0"/>
        </svg>
        {/* Arrow stroke */}
        <svg className="stroke" viewBox="0 0 50 100">
          <line x1="50" y1="0" x2="0" y2="50" vectorEffect="non-scaling-stroke"/>
          <line x1="0" y1="50" x2="50" y2="100" vectorEffect="non-scaling-stroke"/>
        </svg>
      </div>
    );
  }
}

const HintStyled = styled(HintBase)`
  /* Position */
  position: absolute;
  ${p => p.side == "left"  && css`left:  calc(100% + ${p.offset}px);`};
  ${p => p.side == "right" && css`right: calc(100% + ${p.offset}px);`};
  top: calc(50% - ${HEIGHT/2}px);
  height: ${HEIGHT}px;
  line-height: ${HEIGHT}px;
  padding: 0 12px 0 6px;
  margin: 0 12px 0 12px;

  /* Border */
  border: solid 1px ${p => p.foreground ?? DEFAULT_COLOR};
  ${p => p.side == "left" && css`
    border-top-right-radius: ${p.borderRadius ?? DEFAULT_BORDER_RADIUS}px;
    border-bottom-right-radius: ${p.borderRadius ?? DEFAULT_BORDER_RADIUS}px;
    border-left: none;
  `}
  ${p => p.side == "right" && css`
    border-top-left-radius: ${p.borderRadius ?? DEFAULT_BORDER_RADIUS}px;
    border-bottom-left-radius: ${p.borderRadius ?? DEFAULT_BORDER_RADIUS}px;
    border-right: none;
  `}  

  /* Color */
  background: ${p => p.background ?? DEFAULT_BACKGROUND};
  color: ${p => p.foreground ?? DEFAULT_COLOR};
  white-space: nowrap;
  pointer-events: none;
  user-select: none;

  transform: scale(1);
  opacity: 1;
  transition: transform ease-in-out ${TRANSITION_TIME}s,
              opacity ease-in-out ${TRANSITION_TIME}s;
  svg {
    position: absolute;
    top: 0;
    ${p => p.side == 'right' && css`right: -${HEIGHT/2}px;`}
    ${p => p.side == 'left' && css`left: -${HEIGHT/2}px;`}
    height: 100%;
    // Mirror SVG depending on side.
    transform: scale(${p => p.side == "right" ? -1 : 1});
  }
  svg.fill {
    fill: ${p => p.background ?? DEFAULT_BACKGROUND};
  }
  svg.stroke {
    stroke: ${p => p.foreground ?? DEFAULT_COLOR};
    stroke-width: 1px;
    z-index: 1;
  }
`

/**
 * A Hint appears next to a parent control, at the specified side (left or 
 * right), with an optional offset.
 */
const Hint = (p: IProps) => <HintStyled {...p}/>

export { Hint, IProps }
