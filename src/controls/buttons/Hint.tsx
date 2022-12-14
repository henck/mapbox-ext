import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DefaultSkin, ISkin } from '../../types/Skin';

const HEIGHT = 24;                     // Hint height (px)
const TRANSITION_TIME = 0.25;          // Transition time (s)

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
  /** Enable wobble effect? */
  wobble?: boolean;
}

class HintBase extends React.Component<IHintProps> {
  render = () => {
    const p = this.props;
    return (
      <div className={p.className}>
        <Content>
          {p.children}
        </Content>
        <svg viewBox="-4 -4 54 108">
          <polygon points="50,-4, -4,50, 50, 104, 50, -4"/>
          <line x1="0"  y1="50"  x2="40" y2="0"   vectorEffect="non-scaling-stroke" style={{ strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10}} />
          <line x1="40" y1="0"   x2="50" y2="0"   vectorEffect="non-scaling-stroke" style={{ strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10}} />
          <line x1="0"  y1="50"  x2="40" y2="100" vectorEffect="non-scaling-stroke" style={{ strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10}} />
          <line x1="40" y1="100" x2="50" y2="100" vectorEffect="non-scaling-stroke" style={{ strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10}} />
        </svg>
      </div>
    );
  }
}

const wobbleLeft = keyframes`
  0%   { margin-left: 12px; }
  50%  { margin-left: 0px; }
  100% { margin-left: 12px; }
`;

const wobbleRight = keyframes`
  0%   { margin-right: 12px; }
  50%  { margin-right: 0px; }
  100% { margin-right: 12px; }
`;

const Content = styled('div')`
`

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
  margin: 0 12 0 12px;
  ${p => p.wobble && css`
    animation: ${p.side == "left" ? wobbleLeft : wobbleRight} 2s ease-in-out alternate infinite;
  `}
  /* Mirror hint depending on side. */
  transform: scaleX(${p => p.side == "right" ? -1 : 1});
  ${Content} {
    transform: scaleX(${p => p.side == "right" ? -1 : 1});
  }

  /* Border */
  border: solid 2px ${p => p.skin.border};
  border-top-right-radius: ${p => p.skin.radius}px;
  border-bottom-right-radius: ${p => p.skin.radius}px;
  border-left: none;

  /* Color */
  background: ${p => p.skin.fill};
  color: ${p => p.disabled ? p.skin.disabled : p.skin.border};
  white-space: nowrap;
  pointer-events: none;
  user-select: none;

  opacity: 1;
  transition: opacity ease-in-out ${TRANSITION_TIME}s;
  svg {
    position: absolute;
    top: -2px;
    left: -${HEIGHT/2}px;
    height: calc(100% + 4px);
  }
  svg polygon {
    fill: ${p => p.skin.fill};
  }
  svg line {
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
