import * as React from 'react';
import styled from 'styled-components';

interface ILegendBoxProps {
  /** @ignore */
  className?: string;
  /** Legend box color, e.g. "green" or "#0f0" */
  color: string;
}

const LegendBoxBase = (props: ILegendBoxProps) => {
  return <div className={props.className}></div>
}

const LegendBoxStyled = styled(LegendBoxBase)`
  /* Size */
  width:  10px;
  height: 10px;
  /* Appearance */
  border: solid 1px black;
  border-radius: 2px;
  background-color: ${p => p.color};
  transition: border-color ease-in-out 150ms;
  &:hover {
    border-color: solid 1px white;
  }
`

/**
 * A small, colored square box.
 */
const LegendBox = (p: ILegendBoxProps) => <LegendBoxStyled {...p}/>

export { LegendBox, ILegendBoxProps }
