import * as React from 'react';
import styled, { css } from 'styled-components';
import { Hint } from './Hint';

const DEFAULT_SIZE    = 34;   // Button size (px)
const TRANSITION_TIME = 0.1;  // Transtion time (s)
const BORDER_SIZE     = 2;    // Border thickness (px)
const BORDER_RADIUS   = 8;    // Border radius (px)

interface IMapButtonProps {
  /** Button anchor (x,y). Negative values are offsets from the right and 
   *  bottom. */
  anchor: number[];
  /** Is button currently active? */
  active?: boolean;
  /** Is button currently disabled? */
  disabled?: boolean;
  /** Optional Hint to show on hover. */
  hint?: React.ReactNode;
  /** Button size. Defaults to 34. */
  size?: number;
  /** Is another button attached to the top of this one? */
  attachedTop?: boolean;
  /** Is another button attached to the bottom of this one? */
  attachedBottom?: boolean;
}

interface IProps {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
}

const MapButtonBase = (p: IProps & IMapButtonProps) => {
  return (
    <div className={p.className} onClick={p.onClick}>
      <Button>
        {p.children}
      </Button>
      {p.hint && 
        <Hint offset={16} side={p.anchor[0] < 0 ? "right" : "left"}>{p.hint}</Hint>
      }
    </div>);
}

const Button = styled('div')`
`

const MapButton = styled(MapButtonBase)`
  /* Position control */
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  ${p => p.anchor[0] >= 0 && css`left: ${p.anchor[0]}px;`}
  ${p => p.anchor[0] < 0 && css`right: ${-p.anchor[0]}px;`}
  ${p => p.anchor[1] >= 0 && css`top: ${p.anchor[1]}px;`}
  ${p => p.anchor[1] < 0 && css`bottom: ${-p.anchor[1]}px;`}

  /* Size control */
  width: ${p => p.size ?? DEFAULT_SIZE}px;
  height: ${p => p.size ?? DEFAULT_SIZE}px;

  ${Button} {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    cursor: pointer;
    background-clip: padding-box;
    border: ${BORDER_SIZE}px solid #cfcfcf;
    border-radius: ${BORDER_RADIUS}px;
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
    background: #333;
    transition: border-color ease-in-out ${TRANSITION_TIME}s;
    box-shadow: 0px 0px 6px rgb(255,255,255,0.5);
  }

  /* Hint positioning */
  ${Hint} {
    opacity: 0;
  }

  /* SVG sizing */
  & > div:first-child svg { 
    fill: #cfcfcf;
    transition: fill ease-in-out ${TRANSITION_TIME}s;
    width: ${p => (p.size ?? DEFAULT_SIZE) - 2 * BORDER_SIZE}px;
    height: ${p => (p.size ?? DEFAULT_SIZE) - 2 * BORDER_SIZE}px;
    padding: 6px;
    // With a border removed, SVG needs to be bumped down a little:
    ${p => p.attachedBottom && css`padding-bottom: 2px;`}
    box-sizing: border-box;
  }

  /* Active mode */
  ${p => p.active && css`
    border-color: #cfcfcf;
    background-color: white;
    & > div:first-child svg { fill: #333; }
  `}

  /* Disabled mode */
  ${p => p.disabled && css`
    border-color: #222222;
    & > div:first-child svg { fill: #888888; }
  `}

  /* Hover */
  &:hover {
    ${p => !p.disabled && css`border-color: #fff`};
    ${p => !p.disabled && css`
      & > div:first-child svg {
        fill: #fff;
      }
    `}
    ${p => p.disabled && css`cursor: default;`}
    ${Hint} {
      opacity: 1;
    }
  }
`

export { MapButton, IMapButtonProps }
