import * as React from 'react';
import styled, { css } from 'styled-components';
import { DefaultSkin, ISkin } from '../../types/Skin';

interface ILegendProps {
  /** @ignore */
  className?: string;
  /** @ignore */
  children?: React.ReactNode;
  /**
   * Control horizontal position. A negative value means offset from the right.
   */
   x: number;
   /**
    * Control vertical position. A negative value means offset from the bottom.
    */
   y: number;
  /** Optional skin to apply. */
  skin?: ISkin;     
}

const LegendBase = (props: ILegendProps) => {
  // Pass skin prop to children:
  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { skin: props.skin } as any );
    }
    return child;
  });

  return (
    <div className={props.className}>
      {childrenWithProps}
    </div>
  );
}

const LegendStyled = styled(LegendBase).attrs(p => ({
  skin: p.skin ?? DefaultSkin
}))`
  /* Position */
  position: absolute;
  z-index: 100;
  ${p => p.x >= 0 && css`left:   ${ p.x}px; margin-right: 32px;`}
  ${p => p.x < 0  && css`right:  ${-p.x}px; margin-left: 32px;`}
  ${p => p.y >= 0 && css`top:    ${ p.y}px;`}
  ${p => p.y < 0  && css`bottom: ${-p.y}px;`}

  /* Content positioning */
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 12px;
  pointer-events: none;

  /* Appearance */
  padding: 6px 12px 6px 12px;
  box-shadow: 2px 2px 2px rgb(0,0,0,0.5);
  border: solid 1px ${p => p.skin.border};
  border-radius: ${p => p.skin.radius}px;
  background: ${p => p.skin.fill};

  /* Display legend entries vertically on small screens: */
  @media (max-width: 700px) {
    flex-direction: column;
  }
`

/**
 * A box with LegendBox entries.
 */
const Legend = (props: ILegendProps) => <LegendStyled {...props}/>

export { Legend, ILegendProps }
