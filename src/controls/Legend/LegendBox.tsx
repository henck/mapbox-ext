import * as React from 'react';
import styled from 'styled-components';
import { DefaultSkin, ISkin } from '../../types/Skin';

interface ILegendBoxProps {
  /** @ignore */
  className?: string;
  /** Legend box color, e.g. "green" or "#0f0" */
  color: string;
  /** Optional label */
  label?: React.ReactNode;
  /** Optional skin to apply. */
  skin?: ISkin;  
}

const LegendBoxBase = (props: ILegendBoxProps) => {
  return <div className={props.className}>
    <Box/>
    {props.label && <Label>{props.label}</Label>}
  </div>
}

const Box = styled.div`
  /* Size */
  width:  10px;
  height: 10px;
  /* Appearance */
  border: solid 1px black;
  border-radius: 2px;
  transition: border-color ease-in-out 150ms;
  flex-shrink: 0;
  &:hover {
    border-color: white;
  }
`

const Label = styled.div`
  color: #fff;
  user-select: none;
`

const LegendBoxStyled = styled(LegendBoxBase).attrs(p => ({
  skin: p.skin ?? DefaultSkin
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  ${Box} {
    background-color: ${p => p.color};
  }
  ${Label} {
    color: ${p => p.skin.border};
  }
`

/**
 * A small, colored square box.
 */
const LegendBox = (p: ILegendBoxProps) => <LegendBoxStyled {...p}/>

export { LegendBox, ILegendBoxProps }
