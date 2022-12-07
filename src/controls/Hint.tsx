import * as React from 'react';
import styled, { css } from 'styled-components';
import { DefaultSkin, ISkin } from './Skin';

const HEIGHT = 24;                     // Hint height (px)
const TRANSITION_TIME = 0.2;           // Transition time (s)

interface IHintProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
  /** Hint horizontal offset from center of parent, in pixels. */
  offset: number;
  /** Should Hint appear to left or right of parent? */
  side: 'left' | 'right';
  /** Is parent control disabled? */
  disabled?: boolean;
  /** Optional skin to apply. */
  skin?: ISkin;
}

class HintBase extends React.Component<IHintProps> {
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

const HintStyled = styled(HintBase).attrs(p => ({
  skin: p.skin ?? DefaultSkin
}))`
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
  border: solid 2px ${p => p.skin.border};
  ${p => p.side == "left" && css`
    border-top-right-radius: ${p.skin.radius}px;
    border-bottom-right-radius: ${p.skin.radius}px;
    border-left: none;
  `}
  ${p => p.side == "right" && css`
    border-top-left-radius: ${p.skin.radius}px;
    border-bottom-left-radius: ${p.skin.radius}px;
    border-right: none;
  `}  

  /* Color */
  background: ${p => p.skin.fill};
  color: ${p => p.disabled ? p.skin.disabled : p.skin.border};
  white-space: nowrap;
  pointer-events: none;
  user-select: none;

  transform: scale(1);
  opacity: 1;
  transition: transform ease-in-out ${TRANSITION_TIME}s,
              opacity ease-in-out ${TRANSITION_TIME}s;
  svg {
    position: absolute;
    top: -1px;
    ${p => p.side == 'right' && css`right: -${HEIGHT/2}px;`}
    ${p => p.side == 'left' && css`left: -${HEIGHT/2}px;`}
    height: calc(100% + 2px);
    // Mirror SVG depending on side.
    transform: scale(${p => p.side == "right" ? -1 : 1});
  }
  svg.fill {
    fill: ${p => p.skin.fill};
  }
  svg.stroke {
    stroke: ${p => p.skin.border};
    stroke-width: 2px;
    z-index: 1;
  }
`

/**
 * A Hint appears next to a parent control, at the specified side (left or 
 * right), with an optional offset.
 */
const Hint = (p: IHintProps) => <HintStyled {...p}/>

export { Hint, IHintProps }
