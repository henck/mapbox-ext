import * as React from 'react';
import styled, { css } from 'styled-components';

import { Hint } from './Hint';
import { DefaultSkin, ISkin } from '../types/Skin';

const DEFAULT_SIZE    = 34;   // Button size (px)
const TRANSITION_TIME = 0.1;  // Transtion time (s)
const BORDER_SIZE     = 2;    // Border thickness (px)

interface IMapButtonProps {
  /** Horizontal button position. A negative value is an offset from the right. */
  x: number;
  /** Vertical button position. A negative value is an offset from the bottom. */
  y: number;
  /** Is button currently active? */
  active?: boolean;
  /** Is button currently disabled? */
  disabled?: boolean;
  /** Optional Hint to show on hover. */
  hint?: React.ReactNode;
  /** Button size in pixels. 
   * @defaultValue 34 
   */
  size?: number;
  /** Is another button attached to the top of this one? */
  attachedTop?: boolean;
  /** Is another button attached to the bottom of this one? */
  attachedBottom?: boolean;
  /** Optional skin to apply. */
  skin?: ISkin;
}

interface IProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
  /** Fired when map button is clicked. */
  onClick: () => void;
}

const MapButtonBase = (p: IProps & IMapButtonProps) => {
  return (
    <div className={p.className} onClick={p.onClick}>
      <Button>
        {p.children}
      </Button>
      {p.hint && 
        <Hint 
          disabled={p.disabled} 
          offset={16} 
          wobble
          side={p.x < 0 ? "right" : "left"}
          skin={p.skin}>
          {p.hint}
        </Hint>
      }
    </div>);
}

const Button = styled('div')`
`

const MapButton = styled(MapButtonBase).attrs(p => ({
  size: p.size ?? DEFAULT_SIZE,
  skin: p.skin ?? DefaultSkin
}))`
  /* Position control */
  position: absolute;
  z-index: 100;
  box-sizing: border-box;
  ${p => p.x >= 0 && css`left:   ${ p.x}px;`}
  ${p => p.x < 0  && css`right:  ${-p.x}px;`}
  ${p => p.y >= 0 && css`top:    ${ p.y}px;`}
  ${p => p.y < 0  && css`bottom: ${-p.y}px;`}  

  /* Size control */
  width: ${p => p.size}px;
  height: ${p => p.size}px;

  ${Button} {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    cursor: pointer;
    background-clip: padding-box;
    border: ${BORDER_SIZE}px solid ${p => p.active ? p.skin.fill : p.skin.border};
    border-radius: ${p => p.skin.radius}px;
    ${p => p.attachedBottom && css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-width: 1px;
      border-bottom-color: #aaa;
    `}
    ${p => p.attachedTop && css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: none;
    `}  

    ${p => p.attachedBottom && css`clip-path: inset(-6px -6px  0px -6px);`}
    ${p => p.attachedTop    && css`clip-path: inset( 0px -6px -6px -6px);`}
    ${p => p.attachedTop && p.attachedBottom && css`clip-path: inset( 0px -6px 0px -6px);`}
    background: ${p => p.active ? p.skin.border : p.skin.fill};
    transition: border-color ease-in-out ${TRANSITION_TIME}s;
    box-shadow: 0px 0px 6px rgb(255,255,255,0.5);

    svg {
      fill: ${p => p.active ? p.skin.fill : p.skin.border};
      transition: fill ease-in-out ${TRANSITION_TIME}s;
      width: ${p => p.size - 2 * BORDER_SIZE}px;
      height: ${p => p.size - 2 * BORDER_SIZE}px;
      padding: 8px;
      // With a border removed, SVG needs to be bumped down a little:
      ${p => p.attachedBottom && css`padding-bottom: 5px;`}
      box-sizing: border-box;
    }
  }

  /* Hint positioning */
  div:nth-child(2) {
    opacity: 0;
  }

  /* Disabled mode */
  ${p => p.disabled && css`
    ${Button} { 
      border-color: #222;
      svg { fill: #888; }
    }
  `}

  /* Hover */
  &:hover {
    ${p => !p.disabled && css`${Button} {border-color: ${p.skin.hover}}`};

    ${p => !p.disabled && !p.active && css`
      ${Button} {
        svg {
          fill: ${p.skin.hover};
        }
      }
    `}
    ${p => p.disabled && css`cursor: default;`}
    div:nth-child(2) {
      opacity: 1;
    }
  }
`

export { MapButton, IMapButtonProps, IProps }
